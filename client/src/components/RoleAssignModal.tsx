import type { ShipSlot, Role } from "@mission-planer/shared";
import { SHIP_ALLOWED_ROLES, SHIP_ROLE_CAPACITY } from "@mission-planer/shared";

interface Props {
  ship: ShipSlot;
  currentUserId: string;
  onAssign: (shipId: string, role: Role) => void;
  onUnassign: (shipId: string) => void;
  onClose: () => void;
}

export function RoleAssignModal({
  ship,
  currentUserId,
  onAssign,
  onUnassign,
  onClose,
}: Props) {
  const allowedRoles = SHIP_ALLOWED_ROLES[ship.type];
  const capacities = SHIP_ROLE_CAPACITY[ship.type];
  const myAssignment = ship.players.find((p) => p.userId === currentUserId);

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal">
        <div className="modal-title">
          {ship.name}
          <span
            className="tag"
            style={{ marginLeft: 10, verticalAlign: "middle", fontSize: 11 }}
          >
            {ship.type}
          </span>
        </div>

        {myAssignment && (
          <div
            style={{
              background: "rgba(87,242,135,0.1)",
              border: "1px solid rgba(87,242,135,0.3)",
              borderRadius: "var(--radius)",
              padding: "8px 12px",
              fontSize: 12,
              color: "var(--green)",
            }}
          >
            You are currently assigned as <strong>{myAssignment.role}</strong>
          </div>
        )}

        <div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            Pick a Role
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {allowedRoles.map((role) => {
              const max = capacities[role] ?? 1;
              const filled = ship.players.filter(
                (p) => p.role === role && p.userId !== currentUserId
              ).length;
              const isMine = myAssignment?.role === role;
              // Full = all capacity slots occupied by other players
              const isFull = filled >= max;
              const filledDisplay = isMine ? filled + 1 : filled;

              return (
                <button
                  key={role}
                  className="btn btn-ghost"
                  style={{
                    justifyContent: "space-between",
                    opacity: isFull && !isMine ? 0.4 : 1,
                    background: isMine ? "rgba(88,101,242,0.2)" : undefined,
                    borderColor: isMine ? "var(--accent)" : undefined,
                  }}
                  disabled={isFull && !isMine}
                  onClick={() => {
                    onAssign(ship.id, role);
                    onClose();
                  }}
                >
                  <span>{role}</span>
                  <span
                    style={{
                      fontSize: 11,
                      color: filledDisplay >= max ? "var(--red)" : "var(--text-muted)",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {filledDisplay}/{max}
                    {isMine && (
                      <span style={{ color: "var(--green)", marginLeft: 4 }}>
                        (you)
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="modal-actions">
          {myAssignment && (
            <button
              className="btn btn-danger btn-sm"
              onClick={() => {
                onUnassign(ship.id);
                onClose();
              }}
            >
              Leave Ship
            </button>
          )}
          <button className="btn btn-ghost" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
