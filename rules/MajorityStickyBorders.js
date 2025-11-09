// MajorityStickyBorders.js
import { Majority } from "./Majority.js";

export class MajorityStickyBorders extends Majority {
  constructor() {
    super({
      supportBias: 0.0, // just needs to beat uniform
      leadBias: 0.4, // must move 40% of way from p_current to 1.0
    });
  }
}
