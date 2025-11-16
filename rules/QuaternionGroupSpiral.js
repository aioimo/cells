import { ImaginaryGroupBase } from "./ImaginaryGroupBase.js";
import { Matrix } from "../core/Matrix.js";
import { emptyMatrix } from "../utils.js";

export class QuaternionGroupSpiral extends ImaginaryGroupBase {
  GRID_SIZE = 301;

  getColor(val) {
    switch (val) {
      case "1":
        return "white";
      case "-1":
        return "white";
      case "i":
        return "purple";
      case "-i":
        return "purple";
      case "j":
        return "lightsalmon";
      case "-j":
        return "lightsalmon";
      case "k":
        return "lightblue";
      case "-k":
        return "lightblue";
    }
  }

  constructor(props) {
    super(props);
    this.ordering = ["-1", "k", "-j", "1", "j", "-k", "i", "-i"];
    this.radius = 2;
    this.gridSize = this.GRID_SIZE;
  }

  generateStartingState() {
    return this.generateComplexPattern();
  }

  generateComplexPattern() {
    return this.generateInterlockingQuadrants(this.GRID_SIZE, this.ordering);
  }

  generateInterlockingQuadrants(gridSize, ordering) {
    const m = emptyMatrix(gridSize, gridSize);

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        let region = this.determineRegion(row, col, gridSize);
        m[row][col] = ordering[region];
      }
    }

    return new Matrix(m);
  }

  determineRegion(row, col, gridSize) {
    let halfGridSize = gridSize / 2;
    let region;

    if (row < halfGridSize) {
      region = col < halfGridSize ? 0 : 1;
    } else {
      region = col < halfGridSize ? 2 : 3;
    }

    // Create a wave or zigzag pattern
    if (
      Math.abs(row - col) < gridSize / 4 ||
      Math.abs(row + col - gridSize) < gridSize / 4
    ) {
      region = (region + 2) % 4; // Swap regions to create the interlocking effect
    }

    return region;
  }
}
