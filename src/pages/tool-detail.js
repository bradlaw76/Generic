// =============================================================================
// TOOL DETAIL — Rich detail page for a single portfolio tool entry
// Version: 2.0.0 | Last Updated: 2026-02-16
//
// COMPONENT: ToolDetailPage
// DESCRIPTION: Shows full description, metadata, screenshots, tags,
//              and repo link for a tool entry. Driven by data/tools.json.
// ENVIRONMENT: Vanilla JS (ES Module) — GitHub Pages
// =============================================================================

import { icon } from "../shared/icons.js";
import { navigate } from "../app/router.js";
import { updateTool } from "../platform/tool-registry.js";

const CATEGORIES = ["Generic Tools", "Publications", "Development"];
const PRIORITIES = ["High", "Normal", "Low"];
const STATUSES = ["Active", "Draft", "Archived"];

/**
 * Renders the tool detail page.
 * @param {HTMLElement} container
 * @param {import("../platform/tool-types.js").ToolEntry} tool
 */
export function render(container, tool) {
  const page = document.createElement("div");
  page.className = "page-content";

  // ── Header with back button ──
  const header = document.createElement("div");
  header.className = "detail-header";
  header.innerHTML = `
    <button class="back-button" id="detailBackBtn" aria-label="Back to grid">
      ${icon("arrowBack")}
    </button>
    <h2 class="section-title">${tool.name}</h2>
  `;
  page.appendChild(header);

  // ── Metadata grid ──
  const meta = document.createElement("div");
  meta.className = "detail-meta";

  const metaFields = [
    { label: "Status", value: `<span class="status-${(tool.status || "active").toLowerCase()}">${tool.status}</span>` },
    { label: "Priority", value: `<span class="priority-${(tool.priority || "normal").toLowerCase()}">${tool.priority || "—"}</span>` },
    { label: "Version", value: tool.version },
    { label: "Category", value: tool.category },
    { label: "Origin", value: tool.origin || "—" },
    { label: "Created", value: tool.dateCreated || "—" },
    { label: "Last Updated", value: tool.lastUpdated || "—" },
  ];

  if (tool.repoUrl) {
    metaFields.push({
      label: "Repository",
      value: `<a href="${tool.repoUrl}" target="_blank" rel="noopener">${tool.repoUrl.replace("https://github.com/", "")} ${icon("openInNew", "icon").replace('width="24" height="24"', 'style="width:14px;height:14px;vertical-align:middle;"')}</a>`,
    });
  }

  for (const field of metaFields) {
    meta.innerHTML += `
      <div class="meta-item">
        <span class="meta-label">${field.label}</span>
        <span class="meta-value">${field.value}</span>
      </div>
    `;
  }
  page.appendChild(meta);

  // ── Tags ──
  if (tool.tags && tool.tags.length > 0) {
    const tagSection = document.createElement("div");
    tagSection.style.marginBottom = "24px";
    tagSection.innerHTML = `
      <div class="tag-list">
        ${tool.tags.map((t) => `<span class="tag">${t}</span>`).join("")}
      </div>
    `;
    page.appendChild(tagSection);
  }

  // ── Description ──
  const descCard = document.createElement("div");
  descCard.className = "card";
  descCard.innerHTML = `
    <h3>Description</h3>
    <div class="detail-body">${tool.longDescription || tool.description || "No description available."}</div>
  `;
  page.appendChild(descCard);

  // ── Screenshots ──
  if (tool.screenshots && tool.screenshots.length > 0) {
    const screenshotCard = document.createElement("div");
    screenshotCard.className = "card";
    screenshotCard.innerHTML = `
      <h3>Screenshots</h3>
      <div class="screenshot-grid">
        ${tool.screenshots.map((src) => `<img src="${src}" alt="Screenshot" loading="lazy" />`).join("")}
      </div>
    `;
    page.appendChild(screenshotCard);
  }

  // ── Actions ──
  const actionsCard = document.createElement("div");
  actionsCard.className = "card";
  let actionsHTML = '<div class="button-group">';
  if (tool.repoUrl) {
    actionsHTML += `<a href="${tool.repoUrl}" target="_blank" rel="noopener" class="button button-primary" style="text-decoration:none;">View Repository</a>`;
  }
  actionsHTML += `<button class="button button-outline" id="editToolBtn">${icon("edit", "icon")} Edit Tool</button>`;
  actionsHTML += `<button class="button button-outline" id="backToDash">Back to Dashboard</button>`;
  actionsHTML += "</div>";
  actionsCard.innerHTML = actionsHTML;
  page.appendChild(actionsCard);

  // ── Edit panel placeholder ──
  const editArea = document.createElement("div");
  editArea.id = "detailEditArea";
  page.appendChild(editArea);

  container.appendChild(page);

  // ── Wire events ──
  page.querySelector("#detailBackBtn").addEventListener("click", () => navigate("/"));
  page.querySelector("#backToDash").addEventListener("click", () => navigate("/"));

  // ── Edit button ──
  page.querySelector("#editToolBtn").addEventListener("click", () => {
    const area = page.querySelector("#detailEditArea");
    if (area.querySelector("#detailEditPanel")) {
      area.querySelector("#detailEditPanel").remove();
      return;
    }
    showDetailEditPanel(area, tool, page);
  });
}

