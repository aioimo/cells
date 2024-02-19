class MajorityDiaganol extends Majority {
  ORDERING = ['orange', 'black'];
  RADIUS = 8;
  THRESHOLD = 0;
  FILTER_SCHEMA = X_PATTERN;
  GRID_SIZE = 89;

  constructor(props) {
    super(props);

    this.radius = this.RADIUS;
    this.threshold = this.THRESHOLD;
    this.ordering = this.ORDERING;
    this.filterSchema = this.FILTER_SCHEMA;

    const initalState = randomMatrix(
      this.GRID_SIZE,
      this.GRID_SIZE,
      this.ordering
    );

    this.initialise(initalState);
  }

  getNextState(prevState) {
    const rows = prevState.length;
    const cols = prevState[0].length;

    const nextState = emptyMatrix(rows, cols);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const r = this.nextValue(row, col, prevState);
        if (!!r) {
          nextState[row][col] = r;
        } else {
          nextState[row][col] = prevState[row][col];
        }
      }
    }

    return nextState;
  }

  nextValue(row, col, state) {
    return this.determine(this.most(this.neighbors(row, col, state)));
  }

  neighbors(row_0, col_0, state) {
    const matrix = state;
    const l = matrix.length;
    const radius = this.radius;
    const results = {};

    for (let row = -radius; row <= radius; row++) {
      for (let col = -radius; col <= radius; col++) {
        if (this.filterSchema(row, col, radius)) {
          continue;
        }

        const neighbor = matrix[mod(row_0 + row, l)][mod(col_0 + col, l)];

        if (results[neighbor]) {
          results[neighbor]++;
        } else {
          results[neighbor] = 1;
        }
      }
    }

    return results;
  }
}
