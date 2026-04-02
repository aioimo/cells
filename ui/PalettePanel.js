export class PalettePanel {
  constructor({ panelEl, colorOverride, rule, scenario, onColorChange }) {
    this.panelEl = panelEl;
    this.colorOverride = colorOverride;
    this.rule = rule;
    this.scenario = scenario;
    this.onColorChange = onColorChange;
    this.originalColors = this._getOriginalColors();
    // Capture the gallery palette defaults so reset restores to them
    this.defaultOverrides = new Map(this.colorOverride.overrides);
    this.sectionEl = null;
  }

  render() {
    this.sectionEl = document.createElement("div");
    this.sectionEl.className = "palette-section";

    // Section title
    const title = document.createElement("div");
    title.className = "palette-section-title";
    title.textContent = "Colors";
    title.style.cssText =
      "font-size: var(--text-sm); color: var(--text-muted); margin-bottom: var(--space-3); font-weight: 500;";
    this.sectionEl.appendChild(title);

    // Color swatches with pickers
    const swatchRow = document.createElement("div");
    swatchRow.style.cssText =
      "display: flex; flex-wrap: wrap; gap: var(--space-2); margin-bottom: var(--space-4);";

    this.originalColors.forEach((color) => {
      const wrapper = document.createElement("label");
      wrapper.style.cssText = "position: relative; cursor: pointer;";

      const swatch = document.createElement("div");
      swatch.style.cssText = `width: 32px; height: 32px; border-radius: 6px; background: ${color}; border: 1px solid var(--border);`;
      swatch.dataset.originalColor = color;

      const input = document.createElement("input");
      input.type = "color";
      input.value = this._toHex6(color);
      input.style.cssText =
        "position: absolute; inset: 0; opacity: 0; width: 100%; height: 100%; cursor: pointer;";

      input.addEventListener("input", (e) => {
        const newColor = e.target.value;
        swatch.style.background = newColor;
        this.colorOverride.setOverride(color, newColor);
        this.onColorChange();
      });

      wrapper.appendChild(swatch);
      wrapper.appendChild(input);
      swatchRow.appendChild(wrapper);
    });

    this.sectionEl.appendChild(swatchRow);

    // Preset palettes
    const palettes = this.scenario.palettes;
    if (palettes && palettes.length > 0) {
      const presetTitle = document.createElement("div");
      presetTitle.textContent = "Presets";
      presetTitle.style.cssText =
        "font-size: var(--text-sm); color: var(--text-muted); margin-bottom: var(--space-2); font-weight: 500;";
      this.sectionEl.appendChild(presetTitle);

      palettes.forEach((preset) => {
        const btn = document.createElement("button");
        btn.style.cssText = `
          display: flex; align-items: center; gap: var(--space-2);
          width: 100%; padding: var(--space-2); margin-bottom: var(--space-1);
          background: transparent; border: 1px solid var(--border);
          border-radius: 6px; cursor: pointer; color: var(--text-muted);
          font-size: var(--text-sm); font-family: var(--font-body);
          transition: border-color 0.15s;
        `;

        // Preview swatches
        const swatches = document.createElement("span");
        swatches.style.cssText = "display: flex; gap: 2px;";
        const previewColors = preset.map
          ? Object.values(preset.map)
          : this.originalColors;
        previewColors.forEach((c) => {
          const dot = document.createElement("span");
          dot.style.cssText = `width: 12px; height: 12px; border-radius: 3px; background: ${c};`;
          swatches.appendChild(dot);
        });

        const label = document.createElement("span");
        label.textContent = preset.name;

        btn.appendChild(swatches);
        btn.appendChild(label);

        btn.addEventListener("click", () => {
          this.colorOverride.applyPreset(preset.map);
          this._updateSwatches();
          this.onColorChange();
        });

        btn.addEventListener("mouseenter", () => {
          btn.style.borderColor = "var(--text-faint)";
        });
        btn.addEventListener("mouseleave", () => {
          btn.style.borderColor = "var(--border)";
        });

        this.sectionEl.appendChild(btn);
      });
    }

    // Reset link
    const resetBtn = document.createElement("button");
    resetBtn.textContent = "Reset colors";
    resetBtn.style.cssText = `
      font-size: var(--text-xs); color: var(--text-faint);
      background: none; border: none; cursor: pointer;
      padding: var(--space-2) 0; font-family: var(--font-body);
      transition: color 0.15s; margin-top: var(--space-2);
    `;
    resetBtn.addEventListener("mouseenter", () => {
      resetBtn.style.color = "var(--text-muted)";
    });
    resetBtn.addEventListener("mouseleave", () => {
      resetBtn.style.color = "var(--text-faint)";
    });
    resetBtn.addEventListener("click", () => {
      // Restore to gallery palette defaults, not bare rule colors
      this.colorOverride.overrides = new Map(this.defaultOverrides);
      this._updateSwatches();
      this.onColorChange();
    });
    this.sectionEl.appendChild(resetBtn);

    this.panelEl.appendChild(this.sectionEl);
  }

  _getOriginalColors() {
    // Return the currently active display colors (after gallery palette override)
    const ordering = this.rule.ordering || [];
    const seen = new Set();
    const colors = [];
    for (const val of ordering) {
      const color = this.colorOverride.getColor(val);
      if (!seen.has(color)) {
        seen.add(color);
        colors.push(color);
      }
    }
    return colors;
  }

  _updateSwatches() {
    if (!this.sectionEl) return;
    const swatches = this.sectionEl.querySelectorAll("[data-original-color]");
    swatches.forEach((swatch) => {
      const orig = swatch.dataset.originalColor;
      const current = this.colorOverride.overrides.get(orig) ?? orig;
      swatch.style.background = current;
      const input = swatch.parentElement.querySelector('input[type="color"]');
      if (input) input.value = this._toHex6(current);
    });
  }

  _toHex6(color) {
    // Handle named colors and existing hex — try to parse via canvas if needed
    if (/^#[0-9a-fA-F]{6}$/.test(color)) return color;
    if (/^#[0-9a-fA-F]{8}$/.test(color)) return color.slice(0, 7);
    if (/^#[0-9a-fA-F]{3}$/.test(color)) {
      return "#" + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
    }
    // Fallback for named colors: use a temporary canvas
    try {
      const ctx = document.createElement("canvas").getContext("2d");
      ctx.fillStyle = color;
      return ctx.fillStyle; // returns #rrggbb
    } catch {
      return "#000000";
    }
  }
}
