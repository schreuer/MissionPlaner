import type { ShipSlot } from "@mission-planer/shared";
import { safeAvatarUrl } from "../lib/avatar";

const SHIP_ICONS: Record<string, string> = {
  Fighter: "✈",
  Bomber: "💣",
  Scout: "🔭",
  Frigate: "⚓",
  Destroyer: "🛡",
  Cruiser: "🚀",
  Carrier: "🛸",
};

interface Props {
  ship: ShipSlot;
  currentUserId: string;
  isHost: boolean;
  onClickAssign: () => void;
  onRemove: () => void;
}

export function ShipCard({
  ship,
  currentUserId,
  isHost,
  onClickAssign,
  onRemove,
}: Props) {
  const myAssignment = ship.players.find((p) => p.userId === currentUserId);

  return (
    <div
      style={{
        background: "var(--bg-card)",
        borderRadius: "var(--radius-lg)",
        padding: 14,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        border: myAssignment
          ? "1px solid rgba(88,101,242,0.5)"
          : "1px solid var(--border)",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 20 }}>{SHIP_ICONS[ship.type] ?? "🛸"}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>{ship.name}</div>
          <span className="tag" style={{ fontSize: 10 }}>
            {ship.type}
          </span>
        </div>
        {isHost && (
          <button
            className="btn btn-danger btn-sm"
            onClick={onRemove}
            title="Remove ship"
          >
            ✕
          </button>
        )}
      </div>

      {/* Player list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {ship.players.length === 0 ? (
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
            No crew assigned yet
          </div>
        ) : (
          ship.players.map((p) => (
            <div
              key={p.userId}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "4px 8px",
                borderRadius: "var(--radius)",
                background: p.userId === currentUserId
                  ? "rgba(88,101,242,0.15)"
                  : "var(--bg-input)",
              }}
            >
              {safeAvatarUrl(p.avatarUrl) ? (
                <img
                  src={safeAvatarUrl(p.avatarUrl)}
                  alt={p.username}
                  style={{ width: 20, height: 20, borderRadius: "50%" }}
                />
              ) : (
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "var(--accent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#fff",
                    flexShrink: 0,
                  }}
                >
                  {p.username[0]?.toUpperCase()}
                </div>
              )}
              <span style={{ flex: 1, fontSize: 13 }}>
                {p.username}
                {p.userId === currentUserId && (
                  <span style={{ color: "var(--text-muted)", marginLeft: 4 }}>(you)</span>
                )}
              </span>
              <span className="tag" style={{ fontSize: 10 }}>{p.role}</span>
            </div>
          ))
        )}
      </div>

      {/* Assign button */}
      <button
        className="btn btn-ghost btn-sm"
        onClick={onClickAssign}
        style={{ alignSelf: "flex-start" }}
      >
        {myAssignment ? "Change Role" : "Join Ship"}
      </button>
    </div>
  );
}
