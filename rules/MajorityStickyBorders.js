// MajorityStickyBorders.js
import { Majority } from "./Majority.js";

export class MajorityStickyBorders extends Majority {
  constructor() {
    super({
      ordering: ["#FFB100", "#E83F6F", "#2274A5", "#32936F"],
      gridSize: 200,
      radius: 3,
      supportBias: 0.0, // just needs to beat uniform
      leadBias: 0.4, // must move 40% of way from p_current to 1.0,
    });
  }
}
