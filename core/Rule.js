import { randomMatrix } from "../utils.js";

// core/Rule.js
export class Rule {
  constructor(config = {}) {
    Object.assign(this, config);
  }

  // --- to be overridden ---
  nextValue(row, col, state) {
    throw new Error("nextValue() must be implemented by subclass");
  }

  // --- optional overrides ---
  getColor(val) {
    return val;
  }

  generateStartingState(gridSize, ordering) {
    return randomMatrix(gridSize, gridSize, ordering);
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
