// initSimulation.js

import { getRuleById, RULE_META } from "./rules/index.js";
import { Automaton } from "./core/Automaton.js";
import { SimulationController } from "./SimulationController.js";
import { DrawingEngine } from "./drawing/DrawingEngine.js";
import { State } from "./ui/State.js";
import { Buttons } from "./ui/Buttons.js";
import { UIManager } from "./ui/UIManager.js";

import { Iteration } from "./ui/Iteration.js";
import { Colors } from "./ui/Colors.js";

export function initSimulation({ ruleId, elements }) {
  const {
    canvas,
    iterationsEl,
    colorsEl,
    startBtn,
    pauseBtn,
    nextBtn,
    resetBtn,
    titleEl,
    descEl,
  } = elements;

  const meta = RULE_META[ruleId] || {};
  console.log("RULE ID", ruleId);
  const rule = getRuleById(ruleId);

  console.log("RULE...", rule);

  if (titleEl) titleEl.textContent = meta.label || ruleId;
  if (descEl) descEl.textContent = meta.description || "";

  const automaton = new Automaton({ rule });

  console.log("AUTOMATON...", automaton);

  const drawingEngine = new DrawingEngine({
    canvas,
    getColor: (val) =>
      typeof rule.getColor === "function" ? rule.getColor(val) : val,
  });

  const iterations = new Iteration(iterationsEl);
  const colors = new Colors(colorsEl);
  const buttons = new Buttons(startBtn, pauseBtn, resetBtn, nextBtn);

  let ui; // assigned after controller so callbacks can see it

  const controller = new SimulationController({
    automaton,
    drawingEngine,
    onChange: (logic) => {
      ui.updateUI(logic);
    },
    onEnd: () => {
      state.dispatch({ type: "END" });
    },
  });

  const state = new State(controller, buttons);

  ui = new UIManager({
    buttons,
    iterations,
    colors,
    onAction: (type) => state.dispatch({ type }),
  });

  ui.bindEvents();
  buttons.initialise();
  controller.reset();

  // return handles if you ever want to poke at them from outside
  return { rule, automaton, controller, ui, state };
}
