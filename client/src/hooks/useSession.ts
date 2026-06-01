import { useCallback, useEffect, useRef, useState } from "react";
import type {
  MissionSession,
  WsClientMessage,
  WsServerMessage,
  Role,
  ShipType,
} from "@mission-planer/shared";

const WS_URL =
  import.meta.env.VITE_WS_URL ??
  (location.protocol === "https:" ? "wss://" : "ws://") +
    location.host +
    "/ws";

export type ConnectionState = "connecting" | "open" | "closed" | "error";

export interface UseSessionResult {
  session: MissionSession | null;
  connectionState: ConnectionState;
  sessionError: string | null;
  createSession: (presetId: string) => void;
  joinSession: (sessionId: string) => void;
  addShip: (type: ShipType, name: string) => void;
  removeShip: (shipId: string) => void;
  assignRole: (shipId: string, role: Role) => void;
  unassignRole: (shipId: string) => void;
}

interface Identity {
  userId: string;
  username: string;
  avatarUrl?: string;
}

export function useSession(identity: Identity | null): UseSessionResult {
  const ws = useRef<WebSocket | null>(null);
  const [session, setSession] = useState<MissionSession | null>(null);
  const [connectionState, setConnectionState] =
    useState<ConnectionState>("connecting");
  const [sessionError, setSessionError] = useState<string | null>(null);
  const pendingMessages = useRef<WsClientMessage[]>([]);

  const send = useCallback((msg: WsClientMessage) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(msg));
    } else {
      // Queue until connected
      pendingMessages.current.push(msg);
    }
  }, []);

  useEffect(() => {
    const socket = new WebSocket(WS_URL);
    ws.current = socket;

    socket.onopen = () => {
      setConnectionState("open");
      // Flush pending messages
      for (const msg of pendingMessages.current) {
        socket.send(JSON.stringify(msg));
      }
      pendingMessages.current = [];
    };

    socket.onmessage = (event: MessageEvent<string>) => {
      let msg: WsServerMessage;
      try {
        msg = JSON.parse(event.data) as WsServerMessage;
      } catch {
        return;
      }
      if (msg.type === "SESSION_STATE" || msg.type === "SESSION_CREATED") {
        setSession(msg.session);
      } else if (msg.type === "ERROR") {
        setSessionError(msg.message);
      }
    };

    socket.onerror = () => {
      setConnectionState("error");
    };

    socket.onclose = () => {
      setConnectionState("closed");
    };

    return () => {
      socket.close();
    };
  }, []);

  const createSession = useCallback(
    (presetId: string) => {
      if (!identity) return;
      send({
        type: "CREATE_SESSION",
        presetId,
        userId: identity.userId,
        username: identity.username,
        avatarUrl: identity.avatarUrl,
      });
    },
    [send, identity]
  );

  const joinSession = useCallback(
    (sessionId: string) => {
      if (!identity) return;
      send({
        type: "JOIN",
        sessionId,
        userId: identity.userId,
        username: identity.username,
        avatarUrl: identity.avatarUrl,
      });
    },
    [send, identity]
  );

  const addShip = useCallback(
    (type: ShipType, name: string) => {
      if (!session) return;
      send({ type: "ADD_SHIP", sessionId: session.id, shipType: type, shipName: name });
    },
    [send, session]
  );

  const removeShip = useCallback(
    (shipId: string) => {
      if (!session) return;
      send({ type: "REMOVE_SHIP", sessionId: session.id, shipId });
    },
    [send, session]
  );

  const assignRole = useCallback(
    (shipId: string, role: Role) => {
      if (!session || !identity) return;
      send({
        type: "ASSIGN_ROLE",
        sessionId: session.id,
        shipId,
        role,
        userId: identity.userId,
        username: identity.username,
        avatarUrl: identity.avatarUrl,
      });
    },
    [send, session, identity]
  );

  const unassignRole = useCallback(
    (shipId: string) => {
      if (!session || !identity) return;
      send({
        type: "UNASSIGN_ROLE",
        sessionId: session.id,
        shipId,
        userId: identity.userId,
      });
    },
    [send, session, identity]
  );

  return {
    session,
    connectionState,
    sessionError,
    createSession,
    joinSession,
    addShip,
    removeShip,
    assignRole,
    unassignRole,
  };
}
