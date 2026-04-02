#!/usr/bin/env node

/**
 * Extract the color mappings that render-thumbnails computes for each scenario.
 * Outputs a JSON object mapping scenarioId -> { originalColor: paletteColor }
 * to be used as default displayColors in scenarios.js.
 */

import { readFileSync, readdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

import { SCENARIOS } from "../scenarios.js";
import { getRuleById } from "../rules/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");

const palette = JSON.parse(
  readFileSync(join(projectRoot, "palettes/gallery.json"), "utf-8")
);

const snapshotsDir = join(projectRoot, "snapshots");
const files = readdirSync(snapshotsDir).filter((f) => f.endsWith(".json"));

const result = {};

for (const file of files) {
  const scenarioId = file.replace(".json", "");
  const scenario = SCENARIOS.find((s) => s.id === scenarioId);
  if (!scenario) continue;

  const raw = readFileSync(join(snapshotsDir, file), "utf-8");
  const snapshot = JSON.parse(raw);

  const rule = getRuleById(scenario.ruleId, scenario.config || {});
  const getColor = (val) =>
    typeof rule?.getColor === "function" ? rule.getColor(val) : val;

  // Count by display color
  const displayCounts = new Map();
  for (const val of snapshot.data) {
    const display = getColor(val);
    displayCounts.set(display, (displayCounts.get(display) || 0) + 1);
  }

  const sorted = [...displayCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([color]) => color);

  const mapping = {};
  for (let i = 0; i < sorted.length; i++) {
    mapping[sorted[i]] = palette.colors[i % palette.colors.length];
  }

  result[scenarioId] = mapping;
}

console.log(JSON.stringify(result, null, 2));
