// =============================================================================
// DASHBOARD — Metrics-only overview of the tool portfolio
// Version: 3.0.0 | Last Updated: 2026-02-16
//
// COMPONENT: Dashboard
// DESCRIPTION: Landing page showing portfolio metrics, category breakdown,
//              recently updated tools, and quick-action links. Tool list
//              management is handled in the Settings page.
// ENVIRONMENT: Vanilla JS (ES Module) — GitHub Pages
// =============================================================================

import { getAllTools, getActiveTools } from "../../platform/tool-registry.js";
import { navigate } from "../../app/router.js";
import { icon } from "../../shared/icons.js";

/**
 * Renders the dashboard metrics page.
 * @param {HTMLElement} container
 */
export function render(container) {
  const allTools = getAllTools();
  const activeTools = getActiveTools();
  const categories = {};
  const priorities = { High: 0, Normal: 0, Low: 0 };

  for (const tool of activeTools) {
    categories[tool.category] = (categories[tool.category] || 0) + 1;
    if (tool.priority && priorities[tool.priority] !== undefined) {
      priorities[tool.priority]++;
    }
  }

  const recentTools = [...activeTools]
    .sort((a, b) => (b.lastUpdated || "").localeCompare(a.lastUpdated || ""))
    .slice(0, 5);

  const page = document.createElement("div");
  page.className = "page-content";

  // ── View title with version badge ──
  const header = document.createElement("div");
  header.className = "section-header";
  header.innerHTML = `
    <div class="section-header-left">
      <h2 class="section-title">Tool Portfolio</h2>
      <span class="version-badge">v1.0.0</span>
    </div>
    <img src="images/Generic.ASCII.png" alt="Generic logo" class="dash-header-logo" />
  `;
  page.appendChild(header);

  // ── Primary stat cards ──
  const statsGrid = document.createElement("div");
  statsGrid.className = "card-grid";
  statsGrid.style.gridTemplateColumns = "repeat(4, 1fr)";
  statsGrid.innerHTML = `
    <div class="card stat-card" style="--stat-accent: var(--color-primary);">
      <div class="stat-value">${activeTools.length}</div>
      <div class="stat-label">Active Tools</div>
    </div>
    <div class="card stat-card" style="--stat-accent: var(--color-success);">
      <div class="stat-value">${Object.keys(categories).length}</div>
      <div class="stat-label">Categories</div>
    </div>
    <div class="card stat-card" style="--stat-accent: var(--color-warning);">
      <div class="stat-value">${priorities.High}</div>
      <div class="stat-label">High Priority</div>
    </div>
    <div class="card stat-card" style="--stat-accent: var(--color-accent);">
      <div class="stat-value">${allTools.length - activeTools.length}</div>
      <div class="stat-label">Disabled</div>
    </div>
  `;
  page.appendChild(statsGrid);

  // ── Two-column layout: Category Breakdown + Recently Updated ──
  const twoCol = document.createElement("div");
  twoCol.className = "card-grid";
  twoCol.style.gridTemplateColumns = "1fr 1fr";

  // Category breakdown card
  const catCard = document.createElement("div");
  catCard.className = "card";
  let catHTML = `<h3>Categories</h3><div class="dash-breakdown">`;
  for (const [cat, count] of Object.entries(categories).sort((a, b) => b[1] - a[1])) {
    const pct = Math.round((count / activeTools.length) * 100);
    catHTML += `
      <div class="dash-breakdown-row">
        <span class="dash-breakdown-label">${cat}</span>
        <div class="dash-breakdown-bar-track">
          <div class="dash-breakdown-bar" style="width: ${pct}%;"></div>
        </div>
        <span class="dash-breakdown-count">${count}</span>
      </div>`;
  }
  catHTML += `</div>`;
  catCard.innerHTML = catHTML;
  twoCol.appendChild(catCard);

  // Recently updated card
  const recentCard = document.createElement("div");
  recentCard.className = "card";
  let recentHTML = `<h3>Recently Updated</h3><div class="dash-recent-list">`;
  for (const tool of recentTools) {
    const updated = tool.lastUpdated
      ? new Date(tool.lastUpdated).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : "—";
    recentHTML += `
      <div class="dash-recent-item" data-tool-id="${tool.id}">
        <div class="dash-recent-name">${tool.name}</div>
        <div class="dash-recent-meta">
          <span class="priority-${(tool.priority || "normal").toLowerCase()}">${tool.priority || "Normal"}</span>
          <span class="dash-recent-date">${updated}</span>
        </div>
      </div>`;
  }
  recentHTML += `</div>`;
  recentCard.innerHTML = recentHTML;
  twoCol.appendChild(recentCard);

  page.appendChild(twoCol);

  // ── Second row: Donut (Public vs Private) + Priority Distribution ──
  const twoCol2 = document.createElement("div");
  twoCol2.className = "card-grid";
  twoCol2.style.gridTemplateColumns = "1fr 1fr";

  // Public vs Private donut card
  const publicCount = allTools.filter((t) => t.visibility !== "private").length;
  const privateCount = allTools.filter((t) => t.visibility === "private").length;
  const total = allTools.length;
  const pubPct = total > 0 ? Math.round((publicCount / total) * 100) : 100;
  const privPct = 100 - pubPct;
  // Conic gradient: public (teal/success) then private (purple/accent)
  const donutGradient = privateCount > 0
    ? `conic-gradient(var(--color-success) 0% ${pubPct}%, var(--color-accent) ${pubPct}% 100%)`
    : `conic-gradient(var(--color-success) 0% 100%)`;

  const donutCard = document.createElement("div");
  donutCard.className = "card";
  donutCard.innerHTML = `
    <h3>Repository Visibility</h3>
    <div class="donut-container">
      <div class="donut-chart" style="background: ${donutGradient};">
        <div class="donut-hole">
          <span class="donut-total">${total}</span>
          <span class="donut-total-label">Total</span>
        </div>
      </div>
      <div class="donut-legend">
        <div class="donut-legend-item">
          <span class="donut-legend-dot" style="background: var(--color-success);"></span>
          <span class="donut-legend-label">Public</span>
          <span class="donut-legend-value">${publicCount} (${pubPct}%)</span>
        </div>
        <div class="donut-legend-item">
          <span class="donut-legend-dot" style="background: var(--color-accent);"></span>
          <span class="donut-legend-label">Private</span>
          <span class="donut-legend-value">${privateCount} (${privPct}%)</span>
        </div>
      </div>
    </div>
  `;
  twoCol2.appendChild(donutCard);

  // ── Priority distribution card ──
  const priorityCard = document.createElement("div");
  priorityCard.className = "card";
  let prioHTML = `<h3>Priority Distribution</h3><div class="dash-breakdown">`;
  const prioColors = { High: "var(--color-danger)", Normal: "var(--color-primary)", Low: "var(--color-success)" };
  for (const [prio, count] of Object.entries(priorities)) {
    const pct = activeTools.length > 0 ? Math.round((count / activeTools.length) * 100) : 0;
    prioHTML += `
      <div class="dash-breakdown-row">
        <span class="dash-breakdown-label priority-${prio.toLowerCase()}">${prio}</span>
        <div class="dash-breakdown-bar-track">
          <div class="dash-breakdown-bar" style="width: ${pct}%; background: ${prioColors[prio]};"></div>
        </div>
        <span class="dash-breakdown-count">${count}</span>
      </div>`;
  }
  prioHTML += `</div>`;
  priorityCard.innerHTML = prioHTML;
  twoCol2.appendChild(priorityCard);

  page.appendChild(twoCol2);

  // ── Quick actions card ──
  const actionsCard = document.createElement("div");
  actionsCard.className = "card";
  actionsCard.innerHTML = `
    <h3>Quick Actions</h3>
    <div class="dash-actions">
      <button class="button button-primary" id="dashGoSettings">
        ${icon("settings", "icon")} Manage Tools
      </button>
      <button class="button button-outline" id="dashGoSpeckKit">
        ${icon("speckkit", "icon")} SpeckKit
      </button>
      <button class="button button-outline" id="dashGoVSCode">
        ${icon("vscode", "icon")} VS Code & How
      </button>
    </div>
  `;
  page.appendChild(actionsCard);

  container.appendChild(page);

  // ── Wire events ──
  page.querySelectorAll(".dash-recent-item").forEach((item) => {
    item.style.cursor = "pointer";
    item.addEventListener("click", () => navigate("/tools/" + item.dataset.toolId));
  });

  page.querySelector("#dashGoSettings").addEventListener("click", () => navigate("/settings"));
  page.querySelector("#dashGoSpeckKit").addEventListener("click", () => navigate("/speckkit"));
  page.querySelector("#dashGoVSCode").addEventListener("click", () => navigate("/vscode"));
}
