// Majority.js
// ---------------------------------------------
// Local majority rule with configurable inertia.
//
// For each cell:
//   neighbours -> counts[c], N = total neighbours
//   current    = state[row][col]
//   bestColor  = argmax_c counts[c]
//   p_best     = bestCount / N
//   p_current  = currentCount / N
//   K_local    = #distinct neighbour colours
//   p_uniform  = 1 / K_local
//
// Flip to bestColor iff:
//   1) bestColor !== current
//   2) p_best >= p_uniform + supportMargin
//   3) p_best >= p_current + incumbentMargin
//
// Otherwise: stay as current (return null).

import { Rule } from "../core/Rule.js";
import { randomMatrix } from "../utils.js";
import { Matrix } from "../core/Matrix.js";

export class Majority extends Rule {
  constructor({
    ordering = ["#FFB100", "#1c0221"],
    gridSize = 500,
    radius = 1,
    supportBias = 0.0, // 0 => ≥ p_uniform, 1 => ≥ 1.0
    leadBias = 0.0, // 0 => ≥ p_current, 1 => ≥ 1.0
  } = {}) {
    super();
    this.ordering = ordering;
    this.gridSize = gridSize;
    this.radius = radius;
    this.supportBias = supportBias;
    this.leadBias = leadBias;
  }
  nextValue(row, col, state) {
    // state is now a Matrix instance
    const neighbours = this.getListOfNeighbourValues(row, col, state);
    const N = neighbours.length;
    if (N === 0) return null;

    // Count neighbour colours
    const counts = {};
    for (const v of neighbours) {
      counts[v] = (counts[v] || 0) + 1;
    }

    const current = state.get(row, col);
    const currentCount = counts[current] || 0;

    // Find bestColor (strict max over counts; ties favour staying put)
    let bestColor = current;
    let bestCount = currentCount;

    for (const [color, count] of Object.entries(counts)) {
      if (count > bestCount) {
        bestColor = color;
        bestCount = count;
      }
    }

    // No challenger strictly better than current
    if (bestColor === current) return null;

    const K_local = Object.keys(counts).length;
    if (K_local === 0) return null;

    const p_best = bestCount / N;
    const p_current = currentCount / N;
    const p_uniform = 1 / K_local;

    // Between p_uniform and 1.0
    const supportThreshold = p_uniform + this.supportBias * (1 - p_uniform);

    // Between p_current and 1.0
    const incumbentThreshold = p_current + this.leadBias * (1 - p_current);

    const supportOk = p_best >= supportThreshold;
    const incumbentOk = p_best >= incumbentThreshold;

    return supportOk && incumbentOk ? bestColor : null;
  }

  generateStartingState() {
    const arr = randomMatrix(this.gridSize, this.gridSize, this.ordering);
    return new Matrix(arr);
  }
}
