class ImaginaryGroupSingle extends ImaginaryGroupBase {
  GRID_SIZE = 199;

  getColor(val) {
    switch (val) {
      case '1':
        return 'black';
      case '-1':
        return 'white';
      case 'i':
        return 'orange';
      case '-i':
        return 'purple';
    }
  }

  generateStartingState() {
    const m = randomMatrixWeighted(
      this.GRID_SIZE,
      this.GRID_SIZE,
      this.ordering,
      [0.4, 0, 0.4, 0.2]
    );

    m[Math.floor(this.GRID_SIZE / 3)][Math.floor(this.GRID_SIZE / 3)] = 'i';
    m[Math.floor((2 * this.GRID_SIZE) / 3)][
      Math.floor((2 * this.GRID_SIZE) / 3)
    ] = '1';

    return m;
  }
}
