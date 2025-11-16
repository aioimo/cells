import { random, randomWeighted } from "./randomUtils.js";

export function emptyMatrix(rows, cols) {
  let empty = [];
  for (let row = 0; row < rows; row++) {
    const rowArray = [];
    for (let col = 0; col < cols; col++) {
      rowArray.push(undefined);
    }
    empty.push(rowArray);
  }
  return empty;
}

export function areMatricesEqual(matrix1, matrix2) {
  try {
    for (let row = 0; row < matrix1.length; row++) {
      for (let col = 0; col < matrix1.length; col++) {
        if (matrix1[row][col] !== matrix2[row][col]) {
          return false;
        }
      }
    }
  } catch {
    return false;
  }
  return true;
}

export function randomMatrix(rows, cols, vals) {
  const result = [];
  for (let row = 0; row < rows; row++) {
    const rowArray = [];
    for (let col = 0; col < cols; col++) {
      rowArray.push(random(vals));
    }
    result.push(rowArray);
  }
  return result;
}

export function randomMatrixWeighted(rows, cols, vals, weights) {
  const result = [];
  for (let row = 0; row < rows; row++) {
    const rowArray = [];
    for (let col = 0; col < cols; col++) {
      rowArray.push(randomWeighted(vals, weights));
    }
    result.push(rowArray);
  }
  return result;
}

// random and randomWeighted are imported from randomUtils.js
