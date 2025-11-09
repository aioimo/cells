import { RPS } from "./RPS.js";

export class RPSDiagonal extends RPS {
  constructor(props) {
    super(props);

    this.radius = 6;
    this.influenceAdvantage = 2.1;
    this.ordering = ["#7C3626", "#f5853f", "#ffcdbc"];
    this.dominanceBias = 0.0;
  }

  shouldIncludeOffset(dr, dc) {
    return Math.abs(dr) === Math.abs(dc);
  }
}
