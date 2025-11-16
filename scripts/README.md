# Thumbnail Generation Scripts

This directory contains scripts for generating thumbnails programmatically.

## Setup

First, install dependencies:

```bash
npm install
```

## Usage

### Generate a single thumbnail

```bash
npm run thumbnail <ruleId> [iteration]
```

Examples:

```bash
npm run thumbnail game-of-life 100
npm run thumbnail d3 50
npm run thumbnail imaginary-single 25
```

### Generate all thumbnails (selective)

```bash
npm run thumbnails:all
```

By default, no thumbnails are generated to avoid overwriting existing ones. To generate thumbnails for specific rules:

1. Open `scripts/generate-all-thumbnails.js`
2. In the `RULE_CONFIGS` object, set `enabled: true` for the rules you want to update
3. Run the script

Example configuration:

```javascript
const RULE_CONFIGS = {
  'majority': { iterations: 50, enabled: true },  // Will be generated
  'rps3': { iterations: 100, enabled: false },     // Will be skipped
  'd3': { iterations: 50, enabled: true },         // Will be generated
  // ...
};
```

## Configuration

Each rule in `RULE_CONFIGS` has:
- `iterations`: Number of steps to run before capturing
- `enabled`: Toggle to control whether to generate/update this thumbnail

## How it works

The scripts use Node.js canvas to:
1. Create a rule instance
2. Run the simulation for the specified iterations
3. Render the final state to a canvas
4. Save it to `thumbnails/<ruleId>.png`

The thumbnails are automatically picked up by `index.html` for display in the gallery view.
