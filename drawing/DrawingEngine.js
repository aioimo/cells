export class DrawingEngine {
  BORDER_WIDTH = 0.05;
  GET_COLOR = () => "lightgrey";

  constructor({ canvas, getColor = this.GET_COLOR }) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.W_100 = this.canvas.width;
    this.H_100 = this.canvas.height;
    this.getColor = getColor;
  }

  draw(state) {
    const { ctx, W_100, H_100 } = this;
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

    ctx.save();
    ctx.clearRect(0, 0, W_100, H_100);

    for (let row = 0; row < state.rows; row++) {
      for (let col = 0; col < state.cols; col++) {
        const val = state.get(row, col);
        this.drawSquare(row, col, val, squareSize);
      }
    }
    ctx.restore();
  }

  drawSquare(row, col, val, squareSize) {
    const { ctx, BORDER_WIDTH } = this;

    const color = this.getColor(val);
    ctx.save();
    ctx.fillStyle = color;
    ctx.translate(squareSize * col, squareSize * row);
    ctx.fillRect(
      BORDER_WIDTH,
      BORDER_WIDTH,
      squareSize - 2 * BORDER_WIDTH,
      squareSize - 2 * BORDER_WIDTH
    );

    ctx.restore();
  }
}
