import jest from "jest-mock";

import { DrawingEngine } from "../drawing/DrawingEngine.js";
import { Matrix } from "../core/Matrix.js";

describe("DrawingEngine", () => {
  let canvas, engine;

  beforeEach(() => {
    canvas = document.createElement("canvas");
    canvas.width = 100;
    canvas.height = 100;
    // Mock getContext to return an object with needed methods
    canvas.getContext = () => ({
      save: jest.fn(),
      clearRect: jest.fn(),
      fillStyle: "",
      translate: jest.fn(),
      fillRect: jest.fn(),
      restore: jest.fn(),
    });
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

  it("should call drawSquare for each cell", () => {
    const matrix = new Matrix([
      ["A", "B"],
      ["B", "A"],
    ]);
    const spy = jest.spyOn(engine, "drawSquare");
    engine.draw(matrix);
    expect(spy).toHaveBeenCalledTimes(4);
    spy.mockRestore();
  });
});
