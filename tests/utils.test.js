import { emptyMatrix, mod, random, areMatricesEqual } from "../utils.js";

describe("Utils Module", () => {
  describe("emptyMatrix", () => {
    test("emptyMatrix creates correct shape", () => {
      const m = emptyMatrix(2, 3);
      expect(m.length).toBe(2);
      expect(m[0].length).toBe(3);
    });
  });

  describe("areMatricesEqual", () => {
    test("areMatricesEqual returns true for equal matrices", () => {
      const m1 = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ];
      const m2 = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ];
      expect(areMatricesEqual(m1, m2)).toBe(true);
    });

    test("areMatricesEqual returns false for different matrices", () => {
      const m1 = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ];
      const m2 = [
        [1, 2, 3],
        [4, 5, 7],
        [7, 8, 9],
      ];
      expect(areMatricesEqual(m1, m2)).toBe(false);
    });
  });

  describe("mod", () => {
    test("mod returns positive result", () => {
      expect(mod(-1, 5)).toBe(4);
      expect(mod(6, 5)).toBe(1);
      expect(mod(3, 5)).toBe(3);
    });
  });

  describe("random", () => {
    test("random returns element from array", () => {
      const arr = [1, 2, 3];
      expect(arr).toContain(random(arr));
    });
  });
});
