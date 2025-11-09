// State.js
export class State {
  constructor(controller, buttons) {
    this.controller = controller;
    this.buttons = buttons;
  }

  dispatch(event) {
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
}
