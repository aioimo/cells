import { ImaginaryGroupBase } from "./ImaginaryGroupBase.js";

export class QuaternionGroup extends ImaginaryGroupBase {
  GRID_SIZE = 80;

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
  constructor(props) {
    super(props);
    this.ordering = ["-1", "i", "-i", "1", "-j", "k", "-k", "j"];
    this.radius = 1;
  }

  generateStartingState() {
    const m = emptyMatrix(this.GRID_SIZE, this.GRID_SIZE);
    const QUARTER = Math.floor(this.GRID_SIZE / 4); // One quarter of the grid size
    const HALF = Math.floor(this.GRID_SIZE / 2); // One half of the grid size

    for (let row = 0; row < this.GRID_SIZE; row++) {
      for (let col = 0; col < this.GRID_SIZE; col++) {
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

    return m;
  }
}
