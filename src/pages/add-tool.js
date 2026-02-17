// =============================================================================
// ADD TOOL — Form UI for composing a new tool entry
// Version: 2.0.0 | Last Updated: 2026-02-16
//
// COMPONENT: AddToolPage
// DESCRIPTION: A form that composes a new tool JSON entry, shows a live
//              preview, and copies the JSON to clipboard. User then pastes
//              into data/tools.json and commits.
// ENVIRONMENT: Vanilla JS (ES Module) — GitHub Pages
// =============================================================================

import { createSectionHeader } from "../shared/components/section-header.js";

const CATEGORIES = [
  "Generic Tools",
  "Publications",
  "Development",
];

const PRIORITIES = ["High", "Normal", "Low"];
const STATUSES = ["Active", "Draft", "Archived"];
const ORIGINS = ["Web", "Phone", "Chat", "Email"];

/**
 * Renders the Add New Tool page.
 * @param {HTMLElement} container
 */
export function render(container) {
  const page = document.createElement("div");
  page.className = "page-content";

  page.appendChild(
    createSectionHeader({ title: "Add New Tool" })
  );

  // Instructions card
  const infoCard = document.createElement("div");
  infoCard.className = "card";
  infoCard.innerHTML = `
    <h3>How it works</h3>
    <p>Fill in the form below. The JSON preview updates in real time. When ready, click <strong>Copy JSON</strong> and paste the entry into <code>data/tools.json</code>. Commit and push — the tool will appear automatically on the next page load.</p>
    <p>For screenshots, place image files in <code>data/screenshots/{tool-id}/</code> and reference them in the screenshots field.</p>
  `;
  page.appendChild(infoCard);

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
  page.appendChild(formCard);

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
  page.appendChild(previewCard);

  container.appendChild(page);

  // ── Live preview logic ──
  const fields = {
    name: page.querySelector("#f-name"),
    id: page.querySelector("#f-id"),
    category: page.querySelector("#f-category"),
    status: page.querySelector("#f-status"),
    priority: page.querySelector("#f-priority"),
    origin: page.querySelector("#f-origin"),
    version: page.querySelector("#f-version"),
    repo: page.querySelector("#f-repo"),
    desc: page.querySelector("#f-desc"),
    longdesc: page.querySelector("#f-longdesc"),
    tags: page.querySelector("#f-tags"),
    screenshots: page.querySelector("#f-screenshots"),
  };

  const preview = page.querySelector("#jsonPreview");

  function toId(name) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function getToday() {
    return new Date().toISOString().split("T")[0];
  }

  function buildJSON() {
    const name = fields.name.value.trim();
    const id = toId(name);
    fields.id.value = id;

    const tags = fields.tags.value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const screenshots = fields.screenshots.value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

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

    // Remove undefined keys
    Object.keys(entry).forEach((k) => {
      if (entry[k] === undefined) delete entry[k];
    });

    return entry;
  }

  function updatePreview() {
    const entry = buildJSON();
    preview.textContent = JSON.stringify(entry, null, 2);
  }

  // Wire live updates on all inputs
  Object.values(fields).forEach((el) => {
    el.addEventListener("input", updatePreview);
    el.addEventListener("change", updatePreview);
  });

  updatePreview();

  // Copy button
  page.querySelector("#copyJsonBtn").addEventListener("click", () => {
    const text = preview.textContent;
    navigator.clipboard.writeText(text).then(
      () => {
        const btn = page.querySelector("#copyJsonBtn");
        btn.textContent = "Copied!";
        setTimeout(() => (btn.textContent = "Copy JSON"), 2000);
      },
      () => alert("Copy failed — please select and copy manually.")
    );
  });
}
