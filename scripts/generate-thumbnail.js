#!/usr/bin/env node

/**
 * Generate thumbnail for a rule at a specific iteration
 * Uses Node.js canvas to render without Puppeteer
 * 
 * Usage: node scripts/generate-thumbnail.js <ruleId> [iteration] [canvasSize]
 * 
 * Examples:
 *   node scripts/generate-thumbnail.js majority 100
 *   node scripts/generate-thumbnail.js d3 50
 *   node scripts/generate-thumbnail.js imaginary-single 25 512
 */

import { createCanvas } from 'canvas';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Import core classes
import { Automaton } from '../core/Automaton.js';
import { DrawingEngine } from '../drawing/DrawingEngine.js';
import { RULES } from '../rules/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Default fallback color
function getColorForValue(value) {
  return '#CCCCCC';
}

/**
 * Generate a thumbnail for a given rule
 * @param {string} ruleId - The rule ID (e.g., 'majority', 'd3')
 * @param {number} iterations - Number of iterations to run (default: 100)
 * @param {number} canvasSize - Canvas size in pixels (default: 400)
 */
async function generateThumbnail(ruleId, iterations = 100, canvasSize = 400) {
  console.log(`Generating thumbnail for rule: ${ruleId}`);
  console.log(`Iterations: ${iterations}, Canvas size: ${canvasSize}px`);

  // Get rule factory
  const ruleFactory = RULES[ruleId];
  if (!ruleFactory) {
    throw new Error(`Rule '${ruleId}' not found. Available rules: ${Object.keys(RULES).join(', ')}`);
  }

  // Create canvas
  const canvas = createCanvas(canvasSize, canvasSize);
  
  // Create rule instance
  const rule = ruleFactory();
  
  // Create drawing engine with color mapping from rule
  const drawingEngine = new DrawingEngine({
    canvas,
    getColor: (val) => typeof rule.getColor === 'function' ? rule.getColor(val) : getColorForValue(val)
  });

  // Create automaton
  const automaton = new Automaton({ rule });
  
  // Initialize with rule's initial state
  const initialState = rule.createInitialState();
  automaton.initialise(initialState);
  
  // Draw initial state
  drawingEngine.draw(automaton.state);
  
  // Run iterations
  console.log(`Running ${iterations} iterations...`);
  for (let i = 0; i < iterations; i++) {
    if (automaton.stable) {
      console.log(`Reached stable state at iteration ${i}`);
      break;
    }
    automaton.step();
    drawingEngine.draw(automaton.state);
  }
  
  // Ensure thumbnails directory exists
  const thumbnailsDir = join(projectRoot, 'thumbnails');
  if (!existsSync(thumbnailsDir)) {
    mkdirSync(thumbnailsDir, { recursive: true });
  }
  
  // Save to file
  const outputPath = join(thumbnailsDir, `${ruleId}.png`);
  const buffer = canvas.toBuffer('image/png');
  writeFileSync(outputPath, buffer);
  
  console.log(`✓ Thumbnail saved to: ${outputPath}`);
  console.log(`  Final iteration: ${automaton.iteration}`);
  console.log(`  Stable: ${automaton.stable}`);
}

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Usage: npm run thumbnail <rule-id> [iterations] [canvas-size]');
  console.log('');
  console.log('Examples:');
  console.log('  npm run thumbnail majority 100');
  console.log('  npm run thumbnail d3 150 512');
  console.log('  npm run thumbnail rps3 200');
  console.log('');
  console.log('Available rules:');
  Object.keys(RULES).forEach(id => console.log(`  - ${id}`));
  process.exit(1);
}

const ruleId = args[0];
const iterations = args[1] ? parseInt(args[1], 10) : 100;
const canvasSize = args[2] ? parseInt(args[2], 10) : 400;

generateThumbnail(ruleId, iterations, canvasSize)
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed:', error);
    process.exit(1);
  });
