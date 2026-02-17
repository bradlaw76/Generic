# Generic Tool Portfolio — Project Index

## File-Level Module Reference

> **Version:** 3.0.0  
> **Last updated:** 2026-02-16  
> **Architecture:** Vanilla HTML/CSS/JS — Zero dependencies, zero build step

---

## Overview

This document catalogues every file in the project, its purpose, exports, and relationships. The project is a single-page application built entirely with native browser technologies.

---

## Entry Point

### `index.html`
- **Type:** HTML
- **Purpose:** Single entry point — loads 6 CSS stylesheets and bootstraps the app via `src/app/shell.js` as an ES module
- **Key detail:** `<body class="theme-dark">` — default theme applied statically

---

## Application Core (`src/app/`)

### `shell.js` (96 lines, v2.0.0)
- **Type:** ES Module
- **Purpose:** Main orchestrator — initializes theme, loads tool data, mounts layout components, registers all routes, starts router
- **Exports:** `init()`
- **Imports:** `theme-switcher.js`, `top-bar.js`, `side-nav.js`, `content-area.js`, `router.js`, `tool-registry.js`
- **Route registration:** `/`, `/tools/:id`, `/settings`, `/add-tool`, `/speckkit`, `/vscode`

### `router.js` (131 lines)
- **Type:** ES Module
- **Purpose:** Hash-based SPA router with parameterised pattern matching
- **Exports:** `registerRoute(pattern, handler)`, `navigate(path)`, `startRouter()`, `updateActiveNav()`
- **Features:** Pattern compilation (`/tools/:id` → regex), async handlers, cleanup function support, `hashchange` listener

---

## Layout Components (`src/layout/`)

### `top-bar.js` (78 lines)
- **Type:** ES Module
- **Purpose:** Fixed top bar — hamburger menu, logo (Generic.ASCII.png, 32px), title "Generic", theme selector dropdown, settings gear button, profile icon
- **Exports:** `renderTopBar(root, { onToggleNav })`
- **Imports:** `icons.js`, `theme-switcher.js`, `router.js`

### `side-nav.js` (~120 lines)
- **Type:** ES Module
- **Purpose:** Collapsible left navigation with category groups
- **Exports:** `renderSideNav(root)` → returns `{ toggle() }` ref
- **Groups:** Dashboard, tool categories (dynamic from registry), Development (SpeckKit, VS Code), Admin (Settings)
- **Features:** Active route highlighting, collapse toggle, icon-only mode

### `content-area.js`
- **Type:** ES Module
- **Purpose:** Creates the `<main>` route target container
- **Exports:** `renderContentArea(root)`

---

## Pages (`src/pages/`)

### `settings.js` (~994 lines)
- **Type:** ES Module
- **Purpose:** 3-tab Settings page — the largest module in the project
- **Exports:** `render(container)`
- **Imports:** `icons.js`, `router.js`, `tool-registry.js` (getAllTools, getToolById, isToolDisabled, toggleToolDisabled, addTool, updateTool)

**Tab 1 — Tool Management:**
- D365-style data grid with columns: Name, Category, Visibility, Status, Priority, Last Updated, Enabled (toggle switch), Edit (pencil icon)
- Stats cards (Total, Active, High Priority, Disabled)
- Toolbar with +New Tool, Refresh, Filter buttons
- `showEditPanel()` — inline edit form for all tool fields

**Tab 2 — Add New Tool:**
- Full form (name, category, status, priority, version, description, repo URL, tags)
- Live JSON preview panel
- Copy JSON button

**Tab 3 — GitHub Repository Sync:**
- PAT input (password type) with Show/Hide/Clear controls
- Poll Repositories button → `fetchAllRepos(token)`
- Untracked repos table with Visibility badge, Generate JSON, + Add to Portfolio buttons
- Tracked repos list with Visibility badges
- `autoImportRepo()` function for instant tool creation

### `tool-detail.js` (~470 lines)
- **Type:** ES Module
- **Purpose:** Full tool detail page with metadata display, inline editing, and screenshot upload
- **Exports:** `render(container, tool)`
- **Imports:** `icons.js`, `router.js`, `tool-registry.js`
- **Features:** Metadata grid, tags, long description, screenshot gallery with upload (Add Files + drag-and-drop), lightbox viewer, remove button for user uploads, adaptive gallery layout (1–5 images), localStorage merge pattern (`generic_screenshots_{id}`), actions (View Repo, Edit Tool, Back), `showDetailEditPanel()` inline editor

### `speckkit.js` (~600 lines)
- **Type:** ES Module
- **Purpose:** SpeckKit methodology overview + 20-slide interactive presentation
- **Exports:** `render(container)` → returns cleanup function
- **Features:** Overview section, chapter sidebar, slide navigation (prev/next/keyboard), auto-sizing

### `vscode.js` (174 lines)
- **Type:** ES Module
- **Purpose:** VS Code & How I Build page — dev environment showcase
- **Exports:** `render(container)`
- **Sections:** Dev Environment, Key Extensions, Workflow, Why Vanilla JS, Project Structure

### `add-tool.js`
- **Type:** ES Module
- **Purpose:** Legacy redirect — navigates to `/settings`
- **Note:** Kept for backward compatibility with old bookmarks

---

## Platform Layer (`src/platform/`)

