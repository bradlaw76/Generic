// =============================================================================
// APP CARD — Reusable card component builder
// Version: 1.0.0 | Last Updated: 2026-02-16
// =============================================================================

/**
 * Creates a card DOM element.
 * @param {Object} options
 * @param {string} [options.className] - Additional CSS classes
 * @param {string} [options.innerHTML] - Inner HTML content
 * @returns {HTMLElement}
 */
export function createCard({ className = "", innerHTML = "" } = {}) {
  const card = document.createElement("div");
  card.className = `card ${className}`.trim();
  card.innerHTML = innerHTML;
  return card;
}

/**
 * Creates a stat card with a large number and label.
 * @param {Object} options
 * @param {string} options.value - The stat value (e.g., "1,247")
 * @param {string} options.label - The stat label
 * @param {string} [options.color] - Optional color override for value
 * @returns {HTMLElement}
 */
export function createStatCard({ value, label, color }) {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <div class="stat" ${color ? `style="color: ${color}"` : ""}>${value}</div>
    <div class="stat-label">${label}</div>
  `;
  return card;
}
