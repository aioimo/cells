export class ColorOverride {
  constructor(originalGetColor) {
    this.originalGetColor = originalGetColor;
    this.overrides = new Map();
  }

  getColor(val) {
    const original = this.originalGetColor(val);
    return this.overrides.get(original) ?? original;
  }

  setOverride(originalColor, newColor) {
    this.overrides.set(originalColor, newColor);
  }

  applyPreset(colorMap) {
    this.overrides.clear();
    if (colorMap) {
      Object.entries(colorMap).forEach(([from, to]) =>
        this.overrides.set(from, to)
      );
    }
  }

  reset() {
    this.overrides.clear();
  }

  getOriginalColors(ordering, getColor) {
    const seen = new Set();
    const colors = [];
    for (const val of ordering) {
      const color = getColor ? getColor(val) : val;
      if (!seen.has(color)) {
        seen.add(color);
        colors.push(color);
      }
    }
    return colors;
  }
}
