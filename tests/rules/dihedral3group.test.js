import { Dihedral3Group } from "../../rules/Dihedral3Group.js";

describe("Dihedral3Group Rule", () => {
  test("Dihedral3Group.nextValue returns product of neighbouring cells, ignoring self", () => {
    const inputMatrix = [
      ["e", "e", "r2", "r2", "r2", "r2"],
      ["s", "e", "e", "r2", "s", "r2s"],
      ["r2", "e", "r", "e", "r2", "r2"],
      ["r2s", "s", "e", "e", "s", "r2s"],
      ["r2", "r2", "e", "r", "r2", "r2"],
      ["r2s", "s", "r2s", "r2s", "rs", "s"],
    ];
    const rule = new Dihedral3Group();
    const result = rule.nextValue(2, 2, inputMatrix);
    expect("r2s").toEqual(result);
  });
});
