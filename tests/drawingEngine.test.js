/**
 * @jest-environment jsdom
 */
import jest from "jest-mock";

import { DrawingEngine } from "../drawing/DrawingEngine.js";
import { Matrix } from "../core/Matrix.js";

describe("DrawingEngine", () => {
  let canvas, engine, mockCtx;

  beforeEach(() => {
    mockCtx = {
      save: jest.fn(),
      clearRect: jest.fn(),
      fillStyle: "",
      translate: jest.fn(),
      fillRect: jest.fn(),
      restore: jest.fn(),
    };
    canvas = document.createElement("canvas");
    canvas.width = 100;
    canvas.height = 100;
    canvas.getContext = () => mockCtx;
    engine = new DrawingEngine({ canvas });
  });

  it("should throw if state is not a Matrix", () => {
    expect(() =>
      engine.draw([
        [1, 2],
        [3, 4],
      ])
    ).toThrow();
  });

  it("should not throw for valid Matrix", () => {
    const matrix = new Matrix([
      ["A", "B"],
      ["B", "A"],
    ]);
    expect(() => engine.draw(matrix)).not.toThrow();
  });

  it("should call fillRect for each cell on first draw", () => {
    const matrix = new Matrix([
      ["A", "B"],
      ["B", "A"],
    ]);
    const ctx = engine.ctx;
    engine.draw(matrix);
    // 4 cells + 1 clearRect = 5 fillRect calls, but clearRect is separate
    expect(ctx.fillRect).toHaveBeenCalledTimes(4);
  });

  it("should only redraw changed cells on subsequent draws", () => {
    const matrix1 = new Matrix([
      ["A", "B"],
      ["B", "A"],
    ]);
    engine.draw(matrix1);
    engine.ctx.fillRect.mockClear();

    // Change one cell
    const matrix2 = new Matrix([
      ["A", "B"],
      ["B", "B"],
    ]);
    engine.draw(matrix2);
    // Only the changed cell should be redrawn
    expect(engine.ctx.fillRect).toHaveBeenCalledTimes(1);
  });
});
