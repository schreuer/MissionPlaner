// ---------------------------------------------------------------------------
// Ship types and the roles each type allows
// ---------------------------------------------------------------------------

// Every flyable ship in Star Citizen (selection covering all role categories)
export type ShipType =
  // ── Light / single-seat fighters ────────────────────────────────────────
  | "Gladius"
  | "Arrow"
  | "M50"
  | "Sabre"
  | "F7C Hornet"
  | "Talon"
  | "Buccaneer"
  | "Eclipse"
  // ── Two-seat fighters / interceptors ────────────────────────────────────
  | "F7C-M Super Hornet"
  | "Scorpius"
  | "Sabre Comet"
  | "Sabre Raven"
  // ── Scout / recon ────────────────────────────────────────────────────────
  | "F7C-S Hornet Ghost"
  | "F7C-R Hornet Tracker"
  | "Terrapin"
  | "Herald"
  // ── Heavy fighters / long-range ──────────────────────────────────────────
  | "Vanguard Warden"
  | "Vanguard Sentinel"
  | "Corsair"
  // ── Bombers ──────────────────────────────────────────────────────────────
  | "Gladiator"
  | "Vanguard Harbinger"
  | "Retaliator"
  // ── Multi-crew gunships ───────────────────────────────────────────────────
  | "Redeemer"
  | "Constellation Andromeda"
  // ── Frigates / assault ships ──────────────────────────────────────────────
  | "Hammerhead"
  | "Polaris"
  | "Valkyrie"
  | "A2 Hercules"
  // ── Capital ships ─────────────────────────────────────────────────────────
  | "Javelin"
  | "Idris-M"
  | "Idris-P"
  // ── Carriers ─────────────────────────────────────────────────────────────
  | "Kraken"
  | "Liberator";

export type Role =
  | "Pilot"
  | "Co-Pilot"
  | "Gunner"
  | "Bombardier"
  | "Captain"
  | "Navigator"
  | "Engineer"
  | "Medic"
  | "Squadron Leader"
  | "Scout"
  | "Marine"

export const SHIP_ALLOWED_ROLES: Record<ShipType, Role[]> = {
  // ── Light / single-seat fighters ────────────────────────────────────────
  "Gladius":              ["Pilot"],
  "Arrow":                ["Pilot"],
  "M50":                  ["Pilot"],
  "Sabre":                ["Pilot"],
  "F7C Hornet":           ["Pilot"],
  "Talon":                ["Pilot"],
  "Buccaneer":            ["Pilot"],
  "Eclipse":              ["Pilot"],
  // ── Two-seat fighters / interceptors ────────────────────────────────────
  "F7C-M Super Hornet":   ["Pilot", "Gunner"],
  "Scorpius":             ["Pilot", "Gunner"],
  "Sabre Comet":          ["Pilot", "Co-Pilot"],
  "Sabre Raven":          ["Pilot", "Scout"],
  // ── Scout / recon ────────────────────────────────────────────────────────
  "F7C-S Hornet Ghost":   ["Pilot", "Scout"],
  "F7C-R Hornet Tracker": ["Pilot", "Navigator"],
  "Terrapin":             ["Pilot", "Navigator", "Scout"],
  "Herald":               ["Pilot", "Navigator"],
  // ── Heavy fighters / long-range ──────────────────────────────────────────
  "Vanguard Warden":      ["Pilot", "Co-Pilot"],
  "Vanguard Sentinel":    ["Pilot", "Co-Pilot"],
  "Corsair":              ["Pilot", "Co-Pilot", "Gunner"],
  // ── Bombers ──────────────────────────────────────────────────────────────
  "Gladiator":            ["Pilot", "Bombardier"],
  "Vanguard Harbinger":   ["Pilot", "Co-Pilot", "Bombardier"],
  "Retaliator":           ["Pilot", "Co-Pilot", "Bombardier", "Gunner"],
  // ── Multi-crew gunships ───────────────────────────────────────────────────
  "Redeemer":             ["Pilot", "Co-Pilot", "Gunner"],
  "Constellation Andromeda": ["Pilot", "Co-Pilot", "Gunner"],
  // ── Frigates / assault ships ──────────────────────────────────────────────
  "Hammerhead":           ["Captain", "Navigator", "Engineer", "Gunner", "Medic"],
  "Polaris":              ["Captain", "Navigator", "Engineer", "Gunner", "Marine", "Medic"],
  "Valkyrie":             ["Pilot", "Co-Pilot", "Gunner", "Marine", "Medic"],
  "A2 Hercules":          ["Pilot", "Co-Pilot", "Gunner", "Bombardier", "Marine", "Engineer"],
  // ── Capital ships ─────────────────────────────────────────────────────────
  "Javelin":              ["Captain", "Navigator", "Engineer", "Gunner", "Medic", "Marine", "Squadron Leader"],
  "Idris-M":              ["Captain", "Navigator", "Engineer", "Gunner", "Medic", "Marine", "Squadron Leader"],
  "Idris-P":              ["Captain", "Navigator", "Engineer", "Gunner", "Medic", "Marine",  "Squadron Leader"],
  // ── Carriers ─────────────────────────────────────────────────────────────
  "Kraken":               ["Captain", "Navigator", "Engineer", "Medic", "Squadron Leader"],
  "Liberator":            ["Captain", "Navigator", "Engineer", "Medic", "Squadron Leader"],
};

