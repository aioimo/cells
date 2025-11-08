import { Logic } from "../Logic.js";

class Dihedral6Group extends Logic {
  getColor(val) {
    switch (val) {
      case "e":
        return "black"; // black
      case "r":
        return "black"; // red
      case "r2":
        return "black"; // green
      case "r3":
        return "black"; // blue
      case "r4":
        return "black"; // yellow
      case "r5":
        return "black"; // magenta
      case "s":
        return "cyan"; // cyan
      case "rs":
        return "cyan"; // orange
      case "r2s":
        return "cyan"; // purple
      case "r3s":
        return "cyan"; // brown
      case "r4s":
        return "cyan"; // grey
      case "r5s":
        return "cyan"; // pink
      default:
        return "#FFFFFF"; // white (default case for any unexpected value)
    }
  }

  ORDERING = [
    "e",
    "s",
    "r",
    "r2",
    "r3",
    "r4",
    "r5",
    "rs",
    "r2s",
    "r3s",
    "r4s",
    "r5s",
  ];
  RADIUS = 1;
  THRESHOLD = 0;
  FILTER_SCHEMA = (row, col) => row === 0 && col === 0;
  GRID_SIZE = 200;

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

    const complexProduct = neighbors.reduce(
      (prev, curr) => this.multiplyD6(prev, curr),
      "e"
    );

