// =============================================================================
// SETTINGS — Centralized settings page for tool management, admin, and repo sync
// Version: 1.0.0 | Last Updated: 2026-02-16
//
// COMPONENT: SettingsPage
// DESCRIPTION: Unified settings area consolidating tool enable/disable management,
//              add-new-tool form, and GitHub repository auto-discovery. Replaces
//              the scattered admin/toggle controls across dashboard and detail pages.
// ENVIRONMENT: Vanilla JS (ES Module) — GitHub Pages
// =============================================================================

import { icon } from "../shared/icons.js";
import { navigate } from "../app/router.js";
import {
  getAllTools,
  getToolById,
  isToolDisabled,
  toggleToolDisabled,
  addTool,
  updateTool,
} from "../platform/tool-registry.js";

const GITHUB_USERNAME = "bradlaw76";
const GITHUB_API_PUBLIC = `https://api.github.com/users/${GITHUB_USERNAME}/repos`;
const GITHUB_API_AUTHENTICATED = "https://api.github.com/user/repos";
const PAT_STORAGE_KEY = "generic_github_pat";

// ─── Categories / form options ──────────────────────────────────────────

const CATEGORIES = ["Generic Tools", "Publications", "Development"];
const PRIORITIES = ["High", "Normal", "Low"];
const STATUSES = ["Active", "Draft", "Archived"];
const ORIGINS = ["Web", "Phone", "Chat", "Email"];

/**
 * Renders the Settings page.
 * @param {HTMLElement} container
 */
export function render(container) {
  const page = document.createElement("div");
  page.className = "page-content";

  // ── Page header ──
  const header = document.createElement("div");
  header.className = "section-header";
  header.innerHTML = `
    <div class="section-header-left">
      ${icon("settings", "icon")}
      <h2 class="section-title" style="margin-left: 8px;">Settings</h2>
    </div>
  `;
  page.appendChild(header);

  // ── Tab bar (Tool Management | Add New Tool | GitHub Sync) ──
  const tabBar = document.createElement("div");
  tabBar.className = "settings-tabs";
  tabBar.innerHTML = `
    <button class="settings-tab active" data-tab="manage">Tool Management</button>
    <button class="settings-tab" data-tab="add">Add New Tool</button>
    <button class="settings-tab" data-tab="github">GitHub Repository Sync</button>
  `;
  page.appendChild(tabBar);

  // ── Tab content container ──
  const tabContent = document.createElement("div");
  tabContent.id = "settingsTabContent";
  page.appendChild(tabContent);

  container.appendChild(page);

  // ── Tab switching logic ──
  let activeTab = "manage";

  function renderTab(tab) {
    activeTab = tab;
    tabContent.innerHTML = "";

    tabBar.querySelectorAll(".settings-tab").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.tab === tab);
    });

    switch (tab) {
      case "manage":
        renderToolManagement(tabContent);
        break;
      case "add":
        renderAddTool(tabContent);
        break;
      case "github":
        renderGitHubSync(tabContent);
        break;
    }
  }

  tabBar.querySelectorAll(".settings-tab").forEach((btn) => {
    btn.addEventListener("click", () => renderTab(btn.dataset.tab));
  });

  // Initial render
  renderTab("manage");
}

// ═════════════════════════════════════════════════════════════════════════
// TAB 1: Tool Management — Full D365 grid with enable/disable
// ═════════════════════════════════════════════════════════════════════════

/** Priority CSS class map */
const PRIORITY_CLASS = {
  High: "priority-high",
  Normal: "priority-normal",
  Low: "priority-low",
};

/** Status CSS class map */
const STATUS_CLASS = {
  Active: "status-active",
  Draft: "status-draft",
  Archived: "status-archived",
};

