class ElementaryAbelian_2_2_2_Group extends Logic {
  getColor(val) {
    switch (val) {
      case 0:
        return 'white';
      case 1:
        return 'black';
      case 2:
        return 'orange';
      case 3:
        return 'yellow';
      case 4:
        return 'magenta';
      case 5:
        return 'blue';
      case 6:
        return 'green';
      case 7:
        return 'silver';
    }
  }

  ORDERING = [0, 4, 2, 6, 1, 5, 3, 7];
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

    const product = neighbors.reduce((prev, curr) => this.add(prev, curr), 0);

    return product;
  }

  add(a, b) {
    return a ^ b;
  }

  generateStartingState() {
    const m = emptyMatrix(this.GRID_SIZE, this.GRID_SIZE);

    const CENTER_X = (this.GRID_SIZE - 1) / 2;
    const CENTER_Y = (this.GRID_SIZE - 1) / 2;

    for (let row = 0; row < this.GRID_SIZE; row++) {
      for (let col = 0; col < this.GRID_SIZE; col++) {
        const angle = Math.atan2(row - CENTER_Y, col - CENTER_X) + Math.PI;
        const region = Math.floor((8 * angle) / (2 * Math.PI)); // Dividing the full circle into 8 parts
        m[row][col] = this.ordering[region % 8];
      }
    }

    return m;
  }
}
