const GRID = () => false;
const X_PATTERN = (row, col) => Math.abs(row) !== Math.abs(col);
const HOURGLASS = (row, col) => Math.abs(row) < Math.abs(col);
const WEAVE = (row, col) => mod(row * col, 2) == 1;
const PERIMETER = (row, col, radius) =>
  Math.abs(row) < radius && Math.abs(col) < radius;

class RPS extends Logic {
  defaultOrdering = ['#7880b5', '#C0A9B0', '#BCC4DB'];
  defaultRadius = 2;
  defaultThreshold = 12;
  influenceAdvantage = 3;
  defaultFilterSchema = GRID;

  constructor(props) {
    super(props);

    this.radius = 2;
    this.threshold = 16;
    this.ordering = this.defaultOrdering;
    this.filterSchema = this.defaultFilterSchema;

    this.logGameParameters({ initialState: this.state });
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

    const currentCell = matrix[row_0][col_0];

    for (let row = -radius; row <= radius; row++) {
      for (let col = -radius; col <= radius; col++) {
        if (this.filterSchema(row, col, radius)) {
          continue;
        }

        const neighbor = matrix[mod(row_0 + row, l)][mod(col_0 + col, l)];
        const influence = this.influence(currentCell, neighbor);

        if (results[neighbor]) {
          results[neighbor] += influence;
        } else {
          results[neighbor] = influence;
        }
      }
    }

    return results;
  }

  influence(current, neighbor) {
    const ordering = this.ordering;
    const LENGTH = ordering.length;

    if (
      (ordering.indexOf(current) + 1) % LENGTH ===
      ordering.indexOf(neighbor)
    ) {
      return this.influenceAdvantage;
    }

    return 1;
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
    console.log('influenceAdvantage', this.influenceAdvantage);
    console.log('Neighbors: ', neighbours);
    console.log('Available Points: ', availablePoints);
    console.log('Threshold: ', this.threshold);
    console.log('%: ', (100 * this.threshold) / availablePoints);
    console.log('***********');
  }
}
