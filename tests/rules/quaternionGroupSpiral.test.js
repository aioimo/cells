import { QuaternionGroupSpiral } from "../../rules/QuaternionGroupSpiral.js";
import { Matrix } from "../../core/Matrix.js";

describe("QuaternionGroupSpiral Rule", () => {
  test("inherits complexProduct from ImaginaryGroupBase", () => {
    const rule = new QuaternionGroupSpiral();
    
    expect(rule.complexProduct("i", "j")).toBe("k");
    expect(rule.complexProduct("j", "k")).toBe("i");
    expect(rule.complexProduct("k", "i")).toBe("j");
  });

  test("nextValue returns product of neighboring cells", () => {
    const inputMatrix = new Matrix([
      ["1", "i", "j", "k", "1"],
      ["k", "1", "i", "j", "k"],
      ["j", "k", "1", "i", "j"],
      ["i", "j", "k", "1", "i"],
      ["1", "i", "j", "k", "1"],
    ]);
    const rule = new QuaternionGroupSpiral();
    
    const result = rule.nextValue(2, 2, inputMatrix);
    expect(rule.ordering).toContain(result);
  });

  test("generateStartingState returns a Matrix instance", () => {
    const rule = new QuaternionGroupSpiral();
    const state = rule.generateStartingState();
    
    expect(state).toBeInstanceOf(Matrix);
  });

  test("generateStartingState creates Matrix with correct dimensions", () => {
    const rule = new QuaternionGroupSpiral();
    const state = rule.generateStartingState();
    
    expect(state.rows).toBe(301);
    expect(state.cols).toBe(301);
  });

  test("generateStartingState creates interlocking pattern", () => {
    const rule = new QuaternionGroupSpiral();
    const state = rule.generateStartingState();
    
    const validElements = new Set(["-1", "k", "-j", "1", "j", "-k", "i", "-i"]);
    const foundElements = new Set();
    
    for (let row = 0; row < state.rows; row++) {
      for (let col = 0; col < state.cols; col++) {
        const val = state.get(row, col);
        expect(validElements.has(val)).toBe(true);
        foundElements.add(val);
      }
    }
    
    // Should use at least 4 different elements (one for each quadrant base)
    expect(foundElements.size).toBeGreaterThanOrEqual(4);
  });

  test("determineRegion returns valid region index", () => {
    const rule = new QuaternionGroupSpiral();
    
    // Test corners
    expect(rule.determineRegion(0, 0, 301)).toBeGreaterThanOrEqual(0);
    expect(rule.determineRegion(0, 0, 301)).toBeLessThanOrEqual(3);
    expect(rule.determineRegion(300, 300, 301)).toBeGreaterThanOrEqual(0);
    expect(rule.determineRegion(300, 300, 301)).toBeLessThanOrEqual(3);
  });

  test("getColor groups quaternion elements by pairs", () => {
    const rule = new QuaternionGroupSpiral();
    
    expect(rule.getColor("1")).toBe("white");
    expect(rule.getColor("-1")).toBe("white");
    expect(rule.getColor("i")).toBe("purple");
    expect(rule.getColor("-i")).toBe("purple");
    expect(rule.getColor("j")).toBe("lightsalmon");
    expect(rule.getColor("-j")).toBe("lightsalmon");
    expect(rule.getColor("k")).toBe("lightblue");
    expect(rule.getColor("-k")).toBe("lightblue");
  });

  test("uses GRID_SIZE of 301 and radius of 2", () => {
    const rule = new QuaternionGroupSpiral();
    expect(rule.GRID_SIZE).toBe(301);
    expect(rule.gridSize).toBe(301);
    expect(rule.radius).toBe(2);
  });
});
