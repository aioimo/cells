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

  createInitialState() {
    this.ensureConfigured();
    return this.generateStartingState(this.gridSize, this.ordering);
  }

  // 🔧 Overridable hook; subclasses may already override this.
  // Base version: random fill.
  generateStartingState(size = this.gridSize, ordering = this.ordering) {
    return randomMatrix(size, size, ordering);
  }

  ensureConfigured() {
    if (typeof this.gridSize !== "number" || this.gridSize <= 0) {
      throw new Error(`[Rule] ${this.constructor.name} missing valid gridSize`);
    }
    if (!Array.isArray(this.ordering) || this.ordering.length === 0) {
      throw new Error(`[Rule] ${this.constructor.name} missing valid ordering`);
    }
  }

  shouldIncludeOffset(_dr, _dc) {
    return true; // can be overridden to shape neighborhood
  }

  // --- shared helper ---
  getListOfNeighbourValues(row, col, matrix) {
    // Support both nested arrays and Matrix instances
    const isMatrix = typeof matrix.get === "function";
    const numRows = isMatrix ? matrix.rows : matrix.length;
    const numCols = isMatrix ? matrix.cols : matrix[0].length;
    const r = this.radius;
    const neighbours = [];

    for (let dr = -r; dr <= r; dr++) {
      for (let dc = -r; dc <= r; dc++) {
        if (dr === 0 && dc === 0) continue;
        if (!this.shouldIncludeOffset(dr, dc)) continue;
        const rr = (row + dr + numRows) % numRows;
        const cc = (col + dc + numCols) % numCols;
        neighbours.push(isMatrix ? matrix.get(rr, cc) : matrix[rr][cc]);
      }
    }
    return neighbours;
  }
}
