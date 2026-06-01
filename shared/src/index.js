"use strict";
// ---------------------------------------------------------------------------
// Ship types and the roles each type allows
// ---------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.MISSION_PRESETS = exports.SHIP_ROLE_MAP = exports.SHIP_ROLE_CAPACITY = exports.SHIP_ALLOWED_ROLES = void 0;
exports.shipTotalCapacity = shipTotalCapacity;
exports.computeGoalProgress = computeGoalProgress;
exports.SHIP_ALLOWED_ROLES = {
    // ── Light / single-seat fighters ────────────────────────────────────────
    "Gladius": ["Pilot"],
    "Arrow": ["Pilot"],
    "M50": ["Pilot"],
    "Sabre": ["Pilot"],
    "F7C Hornet": ["Pilot"],
    "Talon": ["Pilot"],
    "Buccaneer": ["Pilot"],
    "Eclipse": ["Pilot"],
    // ── Two-seat fighters / interceptors ────────────────────────────────────
    "F7C-M Super Hornet": ["Pilot", "Gunner"],
    "Scorpius": ["Pilot", "Gunner"],
    "Sabre Comet": ["Pilot", "Co-Pilot"],
    "Sabre Raven": ["Pilot", "Scout"],
    // ── Scout / recon ────────────────────────────────────────────────────────
    "F7C-S Hornet Ghost": ["Pilot", "Scout"],
    "F7C-R Hornet Tracker": ["Pilot", "Navigator"],
    "Terrapin": ["Pilot", "Navigator", "Scout"],
    "Herald": ["Pilot", "Navigator"],
    // ── Heavy fighters / long-range ──────────────────────────────────────────
    "Vanguard Warden": ["Pilot", "Co-Pilot"],
    "Vanguard Sentinel": ["Pilot", "Co-Pilot"],
    "Corsair": ["Pilot", "Co-Pilot", "Gunner"],
    "M80": ["Pilot"],
    // ── Bombers ──────────────────────────────────────────────────────────────
    "Gladiator": ["Pilot", "Bombardier"],
    "Vanguard Harbinger": ["Pilot", "Co-Pilot", "Bombardier"],
    "Retaliator": ["Pilot", "Co-Pilot", "Bombardier", "Gunner"],
    // ── Multi-crew gunships ───────────────────────────────────────────────────
    "Redeemer": ["Pilot", "Co-Pilot", "Gunner"],
    "Constellation Andromeda": ["Pilot", "Co-Pilot", "Gunner"],
    "Perseus": ["Pilot", "Co-Pilot", "Gunner", "Marine", "Medic"],
    // ── Frigates / assault ships ──────────────────────────────────────────────
    "Hammerhead": ["Captain", "Navigator", "Engineer", "Gunner", "Medic"],
    "Polaris": ["Captain", "Navigator", "Engineer", "Gunner", "Marine", "Medic"],
    "Valkyrie": ["Pilot", "Co-Pilot", "Gunner", "Marine", "Medic"],
    "A2 Hercules": ["Pilot", "Co-Pilot", "Gunner", "Bombardier", "Marine", "Engineer"],
    // ── Capital ships ─────────────────────────────────────────────────────────
    "Javelin": ["Captain", "Navigator", "Engineer", "Gunner", "Medic", "Marine", "Squadron Leader"],
    "Idris-M": ["Captain", "Navigator", "Engineer", "Gunner", "Medic", "Marine", "Squadron Leader"],
    "Idris-P": ["Captain", "Navigator", "Engineer", "Gunner", "Medic", "Marine", "Squadron Leader"],
    // ── Carriers ─────────────────────────────────────────────────────────────
    "Kraken": ["Captain", "Navigator", "Engineer", "Medic", "Squadron Leader"],
    "Liberator": ["Captain", "Navigator", "Engineer", "Medic", "Squadron Leader"],
    // ── Transports ───────────────────────────────────────────────────────────
    "Caterpillar": ["Pilot", "Co-Pilot", "Engineer", "Gunner"],
    "Hull C": ["Pilot", "Engineer"],
    "Freelancer MAX": ["Pilot", "Co-Pilot"],
    "C2 Hercules": ["Pilot", "Co-Pilot", "Engineer"],
    "Constellation Taurus": ["Pilot", "Co-Pilot", "Gunner"],
};
/**
 * Maximum number of players allowed per role on each ship.
 * Every role listed in SHIP_ALLOWED_ROLES has an explicit entry here.
 * If a role were somehow absent, both the server and the client fall back
 * to a capacity of 1 (one player per role) as a safe default.
 */
