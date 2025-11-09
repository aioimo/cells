import { RPS } from "./RPS.js";

export class RPS6 extends RPS {
  constructor(props) {
    super(props);

    this.radius = 4;
    this.influenceAdvantage = 2.7;
    this.ordering = [
      "#001a23",
      "#31493c",
      "#7a9e7e",
      "#b3efb2",
      "black",
      "#e8f1f2",
    ];
    this.dominanceBias = 0.3; // K-aware dominance requirement
  }
}
