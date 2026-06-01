"use strict";
// ---------------------------------------------------------------------------
// Ship types and the roles each type allows
// ---------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.MISSION_PRESETS = exports.SHIP_ROLE_CAPACITY = exports.SHIP_ALLOWED_ROLES = void 0;
exports.shipTotalCapacity = shipTotalCapacity;
exports.computeGoalProgress = computeGoalProgress;
exports.SHIP_ALLOWED_ROLES = {
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
exports.SHIP_ROLE_CAPACITY = {
    Fighter: { Pilot: 1, "Co-Pilot": 1, Gunner: 2 },
    Bomber: { Pilot: 1, "Co-Pilot": 1, Bombardier: 2, Gunner: 2 },
    Scout: { Pilot: 1, "Co-Pilot": 1, Scout: 2, Navigator: 1 },
    Frigate: { Captain: 1, Navigator: 1, Engineer: 2, Gunner: 4, Medic: 1, Marine: 6 },
    Destroyer: { Captain: 1, Navigator: 1, Engineer: 2, Gunner: 6, Medic: 2, Marine: 8, Technician: 2 },
    Cruiser: { Captain: 1, Navigator: 1, Engineer: 3, Gunner: 8, Medic: 2, Marine: 10, Technician: 2, "Squadron Leader": 1 },
    Carrier: { Captain: 1, Navigator: 1, Engineer: 4, Medic: 3, Technician: 3, "Squadron Leader": 2 },
};
/** Total crew capacity for a given ship type (sum of all role capacities). */
function shipTotalCapacity(type) {
    return Object.values(exports.SHIP_ROLE_CAPACITY[type]).reduce((a, b) => a + b, 0);
}
function computeGoalProgress(preset, ships) {
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
    const allMet = shipsByType.every((s) => s.met) && roleProgress.every((r) => r.met);
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
exports.MISSION_PRESETS = [
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
