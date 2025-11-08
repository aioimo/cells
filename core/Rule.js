import { randomMatrix } from "../utils.js";

// core/Rule.js
export class Rule {
  constructor(config = {}) {
    Object.assign(this, config);
  }

  // --- optional overrides ---
  getColor(val) {
    return val;
  }

  // --- abstract methods (must be implemented) ---
  nextValue(_row, _col, _state) {
    throw new Error("nextValue() must be implemented by subclass");
  }

  generateStartingState() {
    if (typeof this.gridSize !== "number" || this.gridSize <= 0) {
      throw new Error(`[Rule] ${this.constructor.name} missing valid gridSize`);
    }
    if (!Array.isArray(this.ordering) || !this.ordering.length) {
      throw new Error(`[Rule] ${this.constructor.name} missing valid ordering`);
    }
    return randomMatrix(this.gridSize, this.gridSize, this.ordering);
  }

  shouldIncludeOffset(_dr, _dc) {
    return true; // can be overridden to shape neighborhood
  }

  // --- shared helper ---
  getListOfNeighbourValues(row, col, matrix) {
    const numRows = matrix.length;
    const numCols = matrix[0].length;
    const r = this.radius;
    const neighbours = [];

    for (let dr = -r; dr <= r; dr++) {
      for (let dc = -r; dc <= r; dc++) {
        if (dr === 0 && dc === 0) continue;
        if (!this.shouldIncludeOffset(dr, dc)) continue;
        const rr = (row + dr + numRows) % numRows;
        const cc = (col + dc + numCols) % numCols;
        neighbours.push(matrix[rr][cc]);
      }
    }
    return neighbours;
  }
}
