// =============================================================================
// APP SHELL — Main orchestrator; wires layout, routes, and theme
// Version: 2.0.0 | Last Updated: 2026-02-16
//
// COMPONENT: AppShell
// DESCRIPTION: Initializes the D365 Modern Shell application. Loads tool data
//              from tools.json, mounts layout components (TopBar, SideNav,
//              ContentArea), registers all routes (dashboard, tool detail,
//              static content pages), and starts the hash router.
// ENVIRONMENT: Vanilla JS (ES Module) — GitHub Pages
// =============================================================================

import { initTheme, initThemeDropdownClose } from "../theme/theme-switcher.js";
import { renderTopBar } from "../layout/top-bar.js";
import { renderSideNav } from "../layout/side-nav.js";
import { renderContentArea } from "../layout/content-area.js";
import { registerRoute, navigate, startRouter } from "./router.js";
import { loadTools, getToolById } from "../platform/tool-registry.js";

/**
 * Initializes the entire shell application.
 */
export async function init() {
  const root = document.body;

  // 1. Apply saved theme
  initTheme();
  initThemeDropdownClose();

  // 2. Load tool data BEFORE rendering nav (so categories are populated)
  await loadTools();

  // 3. Mount layout components
  let sideNavRef;

  renderTopBar(root, {
    onToggleNav: () => sideNavRef?.toggle(),
  });

  sideNavRef = renderSideNav(root);
  renderContentArea(root);

  // 4. Register routes ——————————————————————————————————————————————————

  // Dashboard (landing page)
  registerRoute("/", async (container) => {
    const mod = await import("../tools/dashboard/index.js");
    mod.render(container);
  });

  // Tool detail (parameterised route)
  registerRoute("/tools/:id", async (container, params) => {
    const tool = getToolById(params.id);
    if (!tool) {
      container.innerHTML = `
        <div class="page-content" style="text-align:center;padding-top:48px;">
          <h2>Tool not found</h2>
          <p class="text-secondary">No tool with ID "${params.id}" exists.</p>
          <p style="margin-top:16px;">
            <a href="#/" style="color:var(--accent);">Return to Dashboard</a>
          </p>
        </div>`;
      return;
    }
    const mod = await import("../pages/tool-detail.js");
    mod.render(container, tool);
  });

  // Settings page (tool management, add tool, GitHub sync)
  registerRoute("/settings", async (container) => {
    const mod = await import("../pages/settings.js");
    mod.render(container);
  });

  // Redirect old add-tool route to settings
  registerRoute("/add-tool", () => {
    navigate("/settings");
  });

  // SpeckKit methodology page
  registerRoute("/speckkit", async (container) => {
    const mod = await import("../pages/speckkit.js");
    return mod.render(container);
  });

  // VS Code & How page
  registerRoute("/vscode", async (container) => {
    const mod = await import("../pages/vscode.js");
    mod.render(container);
  });

  // 5. Start router
  startRouter();
}

