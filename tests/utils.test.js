import { emptyMatrix, mod, random } from "../utils.js";

describe("Utils Module", () => {
  describe("emptyMatrix", () => {
    test("emptyMatrix creates correct shape", () => {
      const m = emptyMatrix(2, 3);
      expect(m.length).toBe(2);
      expect(m[0].length).toBe(3);
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
