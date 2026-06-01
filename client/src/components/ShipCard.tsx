import type { PlayerAssignment, ShipSlot } from "@mission-planer/shared";

const SHIP_ICONS: Record<string, string> = {
  // Light fighters
  "Gladius":              "✈",
  "Arrow":                "✈",
  "M50":                  "✈",
  "Sabre":                "✈",
  "F7C Hornet":           "✈",
  "Talon":                "✈",
  "Buccaneer":            "✈",
  "Eclipse":              "✈",
  // Two-seat fighters
  "F7C-M Super Hornet":   "🛩",
  "Scorpius":             "🛩",
  "Sabre Comet":          "🛩",
  "Sabre Raven":          "🔭",
  // Scout / recon
  "F7C-S Hornet Ghost":   "🔭",
  "F7C-R Hornet Tracker": "🔭",
  "Terrapin":             "🔭",
  "Herald":               "🔭",
  // Heavy fighters
  "Vanguard Warden":      "🛩",
  "Vanguard Sentinel":    "🛩",
  "Corsair":              "🛩",
  // Bombers
  "Gladiator":            "💣",
  "Vanguard Harbinger":   "💣",
  "Retaliator":           "💣",
  // Multi-crew gunships
  "Redeemer":             "🎯",
  "Constellation Andromeda": "🎯",
  // Frigates / assault
  "Hammerhead":           "⚓",
  "Polaris":              "⚓",
  "Valkyrie":             "⚓",
  "A2 Hercules":          "⚓",
  // Capital ships
  "Javelin":              "🛡",
  "Idris-M":              "🛡",
  "Idris-P":              "🛡",
  // Carriers
  "Kraken":               "🛸",
  "Liberator":            "🛸",
};

function PlayerRow({
  player,
  isCurrentUser,
}: {
  player: PlayerAssignment;
  isCurrentUser: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "4px 8px",
        borderRadius: "var(--radius)",
        background: isCurrentUser ? "rgba(88,101,242,0.15)" : "var(--bg-input)",
      }}
    >
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: isCurrentUser ? "var(--accent)" : "var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 10,
          fontWeight: 700,
          color: "#fff",
          flexShrink: 0,
        }}
      >
        {player.username[0]?.toUpperCase()}
      </div>
      <span style={{ flex: 1, fontSize: 13 }}>
        {player.username}
        {isCurrentUser && (
          <span style={{ color: "var(--text-muted)", marginLeft: 4 }}>(you)</span>
        )}
      </span>
      <span className="tag" style={{ fontSize: 10 }}>{player.role}</span>
    </div>
  );
}

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
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 2 }}>
            <span className="tag" style={{ fontSize: 10 }}>{ship.type}</span>
            <span className="tag" style={{ fontSize: 10 }}>{ship.role}</span>
          </div>
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

      {/* Owner */}
      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
        Owner: <span style={{ color: "var(--text-normal)" }}>{ship.ownerName}</span>
      </div>

      {/* Player list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {ship.players.length === 0 ? (
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
            No crew assigned yet
          </div>
        ) : (
          ship.players.map((p) => (
            <PlayerRow
              key={p.userId}
              player={p}
              isCurrentUser={p.userId === currentUserId}
            />
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
