import { C4Group } from "../../rules/C4Group.js";
import { Matrix } from "../../core/Matrix.js";

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

  test("generateStartingState returns a Matrix instance", () => {
    const rule = new C4Group();
    const state = rule.generateStartingState();
    
    expect(state).toBeInstanceOf(Matrix);
  });

  test("generateStartingState creates Matrix with correct dimensions", () => {
    const rule = new C4Group();
    const state = rule.generateStartingState();
    
    expect(state.rows).toBe(300);
    expect(state.cols).toBe(300);
  });

  test("generateStartingState creates ring pattern with C4 elements", () => {
    const rule = new C4Group();
    const state = rule.generateStartingState();
    
    // Check that all values are in C4 (0,1,2,3)
    const validElements = new Set([0, 1, 2, 3]);
    let hasZero = false;
    let hasOne = false;
    
    for (let row = 0; row < state.rows; row++) {
      for (let col = 0; col < state.cols; col++) {
        const val = state.get(row, col);
        expect(validElements.has(val)).toBe(true);
        if (val === 0) hasZero = true;
        if (val === 1) hasOne = true;
      }
    }
    
    // Should have both 0 (background) and 1 (ring)
    expect(hasZero).toBe(true);
    expect(hasOne).toBe(true);
  });

  test("nextValue works with Matrix input", () => {
    const inputMatrix = new Matrix([
      [1, 2, 3],
      [3, 1, 2],
      [2, 3, 0],
    ]);
    const rule = new C4Group();
    const result = rule.nextValue(1, 1, inputMatrix);
    
    expect(result).toEqual(0);
  });

  test("getColor returns correct colors for C4 elements", () => {
    const rule = new C4Group();
    
    expect(rule.getColor(0)).toBe("red");
    expect(rule.getColor(1)).toBe("black");
    expect(rule.getColor(2)).toBe("white");
    expect(rule.getColor(3)).toBe("yellow");
  });

  test("uses gridSize of 300 and radius of 1", () => {
    const rule = new C4Group();
    expect(rule.gridSize).toBe(300);
    expect(rule.radius).toBe(1);
  });
});
