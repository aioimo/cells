import { Majority } from "./Majority.js";
import { mod } from "../utils.js";

const X_PATTERN = (row, col) => Math.abs(row) !== Math.abs(col);

export class MajorityDiagonal extends Majority {
  constructor() {
    super();

    this.ordering = ["orange", "black"];
    this.radius = 8;
    this.threshold = 0;
    this.gridSize = 89;
    this.filterSchema = X_PATTERN;
  }

  // optional: override neighbor count only if filterSchema logic differs
  countNeighbours(row0, col0, matrix) {
    const l = matrix.length;
    const results = {};

    for (let dr = -this.radius; dr <= this.radius; dr++) {
      for (let dc = -this.radius; dc <= this.radius; dc++) {
        if (dr === 0 && dc === 0) continue;
        if (this.filterSchema(dr, dc, this.radius)) continue; // use X_PATTERN
        const val = matrix[mod(row0 + dr, l)][mod(col0 + dc, l)];
        results[val] = (results[val] || 0) + 1;
      }
    }

    return results;
  }
}
