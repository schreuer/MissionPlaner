import { useState } from "react";
import type { ShipType } from "@mission-planer/shared";
import { SHIP_ALLOWED_ROLES, SHIP_ROLE_CAPACITY, shipTotalCapacity } from "@mission-planer/shared";

const SHIP_TYPES: ShipType[] = Object.keys(SHIP_ALLOWED_ROLES) as ShipType[];

interface Props {
  onAdd: (type: ShipType, name: string) => void;
  onClose: () => void;
}

export function AddShipModal({ onAdd, onClose }: Props) {
  const [type, setType] = useState<ShipType>("Fighter");
  const [name, setName] = useState("");

  function handleSubmit() {
    const shipName = name.trim() || `${type} #${Math.floor(Math.random() * 9000 + 1000)}`;
    onAdd(type, shipName);
    onClose();
  }

  const capacities = SHIP_ROLE_CAPACITY[type];
  const totalCapacity = shipTotalCapacity(type);

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-title">Add Ship</div>

        <div className="form-group">
          <label>Ship Type</label>
          <select value={type} onChange={(e) => setType(e.target.value as ShipType)}>
            {SHIP_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Ship Name (optional)</label>
          <input
            placeholder={`e.g. The ${type} Express`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            autoFocus
          />
        </div>

        <div style={{ background: "var(--bg-input)", borderRadius: "var(--radius)", padding: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }}>
              Crew Slots
            </div>
            <span className="tag" style={{ fontSize: 10 }}>
              {totalCapacity} total
            </span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {SHIP_ALLOWED_ROLES[type].map((r) => (
              <span key={r} className="tag" title={`Max ${capacities[r] ?? 1} player(s)`}>
                {r} ×{capacities[r] ?? 1}
              </span>
            ))}
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>Add Ship</button>
        </div>
      </div>
    </div>
  );
}
