import { Matrix } from "../core/Matrix.js";
import { Automaton } from "../core/Automaton.js";
import { Rule } from "../core/Rule.js";

describe("Automaton history and loop detection", () => {
  it("should detect loops via hash-based detection", () => {
    const rule = {
      nextValue: (r, c, state) => state.get(r, c),
      createInitialState: () =>
        new Matrix([
          [1, 2],
          [3, 4],
        ]),
      gridSize: 2,
      ordering: [1, 2, 3, 4],
      getColor: (v) => v,
    };
    const automaton = new Automaton({ rule });
    automaton.initialise(rule.createInitialState());
    // Step with identity rule — state is unchanged, should detect loop
    automaton.step();
    expect(automaton.stable).toBe(true);
  });

  it("should not detect loop when state changes", () => {
    let callCount = 0;
    const rule = {
      nextValue: (r, c, state) => {
        // Return different value on first step
        if (callCount < 4) {
          callCount++;
          return state.get(r, c) + 1;
        }
        return state.get(r, c);
      },
      createInitialState: () =>
        new Matrix([
          [1, 2],
          [3, 4],
        ]),
      gridSize: 2,
      ordering: [1, 2, 3, 4],
      getColor: (v) => v,
    };
    const automaton = new Automaton({ rule });
    automaton.initialise(rule.createInitialState());
    automaton.step();
    // State changed, so should not be stable yet
    expect(automaton.stable).toBe(false);
    expect(automaton.iteration).toBe(1);
  });
});

describe("Automaton", () => {
  it("initialise sets state correctly", () => {
    const rule = new Rule({ gridSize: 2, ordering: ["A", "B"] });
    const automaton = new Automaton({ rule });
    const state = new Matrix([
      ["A", "B"],
      ["B", "A"],
    ]);
    automaton.initialise(state);
    expect(automaton.state).toEqual(state);
    expect(automaton.iteration).toBe(0);
    expect(automaton.stable).toBe(false);
  });

  it("reset creates initial state and resets iteration", () => {
    const rule = new Rule({ gridSize: 2, ordering: ["A", "B"] });
    rule.generateStartingState = () =>
      new Matrix([
        ["A", "B"],
        ["B", "A"],
      ]);
    const automaton = new Automaton({ rule });
    automaton.reset();
    expect(automaton.state).toEqual(
      new Matrix([
        ["A", "B"],
        ["B", "A"],
      ])
    );
    expect(automaton.iteration).toBe(0);
  });

  it("step advances state and updates iteration", () => {
    const rule = new Rule({ gridSize: 2, ordering: ["A", "B"] });
    rule.nextValue = () => "B";
    rule.generateStartingState = () =>
      new Matrix([
        ["A", "B"],
        ["B", "A"],
      ]);
    const automaton = new Automaton({ rule });
    automaton.reset();
    automaton.step();
    const expected = new Matrix([
      ["B", "B"],
      ["B", "B"],
    ]);
    expect(automaton.state.equals(expected)).toBe(true);
    expect(automaton.iteration).toBe(1);
  });

  it("getColorCount returns correct color counts", () => {
    const rule = new Rule({ gridSize: 2, ordering: ["A", "B"] });
    rule.getColor = (v) => v;
    const automaton = new Automaton({ rule });
    const matrix = new Matrix([
      ["A", "B"],
      ["B", "A"],
    ]);
    automaton.initialise(matrix);
    expect(automaton.getColorCount()).toEqual({ A: 2, B: 2 });
  });
});
