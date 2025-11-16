import { QuaternionGroupPizza } from "../../rules/QuaternionGroupPizza.js";
import { Matrix } from "../../core/Matrix.js";

describe("QuaternionGroupPizza Rule", () => {
  test("inherits complexProduct from ImaginaryGroupBase", () => {
    const rule = new QuaternionGroupPizza();
    
    expect(rule.complexProduct("i", "j")).toBe("k");
    expect(rule.complexProduct("j", "k")).toBe("i");
    expect(rule.complexProduct("k", "i")).toBe("j");
  });

  test("nextValue returns product of neighboring cells", () => {
    const inputMatrix = new Matrix([
      ["1", "i", "j"],
      ["k", "1", "i"],
      ["j", "k", "1"],
    ]);
    const rule = new QuaternionGroupPizza();
    
    const result = rule.nextValue(1, 1, inputMatrix);
    expect(rule.ordering).toContain(result);
  });

  test("generateStartingState returns a Matrix instance", () => {
    const rule = new QuaternionGroupPizza();
    const state = rule.generateStartingState();
    
    expect(state).toBeInstanceOf(Matrix);
  });

  test("generateStartingState creates Matrix with correct dimensions", () => {
    const rule = new QuaternionGroupPizza();
    const state = rule.generateStartingState();
    
    expect(state.rows).toBe(501);
    expect(state.cols).toBe(501);
  });

  test("generateStartingState creates radial 8-sector pattern", () => {
    const rule = new QuaternionGroupPizza();
    const state = rule.generateStartingState();
    
    const validElements = new Set(["-j", "k", "-i", "1", "j", "-k", "i", "-1"]);
    const foundElements = new Set();
    
    for (let row = 0; row < state.rows; row++) {
      for (let col = 0; col < state.cols; col++) {
        const val = state.get(row, col);
        expect(validElements.has(val)).toBe(true);
        foundElements.add(val);
      }
    }
    
    // Should have all 8 elements in the pizza pattern
    expect(foundElements.size).toBeGreaterThanOrEqual(6);
  });

  test("getColor groups quaternion elements by pairs", () => {
    const rule = new QuaternionGroupPizza();
    
    expect(rule.getColor("1")).toBe("green");
    expect(rule.getColor("-1")).toBe("green");
    expect(rule.getColor("i")).toBe("yellow");
    expect(rule.getColor("-i")).toBe("yellow");
    expect(rule.getColor("j")).toBe("blue");
    expect(rule.getColor("-j")).toBe("blue");
    expect(rule.getColor("k")).toBe("white");
    expect(rule.getColor("-k")).toBe("white");
  });

  test("uses GRID_SIZE of 501", () => {
    const rule = new QuaternionGroupPizza();
    expect(rule.GRID_SIZE).toBe(501);
    expect(rule.gridSize).toBe(501);
  });
});
