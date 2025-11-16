import { Automaton } from "../core/Automaton.js";
import { Rule } from "../core/Rule.js";

describe("Automaton", () => {
  it("initialise sets state and history correctly", () => {
    const rule = new Rule({ gridSize: 2, ordering: ["A", "B"] });
    const automaton = new Automaton({ rule });
    const state = [
      ["A", "B"],
      ["B", "A"],
    ];
    automaton.initialise(state);
    expect(automaton.state).toEqual(state);
    expect(automaton.history).toEqual([state]);
    expect(automaton.iteration).toBe(0);
    expect(automaton.stable).toBe(false);
  });

  it("reset creates initial state and resets iteration/history", () => {
    const rule = new Rule({ gridSize: 2, ordering: ["A", "B"] });
    rule.generateStartingState = () => [
      ["A", "B"],
      ["B", "A"],
    ];
    const automaton = new Automaton({ rule });
    automaton.reset();
    expect(automaton.state).toEqual([
      ["A", "B"],
      ["B", "A"],
    ]);
    expect(automaton.iteration).toBe(0);
    expect(automaton.history).toEqual([
      [
        ["A", "B"],
        ["B", "A"],
      ],
    ]);
  });

  it("step advances state and updates history", () => {
    const rule = new Rule({ gridSize: 2, ordering: ["A", "B"] });
    rule.nextValue = () => "B";
    rule.generateStartingState = () => [
      ["A", "A"],
      ["A", "A"],
    ];
    const automaton = new Automaton({ rule });
    automaton.reset();
    automaton.step();
    expect(automaton.state).toEqual([
      ["B", "B"],
      ["B", "B"],
    ]);
    expect(automaton.iteration).toBe(1);
    expect(automaton.history.length).toBe(2);
  });

  it("getColorCount returns correct color counts", () => {
    const rule = new Rule({ gridSize: 2, ordering: ["A", "B"] });
    rule.getColor = (v) => v;
    const automaton = new Automaton({ rule });
    const state = [
      ["A", "B"],
      ["B", "A"],
    ];
    automaton.initialise(state);
    expect(automaton.getColorCount()).toEqual({ A: 2, B: 2 });
  });
});
