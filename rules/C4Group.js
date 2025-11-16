// C4Group.js (formerly C3Group)
// ---------------------------------------------
// Conceptual summary:
//
// - State space:
//     Integers {0,1,2,3} representing the cyclic group C₄ (Z/4Z).
//
// - Update rule:
//     For each cell:
//       1. Collect neighbour values in radius-1 (excluding itself).
//       2. Sum them all and take result mod 4.
//       3. That value becomes the new state.
//
// - Initial configuration:
//     The grid is split into 4 horizontal bands.
//     Each band is filled with one of the 4 group elements.
//
// - Visualisation:
//     `getColor` maps 0..3 to colours; purely visual.
//

import { Rule } from "../core/Rule.js";
import { Matrix } from "../core/Matrix.js";
import { emptyMatrix } from "../utils.js";

export class C4Group extends Rule {
  constructor() {
    super();
    this.ordering = [0, 1, 2, 3];
    this.gridSize = 300;
    this.radius = 1;
  }

  getColor(val) {
    switch (val) {
      case 0:
        return "red";
      case 1:
        return "black";
      case 2:
        return "white";
      case 3:
        return "yellow";
      default:
        return "#FFFFFF";
    }
  }

  nextValue(row, col, state) {
    const neighbours = this.getListOfNeighbourValues(row, col, state);
    const sum = neighbours.reduce((acc, v) => acc + v, 0);
    return sum % 4;
  }

  generateStartingState() {
    const size = this.gridSize;
    const m = emptyMatrix(size, size);
    const cx = (size - 1) / 2;
    const cy = (size - 1) / 2;
    const inner = size / 6;
    const outer = size / 5;

    // background 0
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const dx = c - cx;
        const dy = r - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        m[r][c] = dist > inner && dist < outer ? 1 : 0;
      }
    }

    return new Matrix(m);
  }
}
