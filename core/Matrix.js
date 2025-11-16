// Matrix.js
export class Matrix {
  constructor(nestedArray) {
    this.rows = nestedArray.length;
    this.cols = nestedArray[0].length;
    this.data = nestedArray.flat();
  }

  get(row, col) {
    if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
      throw new RangeError(`get: Index out of bounds [${row}, ${col}]`);
    }
    return this.data[row * this.cols + col];
  }

  set(row, col, value) {
    if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
      throw new RangeError(`set: Index out of bounds [${row}, ${col}]`);
    }
    this.data[row * this.cols + col] = value;
  }
}
