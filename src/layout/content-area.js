// =============================================================================
// CONTENT AREA — Main content region to the right of SideNav
// Version: 1.0.0 | Last Updated: 2026-02-16
// =============================================================================

/**
 * Renders the content area wrapper into the given container.
 * @param {HTMLElement} container
 * @returns {HTMLElement} The #contentArea element for router to target
 */
export function renderContentArea(container) {
  const main = document.createElement("main");
  main.className = "content-area";
  main.id = "contentArea";
  container.appendChild(main);
  return main;
}