### `tool-registry.js` (~220 lines, v3.0.0)
- **Type:** ES Module
- **Purpose:** Central data layer — loads, merges, and persists tool data
- **Exports:**
  - `loadTools()` — fetches `data/tools.json` + merges localStorage overrides
  - `getAllTools()` — returns full merged tool array
  - `getActiveTools()` — filters out disabled tools
  - `getToolById(id)` — single tool lookup
  - `isToolDisabled(id)` — checks disabled state
  - `toggleToolDisabled(id)` — toggles disabled state
  - `addTool(tool)` — adds user tool to localStorage
  - `updateTool(id, edits)` — persists field-level edits
  - `removeUserTool(id)` — removes user-added tool
- **localStorage keys:** `generic_user_tools`, `generic_tool_edits`, `generic_disabled_tools`

### `navigation-engine.js`
- **Type:** ES Module
- **Purpose:** Navigation configuration and tool registration helpers

### `tool-types.js`
- **Type:** ES Module
- **Purpose:** Tool field definitions and schema constants

---

## Shared Utilities (`src/shared/`)

### `icons.js` (~50 lines)
- **Type:** ES Module
- **Purpose:** 18 inline SVG icon functions — no external icon library
- **Exports:** `icon(name)` — returns SVG string for: `hamburger`, `home`, `grid`, `profile`, `tools`, `addNew`, `document`, `code`, `speckkit`, `vscode`, `link`, `settings`, `analytics`, `classifier`, `arrowBack`, `openInNew`, `edit`, `close`

### `components/`
- **Type:** Directory
- **Purpose:** Shared UI component modules (reserved for future extraction)

---

## Dashboard (`src/tools/dashboard/`)

### `index.js` (~190 lines, v3.0.0)
- **Type:** ES Module
- **Purpose:** Metrics-only dashboard — no tool grid (moved to Settings)
- **Exports:** `render(container)`
- **Imports:** `tool-registry.js`, `icons.js`, `router.js`
- **Sections:**
  - 4 Stat cards (Active Tools, Categories, High Priority, Disabled)
  - Category Breakdown (horizontal bars)
  - Recently Updated (top 5 tools list)
  - Public vs Private (CSS conic-gradient donut chart)
  - Priority Distribution (horizontal bars)
  - Quick Actions (buttons: Add New Tool, Settings, SpeckKit)

---

## Styles (`src/styles/`)

### `reset.css`
- Standard CSS reset — box-sizing, margin/padding normalization

### `themes.css` (~70 lines)
- 3 theme definitions as `body` class selectors: `.theme-dark`, `.theme-light`, `.theme-d365`
- Each defines ~16 CSS custom properties (`--bg-primary`, `--text-primary`, `--color-primary`, etc.)

### `typography.css`
- Font stack (Segoe UI → system fallback), heading scale, text utility classes

### `layout.css` (~231 lines)
- Shell grid layout (top-bar, side-nav, content-area)
- `.top-bar-logo` class (32px logo in header)
- Responsive collapse breakpoints

### `components.css` (~1050 lines)
- All component styles: stat cards, D365 grid, table rows, badges (`.badge-public`, `.badge-private`), toggle switches, settings tabs, donut chart, edit panel, `@keyframes fadeSlideIn`, `.button-success`, dashboard breakdown bars, recent list, action buttons

### `presentation.css`
- SpeckKit slide presentation styles (full-viewport slides, chapter sidebar)

---

## Theme (`src/theme/`)

### `theme-switcher.js`
- **Type:** ES Module
- **Purpose:** Theme persistence and dropdown close handler
- **Exports:** `initTheme()`, `initThemeDropdownClose()`
- **localStorage key:** `generic_theme`
- **Default:** `theme-dark`

---

## Data (`data/`)

### `tools.json` (131 lines)
- **Type:** JSON
- **Purpose:** Static tool definitions — source of truth for 8 tools
- **Schema per entry:** `id`, `name`, `version`, `status`, `priority`, `category`, `description`, `longDescription`, `repoUrl`, `screenshots`, `tags`, `dateCreated`, `lastUpdated`, `origin`
- **Categories:** Generic Tools (5), Publications (1), Development (2)

---

## Static Assets

### `images/Generic.ASCII.png`
- Logo image used in TopBar (32px) and Dashboard header (40px)

### `speckit-presentation.html`
- Standalone fullscreen SpeckKit presentation (independent of SPA)

### `demo.html`
- Original D365 shell prototype — visual blueprint for the production app

---

## Spec & Governance Documents

| File | Purpose |
|------|---------|
| `README.md` | Project overview, setup, structure |
| `PLAN.md` | Architecture decisions, design rationale |
| `PROJECT-INDEX.md` | This file — file-level module reference |
| `TASKS.md` | Feature completion checklist |
| `CONSTITUTION.md` | Engineering principles & constraints |
| `SPEC-KIT.md` | Full specification document |
| `SYSTEM_MANIFEST.json.md` | Machine-readable project metadata |

---

## Dependency Map

```
index.html
  └── src/app/shell.js
        ├── src/theme/theme-switcher.js
        ├── src/layout/top-bar.js
        │     ├── src/shared/icons.js
        │     └── src/theme/theme-switcher.js
        ├── src/layout/side-nav.js
        │     ├── src/shared/icons.js
        │     └── src/platform/tool-registry.js
        ├── src/layout/content-area.js
        ├── src/app/router.js
        ├── src/platform/tool-registry.js
        │     └── fetch('data/tools.json')
        └── [lazy-loaded pages]
              ├── src/tools/dashboard/index.js
              ├── src/pages/settings.js
              ├── src/pages/tool-detail.js
              ├── src/pages/speckkit.js
              └── src/pages/vscode.js
```

**Total files:** ~30 (JS + CSS + HTML + JSON + images)  
**Total dependencies:** 0  
**Build step:** None

---

*End of Project Index — Generic Tool Portfolio v3.0.0*
