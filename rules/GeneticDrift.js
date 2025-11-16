// GeneticDrift.js
// Pure global drift:
// Each cell chooses a new color based on global frequencies (well-mixed).

import { Rule } from "../core/Rule.js";
import { Matrix } from "../core/Matrix.js";
import { randomWeighted } from "../utils.js";

export class GeneticDrift extends Rule {
  constructor() {
    super();
    this.ordering = ["green", "black", "white", "orange", "blue"];
    this.gridSize = 100;

    this._globalCache = null; // { state, counts }
  }

  // Called once per cell by Automaton
  nextValue(_row, _col, state) {
    const counts = this.getGlobalCounts(state);
    const total = Object.values(counts).reduce((sum, v) => sum + v, 0);
    if (total === 0) return null;

    const weights = this.ordering.map((color) => (counts[color] || 0) / total);

    return randomWeighted(this.ordering, weights);
  }

  // --- cache global counts once per generation ---
  getGlobalCounts(state) {
    if (this._globalCache && this._globalCache.state === state) {
      return this._globalCache.counts;
    }

    const counts = {};
    const rows = state.rows;
    const cols = state.cols;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const val = state.get(r, c);
        counts[val] = (counts[val] || 0) + 1;
      }
    }

    this._globalCache = { state, counts };
    return counts;
  }

  generateStartingState() {
    const matrix = super.generateStartingState(this.gridSize, this.ordering);
    return new Matrix(matrix);
  }
}
