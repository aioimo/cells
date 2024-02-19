class Game {
  MAX_FRAME_RATE = 25;

  constructor(canvas, logic, onChange = () => {}) {
    this.logic = logic;
    this.drawingEngine = new DrawingEngine({
      canvas,
      getColor: logic.getColor,
    });
    this.onChange = onChange;
    this.animationFrameId = null;

    this.onReset();
  }

  onStartSimulation() {
    let lastTime = 0;

    const animate = (currentTime) => {
      if (this.logic.stable) {
        this.onGameEnd();
      } else {
        if (currentTime - lastTime > this.MAX_FRAME_RATE) {
          this.onNextStep();
          lastTime = currentTime;
        }
        this.animationFrameId = requestAnimationFrame(animate);
      }
    };

    this.animationFrameId = requestAnimationFrame(animate);
  }

  onPauseSimulation() {
    cancelAnimationFrame(this.animationFrameId);
  }

  onGameEnd() {
    cancelAnimationFrame(this.animationFrameId);
    console.log(`Finished in ${this.logic.iteration} iterations`);
    this.onChange(this.logic);
  }

  onReset() {
    const newStartingState = randomMatrix(50, 50, this.logic.ordering);
    this.logic.initialise(newStartingState);
    this.drawingEngine.draw(this.logic.state);
    this.onChange(this.logic);
  }

  onNextStep() {
    const state = this.logic.onNextState();
    this.onChange(this.logic);
    this.drawingEngine.draw(state);
  }
}
