import { useState } from "react";
import { MISSION_PRESETS } from "@mission-planer/shared";
import type { MissionPreset } from "@mission-planer/shared";

interface Props {
  onSelect: (presetId: string) => void;
  onJoin: (sessionId: string) => void;
}

export function PresetSelection({ onSelect, onJoin }: Props) {
  const [selectedId, setSelectedId] = useState<string>(MISSION_PRESETS[0].id);
  const [joinId, setJoinId] = useState("");

  const selected = MISSION_PRESETS.find((p) => p.id === selectedId)!;

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "32px 16px" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>
        ✈ Mission Planer
      </h1>
      <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>
        Coordinate your fleet for the mission ahead.
      </p>

      <section
        style={{
          background: "var(--bg-card)",
          borderRadius: "var(--radius-lg)",
          padding: 20,
          marginBottom: 16,
        }}
      >
        <h2 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--text-muted)" }}>
          Start a new session
        </h2>

        <div className="form-group" style={{ marginBottom: 16 }}>
          <label>Mission Preset</label>
          <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
            {MISSION_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <PresetCard preset={selected} />

        <button
          className="btn btn-primary"
          style={{ width: "100%", marginTop: 16 }}
          onClick={() => onSelect(selectedId)}
        >
          Create Session
        </button>
      </section>

      <section
        style={{
          background: "var(--bg-card)",
          borderRadius: "var(--radius-lg)",
          padding: 20,
        }}
      >
        <h2 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--text-muted)" }}>
          Join an existing session
        </h2>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            placeholder="Session code (e.g. AB12CD34)"
            value={joinId}
            onChange={(e) => setJoinId(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && joinId && onJoin(joinId)}
          />
          <button
            className="btn btn-ghost"
            disabled={!joinId}
            onClick={() => onJoin(joinId)}
            style={{ whiteSpace: "nowrap" }}
          >
            Join
          </button>
        </div>
      </section>
    </div>
  );
}

function PresetCard({ preset }: { preset: MissionPreset }) {
  return (
    <div
      style={{
        background: "var(--bg-input)",
        borderRadius: "var(--radius)",
        padding: 14,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div>
        <div style={{ fontWeight: 700 }}>{preset.name}</div>
        <div style={{ color: "var(--text-muted)", fontSize: 12 }}>{preset.description}</div>
      </div>

      <div>
        <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 4 }}>
          Minimal Ships
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {preset.shipRequirements.map((req) => (
            <span key={req.role} className="tag">
              {req.count}× {req.role}
            </span>
          ))}
        </div>
      </div>

      <div>
        <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 4 }}>
          Minimal Roles
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {preset.roleRequirements.map((req) => (
            <span key={req.role} className="tag">
              {req.count}× {req.role}
            </span>
          ))}
        </div>
      </div>

      {preset.optimalShipRequirements && preset.optimalShipRequirements.length > 0 && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 4 }}>
            Optimal Ships
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {preset.optimalShipRequirements.map((req) => (
              <span key={req.role} className="tag">
                {req.count}× {req.role}
              </span>
            ))}
          </div>
        </div>
      )}

      {preset.optimalRoleRequirements && preset.optimalRoleRequirements.length > 0 && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 4 }}>
            Optimal Roles
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {preset.optimalRoleRequirements.map((req) => (
              <span key={req.role} className="tag">
                {req.count}× {req.role}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
