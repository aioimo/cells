// core/Automaton.js
import { areMatricesEqual, emptyMatrix } from "../utils.js";

export class Automaton {
  constructor({ rule }) {
    this.rule = rule; // a Rule instance
    this.iteration = 0; // number of completed steps
    this.stable = false; // becomes true when a loop is detected
    this.history = []; // list of previous states
    this.state = null; // current grid
  }

  // ----- Lifecycle -----
  initialise(state) {
    this.iteration = 0;
    this.stable = false;
    this.state = state;
    this.history = [this._cloneState(state)];
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

    const next = this.getNextState(this.state);

    if (this.hasLoop(next)) {
      console.log(
        `Loop detected after ${this.iteration} iterations — stopping simulation`
      );
      this.stable = true;
      return this.state;
    }

    this.state = next;
    this.iteration++;
    this.recordHistory();
    return this.state;
  }

  getNextState(prevState) {
    // Support Matrix instance
    const rows = prevState.rows || prevState.length;
    const cols = prevState.cols || prevState[0].length;
    const isMatrix = typeof prevState.get === "function";
    let next;
    if (isMatrix) {
      next = new prevState.constructor(Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => {
          const newVal = this.rule.nextValue(r, c, prevState);
          return newVal != null ? newVal : prevState.get(r, c);
        })
      ));
    } else {
      next = emptyMatrix(rows, cols);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const newVal = this.rule.nextValue(r, c, prevState);
          next[r][c] = newVal != null ? newVal : prevState[r][c];
        }
      }
    }
    return next;
  }

  // ----- Loop detection -----
  hasLoop(nextState) {
    const index = this.history.findIndex((prev) =>
      areMatricesEqual(
        prev.data ? prev.data : prev,
        nextState.data ? nextState.data : nextState
      )
    );
    if (index !== -1) {
      const cycleLength = this.history.length - index;
      console.log(
        `Loop detected — repeated pattern after ${cycleLength} steps (iteration ${this.iteration})`
      );
      return true;
    }
    return false;
  }

  recordHistory() {
    this.history.push(this._cloneState(this.state));
    if (this.history.length > 200) this.history.shift();
  }
  _cloneState(state) {
    // For Matrix, clone the data
    if (state && typeof state.get === "function") {
      return new state.constructor(
        Array.from({ length: state.rows }, (_, r) =>
          Array.from({ length: state.cols }, (_, c) => state.get(r, c))
        )
      );
    }
    // For arrays, shallow copy
    return JSON.parse(JSON.stringify(state));
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

    const isMatrix = typeof this.state.get === "function";
    const rows = isMatrix ? this.state.rows : this.state.length;
    const cols = isMatrix ? this.state.cols : this.state[0].length;

    const results = this.rule.ordering
      .map(this.rule.getColor.bind(this.rule))
      .reduce((obj, color) => {
        obj[color] = 0;
        return obj;
      }, {});

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const color = this.rule.getColor(
          isMatrix ? this.state.get(r, c) : this.state[r][c]
        );
        results[color] = (results[color] || 0) + 1;
      }
    }

    return results;
  }
}
