#!/usr/bin/env node

/**
 * Generate a colour palette catalogue organized by colour count.
 * For each count (2–12), shows 5-6 intentionally designed palettes
 * rendered against a representative scenario (or swatches only if
 * no scenario exists for that count).
 */

import { createCanvas } from "canvas";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

import { SCENARIOS } from "../scenarios.js";
import { getRuleById } from "../rules/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");

// ── Palette catalogue ──────────────────────────────────────────────────────
// Each count has 5-6 named palettes with exactly N colors.

const PALETTE_CATALOGUE = {
  2: [
    { name: "Ember & Void", background: "#0A0604", colors: ["#FF4D00", "#1A1A2E"] },
    { name: "Ink & Parchment", background: "#0C0A09", colors: ["#F5F0EB", "#1C1917"] },
    { name: "Lagoon", background: "#020B18", colors: ["#00B4D8", "#0A1628"] },
    { name: "Bruise", background: "#0D001A", colors: ["#B5179E", "#1B0A2E"] },
    { name: "Moss & Clay", background: "#0B1A0F", colors: ["#52B788", "#D4A373"] },
    { name: "Neon Pulse", background: "#050510", colors: ["#39FF14", "#FF2D6B"] },
  ],
  3: [
    { name: "Traffic", background: "#09090B", colors: ["#EF4444", "#FACC15", "#22C55E"] },
    { name: "Nautical", background: "#020B18", colors: ["#FFFBEB", "#0077B6", "#DC2626"] },
    { name: "Sherbet", background: "#1A1025", colors: ["#FF6B9D", "#67E8F9", "#FDE047"] },
    { name: "Forest Floor", background: "#0B1A0F", colors: ["#2D6A4F", "#D4A373", "#D8F3DC"] },
    { name: "Ultraviolet", background: "#0D001A", colors: ["#F72585", "#7209B7", "#4CC9F0"] },
    { name: "Campfire", background: "#0A0604", colors: ["#FF8800", "#1C1917", "#CAF0F8"] },
  ],
  4: [
    { name: "Cardinal", background: "#09090B", colors: ["#DC2626", "#FACC15", "#1D4ED8", "#F5F0EB"] },
    { name: "Tide Pool", background: "#020B18", colors: ["#00B4D8", "#FF6B35", "#023E8A", "#CAF0F8"] },
    { name: "Candy Box", background: "#1A1025", colors: ["#FF6B9D", "#C084FC", "#67E8F9", "#FDE047"] },
    { name: "Terracotta", background: "#0A0604", colors: ["#B45309", "#059669", "#D97706", "#F5F0EB"] },
    { name: "Neon Grid", background: "#050510", colors: ["#FF2D6B", "#00F5D4", "#FFE53B", "#7B61FF"] },
    { name: "Sumi", background: "#0C0A09", colors: ["#F5F0EB", "#1C1917", "#A8A29E", "#57534E"] },
  ],
  5: [
    { name: "Spectrum", background: "#09090B", colors: ["#EF4444", "#F59E0B", "#22C55E", "#3B82F6", "#A855F7"] },
    { name: "Coral Reef", background: "#020B18", colors: ["#00B4D8", "#FF6B35", "#06D6A0", "#E040FB", "#FFFBEB"] },
    { name: "Jewel Box", background: "#0F0A1E", colors: ["#F59E0B", "#EC4899", "#06B6D4", "#10B981", "#8B5CF6"] },
    { name: "Patina", background: "#0C0A09", colors: ["#059669", "#B45309", "#78716C", "#D97706", "#CAF0F8"] },
    { name: "Playground", background: "#1A1025", colors: ["#FF6B9D", "#FDE047", "#67E8F9", "#A3E635", "#F0ABFC"] },
  ],
  6: [
    { name: "Stained Glass", background: "#09090B", colors: ["#DC2626", "#F59E0B", "#22C55E", "#3B82F6", "#A855F7", "#EC4899"] },
    { name: "Deep Sea", background: "#020B18", colors: ["#0077B6", "#00B4D8", "#CAF0F8", "#023E8A", "#48CAE4", "#00F5D4"] },
    { name: "Carnival", background: "#0F0A1E", colors: ["#F59E0B", "#EC4899", "#06B6D4", "#8B5CF6", "#10B981", "#F43F5E"] },
    { name: "Earth & Sky", background: "#0B1A0F", colors: ["#2D6A4F", "#95D5B2", "#D4A373", "#0077B6", "#F4A261", "#D8F3DC"] },
    { name: "Neon Nights", background: "#050510", colors: ["#FF2D6B", "#00F5D4", "#FFE53B", "#7B61FF", "#00BBFF", "#FF6B35"] },
  ],
  7: [
    { name: "Rainbow", background: "#09090B", colors: ["#EF4444", "#F59E0B", "#FACC15", "#22C55E", "#3B82F6", "#8B5CF6", "#EC4899"] },
    { name: "Mineral", background: "#0C0A09", colors: ["#059669", "#B45309", "#78716C", "#D97706", "#CAF0F8", "#6A040F", "#4ADE80"] },
    { name: "Candy Store", background: "#1A1025", colors: ["#FF6B9D", "#C084FC", "#67E8F9", "#FDE047", "#A3E635", "#FB923C", "#F0ABFC"] },
    { name: "Dusk Harbor", background: "#020B18", colors: ["#0077B6", "#FF6B35", "#00B4D8", "#F72585", "#48CAE4", "#FFFBEB", "#023E8A"] },
    { name: "Volcanic", background: "#0A0604", colors: ["#FF4D00", "#FF8800", "#FFAA00", "#9D0208", "#FFD60A", "#1C1917", "#CAF0F8"] },
  ],
  8: [
    { name: "Kaleidoscope", background: "#09090B", colors: ["#EF4444", "#F59E0B", "#22C55E", "#3B82F6", "#A855F7", "#EC4899", "#06B6D4", "#FACC15"] },
    { name: "Bioluminescent", background: "#020B18", colors: ["#0077B6", "#00B4D8", "#CAF0F8", "#023E8A", "#48CAE4", "#00F5D4", "#90E0EF", "#0A9396"] },
    { name: "Bazaar", background: "#0F0A1E", colors: ["#F59E0B", "#EC4899", "#06B6D4", "#8B5CF6", "#10B981", "#F43F5E", "#3B82F6", "#FBBF24"] },
    { name: "Autumn", background: "#0A0604", colors: ["#FF4D00", "#FF8800", "#FFAA00", "#9D0208", "#B45309", "#059669", "#D97706", "#FFD60A"] },
    { name: "Pastel Dream", background: "#1A1025", colors: ["#FF6B9D", "#C084FC", "#67E8F9", "#FDE047", "#F0ABFC", "#A3E635", "#FB923C", "#38BDF8"] },
  ],
  9: [
    { name: "Prism", background: "#09090B", colors: ["#EF4444", "#F59E0B", "#FACC15", "#22C55E", "#06B6D4", "#3B82F6", "#8B5CF6", "#EC4899", "#F5F0EB"] },
    { name: "Tropics", background: "#020B18", colors: ["#0077B6", "#FF6B35", "#00B4D8", "#F72585", "#06D6A0", "#FFFBEB", "#48CAE4", "#E040FB", "#023E8A"] },
    { name: "Market Spice", background: "#0A0604", colors: ["#FF4D00", "#FFAA00", "#9D0208", "#059669", "#D97706", "#B45309", "#FFD60A", "#78716C", "#CAF0F8"] },
    { name: "Synthwave", background: "#050510", colors: ["#FF2D6B", "#00F5D4", "#FFE53B", "#7B61FF", "#00BBFF", "#FF6B35", "#39FF14", "#FF85A1", "#C77DFF"] },
    { name: "Garden Party", background: "#0B1A0F", colors: ["#2D6A4F", "#95D5B2", "#D4A373", "#E9C46A", "#52B788", "#F4A261", "#D8F3DC", "#264653", "#74C69D"] },
  ],
  10: [
    { name: "Neon Bloom", background: "#050510", colors: ["#FF2D6B", "#00F5D4", "#FFE53B", "#7B61FF", "#00BBFF", "#FF6B35", "#39FF14", "#FF85A1", "#18E4FF", "#C77DFF"] },
    { name: "Midnight Carnival", background: "#0F0A1E", colors: ["#F59E0B", "#EC4899", "#06B6D4", "#8B5CF6", "#10B981", "#F43F5E", "#3B82F6", "#FBBF24", "#A855F7", "#14B8A6"] },
    { name: "Ember Spectrum", background: "#0A0604", colors: ["#FF4D00", "#FF8800", "#FFAA00", "#CC3700", "#FFD60A", "#9D0208", "#E85D04", "#FFBA08", "#DC2F02", "#F48C06"] },
    { name: "Ocean Floor", background: "#020B18", colors: ["#0077B6", "#00B4D8", "#CAF0F8", "#023E8A", "#48CAE4", "#90E0EF", "#0096C7", "#00F5D4", "#0A9396", "#005F73"] },
    { name: "Candy Pop", background: "#1A1025", colors: ["#FF6B9D", "#C084FC", "#67E8F9", "#FDE047", "#F0ABFC", "#A3E635", "#FB923C", "#38BDF8", "#F472B6", "#34D399"] },
    { name: "Botanical", background: "#0B1A0F", colors: ["#2D6A4F", "#95D5B2", "#D8F3DC", "#1B4332", "#52B788", "#B7E4C7", "#40916C", "#D4A373", "#E9C46A", "#F4A261"] },
  ],
  11: [
    { name: "Full Spectrum", background: "#09090B", colors: ["#EF4444", "#F59E0B", "#FACC15", "#84CC16", "#22C55E", "#06B6D4", "#3B82F6", "#6366F1", "#8B5CF6", "#EC4899", "#F5F0EB"] },
    { name: "Jewel Tones", background: "#0F0A1E", colors: ["#F59E0B", "#EC4899", "#06B6D4", "#8B5CF6", "#10B981", "#F43F5E", "#3B82F6", "#FBBF24", "#A855F7", "#14B8A6", "#E11D48"] },
    { name: "Geological", background: "#0C0A09", colors: ["#B45309", "#78716C", "#92400E", "#D97706", "#059669", "#A16207", "#44403C", "#CA8A04", "#166534", "#4ADE80", "#CAF0F8"] },
    { name: "Arcade", background: "#050510", colors: ["#FF2D6B", "#00F5D4", "#FFE53B", "#7B61FF", "#00BBFF", "#FF6B35", "#39FF14", "#FF85A1", "#18E4FF", "#C77DFF", "#FFD166"] },
    { name: "Botanical", background: "#0B1A0F", colors: ["#2D6A4F", "#95D5B2", "#D8F3DC", "#1B4332", "#52B788", "#B7E4C7", "#40916C", "#74C69D", "#D4A373", "#E9C46A", "#F4A261"] },
  ],
  12: [
    { name: "Solar System", background: "#060208", colors: ["#FFFBEB", "#FEF08A", "#FACC15", "#F59E0B", "#F97316", "#EF4444", "#DC2626", "#B91C1C", "#A855F7", "#3B82F6", "#06B6D4", "#22C55E"] },
    { name: "Stained Cathedral", background: "#09090B", colors: ["#DC2626", "#F59E0B", "#FACC15", "#84CC16", "#22C55E", "#06B6D4", "#3B82F6", "#6366F1", "#8B5CF6", "#EC4899", "#F5F0EB", "#1C1917"] },
    { name: "Reef Ecosystem", background: "#020B18", colors: ["#0077B6", "#00B4D8", "#CAF0F8", "#023E8A", "#48CAE4", "#FF6B35", "#06D6A0", "#F72585", "#90E0EF", "#0A9396", "#FFFBEB", "#E040FB"] },
    { name: "Night Market", background: "#0F0A1E", colors: ["#F59E0B", "#EC4899", "#06B6D4", "#8B5CF6", "#10B981", "#F43F5E", "#3B82F6", "#FBBF24", "#A855F7", "#14B8A6", "#E11D48", "#22D3EE"] },
    { name: "Rust & Verdigris", background: "#121210", colors: ["#B45309", "#78716C", "#92400E", "#D97706", "#57534E", "#A16207", "#059669", "#44403C", "#CA8A04", "#6B7280", "#166534", "#4ADE80"] },
  ],
};

