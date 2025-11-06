export class SimulationController {
  constructor({ logic, drawingEngine, onChange }) {
    this.logic = logic;
    this.drawingEngine = drawingEngine;
    this.onChange = onChange;
    this.animationFrameId = null;
    this.running = false;

    this.FRAME_INTERVAL = 1000 / 5; // 5 fps max
  }

  start() {
    if (this.running) return;
    this.running = true;
    let lastTime = 0;

    const loop = (currentTime) => {
      if (!this.running) return;

      if (this.logic.stable) {
        this.stop();
        return;
      }

      if (currentTime - lastTime > this.FRAME_INTERVAL) {
        this.step();
        lastTime = currentTime;
      }

      this.animationFrameId = requestAnimationFrame(loop);
    };

    this.animationFrameId = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.animationFrameId);
  }

  reset() {
    this.logic.initialise(this.logic.generateStartingState());
    this.drawingEngine.draw(this.logic.state);
    this.onChange?.(this.logic);
  }

  step() {
    this.logic.onNextState();
    this.drawingEngine.draw(this.logic.state);
    this.onChange?.(this.logic);
  }
}
