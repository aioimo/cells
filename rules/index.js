// ----------------------------------------------------
// Rule Registry — explicit imports
// ----------------------------------------------------

// Majority family
import { Majority } from "./Majority.js";
import { MajorityDiagonal } from "./MajorityDiagonal.js";
import { MajorityStickyBorders } from "./MajorityStickyBorders.js";
import { MajorityStrongConsensus } from "./MajorityStrongConsensus.js";

// RPS (Rock–Paper–Scissors) family
import { RPS } from "./RPS.js";
import { RPS4 } from "./RPS4.js";
import { RPS5 } from "./RPS5.js";
import { RPS6 } from "./RPS6.js";
import { RPSDiagonal } from "./RPSDiagonal.js";

// Genetic Drift family
import { GeneticDrift } from "./GeneticDrift.js";
import { GeneticDriftLocalBattle } from "./GeneticDriftLocalBattle.js";
import { GeneticDriftGlobalBattle } from "./GeneticDriftGlobalBattle.js";

// Group theory family
import { C4Group } from "./C4Group.js";
import { Dihedral3Group } from "./Dihedral3Group.js";
import { Dihedral4Group } from "./Dihedral4Group.js";
import { Dihedral6Group } from "./Dihedral6Group.js";
import { ElementaryAbelian_2_2_2_Group } from "./ElementaryAbelian_2_2_2_Group.js";
import { QuaternionGroup } from "./QuaternionGroup.js";
import { QuaternionGroupPizza } from "./QuaternionGroupPizza.js";
import { QuaternionGroupSpiral } from "./QuaternionGroupSpiral.js";

// Imaginary group (complex / quaternion visualisations)
import { ImaginaryGroupBase } from "./ImaginaryGroupBase.js";
import { ImaginaryGroupQuadrants } from "./ImaginaryGroupQuadrants.js";
import { ImaginaryGroupSingle } from "./ImaginaryGroupSingle.js";

// ----------------------------------------------------
// Registry & Tags
// ----------------------------------------------------

export const RULES = {
  // Majority
  majority: () => new Majority(),
  "majority-diagonal": () => new MajorityDiagonal(),
  "majority-sticky-borders": () => new MajorityStickyBorders(),
  "majority-strong-consensus": () => new MajorityStrongConsensus(),

  // RPS
  rps: () => new RPS(),
  "rps-4": () => new RPS4(),
  "rps-5": () => new RPS5(),
  "rps-6": () => new RPS6(),
  "rps-diagonal": () => new RPSDiagonal(),

  // Genetic Drift
  "genetic-drift": () => new GeneticDrift(),
  "genetic-drift-local-battle": () => new GeneticDriftLocalBattle(),
  "genetic-drift-global-battle": () => new GeneticDriftGlobalBattle(),

  // Group Theory
  "c4-group": () => new C4Group(),
  "dihedral-3": () => new Dihedral3Group(),
  "dihedral-4": () => new Dihedral4Group(),
  "dihedral-6": () => new Dihedral6Group(),
  "elementary-abelian-2-2-2": () => new ElementaryAbelian_2_2_2_Group(),
  "quaternion-group": () => new QuaternionGroup(),
  "quaternion-group-pizza": () => new QuaternionGroupPizza(),
  "quaternion-group-spiral": () => new QuaternionGroupSpiral(),

  // Imaginary Groups
  "imaginary-group-base": () => new ImaginaryGroupBase(),
  "imaginary-group-quadrants": () => new ImaginaryGroupQuadrants(),
  "imaginary-group-single": () => new ImaginaryGroupSingle(),
};

// Optionally add metadata for UI filtering / categorisation
export const RULE_TAGS = {
  majority: ["local", "consensus"],
  "majority-diagonal": ["local", "filtered", "symmetry"],
  "majority-sticky-borders": ["local", "boundary", "stability"],
  "majority-strong-consensus": ["local", "consensus", "robust"],

  rps: ["cyclic", "competitive", "3-state"],
  "rps-4": ["cyclic", "competitive", "4-state"],
  "rps-5": ["cyclic", "competitive", "5-state"],
  "rps-6": ["cyclic", "competitive", "6-state"],
  "rps-diagonal": ["cyclic", "filtered"],

  "genetic-drift": ["global", "stochastic"],
  "genetic-drift-local-battle": ["local", "stochastic"],
  "genetic-drift-global-battle": ["global", "weighted"],

  "c4-group": ["group", "cyclic"],
  "dihedral-3": ["group", "symmetry"],
  "dihedral-4": ["group", "symmetry"],
  "dihedral-6": ["group", "symmetry"],
  "elementary-abelian-2-2-2": ["group", "algebraic", "xor"],
  "quaternion-group": ["group", "quaternion", "symmetry"],
  "quaternion-group-pizza": ["group", "pattern", "visualization"],
  "quaternion-group-spiral": ["group", "pattern", "visualization"],

  "imaginary-group-base": ["complex", "pattern", "base"],
  "imaginary-group-quadrants": ["complex", "pattern", "structured"],
  "imaginary-group-single": ["complex", "pattern", "minimal"],
};

// Convenience exports
export const RULE_KEYS = Object.keys(RULES);

export function getRuleById(id) {
  const factory = RULES[id];
  if (!factory) throw new Error(`[Rules] Unknown rule id: ${id}`);
  return factory();
}

export function listRulesByTag(tag) {
  return Object.entries(RULE_TAGS)
    .filter(([_, tags]) => tags.includes(tag))
    .map(([key]) => key);
}
