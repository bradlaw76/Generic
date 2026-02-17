// =============================================================================
// SECTION HEADER — Title bar with optional action button
// Version: 1.0.0 | Last Updated: 2026-02-16
// =============================================================================

/**
 * Creates a section header element.
 * @param {Object} options
 * @param {string} options.title - Section title text
 * @param {string} [options.actionLabel] - Button label (omit if no button)
 * @param {string} [options.actionClass] - Button class (default: "button-primary")
 * @param {() => void} [options.onAction] - Button click handler
 * @returns {HTMLElement}
 */
export function createSectionHeader({
  title,
  actionLabel,
  actionClass = "button-primary",
  onAction,
} = {}) {
  const header = document.createElement("div");
  header.className = "section-header";

  header.innerHTML = `<h2 class="section-title">${title}</h2>`;

  if (actionLabel) {
    const btn = document.createElement("button");
    btn.className = `button ${actionClass}`;
    btn.textContent = actionLabel;
    if (onAction) btn.addEventListener("click", onAction);
    header.appendChild(btn);
  }

  return header;
}
