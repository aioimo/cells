import { Rule } from "../core/Rule.js";
import { mod, randomWeighted } from "../utils.js";

export class GeneticDriftGlobalBattle extends Rule {
  constructor() {
    super();
    this.ordering = ["black", "orange", "white", "blue"];
    this.gridSize = 500;
    this.radius = 2;
    this.filterSchema = () => false;

    this._globalCache = null; // { stateRef, counts }
  }

  nextValue(row, col, state) {
    const globalCounts = this.getGlobalCounts(state); // cached
    const localCounts = this.neighbors(row, col, state);

    const weighted = this.weightedValues(localCounts, globalCounts);
    const total = Object.values(weighted).reduce((sum, v) => sum + v, 0);

    if (total === 0) return null;

    const weights = this.ordering.map(
      (color) => (weighted[color] || 0) / total
    );

    return randomWeighted(this.ordering, weights);
  }

  // --- cache global counts once per step ---
  getGlobalCounts(state) {
    if (this._globalCache && this._globalCache.state === state) {
      return this._globalCache.counts;
    }
    const counts = this.countAll(state);
    this._globalCache = { state, counts };
    return counts;
  }

  countAll(state) {
    const counts = {};
    const rows = state.length;
    const cols = state[0].length;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const val = state[r][c];
        counts[val] = (counts[val] || 0) + 1;
      }
    }
    return counts;
  }

  neighbors(row0, col0, state) {
    const l = state.length;
    const radius = this.radius;
    const results = {};

    for (let dr = -radius; dr <= radius; dr++) {
      for (let dc = -radius; dc <= radius; dc++) {
        if (dr === 0 && dc === 0) continue;
        if (this.filterSchema(dr, dc, radius)) continue;

        const val = state[mod(row0 + dr, l)][mod(col0 + dc, l)];
        results[val] = (results[val] || 0) + 1;
      }
    }

    return results;
  }

  weightedValues(localCounts, globalCounts) {
    const totalGlobal = Object.values(globalCounts).reduce(
      (sum, v) => sum + v,
      0
    );
    if (totalGlobal === 0) return localCounts;

    const result = {};
    for (const [color, local] of Object.entries(localCounts)) {
      const global = globalCounts[color] || 0;
      const proportion = global / totalGlobal;
      result[color] = local * proportion;
    }
    return result;
  }
}
