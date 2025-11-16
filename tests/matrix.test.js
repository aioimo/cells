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

  describe("Matrix clone", () => {
    it("should create an identical but separate Matrix", () => {
      const m1 = new Matrix([
        [1, 2],
        [3, 4],
      ]);
      const m2 = m1.clone();
      expect(m2).not.toBe(m1);
      expect(m2.rows).toBe(2);
      expect(m2.cols).toBe(2);
      expect(m2.data).toEqual([1, 2, 3, 4]);
      // Changing m2 should not affect m1
      m2.set(0, 0, 99);
      expect(m1.get(0, 0)).toBe(1);
      expect(m2.get(0, 0)).toBe(99);
    });
  });

  describe("Matrix equals", () => {
    it("should return true for identical matrices", () => {
      const m1 = new Matrix([
        [1, 2],
        [3, 4],
      ]);
      const m2 = new Matrix([
        [1, 2],
        [3, 4],
      ]);
      expect(m1.equals(m2)).toBe(true);
      expect(m2.equals(m1)).toBe(true);
    });
    it("should return false for different matrices", () => {
      const m1 = new Matrix([
        [1, 2],
        [3, 4],
      ]);
      const m2 = new Matrix([
        [1, 2],
        [3, 5],
      ]);
      expect(m1.equals(m2)).toBe(false);
      expect(m2.equals(m1)).toBe(false);
    });
    it("should return false for different dimensions", () => {
      const m1 = new Matrix([
        [1, 2],
        [3, 4],
      ]);
      const m2 = new Matrix([
        [1, 2, 3],
        [4, 5, 6],
      ]);
      expect(m1.equals(m2)).toBe(false);
      expect(m2.equals(m1)).toBe(false);
    });
  });
});
