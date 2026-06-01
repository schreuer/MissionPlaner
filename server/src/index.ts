import express from "express";
import http from "http";
import cors from "cors";
import { WebSocketServer, WebSocket } from "ws";
import { v4 as uuidv4 } from "uuid";
import {
  MissionSession,
  ShipSlot,
  WsClientMessage,
  WsServerMessage,
  SHIP_ALLOWED_ROLES,
  SHIP_ROLE_CAPACITY,
} from "@mission-planer/shared";

// ---------------------------------------------------------------------------
// In-memory session store
// ---------------------------------------------------------------------------
const sessions = new Map<string, MissionSession>();

// Track which WebSocket clients are watching which session
const sessionClients = new Map<string, Set<WebSocket>>();

// ---------------------------------------------------------------------------
// Express + HTTP server
// ---------------------------------------------------------------------------
const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

// Discord OAuth2 token exchange (used by the Discord Activity SDK)
app.post("/token", async (req, res) => {
  const { code } = req.body as { code?: string };
  if (!code) {
    res.status(400).json({ error: "code is required" });
    return;
  }

  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    res.status(503).json({ error: "Discord credentials not configured" });
    return;
  }

  try {
    const response = await fetch("https://discord.com/api/v10/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "authorization_code",
        code,
      }),
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("[token] Exchange error:", err);
    res.status(500).json({ error: "Token exchange failed" });
  }
});


app.get("/sessions", (_req, res) => {
  const list = Array.from(sessions.values()).map((s) => ({
    id: s.id,
    presetId: s.presetId,
    ships: s.ships.length,
    players: s.ships.reduce((n, ship) => n + ship.players.length, 0),
  }));
  res.json(list);
});

const server = http.createServer(app);

// ---------------------------------------------------------------------------
// WebSocket server
// ---------------------------------------------------------------------------
const wss = new WebSocketServer({ server });

function broadcast(sessionId: string, message: WsServerMessage) {
  const clients = sessionClients.get(sessionId);
  if (!clients) return;
  const payload = JSON.stringify(message);
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  }
}

function sendTo(ws: WebSocket, message: WsServerMessage) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  }
}

function joinSession(ws: WebSocket, sessionId: string) {
  // Remove from any previous session
  for (const [sid, clients] of sessionClients.entries()) {
    if (clients.has(ws) && sid !== sessionId) {
      clients.delete(ws);
    }
  }
  if (!sessionClients.has(sessionId)) {
    sessionClients.set(sessionId, new Set());
  }
  sessionClients.get(sessionId)!.add(ws);
}

wss.on("connection", (ws) => {
  ws.on("message", (raw) => {
    let msg: WsClientMessage;
    try {
      msg = JSON.parse(raw.toString()) as WsClientMessage;
    } catch {
      sendTo(ws, { type: "ERROR", message: "Invalid JSON" });
      return;
    }

    switch (msg.type) {
      // -----------------------------------------------------------------------
      case "CREATE_SESSION": {
        const id = uuidv4().slice(0, 8).toUpperCase();
        const session: MissionSession = {
          id,
          presetId: msg.presetId,
          ships: [],
          hostId: msg.userId,
        };
        sessions.set(id, session);
        joinSession(ws, id);
        sendTo(ws, { type: "SESSION_CREATED", session });
        break;
      }

      // -----------------------------------------------------------------------
      case "JOIN": {
        const session = sessions.get(msg.sessionId);
        if (!session) {
          sendTo(ws, { type: "ERROR", message: `Session ${msg.sessionId} not found` });
          return;
        }
        joinSession(ws, msg.sessionId);
        sendTo(ws, { type: "SESSION_STATE", session });
        break;
      }

      // -----------------------------------------------------------------------
      case "GET_STATE": {
        const session = sessions.get(msg.sessionId);
        if (!session) {
          sendTo(ws, { type: "ERROR", message: `Session ${msg.sessionId} not found` });
          return;
        }
        sendTo(ws, { type: "SESSION_STATE", session });
        break;
      }

      // -----------------------------------------------------------------------
      case "ADD_SHIP": {
        const session = sessions.get(msg.sessionId);
        if (!session) {
          sendTo(ws, { type: "ERROR", message: `Session ${msg.sessionId} not found` });
          return;
        }
        const ship: ShipSlot = {
          id: uuidv4(),
          type: msg.shipType,
          name: msg.shipName,
          players: [],
        };
        session.ships.push(ship);
        broadcast(msg.sessionId, { type: "SESSION_STATE", session });
        break;
      }

      // -----------------------------------------------------------------------
      case "REMOVE_SHIP": {
        const session = sessions.get(msg.sessionId);
        if (!session) {
          sendTo(ws, { type: "ERROR", message: `Session ${msg.sessionId} not found` });
          return;
        }
        session.ships = session.ships.filter((s) => s.id !== msg.shipId);
        broadcast(msg.sessionId, { type: "SESSION_STATE", session });
        break;
      }

      // -----------------------------------------------------------------------
      case "ASSIGN_ROLE": {
        const session = sessions.get(msg.sessionId);
        if (!session) {
          sendTo(ws, { type: "ERROR", message: `Session ${msg.sessionId} not found` });
          return;
        }
        const ship = session.ships.find((s) => s.id === msg.shipId);
        if (!ship) {
          sendTo(ws, { type: "ERROR", message: `Ship ${msg.shipId} not found` });
          return;
        }

        // Validate role is allowed for this ship type
        const allowed = SHIP_ALLOWED_ROLES[ship.type];
        if (!allowed.includes(msg.role)) {
          sendTo(ws, {
            type: "ERROR",
            message: `Role ${msg.role} is not allowed on ${ship.type}`,
          });
          return;
        }

        // Validate role capacity (exclude the player themselves in case they're switching)
        const capacity = SHIP_ROLE_CAPACITY[ship.type][msg.role] ?? 1;
        const currentCount = ship.players.filter(
          (p) => p.role === msg.role && p.userId !== msg.userId
        ).length;
        if (currentCount >= capacity) {
          sendTo(ws, {
            type: "ERROR",
            message: `Role ${msg.role} on ${ship.name} is full (${capacity}/${capacity})`,
          });
          return;
        }

        // Remove player from any existing slot across ALL ships (one slot per player)
        for (const s of session.ships) {
          s.players = s.players.filter((p) => p.userId !== msg.userId);
        }

        // Add player to new ship
        ship.players.push({
          userId: msg.userId,
          username: msg.username,
          role: msg.role,
        });

        broadcast(msg.sessionId, { type: "SESSION_STATE", session });
        break;
      }

      // -----------------------------------------------------------------------
      case "UNASSIGN_ROLE": {
        const session = sessions.get(msg.sessionId);
        if (!session) {
          sendTo(ws, { type: "ERROR", message: `Session ${msg.sessionId} not found` });
          return;
        }
        const ship = session.ships.find((s) => s.id === msg.shipId);
        if (!ship) {
          sendTo(ws, { type: "ERROR", message: `Ship ${msg.shipId} not found` });
          return;
        }
        ship.players = ship.players.filter((p) => p.userId !== msg.userId);
        broadcast(msg.sessionId, { type: "SESSION_STATE", session });
        break;
      }

      default: {
        sendTo(ws, { type: "ERROR", message: "Unknown message type" });
      }
    }
  });

  ws.on("close", () => {
    for (const clients of sessionClients.values()) {
      clients.delete(ws);
    }
  });
});

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
const PORT = Number(process.env.PORT ?? 3001);
server.listen(PORT, () => {
  console.log(`Mission Planer server running on port ${PORT}`);
});
