class QuaternionGroupPizza extends ImaginaryGroupBase {
  GRID_SIZE = 501;

  getColor(val) {
    switch (val) {
      case '1':
        return 'green';
      case '-1':
        return 'green';
      case 'i':
        return 'yellow';
      case '-i':
        return 'yellow';
      case 'j':
        return 'blue';
      case '-j':
        return 'blue';
      case 'k':
        return 'white';
      case '-k':
        return 'white';
    }
  }
  constructor(props) {
    super(props);
    this.ordering = ['-j', 'k', '-i', '1', 'j', '-k', 'i', '-1'];
    this.radius = 1;
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
