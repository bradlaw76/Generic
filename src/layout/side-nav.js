// =============================================================================
// SIDE NAV — 240px / 64px collapsible, data-driven from tools.json
// Version: 2.1.0 | Last Updated: 2026-02-17
// CHANGELOG: 2.1.0 — Distinct icons per tool item in nav
// =============================================================================

import { buildToolGroups } from "../platform/navigation-engine.js";
import { icon } from "../shared/icons.js";
import { navigate, updateActiveNav } from "../app/router.js";

/**
 * Renders the side nav into the given container.
 * @param {HTMLElement} container
 * @returns {{ toggle: () => void, rebuild: () => void }}
 */
export function renderSideNav(container) {
  const nav = document.createElement("nav");
  nav.className = "side-nav";
  nav.id = "sideNav";

  const toolIconKeys = [
    "tools",
    "document",
    "code",
    "analytics",
    "classifier",
    "link",
    "profile",
    "addNew",
    "grid",
  ];

  function pickIconKeyForTool(tool) {
    // Stable selection based on tool.id char codes
    const id = String(tool.id || tool.name || "");
    if (!id) return toolIconKeys[0];
    let sum = 0;
    for (let i = 0; i < id.length; i++) sum += id.charCodeAt(i);
    return toolIconKeys[sum % toolIconKeys.length];
  }

  function buildNavHTML() {
    const groups = buildToolGroups();

    let html = '<ul class="nav-list">';

    // Dashboard (always first)
    html += `
      <li>
        <button class="nav-item active" data-route="/" aria-current="page">
          ${icon("home", "nav-icon")}
          <span class="nav-label">Dashboard</span>
        </button>
      </li>
    `;

    // Tool groups from data/tools.json
    for (const group of groups) {
      html += `<li class="nav-group-label"><span class="nav-label">${group.label}</span></li>`;

      for (const tool of group.tools) {
        const key = pickIconKeyForTool(tool);
        html += `
          <li>
            <button class="nav-item" data-route="/tools/${tool.id}">
              ${icon(key, "nav-icon")}
              <span class="nav-label">${tool.name}</span>
            </button>
          </li>
        `;
      }
    }

    // --- Static pages ---
    // Development group
    html += `<li class="nav-group-label"><span class="nav-label">Development</span></li>`;
    html += `
      <li>
        <button class="nav-item" data-route="/speckkit">
          ${icon("speckkit", "nav-icon")}
          <span class="nav-label">SpeckKit</span>
        </button>
      </li>
    `;

    // VS Code & How group
    html += `<li class="nav-group-label"><span class="nav-label">VS Code & How</span></li>`;
    html += `
      <li>
        <button class="nav-item" data-route="/vscode">
          ${icon("vscode", "nav-icon")}
          <span class="nav-label">VS Code Setup</span>
        </button>
      </li>
    `;

    // Settings
    html += `<li class="nav-group-label"><span class="nav-label">Admin</span></li>`;
    html += `
      <li>
        <button class="nav-item" data-route="/settings">
          ${icon("settings", "nav-icon")}
          <span class="nav-label">Settings</span>
        </button>
      </li>
    `;

    html += "</ul>";
    return html;
  }

  function wireEvents() {
    nav.querySelectorAll(".nav-item").forEach((item) => {
      item.addEventListener("click", () => {
        navigate(item.dataset.route);
        updateActiveNav();
      });
    });
  }

  nav.innerHTML = buildNavHTML();
  container.appendChild(nav);
  wireEvents();

  // Listen for hash changes to keep active state in sync
  window.addEventListener("hashchange", updateActiveNav);

  return {
    toggle() {
      nav.classList.toggle("collapsed");
      const contentArea = document.getElementById("contentArea");
      if (contentArea) contentArea.classList.toggle("nav-collapsed");
    },
    rebuild() {
      nav.innerHTML = buildNavHTML();
      wireEvents();
      updateActiveNav();
    },
  };
}
