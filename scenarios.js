/**
 * scenarios.js
 *
 * Defines presentation scenarios for rules.
 * Each scenario references a rule and can optionally override configuration.
 *
 * Structure:
 * - id: unique identifier for the scenario
 * - ruleId: reference to the underlying rule
 * - label: display name
 * - description: user-facing description
 * - tags: array of free-form category tags
 * - config: optional configuration overrides for the rule
 * - screenshotConfig: optional config for thumbnail generation
 *    - enabled: whether to generate a screenshot/thumbnail
 *    - iteration: iteration number at which to capture the frame
 * - version: scenario version for tracking changes
 */

export const SCENARIOS = [
  // Majority family
  {
    id: "majority-2-players-radius-1",
    ruleId: "majority",
    label: "Majority 2 - Radius 1",
    description:
      "Two-colour majority dynamics: clean, fast convergence to consensus.",
    tags: ["majority", "voting", "two-player"],
    config: {
      ordering: ["#FFB100", "#1c0221"],
      radius: 1,
      gridSize: 200,
    },
    screenshotConfig: {
      enabled: true,
      iteration: 50,
    },
    version: 1,
  },
  {
    id: "majority-2-players-radius-2",
    ruleId: "majority",
    label: "Majority 2 - Radius 2",
    description:
      "Two-colour majority dynamics: clean, fast convergence to consensus.",
    tags: ["majority", "voting", "two-player"],
    config: {
      ordering: ["#FFB100", "#1c0221"],
      radius: 2,
      gridSize: 200,
    },
    screenshotConfig: {
      enabled: true,
      iteration: 50,
    },
    version: 1,
  },
  {
    id: "majority-2-players-radius-3-grid",
    ruleId: "majority",
    label: "Majority 2 - Radius 3",
    description:
      "Two-colour majority dynamics: clean, fast convergence to consensus.",
    tags: ["majority", "voting", "two-player"],
    config: {
      ordering: ["#FFB100", "#1c0221"],
      radius: 3,
      gridSize: 200,
    },
    screenshotConfig: {
      enabled: true,
      iteration: 50,
    },
    version: 1,
  },
  {
    id: "majority-2-players-radius-4-grid",
    ruleId: "majority",
    label: "Majority 2 - Radius 4",
    description:
      "Two-colour majority dynamics: clean, fast convergence to consensus.",
    tags: ["majority", "voting", "two-player"],
    config: {
      ordering: ["#FFB100", "#1c0221"],
      radius: 4,
      gridSize: 200,
    },
    screenshotConfig: {
      enabled: true,
      iteration: 50,
    },
    version: 1,
  },
  {
    id: "majority-2-players-radius-5-grid",
    ruleId: "majority",
    label: "Majority 2 - Radius 5",
    description:
      "Two-colour majority dynamics: clean, fast convergence to consensus.",
    tags: ["majority", "voting", "two-player"],
    config: {
      ordering: ["#FFB100", "#1c0221"],
      radius: 5,
      gridSize: 200,
    },
    screenshotConfig: {
      enabled: true,
      iteration: 50,
    },
    version: 1,
  },
  {
    id: "majority-3-players",
    ruleId: "majority",
    label: "Majority (3 Players)",
    description:
      "Three-colour majority: richer dynamics with coalition boundaries.",
    tags: ["majority", "voting", "multi-player"],
    config: {
      ordering: ["#FFB100", "#1c0221", "#00CED1"],
    },
    screenshotConfig: {
      enabled: true,
      iteration: 50,
    },
    version: 1,
  },
  {
    id: "majority-4-players",
    ruleId: "majority",
    label: "Majority (4 Players)",
    description: "Four-colour majority: complex interfaces and slow consensus.",
    tags: ["majority", "voting", "multi-player"],
    config: {
      ordering: ["#FFB100", "#1c0221", "#00CED1", "#FF4500"],
      radius: 3,
      gridSize: 250,
    },
    screenshotConfig: {
      enabled: true,
      iteration: 50,
    },
    version: 1,
  },
  {
    id: "majority-diagonal",
    ruleId: "majority-diagonal",
    label: "Majority (Diagonal)",
    description:
      "Majority using only diagonal neighbours, giving X-shaped and rotated domains.",
    tags: ["majority", "voting", "diagonal"],
    screenshotConfig: {
      enabled: true,
      iteration: 50,
    },
    version: 1,
  },
  {
    id: "majority-sticky",
    ruleId: "majority-sticky-borders",
    label: "Majority – Sticky Borders",
    description:
      "Interfaces resist flipping, preserving sharp boundaries between regions.",
    tags: ["majority", "voting", "persistence"],
    screenshotConfig: {
      enabled: true,
      iteration: 50,
    },
    version: 1,
  },
  {
    id: "majority-strong",
    ruleId: "majority",
    label: "Majority - Strong Consensus",
    description:
      "Requires a strong local lead to change; slower, more blocky consensus.",
    tags: ["majority", "voting", "consensus"],
    config: {
      ordering: ["red", "white", "blue"],
      supportBias: 0.0,
      leadBias: 0.3,
      radius: 4,
      gridSize: 200,
    },
    screenshotConfig: {
      enabled: true,
      iteration: 50,
    },
    version: 1,
  },

  // Rock-Paper-Scissors family
  {
    id: "rps3-default",
    ruleId: "rps3",
    label: "RPS (3-state)",
    description:
      "Classic cyclic dominance; neighbours weighted by who beats whom.",
    tags: ["rps", "cyclic", "competition"],
    screenshotConfig: {
      enabled: true,
      iteration: 100,
    },
    version: 1,
  },
  {
    id: "rps4-default",
    ruleId: "rps4",
    label: "RPS (4-state)",
    description: "Four-state cyclic dominance with extended interaction loop.",
    tags: ["rps", "cyclic", "competition"],
    screenshotConfig: {
      enabled: true,
      iteration: 100,
    },
    version: 1,
  },
  {
    id: "rps5-default",
    ruleId: "rps5",
    label: "RPS (5-state)",
    description: "Five-state cycle; dense interference and swirling domains.",
    tags: ["rps", "cyclic", "competition"],
    screenshotConfig: {
      enabled: true,
      iteration: 100,
    },
    version: 1,
  },
  {
    id: "rps6-default",
    ruleId: "rps6",
    label: "RPS (6-state)",
    description: "Six-state cycle; rich, slow-mixing wave structures.",
    tags: ["rps", "cyclic", "competition"],
    screenshotConfig: {
      enabled: true,
      iteration: 100,
    },
    version: 1,
  },
  {
    id: "rps-cascade",
    ruleId: "rpsCascade",
    label: "RPS Cascade",
    description:
      "Cyclic dominance with cascading predator influence; multi-level interactions.",
    tags: ["rps", "cyclic", "cascade"],
    config: {
      gridSize: 200,
      radius: 3,
      influenceAdvantage: 4.1,
      dominanceBias: 0.41,
      cascadeDecay: 0.15,
      ordering: [
        "#1A2E6FFF",
        "#B32C4FFF",
        "#1F8A70FF",
        "#F2BE22FF",
        "#0FA3B1FF",
        "#EC4E20FF",
        "#9A6A6AFF",
        "#6C757DFF",
        "#17A2B8FF",
        "#DEE2E6FF",
      ],
    },
    screenshotConfig: {
      enabled: true,
      iteration: 100,
    },
    version: 1,
  },

  // Genetic Drift family
  {
    id: "drift-global",
    ruleId: "genetic-drift",
    label: "Genetic Drift (Global)",
    description:
      "Each cell samples from global colour frequencies: pure drift.",
    tags: ["genetic-drift", "stochastic", "neutral"],
    screenshotConfig: {
      enabled: true,
      iteration: 100,
    },
    version: 1,
  },
  {
    id: "drift-local",
    ruleId: "genetic-drift-local",
    label: "Genetic Drift (Local)",
    description:
      "Cells resample from their immediate neighbours: patchy local drift.",
    tags: ["genetic-drift", "stochastic", "local"],
    config: {
      ordering: ["black", "orange", "white", "blue", "green"],
      gridSize: 100,
    },
    screenshotConfig: {
      enabled: true,
      iteration: 100,
    },
    version: 1,
  },
  {
    id: "drift-hybrid",
    ruleId: "genetic-drift-global",
    label: "Genetic Drift (Local × Global)",
    description:
      "Local choices biased by global popularity: rich feedback dynamics.",
    tags: ["genetic-drift", "stochastic", "hybrid"],
    screenshotConfig: {
      enabled: true,
      iteration: 100,
    },
    version: 1,
  },

  // Imaginary Group family
  {
    id: "imaginary-base",
    ruleId: "imaginary-base",
    label: "Imaginary Group Base",
    description:
      "Cells store ±1, ±i; updates multiply neighbours according to complex-unit rules.",
    tags: ["group-theory", "complex", "algebraic"],
    screenshotConfig: {
      enabled: true,
      iteration: 50,
    },
    version: 1,
  },
  {
    id: "imaginary-single",
    ruleId: "imaginary-single",
    label: "Imaginary Group (Single Source)",
    description: "Imaginary dynamics from a single seeded region.",
    tags: ["group-theory", "complex", "algebraic", "seeded"],
    screenshotConfig: {
      enabled: true,
      iteration: 50,
    },
    version: 1,
  },
  {
    id: "imaginary-quadrants",
    ruleId: "imaginary-quadrants",
    label: "Imaginary Group (Quadrants)",
    description:
      "Quadrants seeded with different units; interfaces show their interactions.",
    tags: ["group-theory", "complex", "algebraic", "seeded"],
    screenshotConfig: {
      enabled: true,
      iteration: 50,
    },
    version: 1,
  },

  // Quaternion family
  {
    id: "quaternion-default",
    ruleId: "quaternion",
    label: "Quaternion Group",
    description:
      "Cells multiply neighbours in Q8; non-commutative group dynamics.",
    tags: ["group-theory", "quaternion", "non-commutative"],
    screenshotConfig: {
      enabled: true,
      iteration: 50,
    },
    version: 1,
  },
  {
    id: "quaternion-pizza",
    ruleId: "quaternion-pizza",
    label: "Quaternion Group (Pizza)",
    description: "Quaternion dynamics from radial sector initialisation.",
    tags: ["group-theory", "quaternion", "non-commutative", "seeded"],
    screenshotConfig: {
      enabled: true,
      iteration: 50,
    },
    version: 1,
  },
  {
    id: "quaternion-spiral",
    ruleId: "quaternion-spiral",
    label: "Quaternion Group (Spiral)",
    description: "Quaternion rule from spiral seed; twisting structure.",
    tags: ["group-theory", "quaternion", "non-commutative", "seeded"],
    screenshotConfig: {
      enabled: true,
      iteration: 50,
    },
    version: 1,
  },

  // Dihedral and Cyclic groups
  {
    id: "c4-default",
    ruleId: "c4",
    label: "C4 (Z/4)",
    description: "Cyclic group of order 4; additive dynamics modulo 4.",
    tags: ["group-theory", "cyclic", "algebraic"],
    screenshotConfig: {
      enabled: true,
      iteration: 50,
    },
    version: 1,
  },
  {
    id: "d3-default",
    ruleId: "d3",
    label: "D₃ (triangle symmetries)",
    description:
      "Products in dihedral group of order 6; triangular symmetry themes.",
    tags: ["group-theory", "dihedral", "symmetry"],
    screenshotConfig: {
      enabled: true,
      iteration: 50,
    },
    version: 1,
  },
  {
    id: "d4-default",
    ruleId: "d4",
    label: "D₄ (square symmetries)",
    description:
      "Products in D4; grid-aligned, reflection/rotation-driven patterns.",
    tags: ["group-theory", "dihedral", "symmetry"],
    screenshotConfig: {
      enabled: true,
      iteration: 50,
    },
    version: 1,
  },
  {
    id: "d6-default",
    ruleId: "d6",
    label: "D₆ (hexagon symmetries)",
    description: "Dihedral group of order 12; more complex symmetric tilings.",
    tags: ["group-theory", "dihedral", "symmetry"],
    screenshotConfig: {
      enabled: true,
      iteration: 50,
    },
    version: 1,
  },

  // Elementary Abelian
  {
    id: "elem-abelian-default",
    ruleId: "elem-abelian-2-2-2",
    label: "(Z/2)³",
    description:
      "XOR-based rule on 3-bit vectors; crisp, high-frequency interference.",
    tags: ["group-theory", "abelian", "xor"],
    screenshotConfig: {
      enabled: false, // matches previous enabled: false
      iteration: 50,
    },
    version: 1,
  },
];

/**
 * Get scenario by ID
 */
export function getScenarioById(id) {
  const scenario = SCENARIOS.find((s) => s.id === id);
  if (!scenario) {
    throw new Error(`[Scenarios] Unknown scenario id: ${id}`);
  }
  return scenario;
}

/**
 * Get all scenarios for a specific rule
 */
export function getScenariosByRuleId(ruleId) {
  return SCENARIOS.filter((s) => s.ruleId === ruleId);
}

/**
 * Get all scenarios with a specific tag
 */
export function getScenariosByTag(tag) {
  return SCENARIOS.filter((s) => s.tags && s.tags.includes(tag));
}

/**
 * Get all unique tags
 */
export function getAllTags() {
  const tagSet = new Set();
  SCENARIOS.forEach((scenario) => {
    if (scenario.tags) {
      scenario.tags.forEach((tag) => tagSet.add(tag));
    }
  });
  return Array.from(tagSet).sort();
}

/**
 * (Optional) Helper for screenshot script
 *
 * Returns all scenarios that have screenshotConfig.enabled === true
 */
export function getScreenshotScenarios() {
  return SCENARIOS.filter(
    (s) => s.screenshotConfig && s.screenshotConfig.enabled
  );
}
