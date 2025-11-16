import { MajorityStickyBorders } from "../../rules/MajorityStickyBorders.js";
import { Matrix } from "../../core/Matrix.js";

describe("MajorityStickyBorders Rule", () => {
  test("MajorityStickyBorders.nextValue overturns current cell when surrounded by significant majority different value", () => {
    const inputMatrix = new Matrix([
      ["B", "A", "A", "A", "A", "A", "A"],
      ["B", "B", "A", "A", "A", "A", "A"],
      ["B", "B", "B", "B", "A", "A", "A"],
      ["B", "B", "B", "A", "A", "B", "A"],
      ["B", "B", "B", "B", "B", "B", "A"],
      ["B", "B", "B", "B", "B", "B", "A"],
      ["B", "B", "B", "B", "B", "B", "B"],
    ]);
    const rule = new MajorityStickyBorders();
    const result = rule.nextValue(3, 3, inputMatrix);
    expect(result).toEqual("B");
  });

  test("MajorityStickyBorders.nextValue lead value prevents simple majority overturn", () => {
    const inputMatrix = new Matrix([
      ["B", "A", "A", "A", "A", "A", "A"],
      ["B", "B", "A", "A", "A", "A", "A"],
      ["B", "B", "B", "B", "A", "A", "A"],
      ["B", "B", "B", "A", "A", "B", "A"],
      ["B", "B", "B", "B", "B", "B", "A"],
      ["B", "B", "B", "B", "B", "B", "A"],
      ["B", "B", "B", "B", "B", "B", "A"],
    ]);
    const rule = new MajorityStickyBorders();
    const result = rule.nextValue(3, 3, inputMatrix);
    expect(result).toBeNull();
  });
});
