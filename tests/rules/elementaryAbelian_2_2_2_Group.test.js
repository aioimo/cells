import { ElementaryAbelian_2_2_2_Group } from "../../rules/ElementaryAbelian_2_2_2_Group.js";
import { Matrix } from "../../core/Matrix.js";

describe("ElementaryAbelian_2_2_2_Group Rule", () => {
  test("nextValue computes XOR of neighboring cells", () => {
    const inputMatrix = [
      [0, 1, 2, 3, 4, 5],
      [1, 2, 3, 4, 5, 6],
      [2, 3, 0, 1, 6, 7],
      [3, 4, 1, 2, 7, 0],
      [4, 5, 2, 3, 0, 1],
      [5, 6, 3, 4, 1, 2],
    ];
    const rule = new ElementaryAbelian_2_2_2_Group();
    const result = rule.nextValue(2, 2, inputMatrix);
    
    // Neighbors at (2,2): positions (1,1), (1,2), (1,3), (2,1), (2,3), (3,1), (3,2), (3,3)
    // Values: 2, 3, 4, 3, 1, 4, 1, 2
    // XOR: 2 ^ 3 ^ 4 ^ 3 ^ 1 ^ 4 ^ 1 ^ 2 = 0
    expect(result).toBe(0);
  });

  test("generateStartingState returns a Matrix instance", () => {
    const rule = new ElementaryAbelian_2_2_2_Group();
    const state = rule.generateStartingState();
    
    expect(state).toBeInstanceOf(Matrix);
  });

  test("generateStartingState creates Matrix with correct dimensions", () => {
    const rule = new ElementaryAbelian_2_2_2_Group();
    const state = rule.generateStartingState();
    
    expect(state.rows).toBe(300);
    expect(state.cols).toBe(300);
  });

  test("generateStartingState creates 8-sector pattern with valid elements", () => {
    const rule = new ElementaryAbelian_2_2_2_Group();
    const state = rule.generateStartingState();
    
    // Check that all values are in range 0-7
    const validElements = new Set([0, 1, 2, 3, 4, 5, 6, 7]);
    const foundElements = new Set();
    
    for (let row = 0; row < state.rows; row++) {
      for (let col = 0; col < state.cols; col++) {
        const val = state.get(row, col);
        expect(validElements.has(val)).toBe(true);
        foundElements.add(val);
      }
    }
    
    // Verify that multiple different elements are present (at least 3)
    expect(foundElements.size).toBeGreaterThanOrEqual(3);
  });

  test("add method performs XOR operation", () => {
    const rule = new ElementaryAbelian_2_2_2_Group();
    
    expect(rule.add(0, 0)).toBe(0);
    expect(rule.add(1, 1)).toBe(0);
    expect(rule.add(3, 5)).toBe(6);
    expect(rule.add(7, 3)).toBe(4);
  });

  test("nextValue works with Matrix input", () => {
    const inputMatrix = new Matrix([
      [0, 1, 2, 3, 4, 5],
      [1, 2, 3, 4, 5, 6],
      [2, 3, 0, 1, 6, 7],
      [3, 4, 1, 2, 7, 0],
      [4, 5, 2, 3, 0, 1],
      [5, 6, 3, 4, 1, 2],
    ]);
    const rule = new ElementaryAbelian_2_2_2_Group();
    const result = rule.nextValue(2, 2, inputMatrix);
    
    expect(typeof result).toBe("number");
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(7);
  });
});