    return complexProduct;
  }

  multiplyD6(a, b) {
    const multiplicationTable = {
      ee: "e",
      er: "r",
      er2: "r2",
      er3: "r3",
      er4: "r4",
      er5: "r5",
      es: "s",
      ers: "rs",
      er2s: "r2s",
      er3s: "r3s",
      er4s: "r4s",
      er5s: "r5s",
      re: "r",
      rr: "r2",
      rr2: "r3",
      rr3: "r4",
      rr4: "r5",
      rr5: "e",
      rs: "rs",
      rrs: "r2s",
      rr2s: "r3s",
      rr3s: "r4s",
      rr4s: "r5s",
      rr5s: "s",
      r2e: "r2",
      r2r: "r3",
      r2r2: "r4",
      r2r3: "r5",
      r2r4: "e",
      r2r5: "r",
      r2s: "r2s",
      r2rs: "r3s",
      r2r2s: "r4s",
      r2r3s: "r5s",
      r2r4s: "s",
      r2r5s: "rs",
      r3e: "r3",
      r3r: "r4",
      r3r2: "r5",
      r3r3: "e",
      r3r4: "r",
      r3r5: "r2",
      r3s: "r3s",
      r3rs: "r4s",
      r3r2s: "r5s",
      r3r3s: "s",
      r3r4s: "rs",
      r3r5s: "r2s",
      r4e: "r4",
      r4r: "r5",
      r4r2: "e",
      r4r3: "r",
      r4r4: "r2",
      r4r5: "r3",
      r4s: "r4s",
      r4rs: "r5s",
      r4r2s: "s",
      r4r3s: "rs",
      r4r4s: "r2s",
      r4r5s: "r3s",
      r5e: "r5",
      r5r: "e",
      r5r2: "r",
      r5r3: "r2",
      r5r4: "r3",
      r5r5: "r4",
      r5s: "r5s",
      r5rs: "s",
      r5r2s: "rs",
      r5r3s: "r2s",
      r5r4s: "r3s",
      r5r5s: "r4s",
      se: "s",
      sr: "rs",
      sr2: "r2s",
      sr3: "r3s",
      sr4: "r4s",
      sr5: "r5s",
      ss: "e",
      srs: "r5",
      sr2s: "r4",
      sr3s: "r3",
      sr4s: "r2",
      sr5s: "r",
      rse: "rs",
      rsr: "r2s",
      rsr2: "r3s",
      rsr3: "r4s",
      rsr4: "r5s",
      rsr5: "s",
      rss: "r",
      rsrs: "e",
      rsr2s: "r5",
      rsr3s: "r4",
      rsr4s: "r3",
      rsr5s: "r2",
      r2se: "r2s",
      r2sr: "r3s",
      r2sr2: "r4s",
      r2sr3: "r5s",
      r2sr4: "s",
      r2sr5: "rs",
      r2se: "r2s",
      r2sr: "r3s",
      r2sr2: "r4s",
      r2sr3: "r5s",
      r2sr4: "s",
      r2sr5: "rs",
      r2ss: "r2",
      r2srs: "r",
      r2sr2s: "e",
      r2sr3s: "r5",
      r2sr4s: "r4",
      r2sr5s: "r3",
      r3se: "r3s",
      r3sr: "r4s",
      r3sr2: "r5s",
      r3sr3: "s",
      r3sr4: "rs",
      r3sr5: "r2s",
      r3ss: "r3",
      r3srs: "r2",
      r3sr2s: "r",
      r3sr3s: "e",
      r3sr4s: "r5",
      r3sr5s: "r4",
      r4se: "r4s",
      r4sr: "r5s",
      r4sr2: "s",
      r4sr3: "rs",
      r4sr4: "r2s",
      r4sr5: "r3s",
      r4ss: "r4",
      r4srs: "r3",
      r4sr2s: "r2",
      r4sr3s: "r",
      r4sr4s: "e",
      r4sr5s: "r5",
      r5se: "r5s",
      r5sr: "s",
      r5sr2: "rs",
      r5sr3: "r2s",
      r5sr4: "r3s",
      r5sr5: "r4s",
      r5ss: "r5",
      r5srs: "r4",
      r5sr2s: "r3",
      r5sr3s: "r2",
      r5sr4s: "r",
      r5sr5s: "e",
      se: "s",
      sr: "rs",
      sr2: "r2s",
      sr3: "r3s",
      sr4: "r4s",
      sr5: "r5s",
      ss: "e",
      srs: "r5",
      sr2s: "r4",
      sr3s: "r3",
      sr4s: "r2",
      sr5s: "r",
      rse: "rs",
      rsr: "r2s",
      rsr2: "r3s",
      rsr3: "r4s",
      rsr4: "r5s",
      rsr5: "s",
      rss: "r",
      rsrs: "e",
      rsr2s: "r5",
      rsr3s: "r4",
      rsr4s: "r3",
      rsr5s: "r2",
      r2se: "r2s",
      r2sr: "r3s",
      r2sr2: "r4s",
      r2sr3: "r5s",
      r2sr4: "s",
      r2sr5: "rs",
      r2ss: "r2",
      r2srs: "r",
      r2sr2s: "e",
      r2sr3s: "r5",
      r2sr4s: "r4",
      r2sr5s: "r3",
      r3se: "r3s",
      r3sr: "r4s",
      r3sr2: "r5s",
      r3sr3: "s",
      r3sr4: "rs",
      r3sr5: "r2s",
      r3ss: "r3",
      r3se: "r3s",
      r3sr: "r4s",
      r3sr2: "r5s",
      r3sr3: "s",
      r3sr4: "rs",
      r3sr5: "r2s",
      r3ss: "r3",
      r3srs: "r2",
      r3sr2s: "r",
      r3sr3s: "e",
      r3sr4s: "r5",
      r3sr5s: "r4",
      r4se: "r4s",
      r4sr: "r5s",
      r4sr2: "s",
      r4sr3: "rs",
      r4sr4: "r2s",
      r4sr5: "r3s",
      r4ss: "r4",
      r4srs: "r3",
      r4sr2s: "r2",
      r4sr3s: "r",
      r4sr4s: "e",
      r4sr5s: "r5",
      r5se: "r5s",
      r5sr: "s",
      r5sr2: "rs",
      r5sr3: "r2s",
      r5sr4: "r3s",
      r5sr5: "r4s",
      r5ss: "r5",
      r5srs: "r4",
      r5sr2s: "r3",
      r5sr3s: "r2",
      r5sr4s: "r",
      r5sr5s: "e",
      sse: "s",
      ssr: "rs",
      ssr2: "r2s",
      ssr3: "r3s",
      ssr4: "r4s",
      ssr5: "r5s",
      sss: "e",
      ssrs: "r5",
      ssr2s: "r4",
      ssr3s: "r3",
      ssr4s: "r2",
      ssr5s: "r",
    };

    // Compute the product
    const product = multiplicationTable[a + b];

    if (product == undefined) {
      console.log("A", a);
      console.log("B", b);
      console.log("A+B*", a + b);
    }

    // Return the result, or some default value if the combination does not exist
    return product !== undefined ? product : "Invalid Combination";
  }

  multiplyD6Broken(a, b) {
    // Function to normalize the rotation
    function normalizeRotation(r) {
      let normalized = r % 6;
      return normalized === 0 ? "e" : "r" + normalized;
    }

    // Extract the rotation and reflection components from the elements
    let rotationA = a.includes("r") ? parseInt(a.slice(1)) : 0;
    let reflectA = a.includes("s");
    let rotationB = b.includes("r") ? parseInt(b.slice(1)) : 0;
    let reflectB = b.includes("s");

    // Compute the total rotation and reflection
    let totalRotation = normalizeRotation(rotationA + rotationB);
    let totalReflection = reflectA !== reflectB; // XOR operation

    // Build the result string
    let result = totalReflection ? "s" : "";
    if (totalRotation !== "e") {
      result = totalRotation + result;
    }
    if (result === "") {
      result = "e"; // Identity element
    }

    return result;
  }

  generateStartingState() {
    const GRID_SIZE = this.GRID_SIZE;
    const D6 = [
      "e",
      "r5s",
      "r",
      "r4s",
      "r2",
      "r3s",
      "r3",
      "r2s",
      "r4",
      "rs",
      "r5",
      "s",
    ];
    const m = Array.from({ length: GRID_SIZE }, () =>
      new Array(GRID_SIZE).fill("e")
    );

    // Center of the grid
    const center = (GRID_SIZE - 1) / 2;

    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        // Calculate angle from the center
        const angle = Math.atan2(row - center, col - center) + Math.PI; // Adjusted to range [0, 2PI]
        const sector = Math.floor((angle / (2 * Math.PI)) * 12);

        // Assign the corresponding element from D6 to the sector
        m[row][col] = D6[sector % D6.length];
      }
    }

    return m;
  }
}
