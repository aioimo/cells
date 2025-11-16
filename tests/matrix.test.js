import { Matrix } from "../core/Matrix.js";

describe("Matrix initialisation", () => {
  it("should flatten nested arrays and infer dimensions", () => {
    const m = new Matrix([
      [1, 2],
      [3, 4],
    ]);
    expect(m.rows).toBe(2);
    expect(m.cols).toBe(2);
    expect(m.data).toEqual([1, 2, 3, 4]);
  });
});

describe("Matrix get", () => {
  it("should return correct value for given row and col", () => {
    const m = new Matrix([
      [1, 2],
      [3, 4],
    ]);
    expect(m.get(0, 0)).toBe(1);
    expect(m.get(1, 1)).toBe(4);
  });
  it("should throw if getting out of bounds", () => {
    const m = new Matrix([
      [1, 2],
      [3, 4],
    ]);
    expect(() => m.get(-1, 0)).toThrow(RangeError);
    expect(() => m.get(2, 0)).toThrow(RangeError);
    expect(() => m.get(0, 2)).toThrow(RangeError);
  });
});

describe("Matrix set", () => {
  it("should set value at given row and col", () => {
    const m = new Matrix([
      [1, 2],
      [3, 4],
    ]);
    m.set(0, 1, 9);
    expect(m.get(0, 1)).toBe(9);
    expect(m.data).toEqual([1, 9, 3, 4]);
  });
  it("should throw if setting out of bounds", () => {
    const m = new Matrix([
      [1, 2],
      [3, 4],
    ]);
    expect(() => m.set(-1, 0, 5)).toThrow(RangeError);
    expect(() => m.set(2, 0, 5)).toThrow(RangeError);
    expect(() => m.set(0, 2, 5)).toThrow(RangeError);
  });
});
