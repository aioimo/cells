import { Rule } from "../core/Rule.js";
import { randomMatrix, mod } from "../utils.js";

const GRID = () => false;

export class RPS extends Rule {
  constructor() {
    super();

    this.ordering = ["#7880b5", "#C0A9B0", "#BCC4DB"];
    this.radius = 4;
    this.threshold = 20;
    this.influenceAdvantage = 2;
    this.filterSchema = GRID;
    this.gridSize = 200;
  }

  nextValue(row, col, state) {
    return this.determine(this.most(this.neighbors(row, col, state)));
  }

  neighbors(row0, col0, state) {
    const l = state.length;
    const radius = this.radius;
    const results = {};
    const current = state[row0][col0];

    for (let dr = -radius; dr <= radius; dr++) {
      for (let dc = -radius; dc <= radius; dc++) {
        if (dr === 0 && dc === 0) continue;
        if (this.filterSchema(dr, dc, radius)) continue;

        const neighbor = state[mod(row0 + dr, l)][mod(col0 + dc, l)];
        const influence = this.influence(current, neighbor);
        results[neighbor] = (results[neighbor] || 0) + influence;
      }
    }
    return results;
  }

  influence(current, neighbor) {
    const i = this.ordering.indexOf(current);
    const j = this.ordering.indexOf(neighbor);
    const len = this.ordering.length;

    // neighbor beats current in cyclic order
    if ((i + 1) % len === j) return this.influenceAdvantage;
    return 1;
  }

  most(results) {
    let threshold = this.threshold;
    let winners = [];
    for (const [state, count] of Object.entries(results)) {
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
