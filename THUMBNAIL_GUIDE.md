# Thumbnail Generation Guide

This project uses Node.js canvas to generate thumbnails for cellular automaton rules. No browser or Puppeteer required!

## Quick Start

### Generate a single thumbnail
```bash
npm run thumbnail <rule-id> [iterations] [canvas-size]
```

Examples:
```bash
npm run thumbnail majority 100
npm run thumbnail d3 150
npm run thumbnail rps3 200 512
```

### Generate all thumbnails (selective)
```bash
npm run thumbnails:all
```

**Note:** By default, no thumbnails are generated to avoid overwriting existing ones. See "Selective Generation" below.

## Selective Generation

To generate/update specific thumbnails:

1. Open `scripts/generate-all-thumbnails.js`
2. Find the `RULE_CONFIGS` object
3. Set `enabled: true` for rules you want to update:

```javascript
const RULE_CONFIGS = {
  'majority': { iterations: 50, enabled: true },   // ✓ Will generate
  'rps3': { iterations: 100, enabled: false },      // ✗ Will skip
  'd3': { iterations: 50, enabled: true },          // ✓ Will generate
  // ...
};
```

4. Run `npm run thumbnails:all`

This lets you:
- Keep existing thumbnails you're happy with
- Only regenerate specific ones
- Test different iteration counts without affecting others

## How It Works

The thumbnail generator:
1. Creates a Node.js canvas element (no browser needed)
2. Instantiates the rule and automaton
3. Runs the specified number of iterations
4. Saves the final canvas state as a PNG image

## File Naming Convention

Thumbnails are saved in the `thumbnails/` directory with the naming pattern:
```
thumbnails/<rule-id>.png
```

For example:
- `thumbnails/majority.png`
- `thumbnails/d3.png`
- `thumbnails/rps3.png`

## Recommended Iteration Counts

Different rules reach interesting states at different iteration counts:

- **Majority rules**: 50-100 iterations
- **RPS variants**: 100-200 iterations
- **Group-based rules**: 50-100 iterations
- **Genetic drift**: 100-150 iterations

## Customization

### Canvas Size
Default is 400x400 pixels. You can specify a different size:

```bash
npm run thumbnail majority 100 512  # 512x512 canvas
```

## Integration with Gallery

The `index.html` gallery automatically displays thumbnails if they exist. The gallery card looks for:
```
thumbnails/<rule-id>.png
```

If a thumbnail doesn't exist, a placeholder is shown instead.

## Manual Capture (In-Browser)

While in the play.html view, you can also use the "Capture Screenshot" button to manually download a screenshot of the current canvas state. This downloads to your browser's Downloads folder and would need to be manually moved to the `thumbnails/` directory with the correct naming convention.

## Troubleshooting

### Canvas package not installed
```bash
npm install --save-dev canvas
```

### Rule not found
Check that the rule ID matches exactly what's in `rules/index.js`.

### Poor quality thumbnail
Try:
1. Increasing iterations: `npm run thumbnail <rule-id> 200`
2. Increasing canvas size: `npm run thumbnail <rule-id> 100 800`
3. Adjusting the iteration count for that rule in `RULE_CONFIGS`