/**
 * Maximum number of players allowed per role on each ship.
 * Every role listed in SHIP_ALLOWED_ROLES has an explicit entry here.
 * If a role were somehow absent, both the server and the client fall back
 * to a capacity of 1 (one player per role) as a safe default.
 */
export const SHIP_ROLE_CAPACITY: Record<ShipType, Partial<Record<Role, number>>> = {
  // ── Light / single-seat fighters ────────────────────────────────────────
  "Gladius":              { Pilot: 1 },
  "Arrow":                { Pilot: 1 },
  "M50":                  { Pilot: 1 },
  "Sabre":                { Pilot: 1 },
  "F7C Hornet":           { Pilot: 1 },
  "Talon":                { Pilot: 1 },
  "Buccaneer":            { Pilot: 1 },
  "Eclipse":              { Pilot: 1 },
  // ── Two-seat fighters / interceptors ────────────────────────────────────
  "F7C-M Super Hornet":   { Pilot: 1, Gunner: 1 },
  "Scorpius":             { Pilot: 1, Gunner: 1 },
  "Sabre Comet":          { Pilot: 1, "Co-Pilot": 1 },
  "Sabre Raven":          { Pilot: 1, Scout: 1 },
  // ── Scout / recon ────────────────────────────────────────────────────────
  "F7C-S Hornet Ghost":   { Pilot: 1, Scout: 1 },
  "F7C-R Hornet Tracker": { Pilot: 1, Navigator: 1 },
  "Terrapin":             { Pilot: 1, Navigator: 1, Scout: 2 },
  "Herald":               { Pilot: 1, Navigator: 1 },
  // ── Heavy fighters / long-range ──────────────────────────────────────────
  "Vanguard Warden":      { Pilot: 1, "Co-Pilot": 1 },
  "Vanguard Sentinel":    { Pilot: 1, "Co-Pilot": 1 },
  "Corsair":              { Pilot: 1, "Co-Pilot": 1, Gunner: 2 },
  // ── Bombers ──────────────────────────────────────────────────────────────
  "Gladiator":            { Pilot: 1, Bombardier: 1 },
  "Vanguard Harbinger":   { Pilot: 1, "Co-Pilot": 1, Bombardier: 1 },
  "Retaliator":           { Pilot: 1, "Co-Pilot": 1, Bombardier: 2, Gunner: 2 },
  // ── Multi-crew gunships ───────────────────────────────────────────────────
  "Redeemer":             { Pilot: 1, "Co-Pilot": 1, Gunner: 3 },
  "Constellation Andromeda": { Pilot: 1, "Co-Pilot": 1, Gunner: 3 },
  // ── Frigates / assault ships ──────────────────────────────────────────────
  "Hammerhead":           { Captain: 1, Navigator: 1, Engineer: 2, Gunner: 6, Medic: 1 },
  "Polaris":              { Captain: 1, Navigator: 1, Engineer: 2, Gunner: 4, Marine: 4, Medic: 1 },
  "Valkyrie":             { Pilot: 1, "Co-Pilot": 1, Gunner: 2, Marine: 8, Medic: 1 },
  "A2 Hercules":          { Pilot: 1, "Co-Pilot": 1, Gunner: 2, Bombardier: 2, Marine: 6, Engineer: 1 },
  // ── Capital ships ─────────────────────────────────────────────────────────
  "Javelin":              { Captain: 1, Navigator: 1, Engineer: 4, Gunner: 8, Medic: 2, Marine: 10, "Squadron Leader": 1 },
  "Idris-M":              { Captain: 1, Navigator: 1, Engineer: 3, Gunner: 8, Medic: 2, Marine: 8,  "Squadron Leader": 1 },
  "Idris-P":              { Captain: 1, Navigator: 1, Engineer: 3, Gunner: 6, Medic: 2, Marine: 6,  "Squadron Leader": 1 },
  // ── Carriers ─────────────────────────────────────────────────────────────
  "Kraken":               { Captain: 1, Navigator: 1, Engineer: 4, Medic: 3, "Squadron Leader": 2 },
  "Liberator":            { Captain: 1, Navigator: 1, Engineer: 2, Medic: 1, "Squadron Leader": 1 },
};