/**
 * Renders an inline edit panel on the detail page.
 */
function showDetailEditPanel(container, tool, page) {
  const visSel = (val) =>
    ["public", "private"]
      .map((v) => `<option value="${v}" ${val === v ? "selected" : ""}>${v.charAt(0).toUpperCase() + v.slice(1)}</option>`)
      .join("");

  const panel = document.createElement("div");
  panel.id = "detailEditPanel";
  panel.className = "card edit-panel";
  panel.style.border = "2px solid var(--color-primary)";
  panel.style.marginTop = "16px";
  panel.style.animation = "fadeSlideIn 0.25s ease-out";

  panel.innerHTML = `
    <div class="section-header" style="margin-bottom: 16px;">
      <h3>${icon("edit", "icon")} Edit — ${tool.name}</h3>
      <button class="icon-button" id="detailEditClose" aria-label="Close">${icon("close", "icon")}</button>
    </div>
    <div class="form-grid">
      <div class="form-group">
        <label class="form-label">Tool Name</label>
        <input type="text" class="form-input" id="de-name" value="${(tool.name || "").replace(/"/g, "&quot;")}" />
      </div>
      <div class="form-group">
        <label class="form-label">Category</label>
        <select class="form-select" id="de-category">
          ${CATEGORIES.map((c) => `<option value="${c}" ${tool.category === c ? "selected" : ""}>${c}</option>`).join("")}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Status</label>
        <select class="form-select" id="de-status">
          ${STATUSES.map((s) => `<option value="${s}" ${tool.status === s ? "selected" : ""}>${s}</option>`).join("")}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Priority</label>
        <select class="form-select" id="de-priority">
          ${PRIORITIES.map((p) => `<option value="${p}" ${tool.priority === p ? "selected" : ""}>${p}</option>`).join("")}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Version</label>
        <input type="text" class="form-input" id="de-version" value="${tool.version || "1.0.0"}" />
      </div>
      <div class="form-group">
        <label class="form-label">Visibility</label>
        <select class="form-select" id="de-visibility">${visSel(tool.visibility || "public")}</select>
      </div>
      <div class="form-group full-width">
        <label class="form-label">Short Description</label>
        <input type="text" class="form-input" id="de-desc" value="${(tool.description || "").replace(/"/g, "&quot;")}" />
      </div>
      <div class="form-group full-width">
        <label class="form-label">Long Description</label>
        <textarea class="form-textarea" id="de-longdesc" rows="4">${tool.longDescription || ""}</textarea>
      </div>
      <div class="form-group full-width">
        <label class="form-label">Tags (comma-separated)</label>
        <input type="text" class="form-input" id="de-tags" value="${(tool.tags || []).join(", ")}" />
      </div>
      <div class="form-group full-width">
        <label class="form-label">Repository URL</label>
        <input type="text" class="form-input" id="de-repo" value="${(tool.repoUrl || "").replace(/"/g, "&quot;")}" />
      </div>
    </div>
    <div class="button-group" style="margin-top: 16px;">
      <button class="button button-primary" id="detailSaveBtn">${icon("speckkit", "icon")} Save Changes</button>
      <button class="button button-outline" id="detailCancelBtn">Cancel</button>
    </div>
  `;

  container.appendChild(panel);
  panel.scrollIntoView({ behavior: "smooth", block: "center" });

  panel.querySelector("#detailEditClose").addEventListener("click", () => panel.remove());
  panel.querySelector("#detailCancelBtn").addEventListener("click", () => panel.remove());

  panel.querySelector("#detailSaveBtn").addEventListener("click", () => {
    const changes = {
      name: panel.querySelector("#de-name").value.trim(),
      category: panel.querySelector("#de-category").value,
      status: panel.querySelector("#de-status").value,
      priority: panel.querySelector("#de-priority").value,
      version: panel.querySelector("#de-version").value.trim(),
      visibility: panel.querySelector("#de-visibility").value,
      description: panel.querySelector("#de-desc").value.trim(),
      longDescription: panel.querySelector("#de-longdesc").value.trim(),
      tags: panel.querySelector("#de-tags").value.split(",").map((t) => t.trim()).filter(Boolean),
      repoUrl: panel.querySelector("#de-repo").value.trim(),
      lastUpdated: new Date().toISOString().split("T")[0],
    };

    updateTool(tool.id, changes);

    const btn = panel.querySelector("#detailSaveBtn");
    btn.textContent = "✓ Saved";
    btn.classList.remove("button-primary");
    btn.classList.add("button-success");

    // Refresh the detail page with updated data
    setTimeout(() => navigate("/tools/" + tool.id), 600);
  });
}
