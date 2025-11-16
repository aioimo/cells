import { Rule } from "../core/Rule.js";

describe("Rule", () => {
  it("createInitialState returns a valid initial state", () => {
    const rule = new Rule({ gridSize: 2, ordering: ["A", "B"] });
    rule.generateStartingState = () => [
      ["A", "B"],
      ["B", "A"],
    ];
    const state = rule.createInitialState();
    expect(state).toEqual([
      ["A", "B"],
      ["B", "A"],
    ]);
  });

  it("generateStartingState returns a valid matrix", () => {
    const rule = new Rule({ gridSize: 2, ordering: ["A", "B"] });
    const matrix = rule.generateStartingState(2, ["A", "B"]);
    expect(matrix.length).toBe(2);
    expect(matrix[0].length).toBe(2);
  });

  it("nextValue throws if not implemented in base class", () => {
    const rule = new Rule({ gridSize: 2, ordering: ["A", "B"] });
    expect(() =>
      rule.nextValue(0, 0, [
        ["A", "B"],
        ["B", "A"],
      ])
    ).toThrow();
  });
});
