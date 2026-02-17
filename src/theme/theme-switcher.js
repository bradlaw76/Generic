// =============================================================================
// THEME SWITCHER — 3-theme system with localStorage persistence
// Version: 1.0.0 | Last Updated: 2026-02-16
// =============================================================================

const THEMES = ["theme-dark", "theme-light", "theme-d365"];
const STORAGE_KEY = "generic-d365-theme";

const THEME_META = [
  { key: "theme-dark", label: "Circuit Dark", dot: "#0B0D10" },
  { key: "theme-light", label: "Circuit Light", dot: "#F4F7FA" },
  { key: "theme-d365", label: "Dynamics 365", dot: "#0078D4" },
];

const THEME_ICONS = {
  "theme-dark":
    '<path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/>',
  "theme-light":
    '<path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 0 0 0-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>',
  "theme-d365":
    '<path d="M17.5 12a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>',
};

/** Returns the currently saved theme or falls back to dark. */
export function getSavedTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && THEMES.includes(saved)) return saved;
  } catch {
    /* localStorage unavailable */
  }
  return "theme-dark";
}

/** Applies a theme to the document body. */
export function setTheme(theme) {
  THEMES.forEach((t) => document.body.classList.remove(t));
  document.body.classList.add(theme);

  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* ignore */
  }

  // Update icon
  const icon = document.querySelector(".theme-icon");
  if (icon) icon.innerHTML = THEME_ICONS[theme] || THEME_ICONS["theme-dark"];

  // Update active state in dropdown
  document.querySelectorAll(".theme-option").forEach((opt) => {
    const isActive = opt.dataset.theme === theme;
    opt.classList.toggle("active", isActive);
  });

  // Close dropdown
  const dropdown = document.getElementById("themeDropdown");
  if (dropdown) dropdown.classList.remove("open");
}

/** Initializes theme on page load. */
export function initTheme() {
  setTheme(getSavedTheme());
}

/** Toggles the theme dropdown. */
export function toggleThemeDropdown() {
  const dropdown = document.getElementById("themeDropdown");
  if (dropdown) dropdown.classList.toggle("open");
}

/** Closes dropdown on outside click. */
export function initThemeDropdownClose() {
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".theme-selector")) {
      const dropdown = document.getElementById("themeDropdown");
      if (dropdown) dropdown.classList.remove("open");
    }
  });
}

export { THEME_META, THEME_ICONS };
