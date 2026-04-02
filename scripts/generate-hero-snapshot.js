#!/usr/bin/env node

/**
 * Generate a high-resolution snapshot for the hero scenario.
 * Uses a much larger grid than the default to capture fine detail.
 *
 * Usage: node scripts/generate-hero-snapshot.js [gridSize] [iterations]
 *   gridSize:   grid dimension (default 800)
 *   iterations: how many steps to run (default from screenshotConfig)
 */

import { writeFileSync, existsSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

import { Automaton } from "../core/Automaton.js";
import { HERO_SCENARIO_ID, getScenarioById } from "../scenarios.js";
import { getRuleById } from "../rules/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");

const gridSize = parseInt(process.argv[2]) || 800;
const scenario = getScenarioById(HERO_SCENARIO_ID);
const iterations = parseInt(process.argv[3]) || scenario.screenshotConfig?.iteration || 100;

console.log(`Hero: ${HERO_SCENARIO_ID}`);
console.log(`Grid: ${gridSize}x${gridSize}`);
console.log(`Iterations: ${iterations}`);
console.log();

// Override gridSize in config
const config = { ...(scenario.config || {}), gridSize };
const rule = getRuleById(scenario.ruleId, config);

const automaton = new Automaton({ rule });
const initialState = rule.createInitialState();
automaton.initialise(initialState);

for (let i = 0; i < iterations; i++) {
  if (automaton.stable) {
    console.log(`Stable at iteration ${i}`);
    break;
  }
  if (i % 10 === 0) {
    console.log(`  iteration ${i}/${iterations}...`);
  }
  automaton.step();
}

const snapshot = {
  scenarioId: HERO_SCENARIO_ID,
  ruleId: scenario.ruleId,
  rows: automaton.state.rows,
  cols: automaton.state.cols,
  data: automaton.state.data,
  iteration: automaton.iteration,
};

const snapshotsDir = join(projectRoot, "snapshots");
if (!existsSync(snapshotsDir)) {
  mkdirSync(snapshotsDir, { recursive: true });
}

const outputPath = join(snapshotsDir, `${HERO_SCENARIO_ID}.json`);
writeFileSync(outputPath, JSON.stringify(snapshot));
console.log(`\nSaved ${snapshot.rows}x${snapshot.cols} snapshot (iteration ${snapshot.iteration})`);
console.log(`File: ${outputPath}`);
