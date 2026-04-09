import { Rule } from "../core/Rule.js";
import { Matrix } from "../core/Matrix.js";
import { emptyMatrix, randomMatrixWeighted } from "../utils.js";

export class ImaginaryGroupBase extends Rule {
  static COLOR_GROUPINGS = [
    {
      name: "Conjugate Pairs",
      groups: [
        { elements: ["1", "-1"], color: "#0D1B2A" },
        { elements: ["i", "-i"], color: "#E0FBFC" },
      ],
    },
    {
      name: "Sign",
      groups: [
        { elements: ["1", "i"], color: "#F7FFF7" },
        { elements: ["-1", "-i"], color: "#1A535C" },
      ],
    },
  ];

  static INIT_PRESETS = {
    quadrants: {
      label: "Quadrants",
      generate(rule) {
        const size = rule.gridSize;
        const m = emptyMatrix(size, size);
        const half = Math.floor(size / 2);

        for (let row = 0; row < size; row++) {
          for (let col = 0; col < size; col++) {
            if (row < half && col < half) m[row][col] = "i";
            else if (row < half && col >= half) m[row][col] = "1";
            else if (row >= half && col < half) m[row][col] = "-i";
            else m[row][col] = "-1";
          }
        }

        return new Matrix(m);
      },
    },
    single: {
      label: "Single Source",
      generate(rule) {
        const size = rule.gridSize;
        const ordering = ["-1", "i", "-i", "1"];
        const m = randomMatrixWeighted(size, size, ordering, [1, 0, 0, 0]);
        m[Math.floor(size / 2)][Math.floor(size / 2)] = "i";
        return new Matrix(m);
      },
    },
    "split-quadrants": {
      label: "Split Quadrants",
      generate(rule) {
        const size = rule.gridSize;
        const m = emptyMatrix(size, size);
        const half = Math.floor(size / 2);

        for (let row = 0; row < size; row++) {
          for (let col = 0; col < size; col++) {
            if (row < half && col < half) m[row][col] = "-i";
            else if (row < half && col >= half) m[row][col] = "1";
            else if (row >= half && col < half) m[row][col] = "-1";
            else m[row][col] = "i";
          }
        }

        return m;
      },
    },
  };

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
    this.initPreset = this.initPreset ?? null;
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
    // Default: quadrants layout
    return ImaginaryGroupBase.INIT_PRESETS.quadrants.generate(this);
  }
}
