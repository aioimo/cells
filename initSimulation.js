// initSimulation.js

import { RULES } from "./rules/index.js";
import { getScenarioById } from "./scenarios.js";

import { Automaton } from "./core/Automaton.js";
import { SimulationController } from "./SimulationController.js";
import { DrawingEngine } from "./drawing/DrawingEngine.js";

import { State } from "./ui/State.js";
import { Buttons } from "./ui/Buttons.js";
import { UIManager } from "./ui/UIManager.js";
import { Iteration } from "./ui/Iteration.js";
import { Colors } from "./ui/Colors.js";

import { downloadCanvasAsPNG } from "./utils/downloadCanvasAsPng.js";

export function initSimulation({ scenarioId, elements }) {
  const {
    canvas,
    iterationsEl,
    colorsEl,
    startBtn,
    pauseBtn,
    nextBtn,
    resetBtn,
    saveThumbnailBtn,
    titleEl,
    descEl,
  } = elements;

  // ---- REQUIRE SCENARIO ID -------------------------------------------------
  if (!scenarioId) {
    throw new Error("[initSimulation] scenarioId is required");
  }

  // ---- LOOK UP SCENARIO ----------------------------------------------------
  const scenario = getScenarioById(scenarioId);
  const { ruleId, config = {} } = scenario;

  // ---- LOOK UP RULE FACTORY ------------------------------------------------
  const ruleFactory = RULES[ruleId];
  if (!ruleFactory) {
    throw new Error(
      `[initSimulation] No rule registered for ruleId '${ruleId}' (from scenario '${scenarioId}')`
    );
  }

  // ---- INSTANTIATE RULE (factory returns instance) -------------------------
  const rule = ruleFactory(config);

  // ---- UI TEXT -------------------------------------------------------------
  if (titleEl) titleEl.textContent = scenario.label ?? scenario.id;
  if (descEl) descEl.textContent = scenario.description ?? "";

  // ---- AUTOMATON -----------------------------------------------------------
  const automaton = new Automaton({ rule });

  // ---- RENDERING ENGINE ----------------------------------------------------
  const drawingEngine = new DrawingEngine({
    canvas,
    getColor: (val) =>
      typeof rule.getColor === "function" ? rule.getColor(val) : val,
  });

  // ---- UI WIDGETS ----------------------------------------------------------
  const iterations = new Iteration(iterationsEl);
  const colors = new Colors(colorsEl);
  const buttons = new Buttons(startBtn, pauseBtn, resetBtn, nextBtn);

  let ui;

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

  // ---- SAVE THUMBNAIL BUTTON ----------------------------------------------
  if (saveThumbnailBtn) {
    saveThumbnailBtn.addEventListener("click", () => {
      downloadCanvasAsPNG(canvas, `${scenario.id}.png`);
    });
  }

  // Expose handles for debugging
  return { rule, automaton, controller, ui, state, scenario };
}
