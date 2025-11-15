// RPSCascade.js
// --------------------------------------------------
// Generalized cyclic dominance with cascading predator influence.
//
// ordering = [C0, C1, ..., C(n-1)]
// Predator chain for Ci is Ci+1, Ci+2, ... (mod n)
// Each step in the cycle gives diminishing dominance influence.
//
// Parameters:
//   influenceAdvantage — base multiplier for immediate predator.
//   cascadeDecay — 0..1, controls how fast dominance fades with distance.
//     0   => only immediate predator counts (classic behaviour).
//     0.5 => moderate cascading.
//     1.0 => all others equally strong predators (no decay).
//
// Behaviour:
//   - Works for any number of colors >= 3.
//   - “Loop-back” allowed, so dominance wraps around cyclically.
//   - Classic RPS behaviour for len=3 if desired (optional branch).

import { RPS } from "./RPS.js";

export class RPSCascade extends RPS {
  constructor({
    ordering = [
      "#15237BFF",
      "#FFFFFFFF",
      "#B64668FF",
      "#C0C0C0FF",
      "#219B1EFF",
      "#D4AF37FF",
      "#D0A215FF",
      "#CD7F32FF",
      "#169C99FF",
      "#D97D6AFF",
      "#219B1EFF",
    ],
    gridSize = 200,
    radius = 3,
    influenceAdvantage = 4.1,
    dominanceBias = 0.41,
    cascadeDecay = 0.11,
  } = {}) {
    super({ ordering, gridSize, radius, influenceAdvantage, dominanceBias });
    this.cascadeDecay = cascadeDecay;
  }

  influence(current, neighbour) {
    const len = this.ordering.length;
    if (len === 0) return 1;

    const i = this.ordering.indexOf(current);
    const j = this.ordering.indexOf(neighbour);
    if (i === -1 || j === -1) return 1;

    const dist = (j - i + len) % len;
    if (dist === 0) return 1; // same colour

    const extra =
      this.influenceAdvantage * Math.pow(this.cascadeDecay, dist - 1);
    return 1 + extra;
  }
}
