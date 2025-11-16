import { Dihedral4Group } from "../rules/Dihedral4Group.js";

describe("Dihedral4Group Rule", () => {
  test("Dihedral4Group.nextValue returns product of neighbouring cells, ignoring self", () => {
    const inputMatrix = [
      ["e", "e", "r2", "r3", "r4", "r2"],
      ["s", "e", "e", "r3", "r4s", "r2s"],
      ["r2", "e", "r", "e", "r4", "r2"],
      ["r3s", "e", "e", "e", "r4s", "r2s"],
      ["r4", "r2", "e", "r", "r2", "r3"],
      ["r2s", "r4s", "r3s", "r2s", "rs", "s"],
    ];
    const rule = new Dihedral4Group({
      ordering: ["e", "r", "r2", "r3", "s", "rs", "r2s", "r3s"],
      gridSize: 6,
      radius: 1,
    });
    const result = rule.nextValue(2, 2, inputMatrix);
    expect("r3").toEqual(result);
  });
});
