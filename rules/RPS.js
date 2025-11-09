// RPS.js
// ---------------------------------------------
// Cyclic dominance with weighted influence + unique winner + threshold.
//
// ordering = [C0, C1, ..., C(n-1)]
// Predator of Ci is C(i+1 mod n).
//
// For each cell (row, col):
//   current = state[row][col]
//   neighbours via getListOfNeighbourValues
//
//   For each neighbour color n:
//     if n is predator(current): add influenceAdvantage
//     else:                      add 1
//
//   influenceCounts[color] = total weighted influence from neighbours
//
//   winner = unique color with max influence
//
//   If winner exists AND influenceCounts[winner] > threshold:
//       return winner
//   Else:
//       return null  (keep current)

import { Rule } from "../core/Rule.js";
import { randomMatrix } from "../utils.js";

export class RPS extends Rule {
  constructor({
    ordering = ["black", "white", "yellow"],
    gridSize = 200,
    radius = 3,
    threshold = 0,
    influenceAdvantage = 1.8,
  } = {}) {
    super();
    this.ordering = ordering;
    this.gridSize = gridSize;
    this.radius = radius;
    this.threshold = threshold;
    this.influenceAdvantage = influenceAdvantage;
  }

  nextValue(row, col, state) {
    const current = state[row][col];

    const neighbours = this.getListOfNeighbourValues(row, col, state);
    if (!neighbours.length) return null;

    // Weighted influence per colour
    const influenceCounts = {};
    for (const n of neighbours) {
      const w = this.influence(current, n);
      influenceCounts[n] = (influenceCounts[n] || 0) + w;
    }

    const { winner, maxValue, isUnique } =
      this.findUniqueWinner(influenceCounts);

    if (!winner || !isUnique) return null;
    if (maxValue <= this.threshold) return null;

    return winner;
  }

  // Cyclic: predator is successor in ordering
  influence(current, neighbour) {
    const len = this.ordering.length;
    const i = this.ordering.indexOf(current);
    const j = this.ordering.indexOf(neighbour);
    if (i === -1 || j === -1 || len === 0) return 1;

    const predatorOfCurrent = this.ordering[(i + 1) % len];

    return neighbour === predatorOfCurrent ? this.influenceAdvantage : 1;
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

    if (!isUnique) return { winner: null, maxValue, isUnique: false };
    return { winner, maxValue, isUnique: true };
  }

  generateStartingState(size = this.gridSize, ordering = this.ordering) {
    return randomMatrix(size, size, ordering);
  }

  // Neighbourhood shape:
  // By default: full square radius via Rule.getListOfNeighbourValues.
  // Variants (diagonal, cross, etc.) override shouldIncludeOffset(dr, dc).
}
