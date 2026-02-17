// =============================================================================
// TOOL DETAIL — Rich detail page for a single portfolio tool entry
// Version: 3.1.0 | Last Updated: 2026-02-17
//
// COMPONENT: ToolDetailPage
// DESCRIPTION: Shows full description, metadata, screenshots, tags,
//              and repo link for a tool entry. Driven by data/tools.json.
//              Screenshot upload via Add Files button + drag-and-drop.
//              User uploads stored in localStorage (generic_screenshots_{id}).
// CHANGELOG: 3.1.0 — Screenshot upload: Add Files, drag-drop, remove, lightbox
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

  // ── Screenshots (localStorage merge pattern) ──
  const screenshotCard = document.createElement("div");
  screenshotCard.className = "card gallery-section";
  screenshotCard.innerHTML = `
    <div class="gallery-header">
      <h3>Screenshots</h3>
      <div class="gallery-header-right">
        <span id="galleryCount" style="font-size: 12px; color: var(--text-muted);"></span>
        <button class="upload-btn" id="screenshotUploadBtn" title="Add screenshots">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          Add Files
        </button>
        <input type="file" id="screenshotFileInput" class="upload-file-input" multiple accept="image/*,video/mp4,video/webm,video/ogg" />
      </div>
    </div>
    <div class="screenshot-gallery" id="screenshotGallery" data-count="0"></div>
  `;
  page.appendChild(screenshotCard);

  // Render merged gallery (repo screenshots + localStorage uploads)
  renderScreenshotGallery(screenshotCard, tool);

  // Wire upload button
  screenshotCard.querySelector("#screenshotUploadBtn").addEventListener("click", () => {
    screenshotCard.querySelector("#screenshotFileInput").click();
  });

  // Wire file input
  screenshotCard.querySelector("#screenshotFileInput").addEventListener("change", (e) => {
    const files = Array.from(e.target.files);
    if (files.length) processScreenshotFiles(screenshotCard, tool, files);
    e.target.value = "";
  });

  // Wire drag-and-drop
  const gallery = screenshotCard.querySelector("#screenshotGallery");
  gallery.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    gallery.classList.add("drag-over");
  });
  gallery.addEventListener("dragleave", () => gallery.classList.remove("drag-over"));
  gallery.addEventListener("drop", (e) => {
    e.preventDefault();
    gallery.classList.remove("drag-over");
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/") || f.type.startsWith("video/"));
    if (files.length) processScreenshotFiles(screenshotCard, tool, files);
  });

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

// =============================================================================
// SCREENSHOT GALLERY — localStorage merge pattern
// Base: tool.screenshots (repo paths, cross-machine)
// User: localStorage generic_screenshots_{id} (local uploads)
// =============================================================================

function isVideo(src) {
  return /\.(mp4|webm|ogg)$/i.test(src) || src.startsWith("data:video/");
}

