#!/usr/bin/env node

/**
 * Generate 10 hero image previews with different color concepts.
 * Each preview uses the same snapshot matrix but a different palette.
 * Also generates an HTML file to compare them side-by-side with swatches.
 */

import { createCanvas } from "canvas";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

import { HERO_SCENARIO_ID, SCENARIOS } from "../scenarios.js";
import { getRuleById } from "../rules/index.js";
import { Automaton } from "../core/Automaton.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");

// ── 10 color concepts ──────────────────────────────────────────────────────
// Each has a name, description, background, and 15 colors (mapped by prominence rank).
// Positions 0-2 are the most prominent cells, 9 is the least.

const CONCEPTS = [
  {
    name: "Neon Bloom",
    description: "Electric brights on void black — arcade glow, high contrast, synthetic flora.",
    background: "#050510",
    colors: [
      "#FF2D6B", "#00F5D4", "#FFE53B", "#7B61FF", "#00BBFF",
      "#FF6B35", "#39FF14", "#FF85A1", "#18E4FF", "#C77DFF",
      "#FFD166", "#06D6A0", "#EF476F", "#4CC9F0", "#F72585",
    ],
  },
  {
    name: "Deep Ocean",
    description: "Abyssal blues through bioluminescent teals — pressure, depth, cold light.",
    background: "#020B18",
    colors: [
      "#0077B6", "#00B4D8", "#CAF0F8", "#023E8A", "#48CAE4",
      "#90E0EF", "#0096C7", "#ADE8F4", "#03045E", "#00F5D4",
      "#0A9396", "#005F73", "#94D2BD", "#1B4965", "#5FA8D3",
    ],
  },
  {
    name: "Ember & Ash",
    description: "Smouldering fire through charcoal — warmth buried in dark, volcanic heat.",
    background: "#0A0604",
    colors: [
      "#FF4D00", "#FF8800", "#FFAA00", "#CC3700", "#FFD60A",
      "#9D0208", "#E85D04", "#FFBA08", "#DC2F02", "#F48C06",
      "#6A040F", "#370617", "#D00000", "#FAA307", "#E5383B",
    ],
  },
  {
    name: "Botanical",
    description: "Lush greens, soil browns, petal accents — a living canopy seen from above.",
    background: "#0B1A0F",
    colors: [
      "#2D6A4F", "#95D5B2", "#D8F3DC", "#1B4332", "#52B788",
      "#B7E4C7", "#40916C", "#74C69D", "#D4A373", "#E9C46A",
      "#FAEDCD", "#264653", "#8AB17D", "#2A9D8F", "#F4A261",
    ],
  },
  {
    name: "Ultraviolet",
    description: "UV purples through hot pinks — blacklight party, fluorescent intensity.",
    background: "#0D001A",
    colors: [
      "#B5179E", "#7209B7", "#F72585", "#560BAD", "#480CA8",
      "#3A0CA3", "#3F37C9", "#4361EE", "#4895EF", "#4CC9F0",
      "#E040FB", "#D500F9", "#AA00FF", "#7C4DFF", "#FF80AB",
    ],
  },
  {
    name: "Sumi Ink",
    description: "Japanese ink wash — near-black through warm whites, subtle warmth in restraint.",
    background: "#0C0A09",
    colors: [
      "#F5F0EB", "#1C1917", "#A8A29E", "#57534E", "#D6D3D1",
      "#78716C", "#E7E5E4", "#44403C", "#292524", "#FAFAF9",
      "#C8B9A6", "#8E7F6F", "#6B5E50", "#D4C4B0", "#3A3330",
    ],
  },
  {
    name: "Candy Pop",
    description: "Saturated pastels — playful, loud, bubblegum palette with punchy contrast.",
    background: "#1A1025",
    colors: [
      "#FF6B9D", "#C084FC", "#67E8F9", "#FDE047", "#F0ABFC",
      "#A3E635", "#FB923C", "#38BDF8", "#F472B6", "#34D399",
      "#FBBF24", "#818CF8", "#FB7185", "#2DD4BF", "#E879F9",
    ],
  },
  {
    name: "Rust Belt",
    description: "Industrial decay — oxidized metals, concrete, verdigris, found beauty in corrosion.",
    background: "#121210",
    colors: [
      "#B45309", "#78716C", "#92400E", "#D97706", "#57534E",
      "#A16207", "#059669", "#44403C", "#CA8A04", "#6B7280",
      "#166534", "#1C1917", "#A3A3A3", "#854D0E", "#4ADE80",
    ],
  },
  {
    name: "Midnight Carnival",
    description: "Jewel tones on deep indigo — rich, theatrical, velvet richness.",
    background: "#0F0A1E",
    colors: [
      "#F59E0B", "#EC4899", "#06B6D4", "#8B5CF6", "#10B981",
      "#F43F5E", "#3B82F6", "#FBBF24", "#A855F7", "#14B8A6",
      "#E11D48", "#6366F1", "#F97316", "#22D3EE", "#D946EF",
    ],
  },
  {
    name: "Solar Flare",
    description: "White-hot core fading through gold to deep space — stellar plasma, radiant energy.",
    background: "#060208",
    colors: [
      "#FFFBEB", "#FEF08A", "#FACC15", "#F59E0B", "#F97316",
      "#EF4444", "#DC2626", "#B91C1C", "#991B1B", "#7F1D1D",
      "#FDE68A", "#FCD34D", "#FBBF24", "#E88D2A", "#D4731A",
    ],
  },
];

