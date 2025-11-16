import { C4Group } from "../rules/C4Group.js";

describe("C4Group Rule", () => {
  test("C4Group.nextValue returns expected output for center cell", () => {
    const inputMatrix = [
      [1, 2, 3],
      [3, 1, 2],
      [2, 3, 0],
    ];
    const rule = new C4Group();
    const result = rule.nextValue(1, 1, inputMatrix);
    expect(result).toEqual(0);
  });
});
