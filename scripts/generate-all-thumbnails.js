#!/usr/bin/env node

/**
 * Generate thumbnails for all rules using Node.js canvas
 * Usage: node scripts/generate-all-thumbnails.js
 */

import { createCanvas } from 'canvas';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

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

// Configuration for each rule
// Set enabled: true to generate/update thumbnail, false to skip
const RULE_CONFIGS = {
  'majority': { iterations: 50, enabled: false },
  'majority-diagonal': { iterations: 50, enabled: false },
  'majority-sticky-borders': { iterations: 50, enabled: false },
  'majority-strong-consensus': { iterations: 50, enabled: false },
  'rps3': { iterations: 100, enabled: false },
  'rps4': { iterations: 100, enabled: false },
  'rps5': { iterations: 100, enabled: false },
  'rps6': { iterations: 100, enabled: false },
  'rpsCascade': { iterations: 100, enabled: false },
  'genetic-drift': { iterations: 100, enabled: false },
  'genetic-drift-local': { iterations: 100, enabled: false },
  'genetic-drift-global': { iterations: 100, enabled: false },
  'imaginary-base': { iterations: 50, enabled: false },
  'imaginary-single': { iterations: 50, enabled: false },
  'imaginary-quadrants': { iterations: 50, enabled: false },
  'quaternion': { iterations: 50, enabled: false },
  'quaternion-pizza': { iterations: 50, enabled: false },
  'quaternion-spiral': { iterations: 50, enabled: false },
  'c4': { iterations: 50, enabled: false },
  'd3': { iterations: 50, enabled: false },
  'd4': { iterations: 50, enabled: false },
  'd6': { iterations: 50, enabled: false },
  'elem-abelian-2-2-2': { iterations: 50, enabled: false },
};

async function generateThumbnail(ruleId, iterations, canvasSize = 400) {
  try {
    console.log(`[${ruleId}] Generating (${iterations} iterations)...`);

    const ruleFactory = RULES[ruleId];
    if (!ruleFactory) {
      throw new Error(`Rule not found in RULES`);
    }

    const canvas = createCanvas(canvasSize, canvasSize);
    const rule = ruleFactory();
    const drawingEngine = new DrawingEngine({ 
      canvas, 
      getColor: (val) => typeof rule.getColor === 'function' ? rule.getColor(val) : getColorForValue(val)
    });
    const automaton = new Automaton({ rule });
    
    const initialState = rule.createInitialState();
    automaton.initialise(initialState);
    drawingEngine.draw(automaton.state);
    
    for (let i = 0; i < iterations; i++) {
      if (automaton.stable) {
        console.log(`[${ruleId}] Stable at iteration ${i}`);
        break;
      }
      automaton.step();
      drawingEngine.draw(automaton.state);
    }
    
    const thumbnailsDir = join(projectRoot, 'thumbnails');
    if (!existsSync(thumbnailsDir)) {
      mkdirSync(thumbnailsDir, { recursive: true });
    }
    
    const outputPath = join(thumbnailsDir, `${ruleId}.png`);
    const buffer = canvas.toBuffer('image/png');
    writeFileSync(outputPath, buffer);
    
    console.log(`[${ruleId}] ✓ Saved (iteration: ${automaton.iteration})`);
    return true;
  } catch (error) {
    console.error(`[${ruleId}] ✗ Error: ${error.message}`);
    return false;
  }
}

async function generateAllThumbnails() {
  console.log('Starting thumbnail generation for selected rules...\n');
  
  // Filter only enabled rules
  const enabledRules = Object.entries(RULE_CONFIGS).filter(([_, config]) => config.enabled);
  
  if (enabledRules.length === 0) {
    console.log('⚠️  No rules enabled for generation.');
    console.log('Edit RULE_CONFIGS in this script and set enabled: true for rules you want to update.\n');
    return;
  }
  
  console.log(`Generating thumbnails for ${enabledRules.length} rule(s):\n`);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const [ruleId, config] of enabledRules) {
    const success = await generateThumbnail(ruleId, config.iterations);
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
    console.error('Failed:', error);
    process.exit(1);
  });
