# Thumbnails Directory

This directory contains thumbnail images for each cellular automata rule displayed in the gallery.

## Creating Thumbnails

### Method 1: Using the UI Button

1. Open any rule in the browser: `play.html?rule=majority`
2. Let the simulation run until you get an interesting visual pattern
3. Click the **"Set as Thumbnail"** button
4. Your browser will download a file named `majority.png` (matching the rule ID)
5. Move the downloaded file from your Downloads folder to this `/thumbnails/` directory
6. Refresh the gallery page to see the new thumbnail

### Method 2: Manual Screenshots

1. Navigate to a rule page
2. Take a screenshot of the canvas
3. Crop/resize to 400×400px square
4. Save as `{rule-id}.png` in this directory

## Naming Convention

**IMPORTANT**: Thumbnail filenames MUST exactly match the rule ID from `rules/index.js`

Examples:
- Rule ID: `"majority"` → File: `majority.png`
- Rule ID: `"conways-life"` → File: `conways-life.png`
- Rule ID: `"d3"` → File: `d3.png`
- Rule ID: `"imaginary-single"` → File: `imaginary-single.png`

## Checking Status

Open `utils/checkThumbnails.html` in your browser to see:
- Which rules have thumbnails
- Which rules are missing thumbnails
- Click on missing rules to quickly navigate and create them

## Technical Specs

- **Format**: PNG
- **Recommended Size**: 400×400px (CSS will scale as needed)
- **Target File Size**: < 50KB per image
- **Purpose**: Visual preview in the gallery index page

## Auto-Discovery

The gallery automatically looks for thumbnails in this directory. If a thumbnail exists for a rule, it will be displayed. If not, the card will show only the title and description.

No code changes needed - just add the PNG files here with the correct names!
