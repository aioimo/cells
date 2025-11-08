import { areMatricesEqual, emptyMatrix, randomMatrix } from "./utils.js";

export class Logic {
  constructor(rule) {
    this.rule = rule;
  }

  getColor(val) {
    return val;
  }

  initialise(state) {
    this.iteration = 0;
    this.stable = false;
    this.state = state;
    this.history = [this.state];
  }

  getNextState(state) {
    return state;
  }

  onNextState() {
    const nextState = this.rule.getNextState
      ? this.rule.getNextState(this.state)
      : this.getNextState(this.state);

    if (this.isStateFoundInHistory(nextState)) {
      this.stable = true;
      return this.state;
    }

    this.iteration++;
    this.state = nextState;
    this.updateHistory();
    return this.state;
  }

  isStateFoundInHistory(nextState) {
    return this.history.some((prevState) =>
      areMatricesEqual(prevState, nextState)
    );
  }

  updateHistory() {
    this.history.push(this.state);
    this.history = this.history.slice(-this.HISTORY_MAXIMUM);
  }

  countAll() {
    const rows = this.state.length;
    const cols = this.state[0].length;

    const results = this.ordering.reduce((obj, item) => {
      obj[item] = 0;
      return obj;
    }, {});

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const value = this.state[row][col];
        if (results[value]) {
          results[value]++;
        } else {
          results[value] = 1;
        }
      }
    }
    return results;
  }

  getNextState(prevState) {
    const rows = prevState.length;
    const cols = prevState[0].length;

    const nextState = emptyMatrix(rows, cols);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const r = this.rule.nextValue(row, col, prevState);

        if (r != null) {
          nextState[row][col] = r;
        } else {
          nextState[row][col] = prevState[row][col];
        }
      }
    }

    return nextState;
  }

  logCurrentState() {
    console.log(this.state);
  }

  generateStartingState() {
    if (this.rule && this.rule.generateStartingState) {
      // Use the rule’s method if available
      return this.rule.generateStartingState(
        this.rule.gridSize,
        this.rule.ordering
      );
    }

    // Fallback: old behavior
    return randomMatrix(this.GRID_SIZE, this.GRID_SIZE, this.ordering);
  }

  getColorCount() {
    const rows = this.state.length;
    const cols = this.state[0].length;

    const ordering = this.rule?.ordering || [];
    const getColor = this.rule?.getColor?.bind(this.rule) || ((v) => v);

    const results = ordering.map(getColor).reduce((obj, item) => {
      obj[item] = 0;
      return obj;
    }, {});

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const value = this.getColor(this.state[row][col]);
        if (results[value]) {
          results[value]++;
        } else {
          results[value] = 1;
        }
      }
    }
    return results;
  }

  getListOfNeighbourValues(row, col, matrix) {
    const numRows = matrix.length;
    const numCols = matrix[0].length;
    const r = this.radius;
    const neighbours = [];

    for (let dr = -r; dr <= r; dr++) {
      for (let dc = -r; dc <= r; dc++) {
        // Skip the center cell itself
        if (dr === 0 && dc === 0) continue;

        // Wrap around (toroidal boundary)
        const neighbourRow = (row + dr + numRows) % numRows;
        const neighbourCol = (col + dc + numCols) % numCols;

        neighbours.push(matrix[neighbourRow][neighbourCol]);
      }
    }

    return neighbours;
  }
}
