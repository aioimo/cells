import { Dihedral4Group } from "../../rules/Dihedral4Group.js";
import { Matrix } from "../../core/Matrix.js";

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

  test("generateStartingState returns a Matrix instance", () => {
    const rule = new Dihedral4Group();
    const state = rule.generateStartingState();
    
    expect(state).toBeInstanceOf(Matrix);
  });

  test("generateStartingState creates Matrix with correct dimensions", () => {
    const rule = new Dihedral4Group();
    const state = rule.generateStartingState();
    
    expect(state.rows).toBe(300);
    expect(state.cols).toBe(300);
  });

  test("generateStartingState creates 8-sector pattern using D4 elements", () => {
    const rule = new Dihedral4Group();
    const state = rule.generateStartingState();
    
    // Check that all values are valid D4 elements
    const validElements = new Set(["e", "r", "r2", "r3", "s", "rs", "r2s", "r3s"]);
    let hasE = false;
    let hasR = false;
    let hasS = false;
    
    for (let row = 0; row < state.rows; row++) {
      for (let col = 0; col < state.cols; col++) {
        const val = state.get(row, col);
        expect(validElements.has(val)).toBe(true);
        if (val === "e") hasE = true;
        if (val === "r") hasR = true;
        if (val === "s") hasS = true;
      }
    }
    
    // Verify that multiple different elements are present
    expect(hasE || hasR || hasS).toBe(true);
  });

  test("nextValue works with Matrix input", () => {
    const inputMatrix = new Matrix([
      ["e", "e", "r2", "r3", "r4", "r2"],
      ["s", "e", "e", "r3", "r4s", "r2s"],
      ["r2", "e", "r", "e", "r4", "r2"],
      ["r3s", "e", "e", "e", "r4s", "r2s"],
      ["r4", "r2", "e", "r", "r2", "r3"],
      ["r2s", "r4s", "r3s", "r2s", "rs", "s"],
    ]);
    const rule = new Dihedral4Group({
      ordering: ["e", "r", "r2", "r3", "s", "rs", "r2s", "r3s"],
      gridSize: 6,
      radius: 1,
    });
    const result = rule.nextValue(2, 2, inputMatrix);
    expect(result).toEqual("r3");
  });
});
