// Dihedral3Group.js
// ---------------------------------------------
// Conceptual summary:
//
// - State space:
//     The 6 elements of the dihedral group D₃ (symmetries of an equilateral triangle):
//       { e, r, r2, s, rs, r2s }
//     where:
//       - r   = rotation by 120°
//       - r2  = rotation by 240°
//       - s   = a reflection
//
// - Group operation:
//     Each cell holds one element. On each update step, we:
//       1. Take all neighbours in a radius-1 neighbourhood (excluding the cell itself).
//       2. Multiply their elements sequentially using the D₃ group law:
//
//            r^i · r^j       = r^(i+j)
//            r^i · r^j s     = r^(i+j) s
//            r^i s · r^j     = r^(i-j) s
//            r^i s · r^j s   = r^(i-j)
//
//          (exponents mod 3).
//
//       3. The resulting element becomes the new state of the cell.
//
// - Initial configuration:
//     The grid is divided into 6 angular sectors around the center.
//     Each sector is assigned one of the 6 elements from `this.ordering`,
//     forming a D₃ “wheel” pattern.
//
// - Visualisation:
//     `getColor` maps elements to colours for display. This mapping is
//     arbitrary and can be changed independently of the group dynamics.
//

import { Rule } from "../core/Rule.js";
import { Matrix } from "../core/Matrix.js";
import { emptyMatrix } from "../utils.js";

// ---------- D3 helpers (outside the class) ----------

// Map symbol -> (k, ref)
//   k   in {0,1,2} is rotation exponent
//   ref in {false,true} indicates reflection (has 's')
function d3ToParts(x) {
  switch (x) {
    case "e":
      return { k: 0, ref: false };
    case "r":
      return { k: 1, ref: false };
    case "r2":
      return { k: 2, ref: false };
    case "s":
      return { k: 0, ref: true };
    case "rs":
      return { k: 1, ref: true };
    case "r2s":
      return { k: 2, ref: true };
    default:
      return { k: 0, ref: false }; // fallback: identity-ish
  }
}

function d3FromParts({ k, ref }) {
  k = ((k % 3) + 3) % 3;

  if (!ref) {
    if (k === 0) return "e";
    if (k === 1) return "r";
    return "r2";
  } else {
    if (k === 0) return "s";
    if (k === 1) return "rs";
    return "r2s";
  }
}

function multiplyD3(a, b) {
  const A = d3ToParts(a);
  const B = d3ToParts(b);

  if (!A.ref && !B.ref) {
    // rot * rot
    return d3FromParts({ k: A.k + B.k, ref: false });
  }

  if (!A.ref && B.ref) {
    // rot * (rot s)
    return d3FromParts({ k: A.k + B.k, ref: true });
  }

  if (A.ref && !B.ref) {
    // (rot s) * rot
    return d3FromParts({ k: A.k - B.k, ref: true });
  }

  // (rot s) * (rot s)
  return d3FromParts({ k: A.k - B.k, ref: false });
}

// ---------- Rule implementation ----------

export class Dihedral3Group extends Rule {
  constructor() {
    super();
    this.ordering = ["e", "r", "r2", "s", "rs", "r2s"];
    this.gridSize = 400;
    this.radius = 1;
  }

  // Tweak freely; purely visual.
  getColor(val) {
    switch (val) {
      case "e":
        return "red";
      case "r":
      case "r2":
        return "black";
      case "s":
      case "rs":
      case "r2s":
        return "white";
      default:
        return "#FFFFFF";
    }
  }

  nextValue(row, col, state) {
    const neighbours = this.getListOfNeighbourValues(row, col, state);
    return neighbours.reduce((acc, v) => multiplyD3(acc, v), "e");
  }

  generateStartingState() {
    const size = this.gridSize;
    const m = emptyMatrix(size, size);
    const center = (size - 1) / 2;
    const D3 = this.ordering; // 6 elements

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const angle = Math.atan2(row - center, col - center) + Math.PI;
        const sector = Math.floor((angle / (2 * Math.PI)) * 6); // 0..5
        m[row][col] = D3[sector % D3.length];
      }
    }

    return new Matrix(m);
  }
}
