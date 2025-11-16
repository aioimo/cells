import { RPS } from "./RPS.js";

export class RPS4 extends RPS {
  constructor(props) {
    super(props);

    this.radius = 4;
    this.threshold = 16;
    this.influenceAdvantage = 2;
    this.ordering = ["#7880b5", "#C0A9B0", "#BCC4DB", "black"];
    this.dominanceBias = 0.25; // K-aware dominance requirement
  }
}
