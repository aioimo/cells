export class Iteration {
  constructor($iteration) {
    this.$iteration = $iteration;
  }

  update(val) {
    this.$iteration.textContent = val;
  }
}
