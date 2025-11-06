// A cell turns to a color of one of its neighbours, randomly
// with the most prominent neighbor weighted proportionally

class GeneticDriftLocalBattle extends Logic {
  DEFAULT_ORDERING = ['black', 'orange', 'white', 'blue'];
  GRID_SIZE = 25;
  RADIUS = 2;
  FILTER_SCHEMA = () => false;

  constructor(props) {
    super(props);

    this.radius = this.RADIUS;
    this.ordering = this.DEFAULT_ORDERING;
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
    const count = this.countAll();

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const val = this.nextValue(row, col, prevState, count);
        if (!!val) {
          nextState[row][col] = val;
        } else {
          nextState[row][col] = prevState[row][col];
        }
      }
    }

    return nextState;
  }

  nextValue(row, col, state, count) {
    const neighbours = this.neighbors(row, col, state);

    const total = Object.values(neighbours).reduce(
      (prev, curr) => prev + curr,
      0
    );

    const asPercentage = (key) => {
      return (neighbours[key] || 0) / total;
    };

    const weights = this.ordering.map(asPercentage);

    return randomWeighted(this.ordering, weights);
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
}
