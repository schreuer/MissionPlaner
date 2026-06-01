import { useState } from "react";
import { useDiscord } from "./hooks/useDiscord";
import { useSession } from "./hooks/useSession";
import { PresetSelection } from "./components/PresetSelection";
import { MissionBoard } from "./components/MissionBoard";

export default function App() {
  const { user, ready, error: discordError } = useDiscord();
  const [view, setView] = useState<"lobby" | "board">("lobby");

  const identity = user
    ? {
        userId: user.id,
        username: user.global_name ?? user.username,
        avatarUrl: user.avatar
          ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
          : undefined,
      }
    : null;

  const {
    session,
    connectionState,
    sessionError,
    createSession,
    joinSession,
    addShip,
    removeShip,
    assignRole,
    unassignRole,
  } = useSession(identity);

  // Once we have a session, show the board
  if (session && view !== "board") {
    setView("board");
  }

  if (!ready) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          flexDirection: "column",
          gap: 12,
          color: "var(--text-muted)",
        }}
      >
        <div style={{ fontSize: 32 }}>🛸</div>
        <div>Connecting to Discord…</div>
      </div>
    );
  }

  const errorBanner = discordError ?? sessionError;

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      {/* Connection status banner */}
      {connectionState === "error" || connectionState === "closed" ? (
        <div
          style={{
            background: "rgba(237,66,69,0.15)",
            color: "var(--red)",
            padding: "8px 16px",
            fontSize: 12,
            textAlign: "center",
          }}
        >
          ⚠ Lost connection to server. Reconnect by refreshing.
        </div>
      ) : null}

      {errorBanner && (
        <div
          style={{
            background: "rgba(254,231,92,0.1)",
            color: "var(--yellow)",
            padding: "8px 16px",
            fontSize: 12,
            textAlign: "center",
          }}
        >
          ⚠ {errorBanner}
        </div>
      )}

      {/* Main content */}
      {view === "lobby" || !session ? (
        <PresetSelection
          onSelect={(presetId) => {
            createSession(presetId);
          }}
          onJoin={(sessionId) => {
            joinSession(sessionId);
          }}
        />
      ) : (
        <MissionBoard
          session={session}
          currentUserId={identity?.userId ?? "unknown"}
          currentUsername={identity?.username ?? "Anonymous"}
          onAddShip={addShip}
          onRemoveShip={removeShip}
          onAssignRole={assignRole}
          onUnassignRole={unassignRole}
        />
      )}
    </div>
  );
}
