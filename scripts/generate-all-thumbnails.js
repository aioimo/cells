#!/usr/bin/env node

/**
 * Generate thumbnails for all scenarios using Node.js canvas
 * Usage: node scripts/generate-all-thumbnails.js
 */

import { createCanvas } from "canvas";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

import { Automaton } from "../core/Automaton.js";
import { DrawingEngine } from "../drawing/DrawingEngine.js";
import { SCENARIOS } from "../scenarios.js";
import { getRuleById } from "../rules/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");

// Default fallback color
function getColorForValue(value) {
  return "#CCCCCC";
}

async function generateThumbnail(scenarioId, iterations, canvasSize = 400) {
  try {
    console.log(`[${scenarioId}] Generating (${iterations} iterations)...`);

    const scenario = SCENARIOS.find((s) => s.id === scenarioId);
    if (!scenario) {
      throw new Error(`Scenario not found: ${scenarioId}`);
    }

    const canvas = createCanvas(canvasSize, canvasSize);
    // NEW: look up the rule via ruleId
    const rule = getRuleById(scenario.ruleId, scenario.config || {});
    if (!rule) {
      throw new Error(`No rule registered for ruleId '${scenario.ruleId}'`);
    }

    const drawingEngine = new DrawingEngine({
      canvas,
      getColor: (val) =>
        typeof rule.getColor === "function"
          ? rule.getColor(val)
          : getColorForValue(val),
    });
    const automaton = new Automaton({ rule });

    const initialState = rule.createInitialState();
    automaton.initialise(initialState);
    drawingEngine.draw(automaton.state);

    for (let i = 0; i < iterations; i++) {
      if (automaton.stable) {
        console.log(`[${scenarioId}] Stable at iteration ${i}`);
        break;
      }
      automaton.step();
      drawingEngine.draw(automaton.state);
    }

    const thumbnailsDir = join(projectRoot, "thumbnails");
    if (!existsSync(thumbnailsDir)) {
      mkdirSync(thumbnailsDir, { recursive: true });
    }

    const outputPath = join(thumbnailsDir, `${scenarioId}.png`);
    const buffer = canvas.toBuffer("image/png");
    writeFileSync(outputPath, buffer);

    console.log(`[${scenarioId}] ✓ Saved (iteration: ${automaton.iteration})`);
    return true;
  } catch (error) {
    console.error(`[${scenarioId}] ✗ Error: ${error.message}`);
    return false;
  }
}

async function generateAllThumbnails() {
  console.log("Starting thumbnail generation for selected scenarios...\n");

  // Filter only enabled scenarios
  const enabledScenarios = Object.entries(SCENARIOS).filter(
    ([_, config]) => config.screenshotConfig?.enabled === true
  );

  console.log("enabledScenarios:", enabledScenarios);

  if (enabledScenarios.length === 0) {
    console.log("⚠️  No scenarios enabled for generation.");
    console.log(
      "Edit scenariosForScreenshots in this script and set enabled: true for scenarios you want to update.\n"
    );
    return;
  }

  console.log(
    `Generating thumbnails for ${enabledScenarios.length} scenario(s):\n`
  );

  let successCount = 0;
  let errorCount = 0;

  for (const [scenarioId, config] of enabledScenarios) {
    console.log("scenarioId:", scenarioId, "config:", config);
    const success = await generateThumbnail(
      config.id,
      config.screenshotConfig.iteration
    );
    if (success) {
      successCount++;
    } else {
      errorCount++;
    }
  }

  console.log(`\nComplete! ${successCount} succeeded, ${errorCount} failed.`);
}

generateAllThumbnails()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Failed:", error);
    process.exit(1);
  });
