import { RPS } from "./RPS.js";

export class RPS5 extends RPS {
  constructor({
    ordering = ["#7880b5", "red", "white", "#BCC4DB", "black"],
    ...props
  } = {}) {
    super({ ordering, ...props });

    console.log("RPS5 initialized with ordering:", ordering);

    this.radius = 4;
    this.threshold = 20;
    this.influenceAdvantage = 3;
    this.ordering = ordering;
    this.dominanceBias = 0.4; // K-aware dominance requirement
  }
}
