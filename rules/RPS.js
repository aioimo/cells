// RPS.js
// ---------------------------------------------
// Cyclic dominance with weighted influence and K-aware dominance threshold.
//
// ordering = [C0, C1, ..., C(n-1)]
// Predator of Ci is C(i+1 mod n).
//
// For each cell:
//   current = state[row][col]
//   neighbours via getListOfNeighbourValues()
//
//   For each neighbour colour n:
//     if n === predator(current): +influenceAdvantage
//     else:                       +1
//
//   influenceCounts[color] = total weighted influence
//   winner = unique colour with max influence
//
//   Let:
//     total      = sum(influenceCounts[*])
//     share      = influenceCounts[winner] / total
//     K_local    = #distinct colours in influenceCounts
//     p_uniform  = 1 / K_local
//
//   dominanceBias in [0,1]:
//     minShare = p_uniform + dominanceBias * (1 - p_uniform)
//       - 0   => minShare = p_uniform      (just beat "random among locals")
//       - 1   => minShare = 1.0            (near-total dominance)
//
//   Flip iff:
//     - winner exists
//     - winner is unique
//     - share >= minShare
//
// Otherwise: return null (keep current).

import { Rule } from "../core/Rule.js";
import { randomMatrix } from "../utils.js";

export class RPS extends Rule {
  constructor({
    ordering = ["#15237bff", "#b64668ff", "#219b1eff"],
    gridSize = 200,
    radius = 4,
    influenceAdvantage = 3.9,
    dominanceBias = 0.5, // K-aware dominance requirement
  } = {}) {
    super();
    this.ordering = ordering;
    this.gridSize = gridSize;
    this.radius = radius;
    this.influenceAdvantage = influenceAdvantage;
    this.dominanceBias = dominanceBias;
  }

  nextValue(row, col, state) {
    const current = state[row][col];
    const neighbours = this.getListOfNeighbourValues(row, col, state);
    if (!neighbours.length) return null;

    // Weighted influence by colour
    const influenceCounts = {};
    let total = 0;

    for (const n of neighbours) {
      const w = this.influence(current, n);
      influenceCounts[n] = (influenceCounts[n] || 0) + w;
      total += w;
    }

    if (total <= 0) return null;

    const { winner, maxValue, isUnique } =
      this.findUniqueWinner(influenceCounts);

    if (!winner || !isUnique) return null;

    const K_local = Object.keys(influenceCounts).length;
    if (K_local === 0) return null;

    const share = maxValue / total;
    const p_uniform = 1 / K_local;
    const minShare = p_uniform + this.dominanceBias * (1 - p_uniform);

    if (share < minShare) return null;

    return winner;
  }

  // Predator = successor of current in the cycle
  influence(current, neighbour) {
    const len = this.ordering.length;
    const i = this.ordering.indexOf(current);
    const j = this.ordering.indexOf(neighbour);
    if (i === -1 || j === -1 || len === 0) return 1;

    const predator = this.ordering[(i + 1) % len];
    return neighbour === predator ? this.influenceAdvantage : 1;
  }

  findUniqueWinner(counts) {
    let winner = null;
    let maxValue = -Infinity;
    let isUnique = true;

    for (const [color, value] of Object.entries(counts)) {
      if (value > maxValue) {
        winner = color;
        maxValue = value;
        isUnique = true;
      } else if (value === maxValue) {
        isUnique = false;
      }
    }

    if (!isUnique) {
      return { winner: null, maxValue, isUnique: false };
    }
    return { winner, maxValue, isUnique: true };
  }

  generateStartingState(size = this.gridSize, ordering = this.ordering) {
    return randomMatrix(size, size, ordering);
  }
}
