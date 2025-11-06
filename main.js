import { SimulationController } from "./SimulationController.js";
import { DrawingEngine } from "./drawing/DrawingEngine.js";
import { State } from "./State.js";
import { Buttons } from "./ui/Buttons.js";
import { Colors } from "./ui/Colors.js";
import { Iteration } from "./ui/Iteration.js";
import { UIManager } from "./ui/UIManager.js";
import { QuaternionGroup } from "./rules/QuaternionGroup.js"; // or whichever rule you start with

// DOM elements
const $canvas = document.getElementById("canvas");
const $iteration = document.getElementById("iterations");
const $colors = document.getElementById("colors");
const $start = document.getElementById("start");
const $pause = document.getElementById("pause");
const $reset = document.getElementById("reset");
const $next = document.getElementById("next");

// Instantiate UI pieces
const buttons = new Buttons($start, $pause, $reset, $next);
const iterations = new Iteration($iteration);
const colors = new Colors($colors);

// Rule and drawing engine
const rule = new RPS5({});
const drawingEngine = new DrawingEngine({
  canvas: $canvas,
  getColor: rule.getColor.bind(rule),
});

// Simulation controller
const controller = new SimulationController({
  logic: rule,
  drawingEngine,
  onChange: (logic) => ui.updateUI(logic),
});

// State manager connects UI actions → controller actions
const state = new State(controller, buttons);

// UI manager wires the DOM → state
const ui = new UIManager({
  buttons,
  iterations,
  colors,
  onAction: (action) => state.dispatch({ type: action }),
});

ui.bindEvents();
controller.reset();
