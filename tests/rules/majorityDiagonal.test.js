import { MajorityDiagonal } from "../../rules/MajorityDiagonal.js";

describe("MajorityDiagonal Rule", () => {
  test("MajorityDiagonal.nextValue returns expected output for center cell", () => {
    const inputMatrix = [
      ["A", "A", "B"],
      ["A", "A", "A"],
      ["B", "A", "B"],
    ];
    const rule = new MajorityDiagonal({
      ordering: ["A", "B"],
      gridSize: 3,
      radius: 1,
    });

    const result = rule.nextValue(1, 1, inputMatrix);
    expect(result).toEqual("B");
  });
});
