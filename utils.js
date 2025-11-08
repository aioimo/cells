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

export function mod(n, m) {
  return ((n % m) + m) % m;
}

export function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function randomWeighted(arr, weights) {
  if (arr.length !== weights.length) {
    throw new Error("Array and weights must be of the same length");
  }

  const sum = weights.reduce((a, b) => a + b, 0);
  if (Math.abs(sum - 1) > 0.00001) {
    throw new Error("Sum of weights must be 1");
  }

  let rand = Math.random();
  let total = 0;

  for (let i = 0; i < weights.length; i++) {
    total += weights[i];
    if (rand <= total) {
      return arr[i];
    }
  }

  // Fallback, should not reach here if weights sum to 1
  return arr[arr.length - 1];
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