function renderToolManagement(container) {
  const tools = getAllTools();

  const wrapper = document.createElement("div");

  // Stats summary
  const enabledCount = tools.filter((t) => !isToolDisabled(t.id)).length;
  const disabledCount = tools.length - enabledCount;

  const statsRow = document.createElement("div");
  statsRow.className = "card-grid";
  statsRow.style.gridTemplateColumns = "repeat(3, 1fr)";
  statsRow.style.marginBottom = "16px";
  statsRow.id = "settingsStats";
  statsRow.innerHTML = `
    <div class="card stat-card" style="--stat-accent: var(--color-primary);">
      <div class="stat-value">${tools.length}</div>
      <div class="stat-label">Total Tools</div>
    </div>
    <div class="card stat-card" style="--stat-accent: var(--color-success);">
      <div class="stat-value" id="settingsEnabledCount">${enabledCount}</div>
      <div class="stat-label">Enabled</div>
    </div>
    <div class="card stat-card" style="--stat-accent: var(--color-danger);">
      <div class="stat-value" id="settingsDisabledCount">${disabledCount}</div>
      <div class="stat-label">Disabled</div>
    </div>
  `;
  wrapper.appendChild(statsRow);

  // Toolbar (D365 command bar)
  const toolbar = document.createElement("div");
  toolbar.className = "grid-toolbar";
  toolbar.innerHTML = `
    <button class="button button-primary button-sm" id="settingsNewBtn">+ New Tool</button>
    <button class="button button-outline button-sm" id="settingsRefreshBtn">Refresh</button>
    <input type="text" class="grid-search" id="settingsSearch" placeholder="Filter tools…" />
  `;
  wrapper.appendChild(toolbar);

  // Grid card
  const gridCard = document.createElement("div");
  gridCard.className = "card";
  gridCard.style.padding = "0";
  gridCard.style.overflow = "hidden";

  const tableWrapper = document.createElement("div");
  tableWrapper.style.overflowX = "auto";

  function buildTableHTML(filteredTools) {
    let html = `<table class="table">
      <thead>
        <tr>
          <th>Tool Name</th>
          <th>Category</th>
          <th>Visibility</th>
          <th>Status</th>
          <th>Priority</th>
          <th>Last Updated</th>
          <th style="width: 100px;">Enabled</th>
          <th style="width: 60px;">Edit</th>
        </tr>
      </thead>
      <tbody>`;

    for (const tool of filteredTools) {
      const pClass = PRIORITY_CLASS[tool.priority] || "priority-normal";
      const disabled = isToolDisabled(tool.id);
      const rowClass = disabled ? "clickable-row disabled-row" : "clickable-row";
      const updated = tool.lastUpdated
        ? new Date(tool.lastUpdated).toLocaleDateString("en-US", {
            month: "numeric",
            day: "numeric",
            year: "numeric",
          })
        : "—";
      const vis = tool.visibility === "private"
        ? '<span class="badge-private">Private</span>'
        : '<span class="badge-public">Public</span>';

      html += `
        <tr class="${rowClass}" data-tool-id="${tool.id}">
          <td style="color: var(--color-primary); font-weight: 500;">${tool.name}</td>
          <td>${tool.category}</td>
          <td>${vis}</td>
          <td>${disabled ? '<span class="status-disabled">Disabled</span>' : `<span class="${STATUS_CLASS[tool.status] || "status-active"}">${tool.status}</span>`}</td>
          <td><span class="${pClass}">${tool.priority || "—"}</span></td>
          <td>${updated}</td>
          <td>
            <label class="toggle-switch" onclick="event.stopPropagation()">
              <input type="checkbox" ${disabled ? "" : "checked"} data-tool-id="${tool.id}" />
              <span class="toggle-slider"></span>
              <span class="toggle-label">${disabled ? "Off" : "On"}</span>
            </label>
          </td>
          <td>
            <button class="icon-button edit-tool-btn" data-tool-id="${tool.id}" onclick="event.stopPropagation()" aria-label="Edit tool" title="Edit">
              ${icon("edit", "icon")}
            </button>
          </td>
        </tr>`;
    }

    html += `</tbody></table>`;
    return html;
  }

  function updateStats() {
    const enabled = tools.filter((t) => !isToolDisabled(t.id)).length;
    const dis = tools.length - enabled;
    const elEnabled = wrapper.querySelector("#settingsEnabledCount");
    const elDisabled = wrapper.querySelector("#settingsDisabledCount");
    if (elEnabled) elEnabled.textContent = enabled;
    if (elDisabled) elDisabled.textContent = dis;
  }

  function renderGrid(filterText) {
    const filtered = filterText
      ? tools.filter(
          (t) =>
            t.name.toLowerCase().includes(filterText) ||
            t.category.toLowerCase().includes(filterText) ||
            (t.description || "").toLowerCase().includes(filterText) ||
            (t.tags || []).some((tag) => tag.toLowerCase().includes(filterText))
        )
      : tools;

    tableWrapper.innerHTML = buildTableHTML(filtered);

    // Wire row clicks (skip toggle and edit)
    tableWrapper.querySelectorAll(".clickable-row").forEach((row) => {
      row.addEventListener("click", (e) => {
        if (e.target.closest(".toggle-switch")) return;
        if (e.target.closest(".edit-tool-btn")) return;
        navigate("/tools/" + row.dataset.toolId);
      });
    });

    // Wire toggles
    tableWrapper.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
      cb.addEventListener("change", () => {
        toggleToolDisabled(cb.dataset.toolId);
        renderGrid(filterText);
        updateStats();
      });
    });

    // Wire edit buttons
    tableWrapper.querySelectorAll(".edit-tool-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const tool = getToolById(btn.dataset.toolId);
        if (tool) showEditPanel(wrapper, tool, () => renderGrid(filterText));
      });
    });

    // Update footer
    const footer = gridCard.querySelector(".grid-footer");
    if (footer) {
      footer.innerHTML = `<span>1\u2013${filtered.length} of ${filtered.length} tool${filtered.length !== 1 ? "s" : ""}</span><span>Page 1</span>`;
    }
  }

  gridCard.appendChild(tableWrapper);

  // Grid footer
  const footer = document.createElement("div");
  footer.className = "grid-footer";
  footer.innerHTML = `<span>1\u2013${tools.length} of ${tools.length} tools</span><span>Page 1</span>`;
  gridCard.appendChild(footer);

  wrapper.appendChild(gridCard);
  container.appendChild(wrapper);

  // Initial render
  renderGrid("");

  // Wire toolbar
  const searchInput = toolbar.querySelector("#settingsSearch");
  searchInput.addEventListener("input", (e) => {
    renderGrid(e.target.value.toLowerCase().trim());
  });

  toolbar.querySelector("#settingsRefreshBtn").addEventListener("click", () => {
    renderGrid(searchInput.value.toLowerCase().trim());
  });

  toolbar.querySelector("#settingsNewBtn").addEventListener("click", () => {
    // Switch to Add tab
    const addTab = container.closest(".page-content")?.querySelector('[data-tab="add"]');
    if (addTab) addTab.click();
  });
}

