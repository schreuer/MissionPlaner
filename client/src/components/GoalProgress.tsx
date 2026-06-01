import { MISSION_PRESETS, computeGoalProgress } from "@mission-planer/shared";
import type { MissionSession } from "@mission-planer/shared";

interface Props {
  session: MissionSession;
}

function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = max === 0 ? 100 : Math.min(100, (value / max) * 100);
  const colorClass = pct >= 100 ? "green" : pct >= 50 ? "yellow" : "red";
  return (
    <div className="progress-bar-track">
      <div
        className={`progress-bar-fill ${colorClass}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function GoalProgress({ session }: Props) {
  const preset = MISSION_PRESETS.find((p) => p.id === session.presetId);
  if (!preset) return null;

  const progress = computeGoalProgress(preset, session.ships);

  return (
    <div
      style={{
        background: "var(--bg-card)",
        borderRadius: "var(--radius-lg)",
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      {/* Overall badge */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontWeight: 700 }}>🎯 Mission Goal – {preset.name}</span>
        <span className={`tag ${progress.allMet ? "tag-green" : "tag-red"}`}>
          {progress.allMet ? "✓ READY" : "NOT READY"}
        </span>
      </div>

      {/* Ships progress */}
      {progress.shipsByType.length > 0 && (
        <div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            Ships ({progress.totalShipsMet}/{progress.totalShipsRequired})
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {progress.shipsByType.map((s) => (
              <div key={s.type}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 12,
                    marginBottom: 2,
                  }}
                >
                  <span>{s.type}</span>
                  <span
                    style={{ color: s.met ? "var(--green)" : "var(--text-muted)" }}
                  >
                    {s.current}/{s.required}
                  </span>
                </div>
                <ProgressBar value={s.current} max={s.required} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Roles progress */}
      {progress.roleProgress.length > 0 && (
        <div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            Roles ({progress.totalRolesMet}/{progress.totalRolesRequired})
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: 6,
            }}
          >
            {progress.roleProgress.map((r) => (
              <div key={r.role}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 12,
                    marginBottom: 2,
                  }}
                >
                  <span>{r.role}</span>
                  <span
                    style={{ color: r.met ? "var(--green)" : "var(--text-muted)" }}
                  >
                    {r.current}/{r.required}
                  </span>
                </div>
                <ProgressBar value={r.current} max={r.required} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
