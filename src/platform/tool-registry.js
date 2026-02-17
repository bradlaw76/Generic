// =============================================================================
// TOOL REGISTRY — Fetches and manages portfolio tool entries from JSON
// Version: 3.0.0 | Last Updated: 2026-02-16
//
// Loads data/tools.json at startup AND merges any user-added tools stored
// in localStorage (key: generic_user_tools). All pages read from the
// cached array. Supports disable/enable toggle persisted in localStorage.
// =============================================================================

const DISABLED_KEY = "generic_disabled_tools";
const USER_TOOLS_KEY = "generic_user_tools";

/** @type {import('./tool-types.js').ToolEntry[]} */
let toolsCache = [];

/** Whether tools have been loaded */
let loaded = false;

/**
 * Loads tools from data/tools.json + localStorage user tools.
 * Call once at app startup.
 * @returns {Promise<import('./tool-types.js').ToolEntry[]>}
 */
export async function loadTools() {
  if (loaded) return toolsCache;

  let jsonTools = [];
  try {
    const resp = await fetch("data/tools.json");
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    jsonTools = await resp.json();
  } catch (err) {
    console.error("[ToolRegistry] Failed to load tools.json:", err);
  }

  // Merge localStorage user-added tools
  const userTools = getUserTools();
  const jsonIds = new Set(jsonTools.map((t) => t.id));
  const merged = [...jsonTools];
  for (const ut of userTools) {
    if (!jsonIds.has(ut.id)) {
      merged.push(ut);
    }
  }

  // Apply any saved edits (overrides for tools.json entries)
  const edits = getEditsMap();
  for (const tool of merged) {
    if (edits[tool.id]) {
      Object.assign(tool, edits[tool.id]);
    }
  }

  toolsCache = merged;
  loaded = true;
  return toolsCache;
}

/**
 * Returns all tools (sync — must call loadTools() first).
 * @returns {import('./tool-types.js').ToolEntry[]}
 */
export function getAllTools() {
  return [...toolsCache];
}

/**
 * Returns enabled tools sorted by category + name.
 * Filters out Archived and disabled tools.
 * @returns {import('./tool-types.js').ToolEntry[]}
 */
export function getActiveTools() {
  return toolsCache
    .filter((t) => t.status !== "Archived" && !isToolDisabled(t.id))
    .sort((a, b) => {
      const catCmp = a.category.localeCompare(b.category);
      if (catCmp !== 0) return catCmp;
      return a.name.localeCompare(b.name);
    });
}

/**
 * Returns a tool by id, or undefined.
 * @param {string} id
 * @returns {import('./tool-types.js').ToolEntry | undefined}
 */
export function getToolById(id) {
  return toolsCache.find((t) => t.id === id);
}

// ─── Disable / Enable via localStorage ──────────────────────────────────

/**
 * Returns the set of disabled tool IDs from localStorage.
 * @returns {Set<string>}
 */
function getDisabledSet() {
  try {
    const raw = localStorage.getItem(DISABLED_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

/**
 * Persists the disabled set to localStorage.
 * @param {Set<string>} set
 */
function saveDisabledSet(set) {
  localStorage.setItem(DISABLED_KEY, JSON.stringify([...set]));
}

/**
 * Checks whether a tool is currently disabled.
 * @param {string} id
 * @returns {boolean}
 */
export function isToolDisabled(id) {
  return getDisabledSet().has(id);
}

/**
 * Toggles a tool's disabled state. Returns new disabled status.
 * @param {string} id
 * @returns {boolean} true if now disabled, false if now enabled
 */
export function toggleToolDisabled(id) {
  const set = getDisabledSet();
  if (set.has(id)) {
    set.delete(id);
    saveDisabledSet(set);
    return false;
  } else {
    set.add(id);
    saveDisabledSet(set);
    return true;
  }
}

// ─── User-added tools (localStorage) ────────────────────────────────────

/**
 * Reads user-added tools from localStorage.
 * @returns {Array}
 */
function getUserTools() {
  try {
    const raw = localStorage.getItem(USER_TOOLS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Saves user-added tools to localStorage.
 * @param {Array} tools
 */
function saveUserTools(tools) {
  localStorage.setItem(USER_TOOLS_KEY, JSON.stringify(tools));
}

/**
 * Adds a tool entry to both the live cache and localStorage persistence.
 * Returns true if added, false if duplicate id.
 * @param {Object} toolEntry
 * @returns {boolean}
 */
export function addTool(toolEntry) {
  if (toolsCache.some((t) => t.id === toolEntry.id)) {
    return false; // Duplicate
  }
  toolsCache.push(toolEntry);

  const userTools = getUserTools();
  userTools.push(toolEntry);
  saveUserTools(userTools);
  return true;
}

/**
 * Removes a user-added tool from localStorage and cache.
 * (Cannot remove tools.json tools — only user-added ones.)
 * @param {string} id
 * @returns {boolean}
 */
export function removeUserTool(id) {
  const userTools = getUserTools();
  const idx = userTools.findIndex((t) => t.id === id);
  if (idx === -1) return false;
  userTools.splice(idx, 1);
  saveUserTools(userTools);
  toolsCache = toolsCache.filter((t) => t.id !== id);
  return true;
}

const EDITS_KEY = "generic_tool_edits";

/**
 * Reads tool edit overrides from localStorage.
 * @returns {Object<string, Object>} Map of tool id → partial overrides
 */
function getEditsMap() {
  try {
    const raw = localStorage.getItem(EDITS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Updates a tool's fields in both the live cache and localStorage.
 * For tools.json tools, stores overrides in a separate localStorage key.
 * For user-added tools, updates the user tools entry directly.
 * @param {string} id
 * @param {Object} changes — partial object with fields to update
 * @returns {boolean} true if tool was found and updated
 */
export function updateTool(id, changes) {
  const idx = toolsCache.findIndex((t) => t.id === id);
  if (idx === -1) return false;

  // Merge into live cache
  Object.assign(toolsCache[idx], changes);

  // Persist — check if it's a user-added tool first
  const userTools = getUserTools();
  const userIdx = userTools.findIndex((t) => t.id === id);
  if (userIdx !== -1) {
    Object.assign(userTools[userIdx], changes);
    saveUserTools(userTools);
  } else {
    // JSON-file tool — store overrides separately
    const edits = getEditsMap();
    edits[id] = { ...(edits[id] || {}), ...changes };
    localStorage.setItem(EDITS_KEY, JSON.stringify(edits));
  }

  return true;
}
