export class SimulationController {
  constructor({ automaton, drawingEngine, onChange, onEnd }) {
    this.automaton = automaton;
    this.drawingEngine = drawingEngine;
    this.onChange = onChange;
    this.onEnd = onEnd;
    this.animationFrameId = null;
    this.running = false;

    this.FRAME_INTERVAL = 1000 / 10; // 5 fps max
  }

  start() {
    if (this.running) return;
    this.running = true;
    let lastTime = 0;

    const loop = (currentTime) => {
      if (!this.running) return;

      if (this.automaton.stable) {
        this.stop();

        this.onEnd?.();
        this.onChange?.(this.automaton);
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
    const initial = this.automaton.rule.createInitialState();
    this.automaton.initialise(initial);
    this.drawingEngine.draw(this.automaton.state);
    this.onChange?.(this.automaton);
  }

  step() {
    this.automaton.step();
    this.drawingEngine.draw(this.automaton.state);
    this.onChange?.(this.automaton);
  }
}
