// main.js
import { SimulationController } from "./SimulationController.js";
import { State } from "./State.js";
import { UIManager } from "./ui/UIManager.js";
import { Buttons } from "./ui/Buttons.js";
import { DrawingEngine } from "./drawing/DrawingEngine.js";
import { Automaton } from "./core/Automaton.js";
import { RPS4 } from "./rules/RPS4.js";
import { Colors } from "./ui/Colors.js";
import { Iteration } from "./ui/Iteration.js";

// ----------------------------
// DOM ELEMENTS
// ----------------------------
const $canvas = document.getElementById("canvas");
const $iteration = document.getElementById("iterations");
const $colors = document.getElementById("colors");

const $start = document.getElementById("start");
const $pause = document.getElementById("pause");
const $reset = document.getElementById("reset");
const $next = document.getElementById("next");

// ----------------------------
// CORE SIMULATION SETUP
// ----------------------------
const rule = new RPS4();
const automaton = new Automaton({ rule });

const drawingEngine = new DrawingEngine({
  canvas: $canvas,
  getColor: rule.getColor.bind(rule),
});

// ----------------------------
// UI ELEMENTS
// ----------------------------
const buttons = new Buttons($start, $pause, $reset, $next);
const colors = new Colors($colors);
const iterations = new Iteration($iteration);

// ----------------------------
// STATE + UI SETUP
// ----------------------------
const state = new State(null, buttons); // attach controller later

const ui = new UIManager({
  buttons,
  iterations,
  colors,
  onAction: (action) => state.dispatch({ type: action }),
});

ui.bindEvents();

// ----------------------------
// CONTROLLER
// ----------------------------
const controller = new SimulationController({
  automaton,
  drawingEngine,
  onChange: (logic) => {
    ui.updateUI(logic);
  },
  onEnd: () => {
    console.log("[Main] onEnd triggered → dispatch END");
    state.dispatch({ type: "END" });
  },
});

// attach controller now that it's defined
state.controller = controller;

// ----------------------------
// INITIALISE + DRAW
// ----------------------------
buttons.initialise();
controller.reset();
