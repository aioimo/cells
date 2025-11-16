import { RPS } from "../../rules/RPS.js";
import { Matrix } from "../../core/Matrix.js";

describe("RPS Rule", () => {
  test("RPS.nextValue returns expected output for center cell", () => {
    const inputMatrix = [
      ["A", "B", "C"],
      ["C", "A", "B"],
      ["B", "C", "A"],
    ];
    const rule = new RPS({ ordering: ["A", "B", "C"], gridSize: 3, radius: 1 });
    const matrix = new Matrix(inputMatrix);
    const result = rule.nextValue(1, 1, matrix);
    expect(result).toEqual("B");
  });
});
