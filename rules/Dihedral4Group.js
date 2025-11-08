import { Logic } from "../Logic.js";

class Dihedral4Group extends Logic {
  getColor(val) {
    switch (val) {
      case "e":
        return "yellow"; // black
      case "r":
        return "black"; // red
      case "r2":
        return "yellow"; // green
      case "r3":
        return "black"; // blue
      case "s":
        return "white"; // cyan
      case "rs":
        return "white"; // orange
      case "r2s":
        return "yellow"; // purple
      case "r3s":
        return "white"; // brown
      default:
        return "#FFFFFF"; // white (default case for any unexpected value)
    }
  }

  ORDERING = ["e", "r2", "s", "r", "rs", "r2s", "r3", "r3s"];
  RADIUS = 1;
  THRESHOLD = 0;
  FILTER_SCHEMA = (row, col) => row === 0 && col === 0;
  GRID_SIZE = 300;

  constructor(props) {
    super(props);

    this.radius = this.RADIUS;
    this.threshold = this.THRESHOLD;
    this.ordering = this.ORDERING;
    this.filterSchema = this.FILTER_SCHEMA;

    const initalState = this.generateStartingState();

    this.initialise(initalState);
  }

  nextValue(row, col, state) {
    const neighbors = this.getListOfNeighbourValues(row, col, state);

    const product = neighbors.reduce(
      (prev, curr) => this.multiplyD4(prev, curr),
      "e"
    );

    return product;
  }

  multiplyD4(a, b) {
    const multiplicationTableD4 = {
      ee: "e",
      er: "r",
      er2: "r2",
      er3: "r3",
      es: "s",
      ers: "rs",
      er2s: "r2s",
      er3s: "r3s",
      re: "r",
      rr: "r2",
      rr2: "r3",
      rr3: "e",
      rs: "rs",
      rrs: "r2s",
      rr2s: "r3s",
      rr3s: "s",
      r2e: "r2",
      r2r: "r3",
      r2r2: "e",
      r2r3: "r",
      r2s: "r2s",
      r2rs: "r3s",
      r2r2s: "s",
      r2r3s: "rs",
      r3e: "r3",
      r3r: "e",
      r3r2: "r",
      r3r3: "r2",
      r3s: "r3s",
      r3rs: "s",
      r3r2s: "rs",
      r3r3s: "r2s",
      se: "s",
      sr: "r3s",
      sr2: "r2s",
      sr3: "rs",
      ss: "e",
      srs: "r3",
      sr2s: "r2",
      sr3s: "r",
      rse: "rs",
      rsr: "s",
      rsr2: "r3s",
      rsr3: "r2s",
      rss: "r",
      rsrs: "e",
      rsr2s: "r3",
      rsr3s: "r2",
      r2se: "r2s",
      r2sr: "rs",
      r2sr2: "s",
      r2sr3: "r3s",
      r2ss: "r2",
      r2srs: "r",
      r2sr2s: "e",
      r2sr3s: "r3",
      r3se: "r3s",
      r3sr: "r2s",
      r3sr2: "rs",
      r3sr3: "s",
      r3ss: "r3",
      r3srs: "r2",
      r3sr2s: "r",
      r3sr3s: "e",
    };
    return multiplicationTableD4[a + b];
  }

  generateStartingState() {
    const GRID_SIZE = this.GRID_SIZE;
    const D4 = this.ordering;
    const m = Array.from({ length: GRID_SIZE }, () =>
      new Array(GRID_SIZE).fill("e")
    );

    // Center of the grid
    const center = (GRID_SIZE - 1) / 2;

    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        // Calculate angle from the center
        const angle = Math.atan2(row - center, col - center) + Math.PI; // Adjusted to range [0, 2PI]
        const sector = Math.floor((angle / (2 * Math.PI)) * 8); // Dividing the circle into 6 sectors

        // Assign the corresponding element from D4 to the sector
        m[row][col] = D4[sector % D4.length];
      }
    }

    return m;
  }
}
