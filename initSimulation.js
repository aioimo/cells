// initSimulation.js

import { getRuleById } from "./rules/index.js";
import { getScenarioById } from "./scenarios.js";

import { Automaton } from "./core/Automaton.js";
import { SimulationController } from "./SimulationController.js";
import { DrawingEngine } from "./drawing/DrawingEngine.js";

import { State } from "./ui/State.js";
import { Buttons } from "./ui/Buttons.js";
import { UIManager } from "./ui/UIManager.js";
import { Iteration } from "./ui/Iteration.js";
import { Colors } from "./ui/Colors.js";

import { ColorOverride } from "./ui/ColorOverride.js";
import { downloadCanvasAsPNG } from "./utils/downloadCanvasAsPng.js";

export async function initSimulation({ scenarioId, elements, playControls }) {
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
    settledBadgeEl,
  } = elements;

  // ---- REQUIRE SCENARIO ID -------------------------------------------------
  if (!scenarioId) {
    throw new Error("[initSimulation] scenarioId is required");
  }

  // ---- LOOK UP SCENARIO ----------------------------------------------------
  const scenario = getScenarioById(scenarioId);
  const { ruleId, config = {} } = scenario;

  // ---- LOOK UP RULE FACTORY ------------------------------------------------
  const rule = getRuleById(ruleId, config);
  if (!rule) {
    throw new Error(
      `[initSimulation] No rule registered for ruleId '${ruleId}' (from scenario '${scenarioId}')`
    );
  }

  // ---- UI TEXT -------------------------------------------------------------
  if (titleEl) titleEl.textContent = scenario.label ?? scenario.id;
  if (descEl) descEl.textContent = scenario.description ?? "";

  // ---- AUTOMATON -----------------------------------------------------------
  const automaton = new Automaton({ rule });

  // ---- COLOR OVERRIDE + RENDERING ENGINE ------------------------------------
  const baseGetColor = (val) =>
    typeof rule.getColor === "function" ? rule.getColor(val) : val;

  const colorOverride = new ColorOverride(baseGetColor);

  // Apply default colours
  const hasLens = !!(rule.constructor.COLOR_GROUPINGS?.length);
  if (!hasLens) {
    // Gallery display colors for non-lens scenarios
    try {
      const resp = await fetch("palettes/display-colors.json");
      if (resp.ok) {
        const allMappings = await resp.json();
        const mapping = allMappings[scenarioId];
        if (mapping) {
          colorOverride.applyPreset(mapping);
        }
      }
    } catch {
      // Silently fall back to rule's native colors
    }
  }
  // Lens scenarios: no overrides on load — getColor() already gives all-distinct

  const drawingEngine = new DrawingEngine({
    canvas,
    getColor: (val) => colorOverride.getColor(val),
  });

  // ---- ITERATION + COLORS WIDGETS ------------------------------------------
  const iterations = iterationsEl ? new Iteration(iterationsEl) : null;
  const colors = colorsEl ? new Colors(colorsEl) : null;

  // ---- WIRING (new PlayControls path vs legacy Buttons path) ---------------
  let controller;
  let state;
  let ui;

  if (playControls) {
    // New exhibit-style UI: PlayControls drives play/pause/step/reset
    controller = new SimulationController({
      automaton,
      drawingEngine,
      onChange: (logic) => {
        if (iterations) iterations.update(logic.iteration);
        if (colors) {
          colors.displayColorTable(logic);
          colors.updateColorStatistics(logic);
        }
      },
      onEnd: () => {
        playControls.onEnd();
        if (settledBadgeEl) settledBadgeEl.classList.add("visible");
      },
    });

    playControls.$playPause.onclick = () => {
      if (playControls.playing) {
        playControls.setPlaying(false);
        controller.stop();
      } else {
        playControls.setPlaying(true);
        controller.start();
      }
    };

    playControls.$step.onclick = () => {
      controller.step();
    };

    playControls.$reset.onclick = () => {
      controller.reset();
      playControls.onReset();
      if (settledBadgeEl) settledBadgeEl.classList.remove("visible");
    };

    playControls.initialise();
    controller.reset();
  } else {
    // Legacy 4-button UI
    const buttons = new Buttons(startBtn, pauseBtn, resetBtn, nextBtn);

    controller = new SimulationController({
      automaton,
      drawingEngine,
      onChange: (logic) => {
        ui.updateUI(logic);
      },
      onEnd: () => {
        state.dispatch({ type: "END" });
      },
    });

    state = new State(controller, buttons);

    ui = new UIManager({
      buttons,
      iterations,
      colors,
      onAction: (type) => state.dispatch({ type }),
    });

    ui.bindEvents();
    buttons.initialise();
    controller.reset();
  }

  // ---- SAVE THUMBNAIL BUTTON ----------------------------------------------
  if (saveThumbnailBtn) {
    saveThumbnailBtn.addEventListener("click", () => {
      downloadCanvasAsPNG(canvas, `${scenario.id}.png`);
    });
  }

  // Expose handles for debugging / external access
  return { rule, automaton, controller, drawingEngine, colorOverride, scenario };
}
