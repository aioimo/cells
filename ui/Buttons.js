export class Buttons {
  constructor($start, $pause, $reset, $next) {
    this.$start = $start;
    this.$pause = $pause;
    this.$reset = $reset;
    this.$next = $next;
  }

  initialise() {
    this.$start.disabled = false;
    this.$pause.disabled = true;
    this.$reset.disabled = true;
    this.$next.disabled = true;
  }

  handleButtonsOnStartSimulation() {
    this.$start.disabled = true;
    this.$pause.disabled = false;
    this.$next.disabled = true;
    this.$reset.disabled = true;
  }

  handleButtonsOnPauseSimulation() {
    this.$start.disabled = false;
    this.$pause.disabled = true;
    this.$next.disabled = false;
    this.$reset.disabled = false;
  }

  handleButtonsOnEndSimulation() {
    this.$start.disabled = true;
    this.$pause.disabled = true;
    this.$next.disabled = true;
    this.$reset.disabled = false;
  }

  handleButtonsOnResetSimulation() {
    this.$start.disabled = false;
    this.$pause.disabled = true;
    this.$next.disabled = false;
    this.$reset.disabled = false;
  }
}
