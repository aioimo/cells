import { Rule } from "../core/Rule.js";
import { Matrix } from "../core/Matrix.js";
import { emptyMatrix } from "../utils.js";

export class ImaginaryGroupBase extends Rule {
  getColor(val) {
    switch (val) {
      case "1":
        return "black";
      case "-1":
        return "white";
      case "i":
        return "red";
      case "-i":
        return "lightblue";
    }
  }

  ORDERING = ["-1", "i", "-i", "1"];
  RADIUS = 1;
  THRESHOLD = 0;
  FILTER_SCHEMA = (row, col) => row === 0 && col === 0;
  GRID_SIZE = 100;

  constructor(props) {
    super(props);

    this.radius = this.radius ?? this.RADIUS;
    this.threshold = this.threshold ?? this.THRESHOLD;
    this.ordering = this.ordering ?? this.ORDERING;
    this.filterSchema = this.filterSchema ?? this.FILTER_SCHEMA;
    this.gridSize = this.gridSize ?? this.GRID_SIZE;
  }

  nextValue(row, col, state) {
    const neighbors = this.getListOfNeighbourValues(row, col, state);

    const complexProduct = neighbors.reduce(
      (prev, curr) => this.complexProduct(prev, curr),
      "1"
    );

    return complexProduct;
  }

  repeatKeysByValues(input) {
    const output = [];
    for (const key in input) {
      const value = input[key];
      for (let i = 0; i < value; i++) {
        output.push(key);
      }
    }
    return output;
  }

  complexProduct(a, b) {
    const productMap = {
      1: {
        1: "1",
        "-1": "-1",
        i: "i",
        "-i": "-i",
        j: "j",
        "-j": "-j",
        k: "k",
        "-k": "-k",
      },
      "-1": {
        1: "-1",
        "-1": "1",
        i: "-i",
        "-i": "i",
        j: "-j",
        "-j": "j",
        k: "-k",
        "-k": "k",
      },
      i: {
        1: "i",
        "-1": "-i",
        i: "-1",
        "-i": "1",
        j: "k",
        "-j": "-k",
        k: "-j",
        "-k": "j",
      },
      "-i": {
        1: "-i",
        "-1": "i",
        i: "1",
        "-i": "-1",
        j: "-k",
        "-j": "k",
        k: "j",
        "-k": "-j",
      },
      j: {
        1: "j",
        "-1": "-j",
        i: "-k",
        "-i": "k",
        j: "-1",
        "-j": "1",
        k: "i",
        "-k": "-i",
      },
      "-j": {
        1: "-j",
        "-1": "j",
        i: "k",
        "-i": "-k",
        j: "1",
        "-j": "-1",
        k: "-i",
        "-k": "i",
      },
      k: {
        1: "k",
        "-1": "-k",
        i: "j",
        "-i": "-j",
        j: "-i",
        "-j": "i",
        k: "-1",
        "-k": "1",
      },
      "-k": {
        1: "-k",
        "-1": "k",
        i: "-j",
        "-i": "j",
        j: "i",
        "-j": "-i",
        k: "1",
        "-k": "-1",
      },
    };

    return productMap[a][b];
  }

  generateStartingState() {
    const m = emptyMatrix(this.GRID_SIZE, this.GRID_SIZE);
    for (let row = 0; row < m.length; row++) {
      for (let col = 0; col < m.length; col++) {
        if (
          row < Math.floor(this.GRID_SIZE / 2) &&
          col < Math.floor(this.GRID_SIZE / 2)
        ) {
          m[row][col] = "i";
          continue;
        }
        if (
          row < Math.floor(this.GRID_SIZE / 2) &&
          col >= Math.floor(this.GRID_SIZE / 2)
        ) {
          m[row][col] = "1";
          continue;
        }

        if (
          row >= Math.floor(this.GRID_SIZE / 2) &&
          col < Math.floor(this.GRID_SIZE / 2)
        ) {
          m[row][col] = "-i";
          continue;
        }

        if (
          row >= Math.floor(this.GRID_SIZE / 2) &&
          col >= Math.floor(this.GRID_SIZE / 2)
        ) {
          m[row][col] = "-1";
          continue;
        }
      }
    }

    return new Matrix(m);
  }
}
