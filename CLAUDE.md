# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Interactive cellular automata playground and gallery. Pure vanilla JavaScript (no frameworks, no build tools) using ES modules natively in the browser. 25+ rule implementations exploring emergent behavior including majority voting, rock-paper-scissors dynamics, genetic drift, and group-theoretic (quaternion, dihedral, cyclic) rules.

## Commands

```bash
# Run tests (Jest with jsdom)
npm test

# Generate a single thumbnail
npm run thumbnail <rule-id> [iterations] [canvas-size]

# Generate all thumbnails
npm run thumbnails:all
```

No build step, no linter. Open `index.html` in a browser for the gallery, or `play.html?scenario=<id>` to run a specific scenario.

## Architecture

**Core engine** (`core/`):
- `Rule.js` — Abstract base class. Subclasses implement `nextValue(row, col, state)` to define cell update logic. Returns `null` to keep current value.
- `Automaton.js` — Drives rule application per generation, maintains state history (last 200), detects loops (stops when a repeated state is found).
- `Matrix.js` — Flat 1D array with 2D `get(row, col)`/`set(row, col, val)` interface. Toroidal wrapping (edges connect).

**Rules** (`rules/`):
- Each rule extends `Rule` and lives in its own file. Registry + metadata in `rules/index.js` (`RULES` map, `RULE_META`, `getRuleById()`).
- Neighborhood access via `getListOfNeighbourValues()`. Override `shouldIncludeOffset()` to customize neighborhood shape.

**Scenarios** (`scenarios.js`):
- **Source of truth** for presentation. Decouples rule logic from display config (colors, grid size, labels, tags, descriptions).
- One rule can have multiple scenarios with different aesthetics.
- Each scenario: `{ id, ruleId, label, description, config: { ordering, radius, gridSize, ... }, tags }`.

**Rendering** (`drawing/DrawingEngine.js`):
- Maps cell values to colors via rule's `getColor(value)` and renders to HTML5 Canvas.

**UI** (`ui/`):
- `State.js` — Event dispatcher / state machine for simulation lifecycle (START → PAUSE → END).
- `SimulationController.js` — Animation loop: calls `step()` then `draw()`, fires onChange/onEnd callbacks.
- `initSimulation.js` — Entry point that wires scenario → rule → automaton → controller → UI.

**Data flow**: `play.html` → `initSimulation()` → `getRuleById()` creates Rule → `Automaton` + `SimulationController` initialized → `State` handles user input → `Controller.step()` → `Rule.nextValue()` → `DrawingEngine.draw()`.

## Adding a New Rule

1. Create `rules/YourRule.js` extending `Rule`, implement `nextValue(row, col, state)`.
2. Register in `rules/index.js` (add to `RULES` map and `RULE_META`).
3. Add scenario(s) in `scenarios.js` with display config.
4. Add tests in `tests/rules/`.

## Testing

Tests live in `tests/` mirroring the source structure. Jest runs with `--experimental-vm-modules` for ESM support and uses `jsdom` environment (configured in `jest.config.js`). Rule-specific tests are in `tests/rules/`.
