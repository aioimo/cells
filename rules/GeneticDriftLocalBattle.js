// GeneticDriftLocalBattle.js
// A cell turns into a neighbour's color, chosen randomly
// with probability proportional to local neighbour counts.

import { Rule } from "../core/Rule.js";
import { mod, randomWeighted } from "../utils.js";

export class GeneticDriftLocalBattle extends Rule {
  constructor() {
    super();
    this.ordering = ["black", "orange", "white", "blue"];
    this.gridSize = 50;
    this.radius = 2;
    this.filterSchema = () => false;
  }

  // Called once per cell by Automaton
  nextValue(row, col, state) {
    const localCounts = this.neighbors(row, col, state);

    const total = Object.values(localCounts).reduce((sum, v) => sum + v, 0);
    if (total === 0) {
      return null; // no change; fallback to current cell
    }

    const weights = this.ordering.map(
      (color) => (localCounts[color] || 0) / total
    );

    return randomWeighted(this.ordering, weights);
  }

  // Count neighbours by color in radius
  neighbors(row0, col0, state) {
    const size = state.length;
    const r = this.radius;
    const results = {};

    for (let dr = -r; dr <= r; dr++) {
      for (let dc = -r; dc <= r; dc++) {
        if (dr === 0 && dc === 0) continue;
        if (this.filterSchema(dr, dc, r)) continue;

        const rr = mod(row0 + dr, size);
        const cc = mod(col0 + dc, size);
        const val = state[rr][cc];

        results[val] = (results[val] || 0) + 1;
      }
    }

    return results;
  }
}
