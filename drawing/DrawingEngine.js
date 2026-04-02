export class DrawingEngine {
  BORDER_WIDTH = 0.05;
  GET_COLOR = () => "lightgrey";

  constructor({ canvas, getColor = this.GET_COLOR }) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.W_100 = this.canvas.width;
    this.H_100 = this.canvas.height;
    this.getColor = getColor;
    this.prevState = null; // previous state for dirty-region detection
  }

  draw(state) {
    const { ctx, W_100, H_100, BORDER_WIDTH } = this;
    // Enforce Matrix structure
    if (
      !state ||
      typeof state.get !== "function" ||
      typeof state.rows !== "number" ||
      typeof state.cols !== "number"
    ) {
      throw new Error(
        "DrawingEngine expects state to be a Matrix instance with get, rows, and cols properties."
      );
    }
    const squareSize = this.H_100 / state.rows;
    const prev = this.prevState;
    const fullRedraw =
      !prev || prev.rows !== state.rows || prev.cols !== state.cols;

    if (fullRedraw) {
      ctx.clearRect(0, 0, W_100, H_100);
    }

    const border = BORDER_WIDTH;
    const innerSize = squareSize - 2 * border;

    for (let row = 0; row < state.rows; row++) {
      for (let col = 0; col < state.cols; col++) {
        const val = state.get(row, col);

        // Skip unchanged cells
        if (!fullRedraw && prev.get(row, col) === val) continue;

        ctx.fillStyle = this.getColor(val);
        ctx.fillRect(
          squareSize * col + border,
          squareSize * row + border,
          innerSize,
          innerSize
        );
      }
    }

    this.prevState = state;
  }

  // Keep for external callers (e.g. thumbnail generation)
  drawSquare(row, col, val, squareSize) {
    const { ctx, BORDER_WIDTH } = this;
    ctx.fillStyle = this.getColor(val);
    ctx.fillRect(
      squareSize * col + BORDER_WIDTH,
      squareSize * row + BORDER_WIDTH,
      squareSize - 2 * BORDER_WIDTH,
      squareSize - 2 * BORDER_WIDTH
    );
  }
}