// ═════════════════════════════════════════════════════════════════════════
// EDIT PANEL — Slide-in editor for tool properties
// ═════════════════════════════════════════════════════════════════════════

/**
 * Shows an inline edit panel for a tool. Saves changes via updateTool().
 * @param {HTMLElement} parent - Container to insert the panel into
 * @param {Object} tool - The tool entry to edit
 * @param {Function} onSave - Callback after save (re-render grid)
 */
function showEditPanel(parent, tool, onSave) {
  // Remove any existing edit panel
  const existing = parent.querySelector("#editPanel");
  if (existing) existing.remove();

  const panel = document.createElement("div");
  panel.id = "editPanel";
  panel.className = "card edit-panel";
  panel.style.border = "2px solid var(--color-primary)";
  panel.style.marginTop = "16px";
  panel.style.animation = "fadeSlideIn 0.25s ease-out";

  const visSel = (val) =>
    ["public", "private"]
      .map((v) => `<option value="${v}" ${val === v ? "selected" : ""}>${v.charAt(0).toUpperCase() + v.slice(1)}</option>`)
      .join("");

  panel.innerHTML = `
    <div class="section-header" style="margin-bottom: 16px;">
      <h3>${icon("edit", "icon")} Edit — ${tool.name}</h3>
      <button class="icon-button" id="editPanelClose" aria-label="Close">${icon("close", "icon")}</button>
    </div>
    <div class="form-grid" id="editForm">
      <div class="form-group">
        <label class="form-label">Tool Name</label>
        <input type="text" class="form-input" id="edit-name" value="${(tool.name || "").replace(/"/g, "&quot;")}" />
      </div>
      <div class="form-group">
        <label class="form-label">Category</label>
        <select class="form-select" id="edit-category">
          ${CATEGORIES.map((c) => `<option value="${c}" ${tool.category === c ? "selected" : ""}>${c}</option>`).join("")}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Status</label>
        <select class="form-select" id="edit-status">
          ${STATUSES.map((s) => `<option value="${s}" ${tool.status === s ? "selected" : ""}>${s}</option>`).join("")}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Priority</label>
        <select class="form-select" id="edit-priority">
          ${PRIORITIES.map((p) => `<option value="${p}" ${tool.priority === p ? "selected" : ""}>${p}</option>`).join("")}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Version</label>
        <input type="text" class="form-input" id="edit-version" value="${tool.version || "1.0.0"}" />
      </div>
      <div class="form-group">
        <label class="form-label">Origin</label>
        <select class="form-select" id="edit-origin">
          ${[...ORIGINS, "GitHub"].map((o) => `<option value="${o}" ${tool.origin === o ? "selected" : ""}>${o}</option>`).join("")}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Visibility</label>
        <select class="form-select" id="edit-visibility">${visSel(tool.visibility || "public")}</select>
      </div>
      <div class="form-group">
        <label class="form-label">Repository URL</label>
        <input type="text" class="form-input" id="edit-repo" value="${(tool.repoUrl || "").replace(/"/g, "&quot;")}" />
      </div>
      <div class="form-group full-width">
        <label class="form-label">Short Description</label>
        <input type="text" class="form-input" id="edit-desc" value="${(tool.description || "").replace(/"/g, "&quot;")}" />
      </div>
      <div class="form-group full-width">
        <label class="form-label">Long Description</label>
        <textarea class="form-textarea" id="edit-longdesc" rows="4">${tool.longDescription || ""}</textarea>
      </div>
      <div class="form-group full-width">
        <label class="form-label">Tags (comma-separated)</label>
        <input type="text" class="form-input" id="edit-tags" value="${(tool.tags || []).join(", ")}" />
      </div>
    </div>
    <div class="button-group" style="margin-top: 16px;">
      <button class="button button-primary" id="editSaveBtn">${icon("speckkit", "icon")} Save Changes</button>
      <button class="button button-outline" id="editCancelBtn">Cancel</button>
    </div>
  `;

  // Insert after the grid card
  parent.appendChild(panel);
  panel.scrollIntoView({ behavior: "smooth", block: "center" });

  // Close / Cancel
  const closePanel = () => panel.remove();
  panel.querySelector("#editPanelClose").addEventListener("click", closePanel);
  panel.querySelector("#editCancelBtn").addEventListener("click", closePanel);

  // Save
  panel.querySelector("#editSaveBtn").addEventListener("click", () => {
    const changes = {
      name: panel.querySelector("#edit-name").value.trim(),
      category: panel.querySelector("#edit-category").value,
      status: panel.querySelector("#edit-status").value,
      priority: panel.querySelector("#edit-priority").value,
      version: panel.querySelector("#edit-version").value.trim(),
      origin: panel.querySelector("#edit-origin").value,
      visibility: panel.querySelector("#edit-visibility").value,
      repoUrl: panel.querySelector("#edit-repo").value.trim(),
      description: panel.querySelector("#edit-desc").value.trim(),
      longDescription: panel.querySelector("#edit-longdesc").value.trim(),
      tags: panel
        .querySelector("#edit-tags")
        .value.split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      lastUpdated: new Date().toISOString().split("T")[0],
    };

    updateTool(tool.id, changes);

    // Flash feedback
    const btn = panel.querySelector("#editSaveBtn");
    btn.textContent = "✓ Saved";
    btn.classList.remove("button-primary");
    btn.classList.add("button-success");

    setTimeout(() => {
      panel.remove();
      onSave();
    }, 600);
  });
}

