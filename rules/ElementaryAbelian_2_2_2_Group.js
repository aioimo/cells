// ElementaryAbelian_2_2_2_Group
// ---------------------------------------------
// Conceptual summary:
//
// - States are the 8 elements of (Z2)^3, encoded as integers 0..7.
// - Colours are a visual mapping of those 8 group elements.
// - Initial configuration:
//     - The grid is split into 8 angular sectors around the center.
//     - Each sector is filled with one of the 8 group elements
//       according to `this.ordering`, creating a radial "group wheel".
// - Update rule (per cell):
//     - Look at all neighbours in a radius-1 Moore neighbourhood
//       (excluding the center cell itself).
//     - Take the bitwise XOR of all neighbour values.
//     - That XOR result is the new state of the cell.
// - Interpretation:
//     - This is a cellular automaton driven by the group operation of
//       the elementary abelian 2×2×2 group: local neighbourhoods combine
//       via XOR, and the evolving pattern reflects algebraic structure
//       rather than ad-hoc rules.

import { Rule } from "../core/Rule.js";
import { Matrix } from "../core/Matrix.js";
import { emptyMatrix } from "../utils.js";

export class ElementaryAbelian_2_2_2_Group extends Rule {
  constructor() {
    super();
    this.ordering = [0, 4, 2, 6, 1, 5, 3, 7];
    this.gridSize = 300;
    this.radius = 1; // 3x3 neighbourhood
  }

  getColor(val) {
    switch (val) {
      case 0:
        return "white";
      case 1:
        return "black";
      case 2:
        return "orange";
      case 3:
        return "yellow";
      case 4:
        return "magenta";
      case 5:
        return "blue";
      case 6:
        return "green";
      case 7:
        return "silver";
      default:
        return "gray";
    }
  }

  // Automaton calls this for each cell
  nextValue(row, col, state) {
    const neighbours = this.getListOfNeighbourValues(row, col, state);
    const result = neighbours.reduce((acc, v) => this.add(acc, v), 0);
    return result;
  }

  // Group operation: (Z2)^3 via XOR
  add(a, b) {
    return a ^ b;
  }

  // Initial 8-sector radial pattern
  generateStartingState() {
    const size = this.gridSize;
    const m = emptyMatrix(size, size);
    const cx = (size - 1) / 2;
    const cy = (size - 1) / 2;

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const angle = Math.atan2(row - cy, col - cx) + Math.PI; // 0..2π
        const sector = Math.floor((8 * angle) / (2 * Math.PI)); // 0..7
        m[row][col] = this.ordering[sector % 8];
      }
    }

    return new Matrix(m);
  }
}
