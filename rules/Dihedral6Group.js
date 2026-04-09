// Dihedral6Group.js
// See conceptual summary above.

import { Rule } from "../core/Rule.js";
import { Matrix } from "../core/Matrix.js";

// Dihedral6Group
// ---------------------------------------------
// Conceptual summary:
//
// - State space:
//     The 12 elements of the dihedral group D₆ — the symmetries of a regular hexagon:
//       { e,
//         r, r2, r3, r4, r5,          // rotations (order 6)
//         s, rs, r2s, r3s, r4s, r5s } // reflections
//
// - Group operation:
//     Each cell holds one of these elements. On each update step,
//     all neighbours’ values are multiplied together under the D₆ group law:
//
//         rⁱ · rʲ        = rⁱ⁺ʲ
//         rⁱ · rʲs       = rⁱ⁺ʲs
//         rⁱs · rʲ       = rⁱ⁻ʲs
//         rⁱs · rʲs      = rⁱ⁻ʲ
//
//     (Exponents are modulo 6.)
//
// - Update rule:
//     For every cell, gather all neighbour elements within a radius-1 neighbourhood
//     (excluding the center). Multiply them sequentially using the D₆ operation.
//     The resulting element becomes the new state of that cell.
//
// - Initial configuration:
//     The grid is divided into 12 angular sectors around the center.
//     Each sector is assigned one of the 12 group elements, forming
//     a dihedral “wheel” pattern.
//
// - Visualisation:
//     Each group element is mapped to a display colour by `getColor()`.
//     The colour mapping is purely visual and independent of the algebraic rule.
//
// - Interpretation:
//     This is a cellular automaton governed by the algebra of the dihedral group D₆.
//     It demonstrates how local group-theoretic interactions propagate globally
//     across a spatial lattice.

// Helpers to work with D6 elements encoded as strings.

function toParts(x) {
  if (x === "e") return { k: 0, ref: false };
  let ref = x.includes("s");
  let rotPart = ref ? x.replace("s", "") : x;

  if (rotPart === "e" || rotPart === "") return { k: 0, ref };
  if (rotPart === "r") return { k: 1, ref };

  const n = parseInt(rotPart.slice(1), 10) || 0;
  return { k: n % 6, ref };
}

function fromParts({ k, ref }) {
  k = ((k % 6) + 6) % 6;
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

function multiplyD6(a, b) {
  const A = toParts(a);
  const B = toParts(b);

  if (!A.ref && !B.ref) return fromParts({ k: A.k + B.k, ref: false });
  if (!A.ref && B.ref) return fromParts({ k: A.k + B.k, ref: true });
  if (A.ref && !B.ref) return fromParts({ k: A.k - B.k, ref: true });
  /* A.ref && B.ref */ return fromParts({ k: A.k - B.k, ref: false });
}

export class Dihedral6Group extends Rule {
  static COLOR_GROUPINGS = [
    {
      name: "Rotations vs Reflections",
      groups: [
        { elements: ["e", "r", "r2", "r3", "r4", "r5"], color: "#00B4D8" },
        { elements: ["s", "rs", "r2s", "r3s", "r4s", "r5s"], color: "#FF006E" },
      ],
    },
    {
      name: "Subgroup \u27E8r\u00B2\u27E9",
      groups: [
        { elements: ["e", "r2", "r4"], color: "#FFBE0B" },
        { elements: ["r", "r3", "r5"], color: "#3A86FF" },
        { elements: ["s", "rs", "r2s", "r3s", "r4s", "r5s"], color: "#FB5607" },
      ],
    },
    {
      name: "Identity Highlighted",
      groups: [
        { elements: ["e"], color: "#FFFFFF" },
        { elements: ["r", "r2", "r3", "r4", "r5"], color: "#023047" },
        { elements: ["s", "rs", "r2s", "r3s", "r4s", "r5s"], color: "#FFB703" },
      ],
    },
  ];

  constructor({ gridSize = 400 } = {}) {
    super();
    this.ordering = [
      "e",
      "s",
      "r",
      "r2",
      "r3",
      "r4",
      "r5",
      "rs",
      "r2s",
      "r3s",
      "r4s",
      "r5s",
    ];
    this.gridSize = gridSize;
    this.radius = 1; // Moore neighborhood
  }

  getColor(val) {
    switch (val) {
      case "e":
        return "#FFFFFF";
      case "r":
        return "#FF0054";
      case "r2":
        return "#BB0A21";
      case "r3":
        return "#7B2D8E";
      case "r4":
        return "#3F37C9";
      case "r5":
        return "#4895EF";
      case "s":
        return "#F72585";
      case "rs":
        return "#FFBE0B";
      case "r2s":
        return "#FB5607";
      case "r3s":
        return "#06D6A0";
      case "r4s":
        return "#118AB2";
      case "r5s":
        return "#073B4C";
      default:
        return "#FFFFFF";
    }
  }

  // Automaton calls this for each cell
  nextValue(row, col, state) {
    const neighbours = this.getListOfNeighbourValues(row, col, state);
    const product = neighbours.reduce((acc, v) => multiplyD6(acc, v), "e");
    return product;
  }

  // 12-sector dihedral wheel initial state
  generateStartingState() {
    const size = this.gridSize;
    const D6 = [
      "e",
      "r5s",
      "r",
      "r4s",
      "r2",
      "r3s",
      "r3",
      "r2s",
      "r4",
      "rs",
      "r5",
      "s",
    ];

    const m = Array.from({ length: size }, () => new Array(size).fill("e"));

    const center = (size - 1) / 2;

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const angle = Math.atan2(row - center, col - center) + Math.PI;
        const sector = Math.floor((angle / (2 * Math.PI)) * 12);
        m[row][col] = D6[sector % D6.length];
      }
    }

    return new Matrix(m);
  }
}
