// =============================================================================
// TOP BAR — Fixed 48px header with hamburger, title, theme selector, profile
// Version: 1.0.0 | Last Updated: 2026-02-16
// =============================================================================

import { icon } from "../shared/icons.js";
import { navigate } from "../app/router.js";
import {
  THEME_META,
  THEME_ICONS,
  toggleThemeDropdown,
  setTheme,
  getSavedTheme,
} from "../theme/theme-switcher.js";

/**
 * Renders the top bar into the given container.
 * @param {HTMLElement} container
 * @param {{ onToggleNav: () => void }} callbacks
 */
export function renderTopBar(container, { onToggleNav }) {
  const currentTheme = getSavedTheme();

  const bar = document.createElement("div");
  bar.className = "top-bar";
  bar.innerHTML = `
    <div class="top-bar-left">
      <button class="icon-button" id="hamburgerBtn" aria-label="Toggle navigation">
        ${icon("hamburger")}
      </button>
      <img src="images/Generic.ASCII.png" alt="Generic logo" class="top-bar-logo" />
      <div class="top-bar-title">Generic — Tool Portfolio</div>
    </div>
    <div class="top-bar-center"></div>
    <div class="top-bar-right">
      <div class="theme-selector">
        <button class="icon-button" id="themeToggleBtn" aria-label="Change theme">
          <svg class="icon theme-icon" viewBox="0 0 24 24" fill="currentColor">
            ${THEME_ICONS[currentTheme] || THEME_ICONS["theme-dark"]}
          </svg>
        </button>
        <div class="theme-dropdown" id="themeDropdown">
          ${THEME_META.map(
            (t) => `
            <button class="theme-option${t.key === currentTheme ? " active" : ""}" data-theme="${t.key}">
              <span class="theme-dot" style="background: ${t.dot};"></span>
              ${t.label}
            </button>
          `
          ).join("")}
        </div>
      </div>
      <button class="icon-button" id="settingsBtn" aria-label="Settings">
        ${icon("settings")}
      </button>
      <button class="icon-button" aria-label="User profile">
        ${icon("profile")}
      </button>
    </div>
  `;

  container.appendChild(bar);

  // Wire events
  bar.querySelector("#hamburgerBtn").addEventListener("click", onToggleNav);
  bar.querySelector("#themeToggleBtn").addEventListener("click", (e) => {
    e.stopPropagation();
    toggleThemeDropdown();
  });

  bar.querySelectorAll(".theme-option").forEach((btn) => {
    btn.addEventListener("click", () => setTheme(btn.dataset.theme));
  });

  bar.querySelector("#settingsBtn").addEventListener("click", () => {
    navigate("/settings");
  });
}
