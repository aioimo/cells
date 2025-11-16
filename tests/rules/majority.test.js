import { Majority } from "../../rules/Majority.js";

describe("Majority Rule", () => {
  test("Majority.nextValue overturns current cell when surrounded by significant majority different value", () => {
    const inputMatrix = [
      ["B", "A", "A", "A", "A", "A", "A"],
      ["B", "B", "A", "A", "A", "A", "A"],
      ["B", "B", "B", "B", "A", "A", "A"],
      ["B", "B", "B", "A", "A", "B", "A"],
      ["B", "B", "B", "B", "B", "B", "A"],
      ["B", "B", "B", "B", "B", "B", "A"],
      ["B", "B", "B", "B", "B", "B", "B"],
    ];
    const rule = new Majority({ radius: 1 });
    const result = rule.nextValue(3, 3, inputMatrix);
    expect(result).toEqual("B");
  });

  test("Majority.nextValue lead value prevents simple majority overturn", () => {
    const inputMatrix = [
      ["A", "A", "A", "A", "A", "A", "A"],
      ["A", "A", "A", "A", "A", "A", "A"],
      ["A", "A", "B", "B", "A", "A", "A"],
      ["A", "A", "B", "C", "A", "A", "A"],
      ["A", "A", "B", "B", "B", "A", "A"],
      ["A", "A", "B", "B", "B", "A", "A"],
      ["A", "A", "B", "A", "A", "A", "A"],
    ];
    const rule = new Majority({ radius: 3 });
    const result = rule.nextValue(3, 3, inputMatrix);
    expect(result).toEqual("A");
  });
});
