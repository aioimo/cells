#!/usr/bin/env node

/**
 * Regenerate palettes/display-colors.json from the current gallery palette.
 *
 * For each snapshot, builds the same prominence-ranked color mapping that
 * render-thumbnails.js uses, then writes the display-color → palette-color
 * entries so the live simulation (play.html) matches the gallery thumbnails.
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

import { SCENARIOS } from "../scenarios.js";
import { getRuleById } from "../rules/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");

function main() {
  const paletteArg = process.argv[2] || "palettes/gallery.json";
  const palettePath = join(projectRoot, paletteArg);

  if (!existsSync(palettePath)) {
    console.error(`Palette not found: ${palettePath}`);
    process.exit(1);
  }

  const palette = JSON.parse(readFileSync(palettePath, "utf-8"));
  console.log(`Using palette: ${paletteArg} (${palette.colors.length} colors)\n`);

  const snapshotsDir = join(projectRoot, "snapshots");
  if (!existsSync(snapshotsDir)) {
    console.error("No snapshots/ directory.");
    process.exit(1);
  }

  const snapshotFiles = readdirSync(snapshotsDir).filter((f) => f.endsWith(".json"));
  const result = {};

  for (const file of snapshotFiles) {
    const scenarioId = file.replace(".json", "");
    const scenario = SCENARIOS.find((s) => s.id === scenarioId);
    if (!scenario) continue;

    const snapshot = JSON.parse(readFileSync(join(snapshotsDir, file), "utf-8"));
    const rule = getRuleById(scenario.ruleId, scenario.config || {});
    const getColor = (val) =>
      typeof rule?.getColor === "function" ? rule.getColor(val) : val;

    // Count prominence by display color
    const displayCounts = new Map();
    for (const val of snapshot.data) {
      const display = getColor(val);
      displayCounts.set(display, (displayCounts.get(display) || 0) + 1);
    }

    // Sort by prominence
    const sorted = [...displayCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([color]) => color);

    // Map display color → palette color
    const mapping = {};
    for (let i = 0; i < sorted.length; i++) {
      mapping[sorted[i]] = palette.colors[i % palette.colors.length];
    }

    result[scenarioId] = mapping;
    console.log(`[${scenarioId}] ${sorted.length} colors mapped`);
  }

  const outputPath = join(projectRoot, "palettes", "display-colors.json");
  writeFileSync(outputPath, JSON.stringify(result, null, 2));
  console.log(`\nWrote ${outputPath}`);
}

main();
