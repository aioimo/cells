import { Dihedral6Group } from "../rules/Dihedral6Group.js";

describe("Dihedral6Group Rule", () => {
  test("Dihedral6Group.nextValue returns product of neighbouring cells, ignoring self", () => {
    const inputMatrix = [
      ["e", "e", "r2", "r3", "r4", "r5"],
      ["s", "e", "e", "e", "r4s", "r5s"],
      ["r2", "e", "r", "e", "r4", "r5"],
      ["r3s", "e", "e", "e", "r4s", "r5s"],
      ["r4", "r5", "e", "r", "r2", "r3"],
      ["r5s", "r4s", "r3s", "r2s", "rs", "s"],
    ];
    const rule = new Dihedral6Group({
      ordering: [
        "e",
        "r",
        "r2",
        "r3",
        "r4",
        "r5",
        "s",
        "rs",
        "r2s",
        "r3s",
        "r4s",
        "r5s",
      ],
      gridSize: 6,
      radius: 1,
    });
    const result = rule.nextValue(2, 2, inputMatrix);
    expect("e").toEqual(result);
  });
});