// ═════════════════════════════════════════════════════════════════════════
// TAB 2: Add New Tool (Form + JSON preview)
// ═════════════════════════════════════════════════════════════════════════

function renderAddTool(container) {
  const wrapper = document.createElement("div");

  // Instructions card
  const infoCard = document.createElement("div");
  infoCard.className = "card";
  infoCard.innerHTML = `
    <h3>Add New Tool</h3>
    <p class="text-secondary" style="margin: 4px 0 0;">
      Fill in the form below. The JSON preview updates in real time.
      When ready, click <strong>Copy JSON</strong> and paste the entry into
      <code>data/tools.json</code>. Commit and push — the tool will appear
      automatically on the next page load.
    </p>
    <p class="text-secondary" style="margin: 8px 0 0;">
      For screenshots, place image files in <code>data/screenshots/{tool-id}/</code>
      and reference them in the screenshots field.
    </p>
  `;
  wrapper.appendChild(infoCard);

  // Form card
  const formCard = document.createElement("div");
  formCard.className = "card";
  formCard.innerHTML = `
    <h3>Tool Details</h3>
    <div class="form-grid" id="toolForm">
      <div class="form-group">
        <label class="form-label">Tool Name *</label>
        <input type="text" class="form-input" id="f-name" placeholder="e.g., Generic Reporter" />
      </div>
      <div class="form-group">
        <label class="form-label">ID (auto-generated)</label>
        <input type="text" class="form-input" id="f-id" placeholder="auto-generated-from-name" readonly />
      </div>
      <div class="form-group">
        <label class="form-label">Category *</label>
        <select class="form-select" id="f-category">
          ${CATEGORIES.map((c) => `<option value="${c}">${c}</option>`).join("")}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Status</label>
        <select class="form-select" id="f-status">
          ${STATUSES.map((s) => `<option value="${s}">${s}</option>`).join("")}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Priority</label>
        <select class="form-select" id="f-priority">
          ${PRIORITIES.map((p, i) => `<option value="${p}" ${i === 1 ? "selected" : ""}>${p}</option>`).join("")}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Origin</label>
        <select class="form-select" id="f-origin">
          ${ORIGINS.map((o) => `<option value="${o}">${o}</option>`).join("")}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Version</label>
        <input type="text" class="form-input" id="f-version" value="1.0.0" />
      </div>
      <div class="form-group">
        <label class="form-label">Repository URL</label>
        <input type="text" class="form-input" id="f-repo" placeholder="https://github.com/bradlaw76/..." />
      </div>
      <div class="form-group full-width">
        <label class="form-label">Short Description *</label>
        <input type="text" class="form-input" id="f-desc" placeholder="One-line summary for the grid view" />
      </div>
      <div class="form-group full-width">
        <label class="form-label">Long Description</label>
        <textarea class="form-textarea" id="f-longdesc" placeholder="Multi-paragraph description for the detail page. Use \\n for line breaks."></textarea>
      </div>
      <div class="form-group full-width">
        <label class="form-label">Tags (comma-separated)</label>
        <input type="text" class="form-input" id="f-tags" placeholder="AI, Dynamics 365, Productivity" />
      </div>
      <div class="form-group full-width">
        <label class="form-label">Screenshots (comma-separated paths)</label>
        <input type="text" class="form-input" id="f-screenshots" placeholder="data/screenshots/my-tool/screen1.png, data/screenshots/my-tool/screen2.png" />
      </div>
    </div>
  `;
  wrapper.appendChild(formCard);

  // Preview card
  const previewCard = document.createElement("div");
  previewCard.className = "card";
  previewCard.innerHTML = `
    <div class="section-header">
      <h3>JSON Preview</h3>
      <button class="button button-primary" id="copyJsonBtn">Copy JSON</button>
    </div>
    <pre class="json-preview" id="jsonPreview">{ }</pre>
  `;
  wrapper.appendChild(previewCard);
  container.appendChild(wrapper);

  // ── Live preview logic ──
  const fields = {
    name: wrapper.querySelector("#f-name"),
    id: wrapper.querySelector("#f-id"),
    category: wrapper.querySelector("#f-category"),
    status: wrapper.querySelector("#f-status"),
    priority: wrapper.querySelector("#f-priority"),
    origin: wrapper.querySelector("#f-origin"),
    version: wrapper.querySelector("#f-version"),
    repo: wrapper.querySelector("#f-repo"),
    desc: wrapper.querySelector("#f-desc"),
    longdesc: wrapper.querySelector("#f-longdesc"),
    tags: wrapper.querySelector("#f-tags"),
    screenshots: wrapper.querySelector("#f-screenshots"),
  };

  const preview = wrapper.querySelector("#jsonPreview");

  function toId(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function getToday() {
    return new Date().toISOString().split("T")[0];
  }

  function buildJSON() {
    const name = fields.name.value.trim();
    const id = toId(name);
    fields.id.value = id;

    const tags = fields.tags.value.split(",").map((t) => t.trim()).filter(Boolean);
    const screenshots = fields.screenshots.value.split(",").map((s) => s.trim()).filter(Boolean);

    const entry = {
      id: id || "my-tool",
      name: name || "My Tool",
      version: fields.version.value.trim() || "1.0.0",
      status: fields.status.value,
      priority: fields.priority.value,
      category: fields.category.value,
      description: fields.desc.value.trim(),
      longDescription: fields.longdesc.value.trim(),
      repoUrl: fields.repo.value.trim() || undefined,
      screenshots: screenshots.length > 0 ? screenshots : [],
      tags: tags.length > 0 ? tags : [],
      dateCreated: getToday(),
      lastUpdated: getToday(),
      origin: fields.origin.value,
    };

    Object.keys(entry).forEach((k) => {
      if (entry[k] === undefined) delete entry[k];
    });

    return entry;
  }

  function updatePreview() {
    const entry = buildJSON();
    preview.textContent = JSON.stringify(entry, null, 2);
  }

  Object.values(fields).forEach((el) => {
    el.addEventListener("input", updatePreview);
    el.addEventListener("change", updatePreview);
  });

  updatePreview();

  wrapper.querySelector("#copyJsonBtn").addEventListener("click", () => {
    const text = preview.textContent;
    navigator.clipboard.writeText(text).then(
      () => {
        const btn = wrapper.querySelector("#copyJsonBtn");
        btn.textContent = "Copied!";
        setTimeout(() => (btn.textContent = "Copy JSON"), 2000);
      },
      () => alert("Copy failed — please select and copy manually.")
    );
  });
}

// ═════════════════════════════════════════════════════════════════════════
// TAB 3: GitHub Repository Sync
// ═════════════════════════════════════════════════════════════════════════

function renderGitHubSync(container) {
  const tools = getAllTools();
  const knownRepos = new Set(
    tools.map((t) => (t.repoUrl || "").toLowerCase().replace(/\/$/, ""))
  );

  const wrapper = document.createElement("div");

  // Retrieve saved PAT
  const savedPat = localStorage.getItem(PAT_STORAGE_KEY) || "";

  // Header card
  const headerCard = document.createElement("div");
  headerCard.className = "card";
  headerCard.innerHTML = `
    <h3>${icon("link", "icon")} GitHub Repository Discovery</h3>
    <p class="text-secondary" style="margin: 4px 0 16px;">
      Poll your GitHub account
      (<a href="https://github.com/${GITHUB_USERNAME}" target="_blank" rel="noopener" style="color: var(--color-primary);">@${GITHUB_USERNAME}</a>)
      for repositories. Without a token, only <strong>public</strong> repos are returned.
      Add a Personal Access Token (PAT) to include <strong>private</strong> repos.
    </p>

    <div class="form-grid" style="margin-bottom: 16px;">
      <div class="form-group" style="flex: 1;">
        <label class="form-label">GitHub Personal Access Token <span class="text-secondary">(optional)</span></label>
        <div style="display: flex; gap: 8px; align-items: center;">
          <input type="password" class="form-input" id="githubPat" placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                 value="${savedPat ? "••••••••" : ""}" style="flex: 1; font-family: monospace;" />
          <button class="button button-outline button-sm" id="togglePatVisibility" type="button" style="white-space: nowrap;">Show</button>
          <button class="button button-outline button-sm" id="clearPatBtn" type="button" style="white-space: nowrap;">Clear</button>
        </div>
        <p class="text-secondary" style="margin: 4px 0 0; font-size: 12px;">
          Requires the <code>repo</code> scope. Stored in localStorage — never sent anywhere except GitHub’s API.
        </p>
      </div>
    </div>

    <div class="button-group">
      <button class="button button-primary" id="pollReposBtn">
        ${icon("classifier", "icon")} Poll Repositories
      </button>
      <span class="text-secondary" id="pollStatus" style="line-height: 36px; margin-left: 12px;"></span>
    </div>
  `;
  wrapper.appendChild(headerCard);

  // Results container
  const resultsArea = document.createElement("div");
  resultsArea.id = "githubResults";
  wrapper.appendChild(resultsArea);

  container.appendChild(wrapper);

  // ── PAT management ──
  const patInput = wrapper.querySelector("#githubPat");
  let patRevealed = false;
  let actualPat = savedPat;

  // Focus clears masked dots so user can type a new token
  patInput.addEventListener("focus", () => {
    if (!patRevealed && patInput.value === "••••••••") {
      patInput.value = actualPat;
      patInput.type = "password";
    }
  });

  patInput.addEventListener("input", () => {
    actualPat = patInput.value.trim();
  });

  patInput.addEventListener("blur", () => {
    // Save on blur
    if (actualPat) {
      localStorage.setItem(PAT_STORAGE_KEY, actualPat);
    }
    if (!patRevealed && actualPat) {
      patInput.value = "••••••••";
      patInput.type = "password";
    }
  });

  wrapper.querySelector("#togglePatVisibility").addEventListener("click", () => {
    patRevealed = !patRevealed;
    const btn = wrapper.querySelector("#togglePatVisibility");
    if (patRevealed) {
      patInput.type = "text";
      patInput.value = actualPat;
      btn.textContent = "Hide";
    } else {
      patInput.type = "password";
      if (actualPat) patInput.value = "••••••••";
      btn.textContent = "Show";
    }
  });

  wrapper.querySelector("#clearPatBtn").addEventListener("click", () => {
    actualPat = "";
    patInput.value = "";
    patInput.type = "password";
    patRevealed = false;
    wrapper.querySelector("#togglePatVisibility").textContent = "Show";
    localStorage.removeItem(PAT_STORAGE_KEY);
  });

  // ── Poll logic ──
  wrapper.querySelector("#pollReposBtn").addEventListener("click", async () => {
    const statusEl = wrapper.querySelector("#pollStatus");
    const btn = wrapper.querySelector("#pollReposBtn");
    btn.disabled = true;

    // Save PAT if entered
    if (actualPat) {
      localStorage.setItem(PAT_STORAGE_KEY, actualPat);
    }

    const useAuth = !!actualPat;
    statusEl.textContent = useAuth
      ? "Fetching repositories (authenticated — includes private)…"
      : "Fetching public repositories…";

    try {
      const repos = await fetchAllRepos(actualPat || null);
      const privateCount = repos.filter((r) => r.private).length;
      const publicCount = repos.length - privateCount;
      statusEl.textContent = useAuth
        ? `Found ${repos.length} repositories (${publicCount} public, ${privateCount} private).`
        : `Found ${repos.length} public repositories.`;
      renderRepoResults(resultsArea, repos, knownRepos);
    } catch (err) {
      statusEl.textContent = `Error: ${err.message}`;
      console.error("[GitHubSync]", err);
    } finally {
      btn.disabled = false;
    }
  });
}

/**
 * Fetches repos for the configured GitHub user (handles pagination).
 * Without a token: public repos only via /users/:user/repos.
 * With a token: all repos (public + private) via /user/repos.
 * @param {string|null} token - GitHub PAT (optional)
 * @returns {Promise<Array>}
 */
async function fetchAllRepos(token) {
  let page = 1;
  const perPage = 100;
  const allRepos = [];
  const useAuth = !!token;

  while (true) {
    const baseUrl = useAuth ? GITHUB_API_AUTHENTICATED : GITHUB_API_PUBLIC;
    const params = new URLSearchParams({
      per_page: perPage,
      page: page,
      sort: "updated",
      direction: "desc",
    });
    // When authenticated, filter to only the user's own repos
    if (useAuth) {
      params.set("affiliation", "owner");
    }

    const url = `${baseUrl}?${params.toString()}`;
    const headers = {};
    if (useAuth) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const resp = await fetch(url, { headers });

    if (!resp.ok) {
      if (resp.status === 401) {
        throw new Error("Invalid token — authentication failed (401).");
      }
      if (resp.status === 403) {
        throw new Error("GitHub API rate limit reached. Try again later.");
      }
      throw new Error(`GitHub API returned ${resp.status}`);
    }

    const repos = await resp.json();
    if (repos.length === 0) break;

    allRepos.push(...repos);
    if (repos.length < perPage) break;
    page++;
  }

  return allRepos;
}

/**
 * Renders the repo comparison results.
 */
function renderRepoResults(container, repos, knownRepos) {
  container.innerHTML = "";

  // Separate tracked vs untracked
  const tracked = [];
  const untracked = [];

  for (const repo of repos) {
    const repoUrl = (repo.html_url || "").toLowerCase().replace(/\/$/, "");
    if (knownRepos.has(repoUrl)) {
      tracked.push(repo);
    } else {
      untracked.push(repo);
    }
  }

  // Summary stats
  const summary = document.createElement("div");
  summary.className = "card-grid";
  summary.style.gridTemplateColumns = "repeat(3, 1fr)";
  summary.style.marginBottom = "16px";
  summary.innerHTML = `
    <div class="card stat-card" style="--stat-accent: var(--color-primary);">
      <div class="stat-value">${repos.length}</div>
      <div class="stat-label">Total Repos</div>
    </div>
    <div class="card stat-card" style="--stat-accent: var(--color-success);">
      <div class="stat-value">${tracked.length}</div>
      <div class="stat-label">Already Tracked</div>
    </div>
    <div class="card stat-card" style="--stat-accent: var(--color-warning);">
      <div class="stat-value">${untracked.length}</div>
      <div class="stat-label">Untracked (New)</div>
    </div>
  `;
  container.appendChild(summary);

  // Untracked repos — actionable
  if (untracked.length > 0) {
    const untrackedCard = document.createElement("div");
    untrackedCard.className = "card";
    untrackedCard.style.padding = "0";
    untrackedCard.style.overflow = "hidden";

    let html = `
      <div style="padding: 16px 20px; border-bottom: 1px solid var(--border-subtle);">
        <h3 style="margin:0;">Untracked Repositories</h3>
        <p class="text-secondary" style="margin: 4px 0 0; font-size: 13px;">
          These repos exist on your GitHub but are not yet in your tool portfolio.
          Click <strong>Generate JSON</strong> to create a tools.json entry.
        </p>
      </div>
    `;

    html += `<table class="table"><thead><tr>
      <th>Repository</th>
      <th>Description</th>
      <th>Language</th>
      <th>Updated</th>
      <th style="width: 90px;">Visibility</th>
      <th style="width: 250px;">Action</th>
    </tr></thead><tbody>`;

    for (const repo of untracked) {
      const updated = repo.updated_at
        ? new Date(repo.updated_at).toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" })
        : "—";
      const desc = repo.description
        ? repo.description.length > 60 ? repo.description.slice(0, 60) + "…" : repo.description
        : '<span class="text-secondary">No description</span>';

      html += `
        <tr>
          <td>
            <a href="${repo.html_url}" target="_blank" rel="noopener" style="color: var(--color-primary); font-weight: 500; text-decoration: none;">
              ${repo.name}
            </a>
          </td>
          <td style="font-size: 13px;">${desc}</td>
          <td>${repo.language || "—"}</td>
          <td style="font-size: 13px;">${updated}</td>
          <td>${repo.private ? '<span class="badge-private">Private</span>' : '<span class="badge-public">Public</span>'}</td>
          <td>
            <div style="display: flex; gap: 6px;">
              <button class="button button-primary button-sm repo-generate-btn"
                      data-repo-name="${repo.name}"
                      data-repo-url="${repo.html_url}"
                      data-repo-desc="${(repo.description || "").replace(/"/g, "&quot;")}"
                      data-repo-lang="${repo.language || ""}"
                      data-repo-created="${repo.created_at || ""}"
                      data-repo-updated="${repo.updated_at || ""}"
                      data-repo-private="${repo.private ? "true" : "false"}">
                Generate JSON
              </button>
              <button class="button button-outline button-sm repo-import-btn"
                      data-repo-name="${repo.name}"
                      data-repo-url="${repo.html_url}"
                      data-repo-desc="${(repo.description || "").replace(/"/g, "&quot;")}"
                      data-repo-lang="${repo.language || ""}"
                      data-repo-created="${repo.created_at || ""}"
                      data-repo-updated="${repo.updated_at || ""}"
                      data-repo-private="${repo.private ? "true" : "false"}"
                      data-repo-topics="${(repo.topics || []).join(",")}">
                + Add to Portfolio
              </button>
            </div>
          </td>
        </tr>`;
    }

    html += `</tbody></table>`;
    untrackedCard.innerHTML = html;
    container.appendChild(untrackedCard);

    // Wire generate buttons
    untrackedCard.querySelectorAll(".repo-generate-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        showGeneratedJSON(container, btn.dataset);
      });
    });

    // Wire auto-import buttons
    untrackedCard.querySelectorAll(".repo-import-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        autoImportRepo(btn, container, knownRepos);
      });
    });
  }

  // Tracked repos — informational
  if (tracked.length > 0) {
    const trackedCard = document.createElement("div");
    trackedCard.className = "card";
    trackedCard.style.marginTop = "16px";

    let html = `<h3>Already Tracked</h3>
      <p class="text-secondary" style="margin: 4px 0 16px; font-size: 13px;">
        These repos are already represented in your tool portfolio.
      </p>
      <div class="tracked-repo-list">`;

    for (const repo of tracked) {
      const visBadge = repo.private
        ? '<span class="badge-private">Private</span>'
        : '<span class="badge-public">Public</span>';
      html += `
        <div class="tracked-repo-item">
          <span class="status-active">Tracked</span>
          ${visBadge}
          <a href="${repo.html_url}" target="_blank" rel="noopener" style="color: var(--text-primary); margin-left: 8px;">${repo.name}</a>
        </div>`;
    }

    html += "</div>";
    trackedCard.innerHTML = html;
    container.appendChild(trackedCard);
  }
}

