import { TAGS } from "./tags.js";

/**
 * scenarios.js
 *
 * Defines presentation scenarios for rules.
 */

export const SCENARIOS = [
  // -------------------------
  // Majority family
  // -------------------------

  {
    id: "majority-2-players-radius-1",
    ruleId: "majority",
    label: "Majority 2 – Radius 1",
    description:
      "Two-state majority dynamics with fast convergence toward consensus.",
    tags: [
      TAGS.MAJORITY,
      TAGS.CONSENSUS,
      TAGS.BI_STATE,
      TAGS.CONVERGENT,
      TAGS.LOW_RADIUS,
    ],
    config: {
      ordering: ["#FFB100", "#1c0221"],
      radius: 1,
      gridSize: 200,
    },
    screenshotConfig: { enabled: true, iteration: 50 },
    version: 1,
  },

  {
    id: "majority-2-players-radius-2",
    ruleId: "majority",
    label: "Majority 2 – Radius 2",
    description:
      "Two-state majority rule with slightly broader neighborhoods and reliable convergence.",
    tags: [
      TAGS.MAJORITY,
      TAGS.CONSENSUS,
      TAGS.BI_STATE,
      TAGS.CONVERGENT,
      TAGS.LOW_RADIUS,
    ],
    config: {
      ordering: ["#FFB100", "#1c0221"],
      radius: 2,
      gridSize: 200,
    },
    screenshotConfig: { enabled: true, iteration: 50 },
    version: 1,
  },

  {
    id: "majority-2-players-radius-3-grid",
    ruleId: "majority",
    label: "Majority 2 – Radius 3",
    description:
      "Two-state majority with wider neighborhoods producing smooth, stable convergence.",
    tags: [
      TAGS.MAJORITY,
      TAGS.CONSENSUS,
      TAGS.BI_STATE,
      TAGS.CONVERGENT,
      TAGS.LOW_RADIUS,
    ],
    config: {
      ordering: ["#FFB100", "#1c0221"],
      radius: 3,
      gridSize: 200,
    },
    screenshotConfig: { enabled: true, iteration: 50 },
    version: 1,
  },

  {
    id: "majority-2-players-radius-4-grid",
    ruleId: "majority",
    label: "Majority 2 – Radius 4",
    description:
      "Large-neighborhood majority rule with slow but reliable convergence.",
    tags: [
      TAGS.MAJORITY,
      TAGS.CONSENSUS,
      TAGS.BI_STATE,
      TAGS.CONVERGENT,
      TAGS.LOW_RADIUS,
    ],
    config: {
      ordering: ["#FFB100", "#1c0221"],
      radius: 4,
      gridSize: 200,
    },
    screenshotConfig: { enabled: true, iteration: 50 },
    version: 1,
  },

  {
    id: "majority-2-players-radius-5-grid",
    ruleId: "majority",
    label: "Majority 2 – Radius 5",
    description:
      "Very wide-radius majority rule, producing smooth consensus evolution.",
    tags: [
      TAGS.MAJORITY,
      TAGS.CONSENSUS,
      TAGS.BI_STATE,
      TAGS.CONVERGENT,
      TAGS.HIGH_RADIUS,
    ],
    config: {
      ordering: ["#FFB100", "#1c0221"],
      radius: 5,
      gridSize: 200,
    },
    screenshotConfig: { enabled: true, iteration: 50 },
    version: 1,
  },

  {
    id: "majority-3-players",
    ruleId: "majority",
    label: "Majority (3 States)",
    description:
      "Three-state majority rule with richer boundaries and slower consensus.",
    tags: [
      TAGS.MAJORITY,
      TAGS.CONSENSUS,
      TAGS.MULTI_STATE,
      TAGS.CONVERGENT,
      TAGS.LOW_RADIUS,
    ],
    config: {
      ordering: ["#FFB100", "#1c0221", "#00CED1"],
    },
    screenshotConfig: { enabled: true, iteration: 50 },
    version: 1,
  },

  {
    id: "majority-4-players",
    ruleId: "majority",
    label: "Majority (4 States)",
    description:
      "Four-state majority rule creating complex interfaces and slow convergence.",
    tags: [
      TAGS.MAJORITY,
      TAGS.CONSENSUS,
      TAGS.MULTI_STATE,
      TAGS.CONVERGENT,
      TAGS.HIGH_RADIUS,
    ],
    config: {
      ordering: ["#FFB100", "#1c0221", "#00CED1", "#FF4500"],
      radius: 3,
      gridSize: 250,
    },
    screenshotConfig: { enabled: true, iteration: 50 },
    version: 1,
  },

  {
    id: "majority-diagonal",
    ruleId: "majority-diagonal",
    label: "Majority (Diagonal)",
    description:
      "Majority rule using only diagonal neighbors, producing X-shaped domains.",
    tags: [
      TAGS.MAJORITY,
      TAGS.CONSENSUS,
      TAGS.BI_STATE,
      TAGS.CONVERGENT,
      TAGS.DIAGONAL,
    ],
    screenshotConfig: { enabled: true, iteration: 50 },
    version: 1,
  },

  {
    id: "majority-sticky",
    ruleId: "majority-sticky-borders",
    label: "Majority – Sticky Borders",
    description:
      "A majority rule with resistant boundaries, preserving sharper interfaces.",
    tags: [
      TAGS.MAJORITY,
      TAGS.CONSENSUS,
      TAGS.BI_STATE,
      TAGS.CONVERGENT,
      TAGS.INTERFACE,
    ],
    screenshotConfig: { enabled: true, iteration: 50 },
    version: 1,
  },

  {
    id: "majority-strong",
    ruleId: "majority",
    label: "Majority – Strong Consensus",
    description:
      "A stronger threshold for flipping, yielding blocky textures and slow consensus.",
    tags: [
      TAGS.MAJORITY,
      TAGS.CONSENSUS,
      TAGS.BI_STATE,
      TAGS.CONVERGENT,
      TAGS.HIGH_RADIUS,
    ],
    config: {
      ordering: ["red", "white", "blue"],
      supportBias: 0.0,
      leadBias: 0.3,
      radius: 4,
      gridSize: 200,
    },
    screenshotConfig: { enabled: true, iteration: 50 },
    version: 1,
  },

  // -------------------------
  // Rock-Paper-Scissors family
  // -------------------------

  {
    id: "rps3-default",
    ruleId: "rps3",
    label: "RPS (3 States)",
    description:
      "Three-state cyclic dominance with continual competition and wave motion.",
    tags: [
      TAGS.RPS,
      TAGS.CYCLIC,
      TAGS.COMPETITION,
      TAGS.MULTI_STATE,
      TAGS.DIVERGENT,
    ],
    screenshotConfig: { enabled: true, iteration: 100 },
    version: 1,
  },

  {
    id: "rps4-default",
    ruleId: "rps4",
    label: "RPS (4 States)",
    description:
      "Four-state cyclic dynamics with a longer interaction loop and persistent motion.",
    tags: [
      TAGS.RPS,
      TAGS.CYCLIC,
      TAGS.COMPETITION,
      TAGS.MULTI_STATE,
      TAGS.DIVERGENT,
    ],
    screenshotConfig: { enabled: true, iteration: 100 },
    version: 1,
  },

  {
    id: "rps5-default",
    ruleId: "rps5",
    label: "RPS (5 States)",
    description:
      "Five-state cyclic dominance yielding swirling, overlapping domains.",
    tags: [
      TAGS.RPS,
      TAGS.CYCLIC,
      TAGS.COMPETITION,
      TAGS.MULTI_STATE,
      TAGS.DIVERGENT,
    ],
    screenshotConfig: { enabled: true, iteration: 100 },
    version: 1,
  },

  {
    id: "rps6-default",
    ruleId: "rps6",
    label: "RPS (6 States)",
    description:
      "Six-state cycle producing slow-mixing wavefronts and complex interactions.",
    tags: [
      TAGS.RPS,
      TAGS.CYCLIC,
      TAGS.COMPETITION,
      TAGS.MULTI_STATE,
      TAGS.DIVERGENT,
    ],
    screenshotConfig: { enabled: true, iteration: 100 },
    version: 1,
  },

  {
    id: "rps-cascade",
    ruleId: "rpsCascade",
    label: "RPS Cascade",
    description:
      "Cyclic dominance with cascading predator influence across multiple levels.",
    tags: [
      TAGS.RPS,
      TAGS.CYCLIC,
      TAGS.COMPETITION,
      TAGS.MULTI_STATE,
      TAGS.DIVERGENT,
      // meaningful bespoke tag
      "cascade",
    ],
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
    screenshotConfig: { enabled: true, iteration: 100 },
    version: 1,
  },

  // -------------------------
  // Genetic Drift family
  // -------------------------

  {
    id: "drift-global",
    ruleId: "genetic-drift",
    label: "Genetic Drift (Global)",
    description:
      "Cells resample from global colour frequencies, producing pure stochastic drift.",
    tags: [
      TAGS.DRIFT,
      TAGS.STOCHASTIC,
      TAGS.GLOBAL,
      TAGS.MULTI_STATE,
      TAGS.CONVERGENT,
    ],
    screenshotConfig: { enabled: true, iteration: 100 },
    version: 1,
  },

  {
    id: "drift-local",
    ruleId: "genetic-drift-local",
    label: "Genetic Drift (Local)",
    description:
      "Local resampling yields patchy drift with slow coalescence toward convergence.",
    tags: [
      TAGS.DRIFT,
      TAGS.STOCHASTIC,
      TAGS.LOCAL,
      TAGS.MULTI_STATE,
      TAGS.CONVERGENT,
    ],
    config: {
      ordering: ["black", "orange", "white", "blue", "green"],
      gridSize: 100,
    },
    screenshotConfig: { enabled: true, iteration: 100 },
    version: 1,
  },

  {
    id: "drift-hybrid",
    ruleId: "genetic-drift-global",
    label: "Genetic Drift (Local × Global)",
    description:
      "Local sampling biased by global popularity, forming feedback-rich dynamics.",
    tags: [
      TAGS.DRIFT,
      TAGS.STOCHASTIC,
      TAGS.HYBRID,
      TAGS.MULTI_STATE,
      TAGS.CONVERGENT,
    ],
    screenshotConfig: { enabled: true, iteration: 100 },
    version: 1,
  },

  // -------------------------
  // Imaginary Group family
  // -------------------------

  {
    id: "imaginary-base",
    ruleId: "imaginary-base",
    label: "Imaginary Group Base",
    description:
      "Cells carry ±1 and ±i; neighborhood products give complex-unit dynamics.",
    tags: [
      TAGS.GROUP_THEORY,
      TAGS.COMPLEX_UNITS,
      TAGS.MULTI_STATE,
      TAGS.DIVERGENT,
    ],
    screenshotConfig: { enabled: true, iteration: 50 },
    version: 1,
  },

  {
    id: "imaginary-single",
    ruleId: "imaginary-single",
    label: "Imaginary Group (Single Source)",
    description:
      "Complex-unit dynamics seeded from a single region, revealing interaction fronts.",
    tags: [
      TAGS.GROUP_THEORY,
      TAGS.COMPLEX_UNITS,
      TAGS.MULTI_STATE,
      TAGS.SEEDED,
      TAGS.DIVERGENT,
    ],
    screenshotConfig: { enabled: true, iteration: 50 },
    version: 1,
  },

  {
    id: "imaginary-quadrants",
    ruleId: "imaginary-quadrants",
    label: "Imaginary Group (Quadrants)",
    description:
      "Quadrants seeded with different complex units; boundaries reveal their interactions.",
    tags: [
      TAGS.GROUP_THEORY,
      TAGS.COMPLEX_UNITS,
      TAGS.MULTI_STATE,
      TAGS.SEEDED,
      TAGS.DIVERGENT,
    ],
    screenshotConfig: { enabled: true, iteration: 50 },
    version: 1,
  },

  // -------------------------
  // Quaternion family
  // -------------------------

  {
    id: "quaternion-default",
    ruleId: "quaternion",
    label: "Quaternion Group",
    description:
      "Cells multiply neighbors in Q8, producing non-commutative group dynamics.",
    tags: [
      TAGS.GROUP_THEORY,
      TAGS.QUATERNION,
      TAGS.MULTI_STATE,
      TAGS.DIVERGENT,
    ],
    screenshotConfig: { enabled: true, iteration: 50 },
    version: 1,
  },

  {
    id: "quaternion-pizza",
    ruleId: "quaternion-pizza",
    label: "Quaternion Group (Pizza)",
    description:
      "Radially seeded quaternion dynamics producing rotational interfaces.",
    tags: [
      TAGS.GROUP_THEORY,
      TAGS.QUATERNION,
      TAGS.MULTI_STATE,
      TAGS.SEEDED,
      TAGS.DIVERGENT,
    ],
    screenshotConfig: { enabled: true, iteration: 50 },
    version: 1,
  },

  {
    id: "quaternion-spiral",
    ruleId: "quaternion-spiral",
    label: "Quaternion Group (Spiral)",
    description:
      "Quaternion rule seeded with a spiral pattern, yielding twisting dynamics.",
    tags: [
      TAGS.GROUP_THEORY,
      TAGS.QUATERNION,
      TAGS.MULTI_STATE,
      TAGS.SEEDED,
      TAGS.DIVERGENT,
    ],
    screenshotConfig: { enabled: true, iteration: 50 },
    version: 1,
  },

  // -------------------------
  // Dihedral & Cyclic Groups
  // -------------------------

  {
    id: "c4-default",
    ruleId: "c4",
    label: "C4 (Z/4)",
    description: "Cyclic group of order 4 with additive dynamics modulo 4.",
    tags: [
      TAGS.GROUP_THEORY,
      TAGS.CYCLIC_GROUP,
      TAGS.MULTI_STATE,
      TAGS.DIVERGENT,
    ],
    screenshotConfig: { enabled: true, iteration: 50 },
    version: 1,
  },

  {
    id: "d3-default",
    ruleId: "d3",
    label: "D₃ (Triangle Symmetries)",
    description:
      "A dihedral group rule expressing triangular rotational and reflection symmetries.",
    tags: [
      TAGS.GROUP_THEORY,
      TAGS.DIHEDRAL,
      TAGS.SYMMETRY,
      TAGS.MULTI_STATE,
      TAGS.DIVERGENT,
    ],
    screenshotConfig: { enabled: true, iteration: 50 },
    version: 1,
  },

  {
    id: "d4-default",
    ruleId: "d4",
    label: "D₄ (Square Symmetries)",
    description:
      "Dihedral group of order 8 with strong grid-aligned symmetry structures.",
    tags: [
      TAGS.GROUP_THEORY,
      TAGS.DIHEDRAL,
      TAGS.SYMMETRY,
      TAGS.MULTI_STATE,
      TAGS.DIVERGENT,
    ],
    screenshotConfig: { enabled: true, iteration: 50 },
    version: 1,
  },

  {
    id: "d6-default",
    ruleId: "d6",
    label: "D₆ (Hexagon Symmetries)",
    description:
      "Hexagonal dihedral group with rich symmetric tilings and non-convergent behavior.",
    tags: [
      TAGS.GROUP_THEORY,
      TAGS.DIHEDRAL,
      TAGS.SYMMETRY,
      TAGS.MULTI_STATE,
      TAGS.DIVERGENT,
    ],
    screenshotConfig: { enabled: true, iteration: 50 },
    version: 1,
  },

  // -------------------------
  // Elementary Abelian
  // -------------------------

  {
    id: "elem-abelian-default",
    ruleId: "elem-abelian-2-2-2",
    label: "(Z/2)³",
    description:
      "An XOR-based rule on 3-bit vectors producing crisp, high-frequency interference.",
    tags: [TAGS.GROUP_THEORY, TAGS.ABELIAN, TAGS.MULTI_STATE, TAGS.DIVERGENT],
    screenshotConfig: { enabled: false, iteration: 50 },
    version: 1,
  },
];

/**
 * Access helpers
 */

export function getScenarioById(id) {
  const scenario = SCENARIOS.find((s) => s.id === id);
  if (!scenario) throw new Error(`[Scenarios] Unknown scenario id: ${id}`);
  return scenario;
}

export function getScenariosByRuleId(ruleId) {
  return SCENARIOS.filter((s) => s.ruleId === ruleId);
}

export function getScenariosByTag(tag) {
  return SCENARIOS.filter((s) => s.tags && s.tags.includes(tag));
}

export function getAllTags() {
  const tagSet = new Set();
  SCENARIOS.forEach((s) => s.tags?.forEach((t) => tagSet.add(t)));
  return Array.from(tagSet).sort();
}

export function getScreenshotScenarios() {
  return SCENARIOS.filter(
    (s) => s.screenshotConfig && s.screenshotConfig.enabled
  );
}
