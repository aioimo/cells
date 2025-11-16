import { QuaternionGroup } from "../../rules/QuaternionGroup.js";
import { Matrix } from "../../core/Matrix.js";

describe("QuaternionGroup Rule", () => {
  test("inherits complexProduct from ImaginaryGroupBase", () => {
    const rule = new QuaternionGroup();
    
    // Test quaternion multiplication
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
    const rule = new QuaternionGroup();
    
    const result = rule.nextValue(1, 1, inputMatrix);
    expect(rule.ordering).toContain(result);
  });

  test("generateStartingState returns a Matrix instance", () => {
    const rule = new QuaternionGroup();
    const state = rule.generateStartingState();
    
    expect(state).toBeInstanceOf(Matrix);
  });

  test("generateStartingState creates Matrix with correct dimensions", () => {
    const rule = new QuaternionGroup();
    const state = rule.generateStartingState();
    
    expect(state.rows).toBe(80);
    expect(state.cols).toBe(80);
  });

  test("generateStartingState creates 8-region pattern with valid quaternion elements", () => {
    const rule = new QuaternionGroup();
    const state = rule.generateStartingState();
    
    const validElements = new Set(["-1", "i", "-i", "1", "-j", "k", "-k", "j"]);
    const foundElements = new Set();
    
    for (let row = 0; row < state.rows; row++) {
      for (let col = 0; col < state.cols; col++) {
        const val = state.get(row, col);
        expect(validElements.has(val)).toBe(true);
        foundElements.add(val);
      }
    }
    
    // Should have multiple elements
    expect(foundElements.size).toBeGreaterThanOrEqual(3);
  });

  test("getColor returns distinct colors for quaternion elements", () => {
    const rule = new QuaternionGroup();
    
    expect(rule.getColor("1")).toBe("black");
    expect(rule.getColor("-1")).toBe("white");
    expect(rule.getColor("i")).toBe("orange");
    expect(rule.getColor("-i")).toBe("lightblue");
    expect(rule.getColor("j")).toBe("green");
    expect(rule.getColor("-j")).toBe("yellow");
    expect(rule.getColor("k")).toBe("red");
    expect(rule.getColor("-k")).toBe("grey");
  });

  test("uses GRID_SIZE of 80", () => {
    const rule = new QuaternionGroup();
    expect(rule.GRID_SIZE).toBe(80);
    expect(rule.gridSize).toBe(80);
  });
});
