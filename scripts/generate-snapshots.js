#!/usr/bin/env node

/**
 * Generate matrix snapshots for all enabled scenarios.
 * Snapshots are the source of truth — they capture the structural state
 * at a specific iteration, decoupled from colors.
 *
 * Usage: node scripts/generate-snapshots.js
 *
 * Output: snapshots/{scenario-id}.json
 *   { rows, cols, data, iteration, ruleId, scenarioId }
 */

import { writeFileSync, existsSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

import { Automaton } from "../core/Automaton.js";
import { SCENARIOS } from "../scenarios.js";
import { getRuleById } from "../rules/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");

function generateSnapshot(scenario) {
  const { id, ruleId, config = {}, screenshotConfig } = scenario;
  const iterations = screenshotConfig?.iteration ?? 100;

  console.log(`[${id}] Running ${iterations} iterations...`);

  const rule = getRuleById(ruleId, config);
  if (!rule) {
    throw new Error(`No rule registered for ruleId '${ruleId}'`);
  }

  const automaton = new Automaton({ rule });
  const initialState = rule.createInitialState();
  automaton.initialise(initialState);

  for (let i = 0; i < iterations; i++) {
    if (automaton.stable) {
      console.log(`[${id}] Stable at iteration ${i}`);
      break;
    }
    automaton.step();
  }

  return {
    scenarioId: id,
    ruleId,
    rows: automaton.state.rows,
    cols: automaton.state.cols,
    data: automaton.state.data,
    iteration: automaton.iteration,
  };
}

function main() {
  console.log("Generating matrix snapshots...\n");

  const enabledScenarios = SCENARIOS.filter(
    (s) => s.screenshotConfig?.enabled === true
  );

  if (enabledScenarios.length === 0) {
    console.log("No scenarios enabled for snapshot generation.");
    return;
  }

  const snapshotsDir = join(projectRoot, "snapshots");
  if (!existsSync(snapshotsDir)) {
    mkdirSync(snapshotsDir, { recursive: true });
  }

  console.log(`Processing ${enabledScenarios.length} scenario(s):\n`);

  let success = 0;
  let errors = 0;

  for (const scenario of enabledScenarios) {
    try {
      const snapshot = generateSnapshot(scenario);
      const outputPath = join(snapshotsDir, `${scenario.id}.json`);
      writeFileSync(outputPath, JSON.stringify(snapshot));
      console.log(`[${scenario.id}] Saved (${snapshot.rows}x${snapshot.cols}, iteration ${snapshot.iteration})`);
      success++;
    } catch (err) {
      console.error(`[${scenario.id}] Error: ${err.message}`);
      errors++;
    }
  }

  console.log(`\nDone. ${success} saved, ${errors} failed.`);
}

main();
