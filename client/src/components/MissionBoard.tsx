import { useState } from "react";
import type { MissionSession, Role, ShipSlot, ShipType } from "@mission-planer/shared";
import { GoalProgress } from "./GoalProgress";
import { ShipCard } from "./ShipCard";
import { AddShipModal } from "./AddShipModal";
import { RoleAssignModal } from "./RoleAssignModal";

interface Props {
  session: MissionSession;
  currentUserId: string;
  currentUsername: string;
  onAddShip: (type: ShipType, name: string) => void;
  onRemoveShip: (shipId: string) => void;
  onAssignRole: (shipId: string, role: Role) => void;
  onUnassignRole: (shipId: string) => void;
}

export function MissionBoard({
  session,
  currentUserId,
  currentUsername: _currentUsername,
  onAddShip,
  onRemoveShip,
  onAssignRole,
  onUnassignRole,
}: Props) {
  const [showAddShip, setShowAddShip] = useState(false);
  const [assignTarget, setAssignTarget] = useState<ShipSlot | null>(null);

  const isHost = session.hostId === currentUserId;

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "16px" }}>
      {/* Session header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700 }}>Mission Board</h1>
          <div style={{ color: "var(--text-muted)", fontSize: 12 }}>
            Session code:{" "}
            <code
              style={{
                background: "var(--bg-card)",
                padding: "1px 6px",
                borderRadius: 4,
                letterSpacing: "0.1em",
                cursor: "pointer",
                userSelect: "all",
              }}
              title="Click to copy"
              onClick={() => navigator.clipboard?.writeText(session.id)}
            >
              {session.id}
            </code>
          </div>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddShip(true)}
        >
          + Add Ship
        </button>
      </div>

      {/* Goal progress */}
      <div style={{ marginBottom: 16 }}>
        <GoalProgress session={session} />
      </div>

      {/* Ships grid */}
      {session.ships.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "48px 0",
            color: "var(--text-muted)",
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 8 }}>🛸</div>
          <div>No ships yet. Add the first one!</div>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 12,
          }}
        >
          {session.ships.map((ship) => (
            <ShipCard
              key={ship.id}
              ship={ship}
              currentUserId={currentUserId}
              isHost={isHost}
              onClickAssign={() => setAssignTarget(ship)}
              onRemove={() => onRemoveShip(ship.id)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {showAddShip && (
        <AddShipModal
          onAdd={onAddShip}
          onClose={() => setShowAddShip(false)}
        />
      )}

      {assignTarget && (
        <RoleAssignModal
          ship={assignTarget}
          currentUserId={currentUserId}
          onAssign={onAssignRole}
          onUnassign={onUnassignRole}
          onClose={() => setAssignTarget(null)}
        />
      )}
    </div>
  );
}