// ── Scenario per colour count (for rendering previews) ─────────────────────
const SCENARIO_FOR_COUNT = {
  2: "majority-2-players-radius-1",
  3: "majority-strong",
  4: "rps4-default",
  5: "rps5-default",
  6: "d3-default",
  // 7: none
  8: "quaternion-default",
  // 9: none
  10: "rps-cascade-10",
  // 11: none
  12: "d6-default",
};

// ── Render helpers ─────────────────────────────────────────────────────────

function buildColorMap(snapshot, palette, scenario) {
  const rule = getRuleById(scenario.ruleId, scenario.config || {});
  const getColor = (val) =>
    typeof rule?.getColor === "function" ? rule.getColor(val) : val;

  const displayCounts = new Map();
  for (const val of snapshot.data) {
    const display = getColor(val);
    displayCounts.set(display, (displayCounts.get(display) || 0) + 1);
  }

  const sortedDisplayColors = [...displayCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([color]) => color);

  const displayToPalette = new Map();
  for (let i = 0; i < sortedDisplayColors.length; i++) {
    displayToPalette.set(
      sortedDisplayColors[i],
      palette.colors[i % palette.colors.length]
    );
  }

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

  ctx.fillStyle = bgColor || "#09090B";
  ctx.fillRect(0, 0, canvasSize, canvasSize);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const val = data[r * cols + c];
      const color = colorMap.get(val) || "#FF00FF";
      ctx.fillStyle = color;
      const x = Math.floor((c * canvasSize) / cols);
      const y = Math.floor((r * canvasSize) / rows);
      const w = Math.floor(((c + 1) * canvasSize) / cols) - x;
      const h = Math.floor(((r + 1) * canvasSize) / rows) - y;
      ctx.fillRect(x, y, w, h);
    }
  }

  return canvas.toBuffer("image/png");
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  const outDir = join(projectRoot, "hero-previews");
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

  const thumbSize = 400;
  const counts = Object.keys(PALETTE_CATALOGUE).map(Number).sort((a, b) => a - b);

  // Pre-load snapshots and scenarios for counts that have them
  const loaded = {};
  for (const count of counts) {
    const scenarioId = SCENARIO_FOR_COUNT[count];
    if (!scenarioId) continue;

    const snapshotPath = join(projectRoot, "snapshots", `${scenarioId}.json`);
    if (!existsSync(snapshotPath)) {
      console.warn(`Snapshot not found for '${scenarioId}' (count ${count}), will show swatches only.`);
      continue;
    }
    const snapshot = JSON.parse(readFileSync(snapshotPath, "utf-8"));
    const scenario = SCENARIOS.find((s) => s.id === scenarioId);
    if (!scenario) {
      console.warn(`Scenario '${scenarioId}' not in SCENARIOS, will show swatches only.`);
      continue;
    }
    loaded[count] = { scenarioId, snapshot, scenario };
  }

  // Render all palettes
  const sections = [];
  for (const count of counts) {
    const palettes = PALETTE_CATALOGUE[count];
    const data = loaded[count];
    const hasPreview = !!data;

    const paletteResults = [];
    for (let i = 0; i < palettes.length; i++) {
      const palette = palettes[i];
      let filename = null;

      if (hasPreview) {
        const colorMap = buildColorMap(data.snapshot, palette, data.scenario);
        const buffer = renderThumbnail(data.snapshot, colorMap, thumbSize, palette.background);
        filename = `count-${count}-${String(i + 1).padStart(2, "0")}-${palette.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`;
        writeFileSync(join(outDir, filename), buffer);
      }

      paletteResults.push({ ...palette, filename });
    }

    sections.push({
      count,
      scenarioId: data?.scenarioId || null,
      hasPreview,
      palettes: paletteResults,
    });

    console.log(`[${count} colours] ${palettes.length} palettes${hasPreview ? ` — rendered with ${data.scenarioId}` : " — swatches only"}`);
  }

  // ── Generate HTML ──────────────────────────────────────────────────────────
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Palette Catalogue</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #09090B; color: #F4F4F5; font-family: 'Inter', system-ui, sans-serif; padding: 48px 24px; }
  h1 { text-align: center; font-size: 1.5rem; font-weight: 500; margin-bottom: 12px; color: #A1A1AA; }
  .subtitle { text-align: center; font-size: 0.85rem; color: #52525B; margin-bottom: 48px; }
  .catalogue { display: flex; flex-direction: column; gap: 64px; max-width: 1600px; margin: 0 auto; }

  .section { display: flex; flex-direction: column; gap: 20px; }
  .section-header { display: flex; align-items: baseline; gap: 12px; border-bottom: 1px solid #27272A; padding-bottom: 12px; }
  .section-count { font-size: 1.8rem; font-weight: 600; color: #F4F4F5; font-family: ui-monospace, monospace; min-width: 2ch; }
  .section-label { font-size: 0.85rem; color: #71717A; }
  .section-scenario { font-size: 0.75rem; color: #3F3F46; font-family: ui-monospace, monospace; }

  .palette-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; }
  .palette-card { display: flex; flex-direction: column; gap: 8px; }
  .palette-card img { width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 6px; display: block; }
  .palette-name { font-size: 0.85rem; font-weight: 500; color: #D4D4D8; }
  .swatches { display: flex; gap: 2px; height: 20px; }
  .swatch { flex: 1; border-radius: 3px; }
  .swatch:first-child { border-radius: 5px 3px 3px 5px; }
  .swatch:last-child { border-radius: 3px 5px 5px 3px; }
  .bg-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; vertical-align: middle; margin-left: 6px; border: 1px solid #3F3F46; }

  .swatch-only { padding: 16px; background: #18181B; border-radius: 8px; }
  .swatch-only .swatches { height: 32px; }

  @media (max-width: 700px) {
    .palette-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); }
  }
</style>
</head>
<body>
<h1>Palette Catalogue</h1>
<p class="subtitle">Colour schemes organized by number of colours, each shown against a representative scenario</p>
<div class="catalogue">
${sections
  .map(
    (s) => `  <div class="section">
    <div class="section-header">
      <span class="section-count">${s.count}</span>
      <span class="section-label">colour${s.count !== 1 ? "s" : ""}</span>
      ${s.scenarioId ? `<span class="section-scenario">${s.scenarioId}</span>` : `<span class="section-scenario">swatches only</span>`}
    </div>
    <div class="palette-grid">
${s.palettes
  .map(
    (p) => `      <div class="palette-card${!p.filename ? " swatch-only" : ""}">
        ${p.filename ? `<img src="${p.filename}" alt="${p.name}" />` : ""}
        <span class="palette-name">${p.name}<span class="bg-dot" style="background:${p.background}"></span></span>
        <div class="swatches">
${p.colors.map((c) => `          <div class="swatch" style="background:${c}" title="${c}"></div>`).join("\n")}
        </div>
      </div>`
  )
  .join("\n")}
    </div>
  </div>`
  )
  .join("\n")}
</div>
</body>
</html>`;

  writeFileSync(join(outDir, "index.html"), html);
  console.log(`\nDone! Open hero-previews/index.html to compare.`);
}

main();
