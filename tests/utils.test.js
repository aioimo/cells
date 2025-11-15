import { emptyMatrix, mod, random } from "../utils.js";

test("emptyMatrix creates correct shape", () => {
  const m = emptyMatrix(2, 3);
  expect(m.length).toBe(2);
  expect(m[0].length).toBe(3);
});

test("mod returns positive result", () => {
  expect(mod(-1, 5)).toBe(4);
});

test("random returns element from array", () => {
  const arr = [1, 2, 3];
  expect(arr).toContain(random(arr));
});
