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

function RequirementsSection({
  label,
  shipsByRole,
  totalShipsMet,
  totalShipsRequired,
  roleProgress,
  totalRolesMet,
  totalRolesRequired,
}: {
  label: string;
  shipsByRole: Array<{ role: string; required: number; current: number; met: boolean }>;
  totalShipsMet: number;
  totalShipsRequired: number;
  roleProgress: Array<{ role: string; required: number; current: number; met: boolean }>;
  totalRolesMet: number;
  totalRolesRequired: number;
}) {
  return (
    <div
      style={{
        background: "var(--bg-input)",
        borderRadius: "var(--radius)",
        padding: 12,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "var(--text-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </div>

      {shipsByRole.length > 0 && (
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
            Ships ({totalShipsMet}/{totalShipsRequired})
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {shipsByRole.map((s) => (
              <div key={s.role}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 12,
                    marginBottom: 2,
                  }}
                >
                  <span>{s.role}</span>
                  <span style={{ color: s.met ? "var(--green)" : "var(--text-muted)" }}>
                    {s.current}/{s.required}
                  </span>
                </div>
                <ProgressBar value={s.current} max={s.required} />
              </div>
            ))}
          </div>
        </div>
      )}

      {roleProgress.length > 0 && (
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
            Roles ({totalRolesMet}/{totalRolesRequired})
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: 6,
            }}
          >
            {roleProgress.map((r) => (
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
                  <span style={{ color: r.met ? "var(--green)" : "var(--text-muted)" }}>
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
      {/* Overall badges */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <span style={{ fontWeight: 700 }}>🎯 Mission Goal – {preset.name}</span>
        <div style={{ display: "flex", gap: 6 }}>
          <span className={`tag ${progress.allMet ? "tag-green" : "tag-red"}`}>
            {progress.allMet ? "✓ MINIMAL MET" : "MINIMAL NOT MET"}
          </span>
          {progress.hasOptimal && (
            <span className={`tag ${progress.optimalAllMet ? "tag-green" : "tag-red"}`}>
              {progress.optimalAllMet ? "✓ OPTIMAL MET" : "OPTIMAL NOT MET"}
            </span>
          )}
        </div>
      </div>

      {/* Minimal requirements */}
      <RequirementsSection
        label="Minimal Setup"
        shipsByRole={progress.shipsByRole}
        totalShipsMet={progress.totalShipsMet}
        totalShipsRequired={progress.totalShipsRequired}
        roleProgress={progress.roleProgress}
        totalRolesMet={progress.totalRolesMet}
        totalRolesRequired={progress.totalRolesRequired}
      />

      {/* Optimal requirements */}
      {progress.hasOptimal && (
        <RequirementsSection
          label="Optimal Setup"
          shipsByRole={progress.optimalShipsByRole}
          totalShipsMet={progress.totalOptimalShipsMet}
          totalShipsRequired={progress.totalOptimalShipsRequired}
          roleProgress={progress.optimalRoleProgress}
          totalRolesMet={progress.totalOptimalRolesMet}
          totalRolesRequired={progress.totalOptimalRolesRequired}
        />
      )}
    </div>
  );
}
