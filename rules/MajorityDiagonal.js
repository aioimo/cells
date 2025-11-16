// MajorityDiagonal.js
// ---------------------------------------------
// Majority variant that only considers diagonal neighbours.
// Uses the same majority-with-headroom rule as Majority,
// but with a different neighbourhood shape.

import { Majority } from "./Majority.js";

export class MajorityDiagonal extends Majority {
  constructor({ radius = 10 }) {
    super({
      ordering: ["orange", "black", "white"],
      gridSize: 251,
      radius,
      supportBias: 0.29,
      leadBias: 0.0,
    });
  }

  // Only include offsets on diagonals: |dr| == |dc|, excluding (0,0) which
  // Majority/Rule already handle.
  shouldIncludeOffset(dr, dc) {
    return Math.abs(dr) === Math.abs(dc);
  }
}
