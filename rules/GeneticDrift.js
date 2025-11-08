import { Logic } from "../Logic.js";
class GeneticDrift extends Logic {
  DEFAULT_ORDERING = ["green", "black", "white", "orange", "blue"];
  GRID_SIZE = 100;

  constructor(props) {
    super(props);

    this.ordering = this.DEFAULT_ORDERING;

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

  nextValue(_row, _col, _state, count) {
    const asPercentage = (key) => {
      const total = Object.values(count).reduce((prev, curr) => prev + curr, 0);

      return (count[key] || 0) / total;
    };

    const weights = this.ordering.map(asPercentage);

    return randomWeighted(this.ordering, weights);
  }
}
