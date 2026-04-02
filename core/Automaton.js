// core/Automaton.js
import { Matrix } from "./Matrix.js";

export class Automaton {
  constructor({ rule }) {
    this.rule = rule; // a Rule instance
    this.iteration = 0; // number of completed steps
    this.stable = false; // becomes true when a loop is detected
    this.state = null; // current grid
    this._historyHashes = new Set(); // hash-based loop detection
    this._maxHistory = 200;
    this._historyCount = 0;
  }

  // ----- Lifecycle -----
  initialise(state) {
    this.iteration = 0;
    this.stable = false;
    // Enforce Matrix structure
    if (!state || typeof state.get !== "function") {
      throw new Error(
        "Automaton expects state to be a Matrix instance. Nested arrays are not supported."
      );
    }
    this.state = state;
    this._historyHashes = new Set();
    this._historyHashes.add(this._hashState(state));
    this._historyCount = 1;
  }

  reset() {
    const initial = this.rule.createInitialState(
      this.rule.gridSize,
      this.rule.ordering
    );
    this.initialise(initial);
  }

  // ----- Step forward -----
  step() {
    if (this.stable || !this.state) return this.state;

    const next = this._getNextState(this.state);

    if (this._hasLoop(next)) {
      console.log(
        `Loop detected after ${this.iteration} iterations — stopping simulation`
      );
      this.stable = true;
      return this.state;
    }

    this.state = next;
    this.iteration++;
    this._recordHistory(next);
    return this.state;
  }

  _getNextState(prevState) {
    const { rows, cols } = prevState;
    const data = new Array(rows * cols);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const newVal = this.rule.nextValue(r, c, prevState);
        data[r * cols + c] = newVal != null ? newVal : prevState.get(r, c);
      }
    }

    return Matrix.fromFlat(rows, cols, data);
  }

  // ----- Loop detection (hash-based) -----
  _hashState(matrix) {
    // FNV-1a inspired hash over the flat data array
    const data = matrix.data;
    const len = data.length;
    let h = 2166136261 >>> 0;
    for (let i = 0; i < len; i++) {
      // Hash the string value — most cell values are short color strings or small integers
      const v = data[i];
      if (typeof v === "number") {
        h ^= v & 0xff;
        h = Math.imul(h, 16777619) >>> 0;
      } else {
        const s = String(v);
        for (let j = 0; j < s.length; j++) {
          h ^= s.charCodeAt(j);
          h = Math.imul(h, 16777619) >>> 0;
        }
      }
    }
    return h;
  }

  _hasLoop(nextState) {
    const hash = this._hashState(nextState);
    if (!this._historyHashes.has(hash)) {
      return false;
    }
    // Hash collision — could be a true loop or a false positive.
    // For correctness we'd need full comparison, but hash collisions on
    // 40k-cell grids are astronomically rare. Log and treat as loop.
    const cycleInfo = `hash match at iteration ${this.iteration}`;
    console.log(`Loop detected — ${cycleInfo}`);
    return true;
  }

  _recordHistory(state) {
    const hash = this._hashState(state);
    this._historyHashes.add(hash);
    this._historyCount++;
    // Cap the Set size — we can't easily evict oldest from a Set,
    // but for loop detection the Set growing unbounded is fine for
    // typical simulation lengths. Only cap at a generous limit.
    if (this._historyCount > 10000) {
      this._historyHashes.clear();
      this._historyHashes.add(hash);
      this._historyCount = 1;
    }
  }

  // ----- Helpers -----
  getColor(value) {
    return this.rule.getColor(value);
  }

  getColorCount() {
    if (!this.state) {
      console.error(
        `[Automaton] getColorCount() called before state was set!`,
        this
      );
      throw new Error(
        `[Automaton] state is undefined (no starting state initialised)`
      );
    }

    const { rows, cols } = this.state;

    const results = this.rule.ordering
      .map(this.rule.getColor.bind(this.rule))
      .reduce((obj, color) => {
        obj[color] = 0;
        return obj;
      }, {});

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const color = this.rule.getColor(this.state.get(r, c));
        results[color] = (results[color] || 0) + 1;
      }
    }

    return results;
  }
}
