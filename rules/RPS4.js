import { RPS } from "./RPS.js";

export class RPS4 extends RPS {
  constructor(props) {
    super(props);

    this.radius = 2;
    this.threshold = 16;
    this.influenceAdvantage = 3;
    this.ordering = ["#7880b5", "#C0A9B0", "#BCC4DB", "black"];
  }
}