/** Total crew capacity for a given ship type (sum of all role capacities). */
export function shipTotalCapacity(type: ShipType): number {
  return Object.values(SHIP_ROLE_CAPACITY[type]).reduce((a, b) => a + b, 0);
}

// ---------------------------------------------------------------------------
// Mission presets
// ---------------------------------------------------------------------------

export interface ShipRequirement {
  type: ShipType;
  count: number;
}

export interface RoleRequirement {
  role: Role;
  count: number;
}

export interface MissionPreset {
  id: string;
  name: string;
  description: string;
  shipRequirements: ShipRequirement[];
  roleRequirements: RoleRequirement[];
}

// ---------------------------------------------------------------------------
// Live session state
// ---------------------------------------------------------------------------

export interface PlayerAssignment {
  userId: string;
  username: string;
  role: Role;
}

export interface ShipSlot {
  id: string;
  type: ShipType;
  name: string;
  players: PlayerAssignment[];
}

export interface MissionSession {
  id: string;
  presetId: string;
  ships: ShipSlot[];
  hostId: string;
}

// ---------------------------------------------------------------------------
// Goal progress helpers
// ---------------------------------------------------------------------------

export interface GoalProgress {
  totalShipsRequired: number;
  totalShipsMet: number;
  shipsByType: Array<{
    type: ShipType;
    required: number;
    current: number;
    met: boolean;
  }>;
  totalRolesRequired: number;
  totalRolesMet: number;
  roleProgress: Array<{
    role: Role;
    required: number;
    current: number;
    met: boolean;
  }>;
  allMet: boolean;
}

