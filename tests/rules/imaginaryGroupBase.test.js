import { ImaginaryGroupBase } from "../../rules/ImaginaryGroupBase.js";

describe("ImaginaryGroupBase Rule", () => {
  test("complexProduct computes i * i = -1", () => {
    const rule = new ImaginaryGroupBase({
      ordering: ["-1", "i", "-i", "1"],
      gridSize: 10,
    });
    expect(rule.complexProduct("i", "i")).toBe("-1");
  });

  test("complexProduct computes i * -i = 1", () => {
    const rule = new ImaginaryGroupBase({
      ordering: ["-1", "i", "-i", "1"],
      gridSize: 10,
    });
    expect(rule.complexProduct("i", "-i")).toBe("1");
  });

  test("complexProduct computes -1 * -1 = 1", () => {
    const rule = new ImaginaryGroupBase({
      ordering: ["-1", "i", "-i", "1"],
      gridSize: 10,
    });
    expect(rule.complexProduct("-1", "-1")).toBe("1");
  });

  test("complexProduct computes 1 * i = i", () => {
    const rule = new ImaginaryGroupBase({
      ordering: ["-1", "i", "-i", "1"],
      gridSize: 10,
    });
    expect(rule.complexProduct("1", "i")).toBe("i");
  });

  test("complexProduct handles quaternion j * k = i", () => {
    const rule = new ImaginaryGroupBase({
      ordering: ["-1", "i", "-i", "1"],
      gridSize: 10,
    });
    expect(rule.complexProduct("j", "k")).toBe("i");
  });

  test("complexProduct handles quaternion k * j = -i", () => {
    const rule = new ImaginaryGroupBase({
      ordering: ["-1", "i", "-i", "1"],
      gridSize: 10,
    });
    expect(rule.complexProduct("k", "j")).toBe("-i");
  });

  test("nextValue returns product of neighboring cells, ignoring self", () => {
    const inputMatrix = [
      ["1", "1", "1"],
      ["1", "i", "1"],
      ["1", "1", "1"],
    ];
    const rule = new ImaginaryGroupBase({
      ordering: ["-1", "i", "-i", "1"],
      gridSize: 3,
      radius: 1,
    });
    // Center cell (1,1) is "i" but should be ignored
    // All 8 neighbors are "1"
    // Product: 1 * 1 * 1 * 1 * 1 * 1 * 1 * 1 = 1
    const result = rule.nextValue(1, 1, inputMatrix);
    expect(result).toBe("1");
  });

  test("getColor returns correct colors for each value", () => {
    const rule = new ImaginaryGroupBase({
      ordering: ["-1", "i", "-i", "1"],
      gridSize: 10,
    });
    expect(rule.getColor("1")).toBe("black");
    expect(rule.getColor("-1")).toBe("white");
    expect(rule.getColor("i")).toBe("red");
    expect(rule.getColor("-i")).toBe("lightblue");
  });

  test("generateStartingState creates quadrant pattern", () => {
    const rule = new ImaginaryGroupBase({
      ordering: ["-1", "i", "-i", "1"],
      gridSize: 100, // Use default grid size
    });
    const state = rule.generateStartingState();
    const half = Math.floor(100 / 2);

    // Top-left quadrant should be "i"
    expect(state[0][0]).toBe("i");
    expect(state[half - 1][half - 1]).toBe("i");

    // Top-right quadrant should be "1"
    expect(state[0][half]).toBe("1");
    expect(state[half - 1][99]).toBe("1");

    // Bottom-left quadrant should be "-i"
    expect(state[half][0]).toBe("-i");
    expect(state[99][half - 1]).toBe("-i");

    // Bottom-right quadrant should be "-1"
    expect(state[half][half]).toBe("-1");
    expect(state[99][99]).toBe("-1");
  });

  test("repeatKeysByValues expands object to array", () => {
    const rule = new ImaginaryGroupBase({
      ordering: ["-1", "i", "-i", "1"],
      gridSize: 10,
    });
    const result = rule.repeatKeysByValues({ a: 2, b: 3, c: 1 });
    expect(result).toEqual(["a", "a", "b", "b", "b", "c"]);
  });
});