function getStoredScreenshots(toolId) {
  try {
    const raw = localStorage.getItem("generic_screenshots_" + toolId);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}

function setStoredScreenshots(toolId, arr) {
  try {
    localStorage.setItem("generic_screenshots_" + toolId, JSON.stringify(arr));
  } catch (e) {
    alert("localStorage is full. Remove some screenshots before adding more.");
  }
}

function getAllScreenshots(tool) {
  const base = tool.screenshots || [];
  const local = getStoredScreenshots(tool.id);
  return { base, local, all: [...base, ...local] };
}

function renderScreenshotGallery(card, tool) {
  const gallery = card.querySelector("#screenshotGallery");
  const countEl = card.querySelector("#galleryCount");
  const { base, local, all } = getAllScreenshots(tool);

  // Always show the section (has upload button now)
  card.classList.add("has-screenshots");

  if (all.length === 0) {
    gallery.setAttribute("data-count", "0");
    gallery.innerHTML = `
      <div class="gallery-empty">
        <svg viewBox="0 0 24 24" fill="currentColor" style="width:20px;height:20px;margin-right:8px;opacity:0.5;"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
        No screenshots — click Add Files or drag &amp; drop images here
      </div>
    `;
    countEl.textContent = "";
    return;
  }

  const display = all.slice(0, 5);
  const count = display.length;
  gallery.setAttribute("data-count", count);
  countEl.textContent = all.length + " screenshot" + (all.length !== 1 ? "s" : "");

  gallery.innerHTML = display.map((src, i) => {
    const isLocal = i >= base.length;
    const localIdx = i - base.length;
    const mediaEl = isVideo(src)
      ? `<video src="${src}" muted preload="metadata"></video>`
      : `<img src="${src}" alt="${tool.name} screenshot ${i + 1}" loading="lazy" />`;
    const removeBtn = isLocal
      ? `<button class="gallery-remove" data-local-idx="${localIdx}" title="Remove" aria-label="Remove screenshot">
           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
         </button>`
      : "";
    return `
      <div class="gallery-item" tabindex="0" data-idx="${i}" role="button" aria-label="View screenshot ${i + 1}">
        ${mediaEl}
        ${removeBtn}
        <div class="gallery-expand">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M21 11V3h-8l3.29 3.29-10 10L3 13v8h8l-3.29-3.29 10-10L21 11z"/></svg>
        </div>
        <span class="gallery-index">${i + 1} / ${count}</span>
      </div>`;
  }).join("");

  // Wire lightbox click
  gallery.querySelectorAll(".gallery-item").forEach((item) => {
    item.addEventListener("click", (e) => {
      if (e.target.closest(".gallery-remove")) return;
      openLightbox(display, tool.name, parseInt(item.dataset.idx, 10));
    });
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter") openLightbox(display, tool.name, parseInt(item.dataset.idx, 10));
    });
  });

  // Wire remove buttons
  gallery.querySelectorAll(".gallery-remove").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.localIdx, 10);
      const arr = getStoredScreenshots(tool.id);
      if (idx >= 0 && idx < arr.length) {
        arr.splice(idx, 1);
        setStoredScreenshots(tool.id, arr);
        renderScreenshotGallery(card, tool);
      }
    });
  });
}

function processScreenshotFiles(card, tool, files) {
  const existing = getStoredScreenshots(tool.id);
  const baseCount = (tool.screenshots || []).length;
  const room = 5 - baseCount - existing.length;

  if (room <= 0) {
    alert("Maximum of 5 screenshots reached for this tool.");
    return;
  }

  const batch = files.slice(0, room);
  let done = 0;

  batch.forEach((file) => {
    const reader = new FileReader();
    reader.onload = function (ev) {
      existing.push(ev.target.result);
      done++;
      if (done === batch.length) {
        setStoredScreenshots(tool.id, existing);
        renderScreenshotGallery(card, tool);
      }
    };
    reader.readAsDataURL(file);
  });
}

// ── Lightbox ──
function openLightbox(media, toolName, startIdx) {
  let idx = startIdx;

  // Create lightbox overlay
  const overlay = document.createElement("div");
  overlay.className = "lightbox open";
  overlay.innerHTML = `
    <button class="lightbox-close" aria-label="Close">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
    ${media.length > 1 ? `
      <button class="lightbox-nav lightbox-prev" aria-label="Previous">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <button class="lightbox-nav lightbox-next" aria-label="Next">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="9 6 15 12 9 18"/></svg>
      </button>
      <div class="lightbox-counter"><span id="lbCounter"></span></div>
    ` : ""}
    <div class="lightbox-content" id="lbContent"></div>
  `;
  document.body.appendChild(overlay);

  function show(i) {
    idx = i;
    const content = overlay.querySelector("#lbContent");
    const src = media[idx];
    content.innerHTML = isVideo(src)
      ? `<video src="${src}" controls autoplay style="max-width:90vw;max-height:85vh;"></video>`
      : `<img src="${src}" alt="${toolName} screenshot ${idx + 1}" />`;
    const counter = overlay.querySelector("#lbCounter");
    if (counter) counter.textContent = `${idx + 1} / ${media.length}`;
  }

  show(idx);

  overlay.querySelector(".lightbox-close").addEventListener("click", () => overlay.remove());
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.remove();
  });

  const prev = overlay.querySelector(".lightbox-prev");
  const next = overlay.querySelector(".lightbox-next");
  if (prev) prev.addEventListener("click", () => show((idx - 1 + media.length) % media.length));
  if (next) next.addEventListener("click", () => show((idx + 1) % media.length));

  document.addEventListener("keydown", function handler(e) {
    if (e.key === "Escape") { overlay.remove(); document.removeEventListener("keydown", handler); }
    if (e.key === "ArrowLeft" && prev) { show((idx - 1 + media.length) % media.length); }
    if (e.key === "ArrowRight" && next) { show((idx + 1) % media.length); }
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
