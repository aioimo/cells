import { RPS4 } from "../../rules/RPS4.js";
import { Matrix } from "../../core/Matrix.js";

describe("RPS4 Rule", () => {
  it("should correctly update the center cell based on cyclic dominance", () => {
    // 4 colors, cyclic order
    const ordering = ["#7880b5", "#C0A9B0", "#BCC4DB", "black"];
    const rule = new RPS4({ ordering });
    // Matrix: center is C0, surrounded by C1 (predator)
    const arr = [
      ["#C0A9B0", "#C0A9B0", "#C0A9B0"],
      ["#C0A9B0", "#7880b5", "#C0A9B0"],
      ["#C0A9B0", "#C0A9B0", "#C0A9B0"],
    ];
    const state = new Matrix(arr);
    // Center cell (1,1) is C0, surrounded by C1 (predator)
    const next = rule.nextValue(1, 1, state);
    expect(next).toBe("#C0A9B0"); // Should be replaced by predator
  });
});
