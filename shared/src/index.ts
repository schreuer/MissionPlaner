// ---------------------------------------------------------------------------
// Ship types and the roles each type allows
// ---------------------------------------------------------------------------

export type ShipType =
  | "Fighter"
  | "Bomber"
  | "Cruiser"
  | "Carrier"
  | "Scout"
  | "Frigate"
  | "Destroyer";

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
  | "Technician";

export const SHIP_ALLOWED_ROLES: Record<ShipType, Role[]> = {
  Fighter: ["Pilot", "Co-Pilot", "Gunner"],
  Bomber: ["Pilot", "Co-Pilot", "Bombardier", "Gunner"],
  Scout: ["Pilot", "Co-Pilot", "Scout", "Navigator"],
  Frigate: ["Captain", "Navigator", "Engineer", "Gunner", "Medic", "Marine"],
  Destroyer: [
    "Captain",
    "Navigator",
    "Engineer",
    "Gunner",
    "Medic",
    "Marine",
    "Technician",
  ],
  Cruiser: [
    "Captain",
    "Navigator",
    "Engineer",
    "Gunner",
    "Medic",
    "Marine",
    "Technician",
    "Squadron Leader",
  ],
  Carrier: [
    "Captain",
    "Navigator",
    "Engineer",
    "Medic",
    "Technician",
    "Squadron Leader",
  ],
};

/**
 * Maximum number of players allowed per role on each ship type.
 * Every role listed in SHIP_ALLOWED_ROLES has an explicit entry here.
 * If a role were somehow absent, both the server and the client fall back
 * to a capacity of 1 (one player per role) as a safe default.
 */
export const SHIP_ROLE_CAPACITY: Record<ShipType, Partial<Record<Role, number>>> = {
  Fighter:   { Pilot: 1, "Co-Pilot": 1, Gunner: 2 },
  Bomber:    { Pilot: 1, "Co-Pilot": 1, Bombardier: 2, Gunner: 2 },
  Scout:     { Pilot: 1, "Co-Pilot": 1, Scout: 2, Navigator: 1 },
  Frigate:   { Captain: 1, Navigator: 1, Engineer: 2, Gunner: 4, Medic: 1, Marine: 6 },
  Destroyer: { Captain: 1, Navigator: 1, Engineer: 2, Gunner: 6, Medic: 2, Marine: 8, Technician: 2 },
  Cruiser:   { Captain: 1, Navigator: 1, Engineer: 3, Gunner: 8, Medic: 2, Marine: 10, Technician: 2, "Squadron Leader": 1 },
  Carrier:   { Captain: 1, Navigator: 1, Engineer: 4, Medic: 3, Technician: 3, "Squadron Leader": 2 },
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
    shipRequirements: [{ type: "Scout", count: 2 }],
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
      { type: "Fighter", count: 4 },
      { type: "Bomber", count: 2 },
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
      { type: "Carrier", count: 1 },
      { type: "Frigate", count: 2 },
      { type: "Fighter", count: 4 },
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
      { type: "Destroyer", count: 2 },
      { type: "Cruiser", count: 1 },
      { type: "Fighter", count: 6 },
      { type: "Bomber", count: 2 },
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
  | { type: "JOIN"; sessionId: string; userId: string; username: string; avatarUrl?: string }
  | { type: "CREATE_SESSION"; presetId: string; userId: string; username: string; avatarUrl?: string }
  | { type: "ADD_SHIP"; sessionId: string; shipType: ShipType; shipName: string }
  | { type: "REMOVE_SHIP"; sessionId: string; shipId: string }
  | { type: "ASSIGN_ROLE"; sessionId: string; shipId: string; role: Role; userId: string; username: string }
  | { type: "UNASSIGN_ROLE"; sessionId: string; shipId: string; userId: string }
  | { type: "GET_STATE"; sessionId: string };

export type WsServerMessage =
  | { type: "SESSION_STATE"; session: MissionSession }
  | { type: "SESSION_CREATED"; session: MissionSession }
  | { type: "ERROR"; message: string };
