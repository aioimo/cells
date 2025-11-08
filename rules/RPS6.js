import { RPS } from "./RPS.js";

export class RPS6 extends RPS {
  constructor(props) {
    super(props);

    this.radius = 5;
    this.threshold = 0;
    this.influenceAdvantage = 1.2;
    this.ordering = ["#7880b5", "red", "white", "#BCC4DB", "black", "purple"];
  }
}
