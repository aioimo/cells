// Dihedral4Group.js
// ---------------------------------------------
// Conceptual summary:
//
// - State space:
//     8 elements of D₄ (symmetries of the square):
//       { e, r, r2, r3, s, rs, r2s, r3s }.
//
// - Update rule:
//     For each cell, take all neighbours in radius 1 (excluding itself),
//     multiply their values sequentially using the D₄ group law, and set
//     the cell to the resulting element.
//
// - Initial configuration:
//     Grid is split into 8 angular sectors around the center; each sector
//     is assigned one of the D₄ elements from `this.ordering`.
//
// - Colours:
//     Defined by getColor(); purely visual, can be changed independently.
//

import { Rule } from "../core/Rule.js";

// ---------- D4 helpers ----------

function d4ToParts(x) {
  if (x === "e") return { k: 0, ref: false };

  const ref = x.includes("s");
  const rotPart = ref ? x.replace("s", "") : x;

  let k;
  switch (rotPart) {
    case "r":
      k = 1;
      break;
    case "r2":
      k = 2;
      break;
    case "r3":
      k = 3;
      break;
    default:
      k = 0;
      break; // treat anything unexpected as identity
  }

  return { k, ref };
}

function d4FromParts({ k, ref }) {
  k = ((k % 4) + 4) % 4; // normalize mod 4

  if (!ref) {
    if (k === 0) return "e";
    if (k === 1) return "r";
    return `r${k}`;
  } else {
    if (k === 0) return "s";
    if (k === 1) return "rs";
    return `r${k}s`;
  }
}

function multiplyD4(a, b) {
  const A = d4ToParts(a);
  const B = d4ToParts(b);

  if (!A.ref && !B.ref) {
    // rot * rot
    return d4FromParts({ k: A.k + B.k, ref: false });
  }

  if (!A.ref && B.ref) {
    // rot * (rot s)
    return d4FromParts({ k: A.k + B.k, ref: true });
  }

  if (A.ref && !B.ref) {
    // (rot s) * rot
    return d4FromParts({ k: A.k - B.k, ref: true });
  }

  // (rot s) * (rot s)
  return d4FromParts({ k: A.k - B.k, ref: false });
}

// ---------- Rule implementation ----------

export class Dihedral4Group extends Rule {
  constructor() {
    super();
    this.ordering = ["e", "r", "r2", "r3", "s", "rs", "r2s", "r3s"];
    this.gridSize = 300;
    this.radius = 1;
  }

  getColor(val) {
    switch (val) {
      case "e":
        return "black";
      case "r2":
      case "r2s":
      case "r":
      case "r3":
        return "yellow";
      case "s":
      case "rs":
      case "r3s":
        return "white";
      default:
        return "#FFFFFF";
    }
  }

  nextValue(row, col, state) {
    const neighbours = this.getListOfNeighbourValues(row, col, state);
    return neighbours.reduce((acc, n) => multiplyD4(acc, n), "e");
  }

  generateStartingState() {
    const size = this.gridSize;
    const m = Array.from({ length: size }, () => new Array(size).fill("e"));

    const center = (size - 1) / 2;
    const D4 = this.ordering;

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const angle = Math.atan2(row - center, col - center) + Math.PI;
        const sector = Math.floor((angle / (2 * Math.PI)) * 8);
        m[row][col] = D4[sector % D4.length];
      }
    }

    return m;
  }
}
