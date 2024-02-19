class State {
  constructor(game, buttons) {
    this.game = game;
    this.buttons = buttons;

    this.buttons.$start.onclick = this.onStartClick.bind(this);
    this.buttons.$pause.onclick = this.onPauseClick.bind(this);
    this.buttons.$reset.onclick = this.onResetClick.bind(this);
    this.buttons.$next.onclick = this.onNextClick.bind(this);
  }

  dispatch(event) {
    console;
    switch (event.type) {
      case 'START':
        this.buttons.handleButtonsOnStartSimulation();
        this.game.onStartSimulation();
        break;
      case 'PAUSE':
        this.buttons.handleButtonsOnPauseSimulation();
        this.game.onPauseSimulation();
        break;
      case 'RESET':
        this.buttons.handleButtonsOnResetSimulation();
        this.game.onReset();
        break;
      case 'NEXT':
        this.game.onNextStep();
        break;
      case 'END':
        this.buttons.handleButtonsOnEndSimulation();
        break;
    }
  }

  onStartClick() {
    this.dispatch({ type: 'START' });
  }

  onPauseClick() {
    this.dispatch({ type: 'PAUSE' });
  }

  onResetClick() {
    this.dispatch({ type: 'RESET' });
  }

  onNextClick() {
    this.dispatch({ type: 'NEXT' });
  }

  onGameEnd() {
    this.dispatch({ type: 'END' });
  }
}
