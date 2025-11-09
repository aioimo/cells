// RPS.js
// --------------------------------------------------
// Classic rock-paper-scissors cyclic dominance.
// Each color dominates exactly one other color (its successor).
//
// ordering = [C0, C1, ..., C(n-1)]
// Predator of Ci is C(i+1 mod n).
//
// Behaviour:
//   - Only the immediate predator gets boosted influence.
//   - Others are neutral (weight 1).
//   - Works cleanly for 3 colours and any N>=3 where you want pure cyclic behaviour.

import { Rule } from "../core/Rule.js";
import { randomMatrix } from "../utils.js";

export class RPS extends Rule {
  constructor({
    ordering = ["#15237bff", "#b64668ff", "#219b1eff"],
    gridSize = 200,
    radius = 4,
    influenceAdvantage = 3.9,
    dominanceBias = 0.5,
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

  influence(current, neighbour) {
    const len = this.ordering.length;
    if (len === 0) return 1;

    const i = this.ordering.indexOf(current);
    const j = this.ordering.indexOf(neighbour);
    if (i === -1 || j === -1) return 1;

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

    return isUnique
      ? { winner, maxValue, isUnique: true }
      : { winner: null, maxValue, isUnique: false };
  }

  generateStartingState(size = this.gridSize, ordering = this.ordering) {
    return randomMatrix(size, size, ordering);
  }
}
