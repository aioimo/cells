import { RPS } from "./RPS.js";

export class RPS5 extends RPS {
  constructor(props) {
    super(props);

    this.radius = 4;
    this.threshold = 20;
    this.influenceAdvantage = 3;
    this.ordering = ["#7880b5", "red", "white", "#BCC4DB", "black"];
    this.dominanceBias = 0.4; // K-aware dominance requirement
  }
}
