export class InitPresetPanel {
  constructor({ panelEl, rule, controller, playControls, settledBadgeEl }) {
    this.panelEl = panelEl;
    this.rule = rule;
    this.controller = controller;
    this.playControls = playControls;
    this.settledBadgeEl = settledBadgeEl;
    this.sectionEl = null;
    this.activePreset = rule.initPreset || null;
  }

  render() {
    const presets = this.rule.constructor.INIT_PRESETS;
    if (!presets || Object.keys(presets).length <= 1) return;

    this.sectionEl = document.createElement("div");
    this.sectionEl.className = "init-preset-section";

    const title = document.createElement("div");
    title.textContent = "Starting Pattern";
    title.style.cssText =
      "font-size: var(--text-sm); color: var(--text-muted); margin-bottom: var(--space-2); font-weight: 500;";
    this.sectionEl.appendChild(title);

    const btnRow = document.createElement("div");
    btnRow.style.cssText =
      "display: flex; flex-wrap: wrap; gap: var(--space-1); margin-bottom: var(--space-4);";

    for (const [key, preset] of Object.entries(presets)) {
      const btn = document.createElement("button");
      btn.textContent = preset.label;
      btn.dataset.preset = key;
      btn.style.cssText = `
        padding: var(--space-1) var(--space-3);
        background: transparent;
        border: 1px solid var(--border);
        border-radius: 6px;
        cursor: pointer;
        color: var(--text-muted);
        font-size: var(--text-sm);
        font-family: var(--font-body);
        transition: border-color 0.15s, background 0.15s;
      `;

      if (key === this.activePreset) {
        btn.style.borderColor = "var(--text-faint)";
        btn.style.background = "var(--surface-raised, rgba(255,255,255,0.08))";
      }

      btn.addEventListener("click", () => {
        this.activePreset = key;
        this.rule.initPreset = key;
        this.controller.reset();
        if (this.playControls) this.playControls.onReset();
        if (this.settledBadgeEl)
          this.settledBadgeEl.classList.remove("visible");
        this._updateButtons();
      });

      btn.addEventListener("mouseenter", () => {
        if (key !== this.activePreset) {
          btn.style.borderColor = "var(--text-faint)";
        }
      });
      btn.addEventListener("mouseleave", () => {
        if (key !== this.activePreset) {
          btn.style.borderColor = "var(--border)";
        }
      });

      btnRow.appendChild(btn);
    }

    this.sectionEl.appendChild(btnRow);
    this.panelEl.appendChild(this.sectionEl);
  }

  _updateButtons() {
    if (!this.sectionEl) return;
    const buttons = this.sectionEl.querySelectorAll("button[data-preset]");
    buttons.forEach((btn) => {
      const key = btn.dataset.preset;
      if (key === this.activePreset) {
        btn.style.borderColor = "var(--text-faint)";
        btn.style.background = "var(--surface-raised, rgba(255,255,255,0.08))";
      } else {
        btn.style.borderColor = "var(--border)";
        btn.style.background = "transparent";
      }
    });
  }
}
