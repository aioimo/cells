import { GeneticDriftLocalBattle } from "../../rules/GeneticDriftLocalBattle.js";
import { Matrix } from "../../core/Matrix.js";

describe("GeneticDriftLocalBattle Rule", () => {
  test("nextValue returns a valid color from ordering", () => {
    const inputMatrix = new Matrix([
      ["black", "orange", "white", "blue", "black"],
      ["orange", "white", "blue", "black", "orange"],
      ["white", "blue", "black", "orange", "white"],
      ["blue", "black", "orange", "white", "blue"],
      ["black", "orange", "white", "blue", "black"],
    ]);
    const rule = new GeneticDriftLocalBattle();
    
    // Run multiple times due to stochastic nature
    for (let i = 0; i < 10; i++) {
      const result = rule.nextValue(2, 2, inputMatrix);
      expect(rule.ordering).toContain(result);
    }
  });

  test("generateStartingState returns a Matrix instance", () => {
    const rule = new GeneticDriftLocalBattle();
    const state = rule.generateStartingState();
    
    expect(state).toBeInstanceOf(Matrix);
  });

  test("generateStartingState creates Matrix with correct dimensions", () => {
    const rule = new GeneticDriftLocalBattle();
    const state = rule.generateStartingState();
    
    expect(state.rows).toBe(100);
    expect(state.cols).toBe(100);
  });

  test("generateStartingState uses valid colors from ordering", () => {
    const rule = new GeneticDriftLocalBattle();
    const state = rule.generateStartingState();
    
    const validColors = new Set(rule.ordering);
    
    for (let row = 0; row < state.rows; row++) {
      for (let col = 0; col < state.cols; col++) {
        const val = state.get(row, col);
        expect(validColors.has(val)).toBe(true);
      }
    }
  });

  test("neighbors counts work with Matrix", () => {
    const rule = new GeneticDriftLocalBattle();
    const inputMatrix = new Matrix([
      ["black", "black", "black", "black", "black"],
      ["black", "black", "black", "black", "black"],
      ["black", "black", "white", "black", "black"],
      ["black", "black", "black", "black", "black"],
      ["black", "black", "black", "black", "black"],
    ]);
    
    // Center is at (2,2), radius is 2, so it counts a 5x5 grid minus center
    const counts = rule.neighbors(2, 2, inputMatrix);
    
    expect(counts.black).toBe(24); // 5x5 = 25 cells, minus 1 center = 24
    expect(counts.white).toBeUndefined();
  });

  test("constructor accepts majorityBias parameter", () => {
    const rule = new GeneticDriftLocalBattle({ majorityBias: 2.0 });
    
    expect(rule.majorityBias).toBe(2.0);
  });
});
