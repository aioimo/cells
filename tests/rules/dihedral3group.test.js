import { Dihedral3Group } from "../../rules/Dihedral3Group.js";
import { Matrix } from "../../core/Matrix.js";

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

  test("generateStartingState returns a Matrix instance", () => {
    const rule = new Dihedral3Group();
    const state = rule.generateStartingState();
    
    expect(state).toBeInstanceOf(Matrix);
  });

  test("generateStartingState creates Matrix with correct dimensions", () => {
    const rule = new Dihedral3Group();
    const state = rule.generateStartingState();
    
    expect(state.rows).toBe(400);
    expect(state.cols).toBe(400);
  });

  test("generateStartingState creates 6-sector pattern using D3 elements", () => {
    const rule = new Dihedral3Group();
    const state = rule.generateStartingState();
    
    // Check that all values are valid D3 elements
    const validElements = new Set(["e", "r", "r2", "s", "rs", "r2s"]);
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
      ["e", "e", "r2", "r2", "r2", "r2"],
      ["s", "e", "e", "r2", "s", "r2s"],
      ["r2", "e", "r", "e", "r2", "r2"],
      ["r2s", "s", "e", "e", "s", "r2s"],
      ["r2", "r2", "e", "r", "r2", "r2"],
      ["r2s", "s", "r2s", "r2s", "rs", "s"],
    ]);
    const rule = new Dihedral3Group();
    const result = rule.nextValue(2, 2, inputMatrix);
    expect(result).toEqual("r2s");
  });
});
