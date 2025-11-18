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

  clone() {
    const newMatrix = Object.create(Matrix.prototype);
    newMatrix.rows = this.rows;
    newMatrix.cols = this.cols;
    newMatrix.data = this.data.slice();
    return newMatrix;
  }

  equals(other) {
    if (
      !other ||
      typeof other.get !== "function" ||
      this.rows !== other.rows ||
      this.cols !== other.cols
    ) {
      return false;
    }
    // Compare flat arrays directly
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i] !== other.data[i]) return false;
    }
    return true;
  }
}
