import { SimulationController } from "./SimulationController.js";
import { DrawingEngine } from "./drawing/DrawingEngine.js";
import { State } from "./State.js";
import { Buttons } from "./ui/Buttons.js";
import { Colors } from "./ui/Colors.js";
import { Iteration } from "./ui/Iteration.js";
import { UIManager } from "./ui/UIManager.js";

// DOM elements
const $canvas = document.getElementById("canvas");
const $iteration = document.getElementById("iterations");
const $colors = document.getElementById("colors");
const $start = document.getElementById("start");
const $pause = document.getElementById("pause");
const $reset = document.getElementById("reset");
const $next = document.getElementById("next");

// Rule instance (e.g. QuaternionGroup)
const rules = new QuaternionGroupSpiral({});

// View utilities
const iterations = new Iteration($iteration);
const colors = new Colors($colors);
const buttons = new Buttons($start, $pause, $reset, $next);

// Renderer
const drawingEngine = new DrawingEngine({
  canvas: $canvas,
  getColor: rules.getColor.bind(rules),
});

const ui = new UIManager({
  buttons,
  iterations,
  colors,
  onAction: (action) => state.dispatch({ type: action }),
});

ui.bindEvents();

const controller = new SimulationController({
  logic: rules,
  drawingEngine,
  onChange: (logic) => ui.updateUI(logic),
});

// State manager connects UI → controller
const state = new State(controller, buttons);

controller.reset();
