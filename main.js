const $canvas = document.getElementById('canvas');
const $iteration = document.getElementById('iterations');
const $colors = document.getElementById('colors');

const $start = document.getElementById('start');
const $pause = document.getElementById('pause');
const $reset = document.getElementById('reset');
const $next = document.getElementById('next');

const rules = new RPS4({});

const iterations = new Iteration($iteration);
const colors = new Colors($colors);

// Game
const game = new Game($canvas, rules, onChange);

// Inputs
const buttons = new Buttons($start, $pause, $reset, $next);

const state = new State(game, buttons);

function onChange(logic) {
  iterations.update.bind(iterations)(logic.iteration);
  colors.displayColorTable(logic);
  colors.updateColorStatistics(logic);
  if (logic.stable) {
    state.dispatch({ type: 'END' });
  }
}
