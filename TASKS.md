# GENERIC TOOL PORTFOLIO — TASKS

## Feature Completion Checklist

> **Version:** 3.0.0  
> **Last updated:** 2026-02-16  
> **Architecture:** Vanilla HTML/CSS/JS — zero dependencies

---

## Phase 1: Project Scaffold & Shell Layout

> **Status:** ✅ Complete

- [x] Create `index.html` entry point with 6 CSS loads + ES module bootstrap
- [x] Create `src/app/shell.js` — main orchestrator (layout + routes + init)
- [x] Create `src/app/router.js` — hash-based SPA router with parameterised patterns
- [x] Create `src/layout/top-bar.js` — 48px fixed header with hamburger, logo, title, theme, gear, profile
- [x] Create `src/layout/side-nav.js` — collapsible nav with category groups + active state
- [x] Create `src/layout/content-area.js` — route target `<main>` container
- [x] Create `src/shared/icons.js` — 18 inline SVG icon functions
- [x] Add `images/Generic.ASCII.png` logo to TopBar (32px) and Dashboard (40px)
- [x] Verify: shell renders, nav collapses, layout matches D365 Modern UI

---

## Phase 2: CSS Foundation & Theme System

> **Status:** ✅ Complete

- [x] Create `src/styles/reset.css` — CSS reset
- [x] Create `src/styles/themes.css` — 3 theme definitions (Circuit Dark, Circuit Light, Dynamics 365)
- [x] Create `src/styles/typography.css` — font stack (Segoe UI), type scale
- [x] Create `src/styles/layout.css` — shell grid layout, top-bar-logo
- [x] Create `src/styles/components.css` — all component styles (~1050 lines)
- [x] Create `src/styles/presentation.css` — SpeckKit slide styles
- [x] Create `src/theme/theme-switcher.js` — theme persistence + dropdown close handler
- [x] Theme dropdown in TopBar with 3 options
- [x] localStorage persistence (`generic-d365-theme`), default: `theme-dark`
- [x] Verify: all 3 themes render correctly, switch is instant, persists on reload

---

## Phase 3: Data Layer & Tool Registry

> **Status:** ✅ Complete

- [x] Create `data/tools.json` — 8 tool definitions (source of truth)
- [x] Create `src/platform/tool-registry.js` — central data CRUD module
- [x] Implement `loadTools()` — fetch JSON + merge localStorage overrides
- [x] Implement `getAllTools()`, `getActiveTools()`, `getToolById()`
- [x] Implement `addTool()` — persist user-added tools to `generic_user_tools`
- [x] Implement `updateTool()` — persist field-level edits to `generic_tool_edits`
- [x] Implement `toggleToolDisabled()` — persist disabled state to `generic_disabled_tools`
- [x] Implement `removeUserTool()` — remove user-added tools
- [x] Create `src/platform/tool-types.js` — schema definitions
- [x] Create `src/platform/navigation-engine.js` — nav configuration helpers

---

## Phase 4: Dashboard

> **Status:** ✅ Complete

- [x] Create `src/tools/dashboard/index.js` — metrics-only dashboard (no tool grid)
- [x] 4 stat cards: Active Tools, Categories, High Priority, Disabled
- [x] Category Breakdown — horizontal bars
- [x] Recently Updated — top 5 tools list
- [x] Public vs Private — CSS conic-gradient donut chart
- [x] Priority Distribution — horizontal bars
- [x] Quick Actions — buttons (Add New Tool, Settings, SpeckKit)
- [x] Verify: all metrics computed from tool registry data

---

## Phase 5: Settings Page

> **Status:** ✅ Complete

### Tab 1 — Tool Management Grid
- [x] D365-style data grid with sortable columns
- [x] Columns: Name, Category, Visibility, Status, Priority, Last Updated, Enabled, Edit
- [x] Stats cards (Total, Active, High Priority, Disabled)
- [x] Toolbar with +New Tool, Refresh, Filter buttons
- [x] Toggle switches for enable/disable (persists via `toggleToolDisabled`)
- [x] Edit pencil icon button per row
- [x] `showEditPanel()` — inline edit form for all tool fields
- [x] Public/Private visibility badges in grid

### Tab 2 — Add New Tool
- [x] Full form: name, category, status, priority, version, description, repo URL, tags
- [x] Live JSON preview panel
- [x] Copy JSON to clipboard button
- [x] Submit adds tool via `addTool()`

