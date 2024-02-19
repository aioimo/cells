class Majority extends Logic {
  ORDERING = ['orange', 'black', 'white', 'green'];
  RADIUS = 3;
  THRESHOLD = 16;
  FILTER_SCHEMA = GRID;
  GRID_SIZE = 100;

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

  most(results) {
    const entries = Object.entries(results);
    let threshold = this.threshold;
    let winners = [];

    entries.forEach(([state, count]) => {
      if (count > threshold) {
        threshold = count;
        winners = [state];
      } else if (count === threshold) {
        winners.push(state);
      }
    });

    return winners;
  }

  determine(winners) {
    return winners.length === 1 ? winners[0] : null;
  }

  logGameParameters() {
    console.log('Radius: ', this.radius);
    console.log('Neighbors: ', neighbours);
    console.log('Available Points: ', availablePoints);
    console.log('Threshold: ', this.threshold);
    console.log('%: ', (100 * this.threshold) / availablePoints);
    console.log('***********');
  }
}
