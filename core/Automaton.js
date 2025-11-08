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
    this.history = [state];
  }

  reset() {
    const initial = this.rule.generateStartingState(
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
    const rows = prevState.length;
    const cols = prevState[0].length;
    const next = emptyMatrix(rows, cols);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const newVal = this.rule.nextValue(r, c, prevState);
        next[r][c] = newVal != null ? newVal : prevState[r][c];
      }
    }

    return next;
  }

  // ----- Loop detection -----
  hasLoop(nextState) {
    const index = this.history.findIndex((prev) =>
      areMatricesEqual(prev, nextState)
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
    this.history.push(this.state);
    if (this.history.length > 200) this.history.shift();
  }

  // ----- Helpers -----
  getColor(value) {
    return this.rule.getColor(value);
  }

  getColorCount() {
    if (!this.state) return {};
    const rows = this.state.length;
    const cols = this.state[0].length;

    const results = this.rule.ordering
      .map(this.rule.getColor.bind(this.rule))
      .reduce((obj, color) => {
        obj[color] = 0;
        return obj;
      }, {});

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const color = this.rule.getColor(this.state[r][c]);
        results[color] = (results[color] || 0) + 1;
      }
    }

    return results;
  }
}
