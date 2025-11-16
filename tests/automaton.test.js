import { Matrix } from "../core/Matrix.js";
import { Automaton } from "../core/Automaton.js";
import { Rule } from "../core/Rule.js";

describe("Automaton history and loop detection", () => {
  it("should clone Matrix state efficiently and detect loops", () => {
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
    // Step once, should detect loop (initial state is in history)
    expect(automaton.hasLoop(automaton.state)).toBe(true);
    // Change state, should not detect loop
    automaton.state.set(0, 0, 99);
    expect(automaton.hasLoop(automaton.state)).toBe(false);
    // Add new state to history and check
    automaton.recordHistory();
    expect(automaton.hasLoop(automaton.state)).toBe(true);
  });
});

describe("Automaton", () => {
  it("initialise sets state and history correctly", () => {
    const rule = new Rule({ gridSize: 2, ordering: ["A", "B"] });
    const automaton = new Automaton({ rule });
    const state = new Matrix([
      ["A", "B"],
      ["B", "A"],
    ]);
    automaton.initialise(state);
    expect(automaton.state).toEqual(state);
    expect(automaton.history).toEqual([state]);
    expect(automaton.iteration).toBe(0);
    expect(automaton.stable).toBe(false);
  });

  it("reset creates initial state and resets iteration/history", () => {
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
    expect(automaton.history).toEqual([
      new Matrix([
        ["A", "B"],
        ["B", "A"],
      ]),
    ]);
  });

  it("step advances state and updates history", () => {
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
    expect(automaton.history.length).toBe(2);
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
