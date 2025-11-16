// randomUtils.js
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
