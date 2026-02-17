// =============================================================================
// HASH ROUTER — Vanilla hash-based routing with param extraction
// Version: 2.0.0 | Last Updated: 2026-02-16
//
// COMPONENT: Router
// DESCRIPTION: Hash-based SPA router supporting exact routes and parameterised
//              patterns like /tools/:id. Handlers receive the content
//              container and an optional params object.
// ENVIRONMENT: Vanilla JS (ES Module) — GitHub Pages
// =============================================================================

/**
 * @typedef {Object} RouteEntry
 * @property {string} pattern   - Route pattern (e.g., "/tools/:id")
 * @property {RegExp} regex     - Compiled regex for matching
 * @property {string[]} keys    - Parameter names
 * @property {Function} handler - (container, params) => cleanup | void
 */

/** @type {RouteEntry[]} */
const routes = [];
let currentCleanup = null;

/**
 * Compile a route pattern into a regex + param-key list.
 * Supports `:param` segments (e.g., "/tools/:id").
 * @param {string} pattern
 * @returns {{ regex: RegExp, keys: string[] }}
 */
function compilePattern(pattern) {
  const keys = [];
  const regexStr = pattern.replace(/:([^/]+)/g, (_m, key) => {
    keys.push(key);
    return "([^/]+)";
  });
  return { regex: new RegExp("^" + regexStr + "$"), keys };
}

/**
 * Register a route.
 * @param {string} pattern - e.g., "/" or "/tools/:id"
 * @param {(container: HTMLElement, params?: Record<string,string>) => (() => void) | void} handler
 */
export function registerRoute(pattern, handler) {
  const { regex, keys } = compilePattern(pattern);
  routes.push({ pattern, regex, keys, handler });
}

/**
 * Navigate to a hash route.
 * @param {string} path
 */
export function navigate(path) {
  window.location.hash = "#" + path;
}

/**
 * Resolves the current hash to a registered route.
 */
function resolve() {
  const hash = window.location.hash.slice(1) || "/";

  // Clean up previous page
  if (typeof currentCleanup === "function") {
    currentCleanup();
    currentCleanup = null;
  }

  const container = document.getElementById("contentArea");
  if (!container) return;
  container.innerHTML = "";

  for (const route of routes) {
    const match = hash.match(route.regex);
    if (match) {
      const params = {};
      route.keys.forEach((key, i) => {
        params[key] = decodeURIComponent(match[i + 1]);
      });
      const result = route.handler(container, params);
      // Support both sync and async handlers
      if (result && typeof result.then === "function") {
        result.then((cleanup) => {
          if (typeof cleanup === "function") currentCleanup = cleanup;
        });
      } else {
        currentCleanup = result || null;
      }
      updateActiveNav();
      return;
    }
  }

  // 404
  container.innerHTML = `
    <div class="page-content" style="text-align:center; padding-top:48px;">
      <h2>404 — Page not found</h2>
      <p class="text-secondary" style="margin-top:8px;">
        The requested page does not exist.
      </p>
      <p style="margin-top:16px;">
        <a href="#/" style="color:var(--accent);">Return to Dashboard</a>
      </p>
    </div>
  `;
  updateActiveNav();
}

/**
 * Start the router — listen for hash changes and resolve initial route.
 */
export function startRouter() {
  window.addEventListener("hashchange", resolve);
  resolve();
}

/**
 * Update the active nav indicator for the current route.
 */
export function updateActiveNav() {
  const hash = window.location.hash.slice(1) || "/";

  document.querySelectorAll(".nav-item").forEach((item) => {
    const route = item.dataset.route;
    if (!route) return;
    const isActive = hash === route || (route !== "/" && hash.startsWith(route));
    item.classList.toggle("active", isActive);
    item.setAttribute("aria-current", isActive ? "page" : "false");
  });
}
