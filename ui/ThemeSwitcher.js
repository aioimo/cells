// ui/ThemeSwitcher.js

const THEMES = [
  { id: "dark", label: "Dark", swatch: "#0a0a0f" },
  { id: "light", label: "Light", swatch: "#f5f3f0" },
  { id: "neon", label: "Neon", swatch: "#ff00ff" },
  { id: "warm", label: "Warm", swatch: "#ff6b35" },
  { id: "ocean", label: "Ocean", swatch: "#00d4aa" },
];

const STORAGE_KEY = "cells-theme";

export function initThemeSwitcher() {
  const saved = localStorage.getItem(STORAGE_KEY) || "ocean";
  applyTheme(saved);

  const container = document.createElement("div");
  container.className = "theme-switcher";
  container.setAttribute("aria-label", "Theme selector");

  THEMES.forEach(({ id, label, swatch }) => {
    const btn = document.createElement("button");
    btn.className = "theme-swatch";
    btn.dataset.theme = id;
    btn.title = label;
    btn.setAttribute("aria-label", `Switch to ${label} theme`);
    btn.style.setProperty("--swatch-color", swatch);
    if (id === saved) btn.classList.add("active");

    btn.addEventListener("click", () => {
      applyTheme(id);
      container
        .querySelectorAll(".theme-swatch")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });

    container.appendChild(btn);
  });

  document.body.appendChild(container);
}

function applyTheme(themeId) {
  if (themeId === "dark") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.dataset.theme = themeId;
  }
  localStorage.setItem(STORAGE_KEY, themeId);
}