/**
 * Auto-imports a repo as a new tool entry — reads repo metadata, creates tool,
 * adds to registry + localStorage, and updates the UI.
 */
function autoImportRepo(btn, container, knownRepos) {
  const ds = btn.dataset;

  const name = ds.repoName
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const tags = [];
  if (ds.repoLang) tags.push(ds.repoLang);
  if (ds.repoTopics) {
    ds.repoTopics.split(",").filter(Boolean).forEach((t) => {
      const tag = t.trim().replace(/\b\w/g, (c) => c.toUpperCase());
      if (!tags.includes(tag)) tags.push(tag);
    });
  }

  const entry = {
    id: ds.repoName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    name: name,
    version: "1.0.0",
    status: "Active",
    priority: "Normal",
    category: "Generic Tools",
    description: ds.repoDesc || `${name} — imported from GitHub.`,
    longDescription: ds.repoDesc || "",
    repoUrl: ds.repoUrl,
    screenshots: [],
    tags: tags,
    dateCreated: ds.repoCreated ? ds.repoCreated.split("T")[0] : new Date().toISOString().split("T")[0],
    lastUpdated: ds.repoUpdated ? ds.repoUpdated.split("T")[0] : new Date().toISOString().split("T")[0],
    origin: "GitHub",
    visibility: ds.repoPrivate === "true" ? "private" : "public",
    source: "auto-import",
  };

  const added = addTool(entry);
  if (!added) {
    btn.textContent = "Already exists";
    btn.disabled = true;
    btn.classList.remove("button-outline");
    return;
  }

  // Update known set so tracked list updates
  knownRepos.add(ds.repoUrl.toLowerCase().replace(/\/$/, ""));

  // Visual feedback
  btn.textContent = "✓ Added";
  btn.disabled = true;
  btn.classList.remove("button-outline");
  btn.classList.add("button-success");

  // Also disable the generate button in the same row
  const row = btn.closest("tr");
  if (row) {
    const genBtn = row.querySelector(".repo-generate-btn");
    if (genBtn) genBtn.disabled = true;
  }
}

