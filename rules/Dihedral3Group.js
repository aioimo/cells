class Dihedral3Group extends Logic {
  getColor(val) {
    switch (val) {
      case 'e':
        return 'red'; // black
      case 'a':
        return 'black'; // red
      case 'b':
        return 'black'; // green
      case 'c':
        return 'black'; // blue
      case 'd':
        return 'red'; // yellow
      case 'f':
        return 'red'; // magenta
      default:
        return '#FFFFFF'; // white (default case for any unexpected value)
    }
  }

  ORDERING = ['b', 'e', 'a', 'f', 'c', 'd'];
  RADIUS = 1;
  THRESHOLD = 0;
  FILTER_SCHEMA = (row, col) => row === 0 && col === 0;
  GRID_SIZE = 400;

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
      (prev, curr) => this.multiplyD3(prev, curr),
      'e'
    );

    return product;
  }

  multiplyD3(a, b) {
    const productTable = {
      e: { e: 'e', a: 'a', b: 'b', c: 'c', d: 'd', f: 'f' },
      a: { e: 'a', a: 'e', b: 'd', c: 'f', d: 'b', f: 'c' },
      b: { e: 'b', a: 'f', b: 'e', c: 'd', d: 'c', f: 'a' },
      c: { e: 'c', a: 'd', b: 'f', c: 'e', d: 'a', f: 'b' },
      d: { e: 'd', a: 'c', b: 'a', c: 'b', d: 'f', f: 'e' },
      f: { e: 'f', a: 'b', b: 'c', c: 'a', d: 'e', f: 'd' },
    };

    return productTable[a][b];
  }

  generateStartingState() {
    const GRID_SIZE = this.GRID_SIZE;
    const D3 = this.ordering;
    const m = Array.from({ length: GRID_SIZE }, () =>
      new Array(GRID_SIZE).fill('e')
    );

    // Center of the grid
    const center = (GRID_SIZE - 1) / 2;

    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        // Calculate angle from the center
        const angle = Math.atan2(row - center, col - center) + Math.PI; // Adjusted to range [0, 2PI]
        const sector = Math.floor((angle / (2 * Math.PI)) * 6); // Dividing the circle into 6 sectors

        // Assign the corresponding element from D3 to the sector
        m[row][col] = D3[sector % D3.length];
      }
    }

    return m;
  }
}
