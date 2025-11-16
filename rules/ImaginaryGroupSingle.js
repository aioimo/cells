import { ImaginaryGroupBase } from "./ImaginaryGroupBase.js";
import { Matrix } from "../core/Matrix.js";
import { randomMatrixWeighted } from "../utils.js";
export class ImaginaryGroupSingle extends ImaginaryGroupBase {
  GRID_SIZE = 199;

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
      this.GRID_SIZE,
      this.GRID_SIZE,
      this.ordering,
      [1, 0, 0.0, 0.0]
    );

    m[Math.floor(this.GRID_SIZE / 2)][Math.floor(this.GRID_SIZE / 2)] = "i";

    return new Matrix(m);
  }
}
