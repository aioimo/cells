import { ImaginaryGroupSingle } from "../../rules/ImaginaryGroupSingle.js";
import { Matrix } from "../../core/Matrix.js";

describe("ImaginaryGroupSingle Rule", () => {
  test("inherits complexProduct from ImaginaryGroupBase", () => {
    const rule = new ImaginaryGroupSingle({
      ordering: ["-1", "i", "-i", "1"],
      gridSize: 199,
    });
    expect(rule.complexProduct("i", "i")).toBe("-1");
    expect(rule.complexProduct("i", "-i")).toBe("1");
  });

  test("getColor returns distinct colors from ImaginaryGroupBase", () => {
    const rule = new ImaginaryGroupSingle({
      ordering: ["-1", "i", "-i", "1"],
      gridSize: 199,
    });
    expect(rule.getColor("1")).toBe("black");
    expect(rule.getColor("-1")).toBe("white");
    expect(rule.getColor("i")).toBe("orange");
    expect(rule.getColor("-i")).toBe("purple");
  });

  test("generateStartingState creates Matrix with correct dimensions", () => {
    const rule = new ImaginaryGroupSingle({
      ordering: ["-1", "i", "-i", "1"],
      gridSize: 199,
    });
    const state = rule.generateStartingState();
    
    expect(state).toBeInstanceOf(Matrix);
    expect(state.rows).toBe(199);
    expect(state.cols).toBe(199);
  });

  test("generateStartingState places single 'i' at center", () => {
    const rule = new ImaginaryGroupSingle({
      ordering: ["-1", "i", "-i", "1"],
      gridSize: 199,
    });
    const state = rule.generateStartingState();
    const center = Math.floor(199 / 2);
    
    expect(state.get(center, center)).toBe("i");
  });

  test("generateStartingState fills most cells with '-1' based on weights", () => {
    const rule = new ImaginaryGroupSingle({
      ordering: ["-1", "i", "-i", "1"],
      gridSize: 199,
    });
    const state = rule.generateStartingState();
    
    let countMinusOnes = 0;
    let countOther = 0;
    const center = Math.floor(199 / 2);
    
    for (let row = 0; row < state.rows; row++) {
      for (let col = 0; col < state.cols; col++) {
        const val = state.get(row, col);
        if (row === center && col === center) {
          expect(val).toBe("i");
        } else if (val === "-1") {
          countMinusOnes++;
        } else {
          countOther++;
        }
      }
    }
    
    // With weights [1, 0, 0, 0] mapping to ordering ["-1", "i", "-i", "1"]
    // All non-center cells should be "-1"
    // Total cells = 199*199 = 39601, minus 1 center = 39600
    expect(countMinusOnes).toBe(39600);
    expect(countOther).toBe(0);
  });

  test("nextValue computes product correctly with mostly '1' neighbors", () => {
    const rule = new ImaginaryGroupSingle({
      ordering: ["-1", "i", "-i", "1"],
      gridSize: 5,
      radius: 1,
    });
    
    const inputMatrix = new Matrix([
      ["1", "1", "1", "1", "1"],
      ["1", "1", "1", "1", "1"],
      ["1", "1", "i", "1", "1"],
      ["1", "1", "1", "1", "1"],
      ["1", "1", "1", "1", "1"],
    ]);
    
    // Center cell (2,2) is "i", all 8 neighbors are "1"
    // Product: 1 * 1 * 1 * 1 * 1 * 1 * 1 * 1 = 1
    const result = rule.nextValue(2, 2, inputMatrix);
    expect(result).toBe("1");
  });

  test("uses default GRID_SIZE of 199", () => {
    const rule = new ImaginaryGroupSingle({
      ordering: ["-1", "i", "-i", "1"],
    });
    
    expect(rule.GRID_SIZE).toBe(199);
  });

  test("createInitialState returns Matrix instance", () => {
    const rule = new ImaginaryGroupSingle({
      ordering: ["-1", "i", "-i", "1"],
      gridSize: 199,
    });
    
    const state = rule.createInitialState();
    expect(state).toBeInstanceOf(Matrix);
    expect(state.rows).toBe(199);
    expect(state.cols).toBe(199);
  });
});