exports.SHIP_ROLE_CAPACITY = {
    // ── Light / single-seat fighters ────────────────────────────────────────
    "Gladius": { Pilot: 1 },
    "Arrow": { Pilot: 1 },
    "M50": { Pilot: 1 },
    "Sabre": { Pilot: 1 },
    "F7C Hornet": { Pilot: 1 },
    "Talon": { Pilot: 1 },
    "Buccaneer": { Pilot: 1 },
    "Eclipse": { Pilot: 1 },
    // ── Two-seat fighters / interceptors ────────────────────────────────────
    "F7C-M Super Hornet": { Pilot: 1, Gunner: 1 },
    "Scorpius": { Pilot: 1, Gunner: 1 },
    "Sabre Comet": { Pilot: 1, "Co-Pilot": 1 },
    "Sabre Raven": { Pilot: 1, Scout: 1 },
    // ── Scout / recon ────────────────────────────────────────────────────────
    "F7C-S Hornet Ghost": { Pilot: 1, Scout: 1 },
    "F7C-R Hornet Tracker": { Pilot: 1, Navigator: 1 },
    "Terrapin": { Pilot: 1, Navigator: 1, Scout: 2 },
    "Herald": { Pilot: 1, Navigator: 1 },
    // ── Heavy fighters / long-range ──────────────────────────────────────────
    "Vanguard Warden": { Pilot: 1, "Co-Pilot": 1 },
    "Vanguard Sentinel": { Pilot: 1, "Co-Pilot": 1 },
    "Corsair": { Pilot: 1, "Co-Pilot": 1, Gunner: 2 },
    "M80": { Pilot: 1 },
    // ── Bombers ──────────────────────────────────────────────────────────────
    "Gladiator": { Pilot: 1, Bombardier: 1 },
    "Vanguard Harbinger": { Pilot: 1, "Co-Pilot": 1, Bombardier: 1 },
    "Retaliator": { Pilot: 1, "Co-Pilot": 1, Bombardier: 2, Gunner: 2 },
    // ── Multi-crew gunships ───────────────────────────────────────────────────
    "Redeemer": { Pilot: 1, "Co-Pilot": 1, Gunner: 3 },
    "Constellation Andromeda": { Pilot: 1, "Co-Pilot": 1, Gunner: 3 },
    "Perseus": { Pilot: 1, "Co-Pilot": 1, Gunner: 2, Marine: 10, Medic: 2 },
    // ── Frigates / assault ships ──────────────────────────────────────────────
    "Hammerhead": { Captain: 1, Navigator: 1, Engineer: 2, Gunner: 6, Medic: 1 },
    "Polaris": { Captain: 1, Navigator: 1, Engineer: 2, Gunner: 4, Marine: 4, Medic: 1 },
    "Valkyrie": { Pilot: 1, "Co-Pilot": 1, Gunner: 2, Marine: 8, Medic: 1 },
    "A2 Hercules": { Pilot: 1, "Co-Pilot": 1, Gunner: 2, Bombardier: 2, Marine: 6, Engineer: 1 },
    // ── Capital ships ─────────────────────────────────────────────────────────
    "Javelin": { Captain: 1, Navigator: 1, Engineer: 4, Gunner: 8, Medic: 2, Marine: 10, "Squadron Leader": 1 },
    "Idris-M": { Captain: 1, Navigator: 1, Engineer: 3, Gunner: 8, Medic: 2, Marine: 8, "Squadron Leader": 1 },
    "Idris-P": { Captain: 1, Navigator: 1, Engineer: 3, Gunner: 6, Medic: 2, Marine: 6, "Squadron Leader": 1 },
    // ── Carriers ─────────────────────────────────────────────────────────────
    "Kraken": { Captain: 1, Navigator: 1, Engineer: 4, Medic: 3, "Squadron Leader": 2 },
    "Liberator": { Captain: 1, Navigator: 1, Engineer: 2, Medic: 1, "Squadron Leader": 1 },
    // ── Transports ───────────────────────────────────────────────────────────
    "Caterpillar": { Pilot: 1, "Co-Pilot": 1, Engineer: 2, Gunner: 4 },
    "Hull C": { Pilot: 1, Engineer: 1 },
    "Freelancer MAX": { Pilot: 1, "Co-Pilot": 1 },
    "C2 Hercules": { Pilot: 1, "Co-Pilot": 1, Engineer: 1 },
    "Constellation Taurus": { Pilot: 1, "Co-Pilot": 1, Gunner: 2 },
};
/** Total crew capacity for a given ship type (sum of all role capacities). */
function shipTotalCapacity(type) {
    return Object.values(exports.SHIP_ROLE_CAPACITY[type]).reduce((a, b) => a + b, 0);
}
/** Maps each named ship to its tactical ship role. */
exports.SHIP_ROLE_MAP = {
    // Fighters
    "Gladius": "Fighter",
    "Arrow": "Fighter",
    "M50": "Fighter",
    "Sabre": "Fighter",
    "F7C Hornet": "Fighter",
    "Talon": "Fighter",
    "Buccaneer": "Fighter",
    "F7C-M Super Hornet": "Fighter",
    "Scorpius": "Fighter",
    "Sabre Comet": "Fighter",
    "Vanguard Warden": "Fighter",
    "Vanguard Sentinel": "Fighter",
    "Corsair": "Fighter",
    "M80": "Fighter",
    // Bombers
    "Eclipse": "Bomber",
    "Gladiator": "Bomber",
    "Vanguard Harbinger": "Bomber",
    "Retaliator": "Bomber",
    // Scouts
    "Sabre Raven": "Scout",
    "F7C-S Hornet Ghost": "Scout",
    "F7C-R Hornet Tracker": "Scout",
    "Terrapin": "Scout",
    "Herald": "Scout",
    // Gunships
    "Redeemer": "Gunship",
    "Constellation Andromeda": "Gunship",
    "Perseus": "Gunship",
    // Frigates
    "Hammerhead": "Frigate",
    "Polaris": "Frigate",
    "Valkyrie": "Frigate",
    "A2 Hercules": "Frigate",
    // Capital ships
    "Javelin": "Capital",
    "Idris-M": "Capital",
    "Idris-P": "Capital",
    // Carriers
    "Kraken": "Carrier",
    "Liberator": "Carrier",
    // Transports
    "Caterpillar": "Transport",
    "Hull C": "Transport",
    "Freelancer MAX": "Transport",
    "C2 Hercules": "Transport",
    "Constellation Taurus": "Transport",
};
function computeGoalProgress(preset, ships) {
    const shipsByRole = preset.shipRequirements.map((req) => {
        const current = ships.filter((s) => s.role === req.role).length;
        return { role: req.role, required: req.count, current, met: current >= req.count };
    });
    const allPlayers = ships.flatMap((s) => s.players);
    const roleProgress = preset.roleRequirements.map((req) => {
        const current = allPlayers.filter((p) => p.role === req.role).length;
        return { role: req.role, required: req.count, current, met: current >= req.count };
    });
    const totalShipsRequired = shipsByRole.reduce((a, b) => a + b.required, 0);
    const totalShipsMet = shipsByRole.reduce((a, b) => a + Math.min(b.current, b.required), 0);
    const totalRolesRequired = roleProgress.reduce((a, b) => a + b.required, 0);
    const totalRolesMet = roleProgress.reduce((a, b) => a + Math.min(b.current, b.required), 0);
    const allMet = shipsByRole.every((s) => s.met) && roleProgress.every((r) => r.met);
    // Optimal tier
    const hasOptimal =
        (preset.optimalShipRequirements?.length ?? 0) > 0 ||
        (preset.optimalRoleRequirements?.length ?? 0) > 0;
    const optimalShipsByRole = (preset.optimalShipRequirements ?? []).map((req) => {
        const current = ships.filter((s) => s.role === req.role).length;
        return { role: req.role, required: req.count, current, met: current >= req.count };
    });
    const optimalRoleProgress = (preset.optimalRoleRequirements ?? []).map((req) => {
        const current = allPlayers.filter((p) => p.role === req.role).length;
        return { role: req.role, required: req.count, current, met: current >= req.count };
    });
    const totalOptimalShipsRequired = optimalShipsByRole.reduce((a, b) => a + b.required, 0);
    const totalOptimalShipsMet = optimalShipsByRole.reduce((a, b) => a + Math.min(b.current, b.required), 0);
    const totalOptimalRolesRequired = optimalRoleProgress.reduce((a, b) => a + b.required, 0);
    const totalOptimalRolesMet = optimalRoleProgress.reduce((a, b) => a + Math.min(b.current, b.required), 0);
    const optimalAllMet = optimalShipsByRole.every((s) => s.met) && optimalRoleProgress.every((r) => r.met);
    return {
        totalShipsRequired,
        totalShipsMet,
        shipsByRole,
        totalRolesRequired,
        totalRolesMet,
        roleProgress,
        allMet,
        hasOptimal,
        totalOptimalShipsRequired,
        totalOptimalShipsMet,
        optimalShipsByRole,
        totalOptimalRolesRequired,
        totalOptimalRolesMet,
        optimalRoleProgress,
        optimalAllMet,
    };
}
// ---------------------------------------------------------------------------
// Built-in preset library
// ---------------------------------------------------------------------------
exports.MISSION_PRESETS = [
    {
        id: "TSG",
        name: "Tactical Strike Group",
        description: "Battle Shattered Blade, infiltrate and extract Gabe",
        shipRequirements: [
            { role: "Frigate", count: 2 },
            { role: "Fighter", count: 3 },
        ],
        roleRequirements: [
            { role: "Pilot", count: 5 },
            { role: "Gunner", count: 2 },
            { role: "Marine", count: 2 },
        ],
        optimalShipRequirements: [
            { role: "Frigate", count: 3 },
            { role: "Fighter", count: 5 },
            { role: "Transport", count: 1 },
        ],
        optimalRoleRequirements: [
            { role: "Pilot", count: 8 },
            { role: "Gunner", count: 4 },
            { role: "Marine", count: 8 },
            { role: "Medic", count: 2 },
            { role: "Engineer", count: 1 },
        ],
    }
];