### Tab 3 — GitHub Repository Sync
- [x] PAT input (password type) with Show/Hide/Clear controls
- [x] Token persistence in `generic_github_pat`
- [x] Poll Repositories button → `fetchAllRepos(token)` with pagination
- [x] Public mode: `GET /users/bradlaw76/repos`
- [x] Authenticated mode: `GET /user/repos` with Bearer token
- [x] Untracked repos table with Visibility badge
- [x] Generate JSON button (copies `tools.json`-compatible entry)
- [x] + Add to Portfolio button (`autoImportRepo()`)
- [x] Tracked repos list with Visibility badges
- [x] Import feedback (button turns green "Added!")

---

## Phase 6: Tool Detail Page

> **Status:** ✅ Complete

- [x] Create `src/pages/tool-detail.js` — full tool metadata display
- [x] Metadata grid: version, status, priority, category, origin, dates
- [x] Tags display
- [x] Long description rendering
- [x] Screenshots section with upload (Add Files button + drag-and-drop)
- [x] localStorage merge: repo screenshots + user uploads (`generic_screenshots_{id}`)
- [x] Remove button (X) on hover for user-uploaded screenshots
- [x] Lightbox viewer with keyboard nav (arrows, Escape)
- [x] Adaptive gallery layout (1–5 images)
- [x] Max 5 screenshots per tool
- [x] Action buttons: View Repository (external link), Edit Tool, Back to Dashboard
- [x] `showDetailEditPanel()` — inline edit form (same fields as Settings edit)
- [x] Edit persists via `updateTool()`
- [x] Parameterised route: `/tools/:id`

---

## Phase 7: SpeckKit Page

> **Status:** ✅ Complete

- [x] Create `src/pages/speckkit.js` — governance overview + guidance
- [x] Governance overview and code standards summary
- [x] UI references policy (ask-first loading)
- [x] Specify CLI guidance with copy-to-clipboard helpers
- [x] Cleanup function returned for route teardown

---

## Phase 8: VS Code Page

> **Status:** ✅ Complete

- [x] Create `src/pages/vscode.js` — dev environment showcase
- [x] Sections: Dev Environment, Key Extensions, Workflow, Why Vanilla JS, Project Structure

---

## Phase 9: SideNav & Routing

> **Status:** ✅ Complete

- [x] SideNav groups: Dashboard, tool categories (dynamic), Development (SpeckKit, VS Code), Admin (Settings)
- [x] Active route highlighting (`updateActiveNav()`)
- [x] Route registration in `shell.js`: `/`, `/tools/:id`, `/settings`, `/add-tool`, `/speckkit`, `/vscode`
- [x] Legacy `/add-tool` route redirects to `/settings`
- [x] Lazy loading via dynamic `import()` in route handlers
- [x] 404 handling for unknown tool IDs

---

## Summary

| Phase | Name                     | Tasks | Status       |
|-------|--------------------------|-------|--------------|
| 1     | Project Scaffold & Shell | 9     | ✅ Complete  |
| 2     | CSS & Theme System       | 10    | ✅ Complete  |
| 3     | Data Layer & Registry    | 10    | ✅ Complete  |
| 4     | Dashboard                | 8     | ✅ Complete  |
| 5     | Settings Page            | 20    | ✅ Complete  |
| 6     | Tool Detail Page         | 14    | ✅ Complete  |
| 7     | SpeckKit Page            | 5     | ✅ Complete  |
| 8     | VS Code Page             | 2     | ✅ Complete  |
| 9     | SideNav & Routing        | 6     | ✅ Complete  |
|       | **TOTAL**                | **87**| **All Complete** |

---

## Future Enhancements (Not Planned)

These are not in scope but could be added later:

- [ ] Authentication / authorization
- [ ] Server-side API layer
- [ ] Advanced data grid (sorting, filtering, column resize)
- [x] ~~Image upload / screenshot management~~ (Implemented v3.1.0)
- [ ] Export / import tool portfolio as JSON file
- [ ] CI/CD pipeline
- [ ] Automated testing (no test framework — zero dependencies)
- [ ] PWA / offline support
- [ ] Dark mode auto-detect (`prefers-color-scheme`)

---

*End of Tasks — Generic Tool Portfolio v3.1.0*
