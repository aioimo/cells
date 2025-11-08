import { Logic } from "../Logic.js";
class C3Group extends Logic {
  getColor(val) {
    switch (val) {
      case 0:
        return "red"; // black
      case 1:
        return "black"; // red
      case 2:
        return "white"; // green
      case 3:
        return "yellow"; // green
    }
  }

  ORDERING = [0, 1, 2, 3];
  RADIUS = 1;
  THRESHOLD = 0;
  FILTER_SCHEMA = (row, col) => false;
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

    const product = neighbors.reduce((prev, curr) => this.add(prev, curr), 0);

    return product;
  }

  add(a, b) {
    return (a + b) % 4;
  }

  generateStartingState() {
    const GRID_SIZE = this.GRID_SIZE;
    const C3 = this.ordering; // Assuming it's ['color1', 'color2', 'color3']
    const m = Array.from({ length: GRID_SIZE }, () => new Array(GRID_SIZE));

    // Calculate the height of each horizontal band
    const bandHeight = Math.floor(GRID_SIZE / 4);

    for (let row = 0; row < GRID_SIZE; row++) {
      let color;
      if (row < bandHeight) {
        color = C3[0]; // First color for the first band
      } else if (row < 2 * bandHeight) {
        color = C3[1]; // Second color for the second band
      } else if (row < 3 * bandHeight) {
        color = C3[2]; // Second color for the second band
      } else {
        color = C3[3]; // Third color for the third band
      }

      for (let col = 0; col < GRID_SIZE; col++) {
        m[row][col] = color;
      }
    }

    return m;
  }
}
