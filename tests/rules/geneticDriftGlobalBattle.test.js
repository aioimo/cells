import { GeneticDriftGlobalBattle } from "../../rules/GeneticDriftGlobalBattle.js";
import { Matrix } from "../../core/Matrix.js";

describe("GeneticDriftGlobalBattle Rule", () => {
  test("nextValue returns a valid color from ordering", () => {
    const inputMatrix = new Matrix([
      ["black", "orange", "white", "blue", "black"],
      ["orange", "white", "blue", "black", "orange"],
      ["white", "blue", "black", "orange", "white"],
      ["blue", "black", "orange", "white", "blue"],
      ["black", "orange", "white", "blue", "black"],
    ]);
    const rule = new GeneticDriftGlobalBattle();
    
    // Run multiple times due to stochastic nature
    for (let i = 0; i < 10; i++) {
      const result = rule.nextValue(2, 2, inputMatrix);
      expect(rule.ordering).toContain(result);
    }
  });

  test("generateStartingState returns a Matrix instance", () => {
    const rule = new GeneticDriftGlobalBattle();
    const state = rule.generateStartingState();
    
    expect(state).toBeInstanceOf(Matrix);
  });

  test("generateStartingState creates Matrix with correct dimensions", () => {
    const rule = new GeneticDriftGlobalBattle();
    const state = rule.generateStartingState();
    
    expect(state.rows).toBe(500);
    expect(state.cols).toBe(500);
  });

  test("generateStartingState uses valid colors from ordering", () => {
    const rule = new GeneticDriftGlobalBattle();
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
    const rule = new GeneticDriftGlobalBattle();
    const inputMatrix = new Matrix([
      ["black", "orange", "white"],
      ["blue", "black", "orange"],
      ["white", "blue", "black"],
    ]);
    
    const counts = rule.getGlobalCounts(inputMatrix);
    
    expect(counts.black).toBe(3);
    expect(counts.orange).toBe(2);
    expect(counts.white).toBe(2);
    expect(counts.blue).toBe(2);
  });

  test("countAll works with Matrix", () => {
    const rule = new GeneticDriftGlobalBattle();
    const inputMatrix = new Matrix([
      ["black", "black"],
      ["white", "white"],
    ]);
    
    const counts = rule.countAll(inputMatrix);
    
    expect(counts.black).toBe(2);
    expect(counts.white).toBe(2);
  });
});
