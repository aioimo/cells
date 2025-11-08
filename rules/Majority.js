import { Rule } from "../core/Rule.js";
import { randomMatrix, mod } from "../utils.js";

export class Majority extends Rule {
  constructor() {
    super();
    this.ordering = ["orange", "black", "white", "green"];
    this.radius = 3;
    this.threshold = 16;
    this.gridSize = 100;
  }

  nextValue(row, col, matrix) {
    const counts = this.countNeighbours(row, col, matrix);
    const winners = this.most(counts);
    return this.determine(winners);
  }

  countNeighbours(row0, col0, matrix) {
    const l = matrix.length;
    const results = {};
    for (let dr = -this.radius; dr <= this.radius; dr++) {
      for (let dc = -this.radius; dc <= this.radius; dc++) {
        if (dr === 0 && dc === 0) continue;
        const val = matrix[mod(row0 + dr, l)][mod(col0 + dc, l)];
        results[val] = (results[val] || 0) + 1;
      }
    }
    return results;
  }

  most(counts) {
    let threshold = this.threshold;
    let winners = [];
    for (const [state, count] of Object.entries(counts)) {
      if (count > threshold) {
        threshold = count;
        winners = [state];
      } else if (count === threshold) {
        winners.push(state);
      }
    }
    return winners;
  }

  determine(winners) {
    return winners.length === 1 ? winners[0] : null;
  }

  generateStartingState(size = this.gridSize, ordering = this.ordering) {
    return randomMatrix(size, size, ordering);
  }
}