// ── Reuse render logic from render-thumbnails.js ────────────────────────────

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

  return { colorMap, sortedDisplayColors, displayToPalette };
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

// ── Scenarios to preview ────────────────────────────────────────────────────
// Hero + a few structurally distinct ones for context.
const PREVIEW_SCENARIOS = [
  HERO_SCENARIO_ID,        // organic RPS cascade (10 colors)
  "quaternion-pizza",      // geometric quilt (few colors, sharp lines)
  "majority-strong",       // bold organic blobs (3 colors)
  "d6-default",            // intricate radial symmetry (many colors)
];

// ── Timeline: one scenario captured at multiple iteration points ────────────
const TIMELINE_SCENARIO_ID = "quaternion-pizza";
const TIMELINE_ITERATIONS = [0, 4, 7, 8, 15, 16, 17, 60, 72, 76, 83, 84];

function generateTimelineSnapshots(scenarioId, iterations) {
  const scenario = SCENARIOS.find((s) => s.id === scenarioId);
  if (!scenario) throw new Error(`Scenario '${scenarioId}' not found`);

  const rule = getRuleById(scenario.ruleId, scenario.config || {});
  if (!rule) throw new Error(`Rule '${scenario.ruleId}' not found`);

  const automaton = new Automaton({ rule });
  const initialState = rule.createInitialState();
  automaton.initialise(initialState);

  const maxIter = Math.max(...iterations);
  const snapshots = new Map();

  // Capture iteration 0 (initial state) if requested
  if (iterations.includes(0)) {
    snapshots.set(0, {
      scenarioId,
      ruleId: scenario.ruleId,
      rows: automaton.state.rows,
      cols: automaton.state.cols,
      data: [...automaton.state.data],
      iteration: 0,
    });
  }

  for (let i = 1; i <= maxIter; i++) {
    if (automaton.stable) {
      console.log(`  [timeline] Stable at iteration ${i}, filling remaining`);
      // Fill any remaining requested iterations with current state
      for (const t of iterations) {
        if (t >= i && !snapshots.has(t)) {
          snapshots.set(t, {
            scenarioId,
            ruleId: scenario.ruleId,
            rows: automaton.state.rows,
            cols: automaton.state.cols,
            data: [...automaton.state.data],
            iteration: t,
          });
        }
      }
      break;
    }
    automaton.step();
    if (iterations.includes(i)) {
      snapshots.set(i, {
        scenarioId,
        ruleId: scenario.ruleId,
        rows: automaton.state.rows,
        cols: automaton.state.cols,
        data: [...automaton.state.data],
        iteration: i,
      });
    }
  }

  // Return in iteration order
  return iterations
    .filter((t) => snapshots.has(t))
    .map((t) => snapshots.get(t));
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  // Load all snapshots + scenarios up front
  const loaded = [];
  for (const sid of PREVIEW_SCENARIOS) {
    const snapshotPath = join(projectRoot, "snapshots", `${sid}.json`);
    if (!existsSync(snapshotPath)) {
      console.warn(`Snapshot not found for '${sid}', skipping.`);
      continue;
    }
    const snapshot = JSON.parse(readFileSync(snapshotPath, "utf-8"));
    const scenario = SCENARIOS.find((s) => s.id === sid);
    if (!scenario) {
      console.warn(`Scenario '${sid}' not in SCENARIOS, skipping.`);
      continue;
    }
    loaded.push({ sid, snapshot, scenario });
  }

  if (loaded.length === 0) {
    console.error("No valid snapshots found. Run `node scripts/generate-snapshots.js` first.");
    process.exit(1);
  }

  const outDir = join(projectRoot, "hero-previews");
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

  const heroSize = 800;
  const supportSize = 400;
  const previews = [];

  for (let i = 0; i < CONCEPTS.length; i++) {
    const concept = CONCEPTS[i];
    const palette = { background: concept.background, colors: concept.colors };
    const slug = concept.name.toLowerCase().replace(/\s+/g, "-");
    const prefix = String(i + 1).padStart(2, "0");

    const images = [];
    let heroMappedColors = [];

    for (const { sid, snapshot, scenario } of loaded) {
      const { colorMap, sortedDisplayColors, displayToPalette } = buildColorMap(snapshot, palette, scenario);
      const isHero = sid === HERO_SCENARIO_ID;
      const size = isHero ? heroSize : supportSize;
      const buffer = renderThumbnail(snapshot, colorMap, size, palette.background);
      const filename = `${prefix}-${slug}-${sid}.png`;
      writeFileSync(join(outDir, filename), buffer);

      if (isHero) {
        heroMappedColors = sortedDisplayColors.map((dc) => displayToPalette.get(dc));
      }

      images.push({ sid, filename, isHero });
    }

    previews.push({ ...concept, images, mappedColors: heroMappedColors });
    console.log(`[${i + 1}/10] ${concept.name}`);
  }

  // ── Timeline: run simulation, capture at each iteration point ─────────────
  console.log(`\nGenerating timeline for '${TIMELINE_SCENARIO_ID}'...`);
  const timelineScenario = SCENARIOS.find((s) => s.id === TIMELINE_SCENARIO_ID);
  const timelineSnapshots = generateTimelineSnapshots(TIMELINE_SCENARIO_ID, TIMELINE_ITERATIONS);
  console.log(`  Captured ${timelineSnapshots.length} iteration snapshots`);

  const timelineSize = 300;
  // For each concept, render all timeline snapshots
  for (let i = 0; i < previews.length; i++) {
    const concept = previews[i];
    const palette = { background: concept.background, colors: concept.colors };
    const slug = concept.name.toLowerCase().replace(/\s+/g, "-");
    const prefix = String(i + 1).padStart(2, "0");

    concept.timeline = [];
    for (const snap of timelineSnapshots) {
      const { colorMap } = buildColorMap(snap, palette, timelineScenario);
      const buffer = renderThumbnail(snap, colorMap, timelineSize, palette.background);
      const filename = `${prefix}-${slug}-timeline-${snap.iteration}.png`;
      writeFileSync(join(outDir, filename), buffer);
      concept.timeline.push({ iteration: snap.iteration, filename });
    }
    console.log(`  [${i + 1}/10] ${concept.name} timeline rendered`);
  }

  // ── Generate comparison HTML ──────────────────────────────────────────────
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Hero Palette Previews</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #09090B; color: #F4F4F5; font-family: 'Inter', system-ui, sans-serif; padding: 48px 24px; }
  h1 { text-align: center; font-size: 1.5rem; font-weight: 500; margin-bottom: 48px; color: #A1A1AA; }
  .concepts { display: flex; flex-direction: column; gap: 72px; max-width: 1400px; margin: 0 auto; }
  .concept { display: flex; flex-direction: column; gap: 20px; }
  .concept-header { display: flex; align-items: baseline; gap: 12px; }
  .concept-number { font-size: 0.75rem; color: #52525B; font-family: ui-monospace, monospace; }
  .concept-name { font-size: 1.3rem; font-weight: 500; }
  .concept-desc { font-size: 0.85rem; color: #71717A; line-height: 1.5; max-width: 600px; }
  .concept-images { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 12px; align-items: start; }
  .concept-images img { width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 6px; display: block; }
  .concept-images img.hero { border-radius: 8px; }
  .swatches { display: flex; gap: 3px; }
  .swatch { flex: 1; height: 24px; border-radius: 3px; }
  .swatch:first-child { border-radius: 5px 3px 3px 5px; }
  .swatch:last-child { border-radius: 3px 5px 5px 3px; }
  .bg-bar { height: 5px; border-radius: 3px; max-width: 200px; }
  .section-title { font-size: 1rem; font-weight: 500; color: #71717A; margin-top: 24px; letter-spacing: 0.05em; text-transform: uppercase; font-size: 0.7rem; }
  .timeline { display: grid; grid-template-columns: repeat(${TIMELINE_ITERATIONS.length}, 1fr); gap: 6px; align-items: start; }
  .timeline-frame { display: flex; flex-direction: column; gap: 4px; }
  .timeline-frame img { width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 4px; display: block; }
  .timeline-label { font-size: 0.65rem; color: #52525B; font-family: ui-monospace, monospace; text-align: center; }
  @media (max-width: 900px) {
    .concept-images { grid-template-columns: 1fr 1fr; }
    .timeline { grid-template-columns: repeat(4, 1fr); }
  }
</style>
</head>
<body>
<h1>Palette Concepts</h1>
<div class="concepts">
${previews
  .map(
    (p, i) => `  <div class="concept">
    <div class="concept-header">
      <span class="concept-number">${String(i + 1).padStart(2, "0")}</span>
      <span class="concept-name">${p.name}</span>
    </div>
    <div class="concept-desc">${p.description}</div>
    <div class="concept-images">
${p.images.map((img) => `      <img src="${img.filename}" alt="${p.name} — ${img.sid}"${img.isHero ? ' class="hero"' : ""} />`).join("\n")}
    </div>
    <div class="swatches">
${p.mappedColors.map((c) => `      <div class="swatch" style="background:${c}" title="${c}"></div>`).join("\n")}
    </div>
    <div class="bg-bar" style="background:${p.background}" title="bg: ${p.background}"></div>
    <div class="section-title">${TIMELINE_SCENARIO_ID} — evolution</div>
    <div class="timeline">
${(p.timeline || []).map((t) => `      <div class="timeline-frame">
        <img src="${t.filename}" alt="iteration ${t.iteration}" />
        <span class="timeline-label">${t.iteration === 0 ? "init" : t.iteration}</span>
      </div>`).join("\n")}
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
