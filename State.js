export class State {
  constructor(controller, buttons) {
    this.controller = controller;
    this.buttons = buttons;

    this.buttons.$start.onclick = this.onStartClick.bind(this);
    this.buttons.$pause.onclick = this.onPauseClick.bind(this);
    this.buttons.$reset.onclick = this.onResetClick.bind(this);
    this.buttons.$next.onclick = this.onNextClick.bind(this);
  }

  dispatch(event) {
    console;
    switch (event.type) {
      case "START":
        this.buttons.handleButtonsOnStartSimulation();
        this.controller.start();
        break;

      case "PAUSE":
        this.buttons.handleButtonsOnPauseSimulation();
        this.controller.stop();
        break;

      case "RESET":
        this.buttons.handleButtonsOnResetSimulation();
        this.controller.reset();
        break;

      case "NEXT":
        this.controller.step();
        break;

      case "END":
        this.buttons.handleButtonsOnEndSimulation();
        break;

      default:
        console.warn("Unknown event type:", event.type);
    }
  }

  onStartClick() {
    this.dispatch({ type: "START" });
  }

  onPauseClick() {
    this.dispatch({ type: "PAUSE" });
  }

  onResetClick() {
    this.dispatch({ type: "RESET" });
  }

  onNextClick() {
    this.dispatch({ type: "NEXT" });
  }

  onGameEnd() {
    this.dispatch({ type: "END" });
  }
}
