// MajorityStrongConsensus.js
import { Majority } from "./Majority.js";

export class MajorityStrongConsensus extends Majority {
  constructor() {
    super({
      supportBias: 0.2, // closer to unanimity than uniform
      leadBias: 0.25, // clearly beats current
    });
  }
}
