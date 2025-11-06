export class UIManager {
  constructor({ buttons, iterations, colors, onAction }) {
    this.buttons = buttons;
    this.iterations = iterations;
    this.colors = colors;
    this.onAction = onAction;
  }

  bindEvents() {
    this.buttons.$start.onclick = () => this.onAction("START");
    this.buttons.$pause.onclick = () => this.onAction("PAUSE");
    this.buttons.$reset.onclick = () => this.onAction("RESET");
    this.buttons.$next.onclick = () => this.onAction("NEXT");
  }

  updateUI(logic) {
    this.iterations.update(logic.iteration);
    this.colors.displayColorTable(logic);
    this.colors.updateColorStatistics(logic);
  }
}
