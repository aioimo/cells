import { ImaginaryGroupBase } from "./ImaginaryGroupBase.js";
import { Matrix } from "../core/Matrix.js";
import { emptyMatrix } from "../utils.js";

export class QuaternionGroup extends ImaginaryGroupBase {
  static COLOR_GROUPINGS = [
    {
      name: "Conjugate Pairs",
      groups: [
        { elements: ["1", "-1"], color: "#1A1A2E" },
        { elements: ["i", "-i"], color: "#E94560" },
        { elements: ["j", "-j"], color: "#0F3460" },
        { elements: ["k", "-k"], color: "#F5E6CA" },
      ],
    },
    {
      name: "Real vs Imaginary",
      groups: [
        { elements: ["1", "-1"], color: "#FFFACD" },
        { elements: ["i", "-i", "j", "-j", "k", "-k"], color: "#2C003E" },
      ],
    },
    {
      name: "Sign",
      groups: [
        { elements: ["1", "i", "j", "k"], color: "#0B0C10" },
        { elements: ["-1", "-i", "-j", "-k"], color: "#C5C6C7" },
      ],
    },
    {
      name: "Conjugacy Classes",
      groups: [
        { elements: ["1"], color: "#FFFFFF" },
        { elements: ["-1"], color: "#0B0C10" },
        { elements: ["i", "-i"], color: "#EE4266" },
        { elements: ["j", "-j"], color: "#FFD23F" },
        { elements: ["k", "-k"], color: "#3BCEAC" },
      ],
    },
  ];

  static INIT_PRESETS = {
    quadrants: {
      label: "Quadrants",
      generate(rule) {
        const size = rule.gridSize;
        const m = emptyMatrix(size, size);
        const QUARTER = Math.floor(size / 4);
        const HALF = Math.floor(size / 2);

        for (let row = 0; row < size; row++) {
          for (let col = 0; col < size; col++) {
            if (row < QUARTER && col < HALF) {
              m[row][col] = "-j";
            } else if (row < QUARTER && col >= HALF) {
              m[row][col] = "j";
            } else if (row < HALF && col < HALF) {
              m[row][col] = "1";
            } else if (row < HALF && col >= HALF) {
              m[row][col] = "-1";
            } else if (row < 3 * QUARTER && col < HALF) {
              m[row][col] = "-k";
            } else if (row < 3 * QUARTER && col >= HALF) {
              m[row][col] = "k";
            } else if (row >= 3 * QUARTER && col < HALF) {
              m[row][col] = "i";
            } else if (row >= 3 * QUARTER && col >= HALF) {
              m[row][col] = "-i";
            }
          }
        }

        return new Matrix(m);
      },
    },
    pizza: {
      label: "Pizza Sectors",
      generate(rule) {
        const size = rule.gridSize;
        const m = emptyMatrix(size, size);
        const ordering = ["-j", "k", "-i", "1", "j", "-k", "i", "-1"];
        const cx = (size - 1) / 2;
        const cy = (size - 1) / 2;

        for (let row = 0; row < size; row++) {
          for (let col = 0; col < size; col++) {
            const angle = Math.atan2(row - cy, col - cx) + Math.PI;
            const region = Math.floor((8 * angle) / (2 * Math.PI));
            m[row][col] = ordering[region % 8];
          }
        }

        return new Matrix(m);
      },
    },
    spiral: {
      label: "Spiral",
      generate(rule) {
        const size = rule.gridSize;
        const ordering = ["-1", "k", "-j", "1", "j", "-k", "i", "-i"];
        const m = emptyMatrix(size, size);
        const half = size / 2;

        for (let row = 0; row < size; row++) {
          for (let col = 0; col < size; col++) {
            let region;
            if (row < half) {
              region = col < half ? 0 : 1;
            } else {
              region = col < half ? 2 : 3;
            }

            // Wave / zigzag interlocking
            if (
              Math.abs(row - col) < size / 4 ||
              Math.abs(row + col - size) < size / 4
            ) {
              region = (region + 2) % 4;
            }

            m[row][col] = ordering[region];
          }
        }

        return new Matrix(m);
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
        return "orange";
      case "-i":
        return "lightblue";
      case "j":
        return "green";
      case "-j":
        return "yellow";
      case "k":
        return "red";
      case "-k":
        return "grey";
    }
  }

  constructor(props = {}) {
    super(props);
    this.ordering = ["1", "-1", "i", "-i", "j", "-j", "k", "-k"];
    this.radius = props.radius ?? 1;
    this.gridSize = props.gridSize ?? 80;
    this.initPreset = props.initPreset ?? null;
  }

  generateStartingState() {
    // Default: quadrants layout
    return QuaternionGroup.INIT_PRESETS.quadrants.generate(this);
  }
}
