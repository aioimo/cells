import { GeneticDrift } from "../../rules/GeneticDrift.js";
import { Matrix } from "../../core/Matrix.js";

describe("GeneticDrift Rule", () => {
  test("nextValue returns a valid color from ordering", () => {
    const inputMatrix = new Matrix([
      ["green", "black", "white"],
      ["orange", "blue", "green"],
      ["white", "black", "orange"],
    ]);
    const rule = new GeneticDrift();
    
    // Run multiple times due to stochastic nature
    for (let i = 0; i < 10; i++) {
      const result = rule.nextValue(1, 1, inputMatrix);
      expect(rule.ordering).toContain(result);
    }
  });

  test("generateStartingState returns a Matrix instance", () => {
    const rule = new GeneticDrift();
    const state = rule.generateStartingState();
    
    expect(state).toBeInstanceOf(Matrix);
  });

  test("generateStartingState creates Matrix with correct dimensions", () => {
    const rule = new GeneticDrift();
    const state = rule.generateStartingState();
    
    expect(state.rows).toBe(100);
    expect(state.cols).toBe(100);
  });

  test("generateStartingState uses valid colors from ordering", () => {
    const rule = new GeneticDrift();
    const state = rule.generateStartingState();
    
    const validColors = new Set(rule.ordering);
    
    for (let row = 0; row < state.rows; row++) {
      for (let col = 0; col < state.cols; col++) {
        const val = state.get(row, col);
        expect(validColors.has(val)).toBe(true);
      }
    }
  });

  test("getGlobalCounts works with Matrix", () => {
    const rule = new GeneticDrift();
    const inputMatrix = new Matrix([
      ["green", "black", "white"],
      ["green", "black", "white"],
      ["green", "black", "white"],
    ]);
    
    const counts = rule.getGlobalCounts(inputMatrix);
    
    expect(counts.green).toBe(3);
    expect(counts.black).toBe(3);
    expect(counts.white).toBe(3);
  });

  test("getGlobalCounts caches results", () => {
    const rule = new GeneticDrift();
    const inputMatrix = new Matrix([
      ["green", "black"],
      ["white", "orange"],
    ]);
    
    const counts1 = rule.getGlobalCounts(inputMatrix);
    const counts2 = rule.getGlobalCounts(inputMatrix);
    
    // Should return the same cached object
    expect(counts1).toBe(counts2);
  });
});
