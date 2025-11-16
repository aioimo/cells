import { ImaginaryGroupBase } from "./ImaginaryGroupBase.js";
import { Matrix } from "../core/Matrix.js";
import { randomMatrixWeighted } from "../utils.js";
export class ImaginaryGroupSingle extends ImaginaryGroupBase {
  GRID_SIZE = 199;

  constructor(props = {}) {
    super({
      gridSize: 199,
      ordering: ["-1", "i", "-i", "1"],
      ...props,
    });
  }

  getColor(val) {
    switch (val) {
      case "1":
        return "black";
      case "-1":
        return "white";
      case "i":
        return "orange";
      case "-i":
        return "purple";
    }
  }

  generateStartingState() {
    const m = randomMatrixWeighted(
      this.gridSize,
      this.gridSize,
      this.ordering,
      [1, 0, 0.0, 0.0]
    );

    m[Math.floor(this.gridSize / 2)][Math.floor(this.gridSize / 2)] = "i";

    return new Matrix(m);
  }
}