export function computeGoalProgress(
  preset: MissionPreset,
  ships: ShipSlot[]
): GoalProgress {
  const shipsByType = preset.shipRequirements.map((req) => {
    const current = ships.filter((s) => s.type === req.type).length;
    return { type: req.type, required: req.count, current, met: current >= req.count };
  });

  const allPlayers = ships.flatMap((s) => s.players);

  const roleProgress = preset.roleRequirements.map((req) => {
    const current = allPlayers.filter((p) => p.role === req.role).length;
    return { role: req.role, required: req.count, current, met: current >= req.count };
  });

  const totalShipsRequired = shipsByType.reduce((a, b) => a + b.required, 0);
  const totalShipsMet = shipsByType.reduce((a, b) => a + Math.min(b.current, b.required), 0);
  const totalRolesRequired = roleProgress.reduce((a, b) => a + b.required, 0);
  const totalRolesMet = roleProgress.reduce((a, b) => a + Math.min(b.current, b.required), 0);

  const allMet =
    shipsByType.every((s) => s.met) && roleProgress.every((r) => r.met);

  return {
    totalShipsRequired,
    totalShipsMet,
    shipsByType,
    totalRolesRequired,
    totalRolesMet,
    roleProgress,
    allMet,
  };
}

// ---------------------------------------------------------------------------
// Built-in preset library
// ---------------------------------------------------------------------------

export const MISSION_PRESETS: MissionPreset[] = [
  {
    id: "recon",
    name: "Recon Run",
    description: "Light scouting mission – fast and quiet.",
    shipRequirements: [{ type: "Terrapin", count: 2 }],
    roleRequirements: [
      { role: "Pilot", count: 2 },
      { role: "Scout", count: 2 },
      { role: "Navigator", count: 1 },
    ],
  },
  {
    id: "strike",
    name: "Strike Mission",
    description: "Surgical strike on a high-value target.",
    shipRequirements: [
      { type: "F7C Hornet", count: 4 },
      { type: "Retaliator", count: 2 },
    ],
    roleRequirements: [
      { role: "Pilot", count: 6 },
      { role: "Bombardier", count: 2 },
      { role: "Gunner", count: 4 },
      { role: "Squadron Leader", count: 1 },
    ],
  },
  {
    id: "escort",
    name: "Carrier Escort",
    description: "Protect a carrier through hostile territory.",
    shipRequirements: [
      { type: "Kraken", count: 1 },
      { type: "Hammerhead", count: 2 },
      { type: "F7C-M Super Hornet", count: 4 },
    ],
    roleRequirements: [
      { role: "Captain", count: 3 },
      { role: "Pilot", count: 4 },
      { role: "Engineer", count: 3 },
      { role: "Medic", count: 2 },
      { role: "Gunner", count: 6 },
      { role: "Squadron Leader", count: 1 },
    ],
  },
  {
    id: "assault",
    name: "Full Assault",
    description: "Large-scale frontal assault on an enemy fleet.",
    shipRequirements: [
      { type: "Javelin", count: 2 },
      { type: "Idris-M", count: 1 },
      { type: "F7C Hornet", count: 6 },
      { type: "Retaliator", count: 2 },
    ],
    roleRequirements: [
      { role: "Captain", count: 3 },
      { role: "Pilot", count: 8 },
      { role: "Gunner", count: 8 },
      { role: "Engineer", count: 4 },
      { role: "Medic", count: 2 },
      { role: "Marine", count: 6 },
      { role: "Bombardier", count: 2 },
    ],
  },
];

// ---------------------------------------------------------------------------
// WebSocket message protocol
// ---------------------------------------------------------------------------

export type WsClientMessage =
  | { type: "JOIN"; sessionId: string; userId: string; username: string }
  | { type: "CREATE_SESSION"; presetId: string; userId: string; username: string }
  | { type: "ADD_SHIP"; sessionId: string; shipType: ShipType; shipName: string }
  | { type: "REMOVE_SHIP"; sessionId: string; shipId: string }
  | { type: "ASSIGN_ROLE"; sessionId: string; shipId: string; role: Role; userId: string; username: string }
  | { type: "UNASSIGN_ROLE"; sessionId: string; shipId: string; userId: string }
  | { type: "GET_STATE"; sessionId: string };

export type WsServerMessage =
  | { type: "SESSION_STATE"; session: MissionSession }
  | { type: "SESSION_CREATED"; session: MissionSession }
  | { type: "ERROR"; message: string };
