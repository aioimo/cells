// A cell turns to a color of one of its neighbours, randomly
// with the most prominent neighbor weighted proportionally

import { Logic } from "../Logic.js";

class GeneticDriftGlobalBattle extends Logic {
  DEFAULT_ORDERING = ["black", "orange", "white", "blue"];
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

    const weightedNeighbours = this.weightedValues(neighbours, count);

    const total = Object.values(weightedNeighbours).reduce(
      (prev, curr) => prev + curr,
      0
    );

    const asPercentage = (key) => {
      return (weightedNeighbours[key] || 0) / total;
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

  weightedValues(input1, input2) {
    let totalSum = Object.values(input2).reduce((sum, value) => sum + value, 0);
    let weightedResult = {};

    if (totalSum === 0) {
      // If totalSum is 0, avoid division by zero by returning all keys with value 0
      Object.keys(input1).forEach((key) => {
        weightedResult[key] = 0;
      });
      return weightedResult;
    }

    Object.keys(input1).forEach((key) => {
      if (input2.hasOwnProperty(key)) {
        let proportion = input2[key] / totalSum;
        weightedResult[key] = input1[key] * proportion;
      }
    });

    return weightedResult;
  }

  determine(winners) {
    return winners.length === 1 ? winners[0] : null;
  }
}
