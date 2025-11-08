import { ImaginaryGroupBase } from "./ImaginaryGroupBase.js";
import { emptyMatrix } from "../utils.js";

export class ImaginaryGroupQuadrants extends ImaginaryGroupBase {
  GRID_SIZE = 160;

  getColor(val) {
    switch (val) {
      case "1":
        return "white";
      case "-1":
        return "orange";
      case "i":
        return "white";
      case "-i":
        return "black";
    }
  }

  generateStartingState() {
    const m = emptyMatrix(this.GRID_SIZE, this.GRID_SIZE);
    const HALF = Math.floor(this.GRID_SIZE / 2);

    for (let row = 0; row < m.length; row++) {
      for (let col = 0; col < m.length; col++) {
        if (row < HALF && col < HALF) {
          m[row][col] = "-i";
          continue;
        }
        if (row < HALF && col >= HALF) {
          m[row][col] = "1";
          continue;
        }

        if (row >= HALF && col < HALF) {
          m[row][col] = "-1";
          continue;
        }

        if (row >= HALF && col >= HALF) {
          m[row][col] = "i";
          continue;
        }
      }
    }

    return m;
  }
}
