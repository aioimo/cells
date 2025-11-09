import { initSimulation } from "./initSimulation.js";

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

initSimulation({
  ruleId: "majority",
  elements: {
    canvas: $canvas,
    iterationsEl: $iteration,
    colorsEl: $colors,
    startBtn: $start,
    pauseBtn: $pause,
    nextBtn: $next,
    resetBtn: $reset,
    titleEl: null,
    descEl: null,
  },
});
