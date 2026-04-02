#!/usr/bin/env node

/**
 * Render thumbnails from persisted matrix snapshots + a color palette.
 *
 * Reads snapshots/{id}.json, applies a palette, renders to thumbnails/{id}.png.
 * The palette is defined in palettes/gallery.json (or a file passed as arg).
 *
 * Usage:
 *   node scripts/render-thumbnails.js                    # uses palettes/gallery.json
 *   node scripts/render-thumbnails.js palettes/warm.json # uses a custom palette
 *
 * Palette format (palettes/gallery.json):
 * {
 *   "background": "#09090B",
 *   "colors": ["#F4F4F5", "#52525B", "#A1A1AA", "#27272A", "#71717A",
 *              "#D4D4D8", "#3F3F46", "#E4E4E7", "#18181B", "#FAFAFA"]
 * }
 *
 * Color assignment: each unique cell value in a snapshot gets assigned a color
 * from the palette in the order the values appear in the scenario's `ordering`.
 * If the scenario has no ordering, values are assigned colors in order of first
 * appearance in the snapshot data.
 */

import { createCanvas } from "canvas";
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

import { SCENARIOS } from "../scenarios.js";
import { getRuleById } from "../rules/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");

function loadPalette(palettePath) {
  const raw = readFileSync(palettePath, "utf-8");
  return JSON.parse(raw);
}

function buildColorMap(snapshot, palette, scenario) {
  // Get the rule's getColor mapping (collapses multiple values into display colors)
  const rule = getRuleById(scenario.ruleId, scenario.config || {});
  const getColor = (val) =>
    typeof rule?.getColor === "function" ? rule.getColor(val) : val;

  // Count prominence by DISPLAY color, not raw cell value
  const displayCounts = new Map();
  for (const val of snapshot.data) {
    const display = getColor(val);
    displayCounts.set(display, (displayCounts.get(display) || 0) + 1);
  }

  // Sort display colors by prominence (most cells first)
  const sortedDisplayColors = [...displayCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([color]) => color);

  // Map display colors to palette colors by prominence rank
  const displayToPalette = new Map();
  for (let i = 0; i < sortedDisplayColors.length; i++) {
    displayToPalette.set(
      sortedDisplayColors[i],
      palette.colors[i % palette.colors.length]
    );
  }

  // Build final map: raw cell value -> palette color (via display color)
  const colorMap = new Map();
  const seen = new Set();
  for (const val of snapshot.data) {
    if (seen.has(val)) continue;
    seen.add(val);
    const display = getColor(val);
    colorMap.set(val, displayToPalette.get(display));
  }

  return colorMap;
}

function renderThumbnail(snapshot, colorMap, canvasSize, bgColor) {
  const canvas = createCanvas(canvasSize, canvasSize);
  const ctx = canvas.getContext("2d");
  const { rows, cols, data } = snapshot;

  // Fill background
  ctx.fillStyle = bgColor || "#09090B";
  ctx.fillRect(0, 0, canvasSize, canvasSize);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const val = data[r * cols + c];
      const color = colorMap.get(val) || "#FF00FF";
      ctx.fillStyle = color;
      // Use floor/ceil to eliminate sub-pixel gaps between cells
      const x = Math.floor(c * canvasSize / cols);
      const y = Math.floor(r * canvasSize / rows);
      const w = Math.floor((c + 1) * canvasSize / cols) - x;
      const h = Math.floor((r + 1) * canvasSize / rows) - y;
      ctx.fillRect(x, y, w, h);
    }
  }

  return canvas.toBuffer("image/png");
}

async function main() {
  const paletteArg = process.argv[2] || "palettes/gallery.json";
  const palettePath = join(projectRoot, paletteArg);

  if (!existsSync(palettePath)) {
    console.error(`Palette not found: ${palettePath}`);
    console.error("Create it first, e.g.:");
    console.error('  { "background": "#09090B", "colors": ["#F4F4F5", "#52525B", ...] }');
    process.exit(1);
  }

  const palette = loadPalette(palettePath);
  console.log(`Using palette: ${paletteArg} (${palette.colors.length} colors)\n`);

  const snapshotsDir = join(projectRoot, "snapshots");
  if (!existsSync(snapshotsDir)) {
    console.error("No snapshots/ directory. Run `node scripts/generate-snapshots.js` first.");
    process.exit(1);
  }

  const thumbnailsDir = join(projectRoot, "thumbnails");
  if (!existsSync(thumbnailsDir)) {
    mkdirSync(thumbnailsDir, { recursive: true });
  }

  const snapshotFiles = readdirSync(snapshotsDir).filter((f) => f.endsWith(".json"));
  console.log(`Found ${snapshotFiles.length} snapshot(s)\n`);

  let success = 0;
  let errors = 0;

  // Import hero ID for high-res rendering
  const { HERO_SCENARIO_ID } = await import("../scenarios.js");

  for (const file of snapshotFiles) {
    const scenarioId = file.replace(".json", "");
    try {
      const raw = readFileSync(join(snapshotsDir, file), "utf-8");
      const snapshot = JSON.parse(raw);

      const scenario = SCENARIOS.find((s) => s.id === scenarioId);
      if (!scenario) {
        console.warn(`[${scenarioId}] No matching scenario, skipping`);
        continue;
      }

      const colorMap = buildColorMap(snapshot, palette, scenario);
      const isHero = scenarioId === HERO_SCENARIO_ID;
      const size = isHero ? Math.max(1200, snapshot.cols) : 400;
      const buffer = renderThumbnail(snapshot, colorMap, size, palette.background);

      const outputPath = join(thumbnailsDir, `${scenarioId}.png`);
      writeFileSync(outputPath, buffer);
      console.log(`[${scenarioId}] Rendered`);
      success++;
    } catch (err) {
      console.error(`[${scenarioId}] Error: ${err.message}`);
      errors++;
    }
  }

  console.log(`\nDone. ${success} rendered, ${errors} failed.`);
}

main();