/**
 * Shows a modal/card with the generated JSON for an untracked repo.
 */
function showGeneratedJSON(container, dataset) {
  const existing = container.querySelector("#generatedJsonCard");
  if (existing) existing.remove();

  const name = dataset.repoName
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const tags = [];
  if (dataset.repoLang) tags.push(dataset.repoLang);

  const entry = {
    id: dataset.repoName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    name: name,
    version: "1.0.0",
    status: "Active",
    priority: "Normal",
    category: "Generic Tools",
    description: dataset.repoDesc || `${name} — imported from GitHub.`,
    longDescription: dataset.repoDesc || "",
    repoUrl: dataset.repoUrl,
    screenshots: [],
    tags: tags,
    dateCreated: dataset.repoCreated ? dataset.repoCreated.split("T")[0] : new Date().toISOString().split("T")[0],
    lastUpdated: dataset.repoUpdated ? dataset.repoUpdated.split("T")[0] : new Date().toISOString().split("T")[0],
    origin: "Web",
    visibility: dataset.repoPrivate === "true" ? "private" : "public",
  };

  const card = document.createElement("div");
  card.className = "card";
  card.id = "generatedJsonCard";
  card.style.marginTop = "16px";
  card.style.border = "2px solid var(--color-primary)";
  card.innerHTML = `
    <div class="section-header">
      <h3>Generated Entry — ${entry.name}</h3>
      <div class="button-group">
        <button class="button button-primary button-sm" id="copyGeneratedJson">Copy JSON</button>
        <button class="button button-outline button-sm" id="dismissGeneratedJson">Dismiss</button>
      </div>
    </div>
    <p class="text-secondary" style="margin: 0 0 12px; font-size: 13px;">
      Copy this JSON and add it to your <code>data/tools.json</code> array. Adjust the category, priority, and description as needed.
    </p>
    <pre class="json-preview">${JSON.stringify(entry, null, 2)}</pre>
  `;

  container.appendChild(card);
  card.scrollIntoView({ behavior: "smooth", block: "center" });

  card.querySelector("#copyGeneratedJson").addEventListener("click", () => {
    navigator.clipboard.writeText(JSON.stringify(entry, null, 2)).then(
      () => {
        const btn = card.querySelector("#copyGeneratedJson");
        btn.textContent = "Copied!";
        setTimeout(() => (btn.textContent = "Copy JSON"), 2000);
      },
      () => alert("Copy failed — please select and copy manually.")
    );
  });

  card.querySelector("#dismissGeneratedJson").addEventListener("click", () => {
    card.remove();
  });
}
