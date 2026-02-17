# GENERIC TOOL PORTFOLIO — SPEC KIT

## Version 3.1.1 | Complete Specification

> **Last updated:** 2026-02-17  
> **Status:** Implemented — all features live  
> **Type:** Portfolio showcase application (D365 Modern UI shell)

---

## Table of Contents

1. [Overview](#1-overview)
2. [Goals & Constraints](#2-goals--constraints)
3. [Technology Stack](#3-technology-stack)
4. [Repository Structure](#4-repository-structure)
5. [Design System — Theme Tokens](#5-design-system--theme-tokens)
6. [Theming Architecture](#6-theming-architecture)
7. [Layout Contract](#7-layout-contract)
8. [Routing & Page Architecture](#8-routing--page-architecture)
9. [Data Model](#9-data-model)
10. [Settings Page](#10-settings-page)
11. [GitHub Integration](#11-github-integration)
12. [Component Library](#12-component-library)
13. [Typography](#13-typography)
14. [Motion & Interaction](#14-motion--interaction)
15. [Accessibility](#15-accessibility)
16. [Development Setup](#16-development-setup)
17. [Visual Tone Guardrails](#17-visual-tone-guardrails)
18. [Demo Reference](#18-demo-reference)
19. [Future Enhancements](#19-future-enhancements)
20. [File Manifest](#20-file-manifest)

### Companion Documents

| Document             | Purpose                                          |
|----------------------|--------------------------------------------------|
| `CONSTITUTION.md`    | Engineering principles: zero deps, code quality, UX, perf |
| `PLAN.md`            | Architecture decisions: vanilla JS, localStorage, hash router |
| `TASKS.md`           | Feature completion checklist (82 tasks, all complete) |
| `PROJECT-INDEX.md`   | File-level module index with exports and imports |

---

## 1. Overview

A single-page portfolio application that:

- Presents a curated portfolio of tools, utilities, and publications
- Visually mirrors the **Dynamics 365 Modern UI** shell
- Uses a custom **Circuit** color palette with 3 themes
- Supports tool management (add, edit, enable/disable) via Settings page
- Integrates with GitHub API for repository discovery and auto-import
- Runs with **zero dependencies** — no npm, no build step, no framework

**This is an application built with vanilla HTML, CSS, and JavaScript.**

---

## 2. Goals & Constraints

### Goals

| # | Goal                              | Measure                                      | Status |
|---|-----------------------------------|----------------------------------------------|--------|
| 1 | D365-authentic look               | Visual density matches D365 Modern UI        | ✅     |
| 2 | Token-only theming                | Zero hardcoded hex values in JS              | ✅     |
| 3 | Zero dependencies                 | No `package.json`, no `node_modules`         | ✅     |
| 4 | 3-theme parity                    | Dark, Light, D365 all fully styled           | ✅     |
| 5 | No layout jitter                  | SideNav collapse smooth, no content shift    | ✅     |
| 6 | Data-driven tools                 | All tools loaded from JSON + localStorage    | ✅     |
| 7 | GitHub integration                | Poll repos, auto-import, PAT support         | ✅     |
| 8 | Inline editing                    | Edit any tool from Settings or Detail page   | ✅     |

### Constraints

- No npm packages — zero dependencies, forever
- No build step — no Vite, no Webpack, no TypeScript compiler
- No framework — no React, no Vue, no Svelte
- No database — localStorage + JSON file only
- No server — static files served by Python/GitHub Pages
- No authentication (v1)

---

## 3. Technology Stack

| Layer        | Choice                          | Rationale                              | Status |
|--------------|---------------------------------|----------------------------------------|--------|
| Language     | JavaScript (ES Modules)         | Native browser support, no transpile   | ✅     |
| Markup       | HTML5                           | Single `index.html` + dynamic DOM      | ✅     |
| Styling      | CSS3 + Custom Properties        | 3 themes, zero preprocessor            | ✅     |
| Framework    | **None**                        | Vanilla JS is sufficient               | ✅     |
| Build Tool   | **None**                        | Native ES modules, no bundler          | ✅     |
| Data         | JSON + localStorage             | Portable, zero-server                  | ✅     |
| Routing      | Hash-based SPA router           | Works on GitHub Pages, no config       | ✅     |
| Icons        | Inline SVG (18 functions)       | No icon font, no CDN                   | ✅     |
| Dev Server   | Python `http.server`            | Pre-installed, zero config             | ✅     |
| Hosting      | GitHub Pages                    | Free static hosting                    | ✅     |

### Explicitly Not Used

| Technology  | Why Not                                              |
|-------------|------------------------------------------------------|
| React       | Unnecessary runtime; vanilla JS handles this scope   |
| TypeScript  | Requires build step; not justified for this project  |
| Vite        | No build needed; native ES modules work directly     |
| Fluent UI   | Adds dependency; CSS custom properties replicate it  |
| SQLite      | 400KB WASM payload; localStorage is adequate         |
| npm         | OneDrive path breaks `node_modules`                  |

---

## 4. Repository Structure

```
Generic/
├── index.html                     # Entry point
├── data/
│   └── tools.json                 # 8 tool definitions
├── images/
│   └── Generic.ASCII.png          # Logo
├── src/
│   ├── app/
│   │   ├── shell.js               # Main orchestrator
│   │   └── router.js              # Hash-based SPA router (131 lines)
│   ├── layout/
│   │   ├── top-bar.js             # 48px fixed header
│   │   ├── side-nav.js            # Collapsible navigation
│   │   └── content-area.js        # Route target container
│   ├── pages/
│   │   ├── settings.js            # 3-tab Settings (~994 lines)
│   │   ├── tool-detail.js         # Tool detail + edit + screenshot upload
│   │   ├── speckkit.js            # SpeckKit presentation
│   │   ├── vscode.js              # VS Code page
│   │   └── add-tool.js            # Legacy redirect
│   ├── platform/
│   │   ├── tool-registry.js       # Data CRUD layer
│   │   ├── navigation-engine.js   # Nav helpers
│   │   └── tool-types.js          # Schema definitions
│   ├── shared/
│   │   ├── icons.js               # 18 SVG icon functions
│   │   └── components/            # Shared components
│   ├── styles/
│   │   ├── reset.css
│   │   ├── themes.css             # 3 theme definitions
│   │   ├── typography.css
│   │   ├── layout.css
│   │   ├── components.css         # ~1050 lines
│   │   └── presentation.css
│   ├── theme/
│   │   └── theme-switcher.js
│   └── tools/
│       └── dashboard/
│           └── index.js           # Metrics dashboard
├── speckit-presentation.html      # Standalone SpeckKit
├── demo.html                      # Original prototype
├── CONSTITUTION.md
├── PLAN.md
├── PROJECT-INDEX.md
├── TASKS.md
├── SPEC-KIT.md                    # This file
└── SYSTEM_MANIFEST.json.md
```

**Total: ~30 files | Dependencies: 0 | Build tools: 0**

---

## 5. Design System — Theme Tokens

Three themes share a unified CSS custom property contract. All components consume tokens — never raw hex values.

### 5.1 Unified Token Contract

| Token               | Purpose                          |
|---------------------|----------------------------------|
| `--bg-primary`      | Page / content area background   |
| `--bg-secondary`    | Cards, panels, side nav          |
| `--bg-tertiary`     | Hover states, active backgrounds |
| `--border-subtle`   | Card borders, dividers           |
| `--border-strong`   | Emphasized borders               |
| `--text-primary`    | Headings, primary content        |
| `--text-secondary`  | Body text, table cells           |
| `--text-muted`      | Labels, metadata, placeholders   |
| `--color-primary`   | Brand actions, active indicators |
| `--color-secondary` | Success, positive signals        |
| `--color-accent`    | Informational highlights         |
| `--color-danger`    | Errors, destructive actions      |
| `--color-warning`   | Warnings, attention markers      |
| `--color-success`   | Confirmations                    |
| `--shadow-card`     | Card elevation                   |
| `--shadow-modal`    | Modal / dropdown elevation       |

### 5.2 Theme: Circuit Dark (`theme-dark`)

| Token               | Hex       |
|---------------------|-----------|
| `--bg-primary`      | `#0B0D10` |
| `--bg-secondary`    | `#12161C` |
| `--bg-tertiary`     | `#1A1F26` |
| `--border-subtle`   | `#232A33` |
| `--border-strong`   | `#2E3742` |
| `--text-primary`    | `#E6EDF3` |
| `--text-secondary`  | `#C9D1D9` |
| `--text-muted`      | `#8B949E` |
| `--color-primary`   | `#1E88E5` |
| `--color-secondary` | `#43A047` |
| `--color-accent`    | `#00BCD4` |
| `--color-danger`    | `#E53935` |
| `--color-warning`   | `#F2C94C` |
| `--color-success`   | `#4CAF50` |
| `--shadow-card`     | `0 8px 24px rgba(0,0,0,0.45)` |
| `--shadow-modal`    | `0 16px 48px rgba(0,0,0,0.6)` |

### 5.3 Theme: Circuit Light (`theme-light`)

| Token               | Hex       |
|---------------------|-----------|
| `--bg-primary`      | `#F4F7FA` |
| `--bg-secondary`    | `#FFFFFF` |
| `--bg-tertiary`     | `#E9EEF3` |
| `--border-subtle`   | `#D0D7DE` |
| `--border-strong`   | `#B6C2CF` |
| `--text-primary`    | `#0D1117` |
| `--text-secondary`  | `#30363D` |
| `--text-muted`      | `#57606A` |
| `--color-primary`   | `#1565C0` |
| `--color-secondary` | `#2E7D32` |
| `--color-accent`    | `#00897B` |
| `--color-danger`    | `#C62828` |
| `--color-warning`   | `#D4AF37` |
| `--color-success`   | `#388E3C` |
| `--shadow-card`     | `0 6px 18px rgba(0,0,0,0.08)` |
| `--shadow-modal`    | `0 12px 32px rgba(0,0,0,0.12)` |

### 5.4 Theme: Dynamics 365 (`theme-d365`)

| Token               | Hex       |
|---------------------|-----------|
| `--bg-primary`      | `#F3F2F1` |
| `--bg-secondary`    | `#FFFFFF` |
| `--bg-tertiary`     | `#FAF9F8` |
| `--border-subtle`   | `#E1DFDD` |
| `--border-strong`   | `#C8C6C4` |
| `--text-primary`    | `#323130` |
| `--text-secondary`  | `#605E5C` |
| `--text-muted`      | `#8A8886` |
| `--color-primary`   | `#0078D4` |
| `--color-secondary` | `#107C10` |
| `--color-accent`    | `#00B7C3` |
| `--color-danger`    | `#D13438` |
| `--color-warning`   | `#FFB900` |
| `--color-success`   | `#107C10` |
| `--shadow-card`     | `0 2px 6px rgba(0,0,0,0.08)` |
| `--shadow-modal`    | `0 8px 24px rgba(0,0,0,0.2)` |

### 5.5 Implementation Rule

**No raw hex values in JavaScript.** All colours flow through CSS custom property tokens defined in `themes.css`.

---

## 6. Theming Architecture

### 6.1 Implementation

All three themes are defined in `src/styles/themes.css` as CSS class selectors on `<body>`:

```css
body.theme-dark  { --bg-primary: #0B0D10; /* ... */ }
body.theme-light { --bg-primary: #F4F7FA; /* ... */ }
body.theme-d365  { --bg-primary: #F3F2F1; /* ... */ }
```

### 6.2 Theme Switching

```js
const THEMES = ['theme-dark', 'theme-light', 'theme-d365'];

function setTheme(theme) {
  THEMES.forEach(t => document.body.classList.remove(t));
  document.body.classList.add(theme);
  localStorage.setItem('generic-d365-theme', theme);
}
```

- Theme selected via dropdown in TopBar (3 options)
- Persisted to `localStorage` key `generic-d365-theme`
- Instant switch — CSS class swap, no JS re-render
- Default: `theme-dark`

---

## 7. Layout Contract

### 7.1 TopBar (`top-bar.js`)

| Property    | Value                                            |
|-------------|--------------------------------------------------|
| Height      | 48px                                             |
| Position    | Fixed, top: 0                                    |
| Z-index     | 1000                                             |
| Border      | Subtle bottom border (1px)                       |

**Contains (left to right):**
- Hamburger toggle button
- Logo image (`Generic.ASCII.png`, 32px)
- Title: "Generic"
- Theme selector dropdown (3 options with colour dots)
- Settings gear button (navigates to `/settings`)
- Profile icon

### 7.2 SideNav (`side-nav.js`)

| Property         | Value                          |
|------------------|--------------------------------|
| Expanded width   | 240px                          |
| Collapsed width  | 64px                           |
| Transition       | `width 180ms ease-in-out`      |
| Active indicator | Left-edge accent bar           |
| Hover            | Background shift               |

**Groups:**
- Dashboard (home icon)
- Tool categories (dynamic from registry)
- Development: SpeckKit, VS Code & How I Build
- Admin: Settings

### 7.3 ContentArea (`content-area.js`)

| Property    | Value                                    |
|-------------|------------------------------------------|
| Padding     | 24px                                     |
| Scroll      | `overflow-y: auto`                       |
| Position    | Fills remaining space after TopBar + Nav |
| Transition  | Adjusts on nav collapse via CSS          |

**No layout shift during nav collapse.**

---

## 8. Routing & Page Architecture

### 8.1 Hash Router (`router.js` — 131 lines)

The router uses `window.location.hash` for client-side navigation:

- `registerRoute(pattern, handler)` — registers a pattern (supports `:param` placeholders)
- `navigate(path)` — `location.hash = path`
- `startRouter()` — begins listening to `hashchange`
- `compilePattern()` — converts `/tools/:id` to regex for matching
- Handlers are `async (container, params) => cleanup?`

### 8.2 Route Table

| Pattern        | Module                           | Description                |
|----------------|----------------------------------|----------------------------|
| `/`            | `tools/dashboard/index.js`       | Metrics dashboard          |
| `/tools/:id`   | `pages/tool-detail.js`           | Tool detail + edit + screenshots |
| `/settings`    | `pages/settings.js`              | Tool management + GitHub   |
| `/add-tool`    | Redirect → `/settings`           | Legacy compat              |
| `/speckkit`    | `pages/speckkit.js`              | SpeckKit presentation      |
| `/vscode`      | `pages/vscode.js`                | VS Code showcase           |

### 8.3 Lazy Loading

Pages are loaded via dynamic `import()` in route handlers within `shell.js`. The browser caches modules natively — no bundler required.

---

## 9. Data Model

### 9.1 Tool Schema (`data/tools.json`)

```json
{
  "id": "string (kebab-case)",
  "name": "string",
  "version": "string (semver)",
  "status": "Active | Inactive | Draft",
  "priority": "High | Normal | Low",
  "category": "Generic Tools | Publications | Development",
  "description": "string (short)",
  "longDescription": "string (detailed, supports \\n)",
  "repoUrl": "string (GitHub URL)",
  "screenshots": "string[] (URLs or paths)",
  "tags": "string[]",
  "dateCreated": "YYYY-MM-DD",
  "lastUpdated": "YYYY-MM-DD",
  "origin": "Web | GitHub"
}
```

### 9.2 Static Baseline: 8 Tools

| ID | Name | Category | Priority |
|----|------|----------|----------|
| `generic-sidebar` | Generic Sidebar | Generic Tools | Normal |
| `copilot-studio-budgetary-cost-estimator` | Copilot Studio Budgetary Cost Estimator | Generic Tools | High |
| `teleprompter` | Teleprompter | Generic Tools | Normal |
| `dynamics-contact-center-whitepaper` | Dynamics Contact Center White Paper | Publications | High |
| `contact-center-mcp` | Contact Center MCP | Generic Tools | Normal |
| `snippets` | Snippets | Development | Low |
| `powerbi` | Power BI | Development | Normal |
| `speckkit-project-development` | SpeckKit Project Development | Development | High |

### 9.3 localStorage Persistence

| Key                      | Type         | Purpose                              |
|--------------------------|--------------|--------------------------------------|
| `generic_user_tools`     | JSON array   | User-added tools                     |
| `generic_tool_edits`     | JSON object  | Edit overrides (keyed by tool ID)    |
| `generic_disabled_tools` | JSON array   | Disabled tool IDs                    |
| `generic_screenshots_{id}` | JSON array | User-uploaded screenshot data URLs   |
| `generic_github_pat`     | String       | GitHub PAT (optional)                |
| `generic-d365-theme`     | String       | Active theme class name              |

### 9.4 Data Merge Strategy (`tool-registry.js`)

1. `fetch('data/tools.json')` → base array
2. Append `generic_user_tools` from localStorage
3. Overlay `generic_tool_edits` on matching tool IDs
4. Return unified array to all consumers

---

## 10. Settings Page

The Settings page (`pages/settings.js`, ~994 lines) has 3 tabs:

### Tab 1 — Tool Management Grid

D365-style data grid displaying all tools:

| Column       | Type           |
|--------------|----------------|
| Tool Name    | Link to detail |
| Category     | Text           |
| Visibility   | Badge (Public/Private) |
| Status       | Text           |
| Priority     | Text           |
| Last Updated | Date           |
| Enabled      | Toggle switch  |
| Edit         | Pencil icon button |

Features:
- Stats cards (Total, Active, High Priority, Disabled)
- Toolbar: +New Tool, Refresh, Filter
- `showEditPanel()` — slide-in form editing all fields
- Toggle persistence via `toggleToolDisabled()`

### Tab 2 — Add New Tool

Form with fields: name, category, status, priority, version, description, repo URL, tags

Features:
- Live JSON preview panel
- Copy JSON button
- Submit adds tool via `addTool()`

### Tab 3 — GitHub Repository Sync

Features:
- PAT input (password) with Show/Hide/Clear
- Poll button → paginated `fetchAllRepos(token)`
- Untracked repos table: Visibility badge, Generate JSON, + Add to Portfolio
- Tracked repos list with Visibility badges
- Import feedback (green "Added!" button state)

---

## 11. GitHub Integration

### 11.1 API Modes

| Mode            | Endpoint                     | Auth              |
|-----------------|------------------------------|--------------------|
| Public          | `GET /users/bradlaw76/repos` | None               |
| Authenticated   | `GET /user/repos`            | Bearer `<PAT>`     |

### 11.2 Pagination

Follows GitHub `Link` header for pagination, up to 10 pages (100 repos per page).

### 11.3 Classification

- **Tracked** — `repoUrl` matches a tool in the portfolio
- **Untracked** — repo not yet in the portfolio

### 11.4 Auto-Import

`autoImportRepo(repo)` creates a tool entry from GitHub repo metadata:
- `id` from repo name (lowercased, hyphenated)
- `name` from repo name
- `repoUrl` from `html_url`
- `origin: "GitHub"`
- `visibility` from `private` flag

### 11.5 Visibility Badges

Public/Private badges use CSS classes `.badge-public` and `.badge-private` and appear in:
- Settings tool grid (Visibility column)
- Untracked repos table
- Tracked repos list

---

## 12. Component Library

### 12.1 Stat Cards

4-card grid layout for metrics display. Each card has a label, value, and themed background.

### 12.2 D365 Data Grid

Table component mimicking D365 grid aesthetics:
- Row hover highlighting
- Column-aligned headers
- Inline action buttons (edit, toggle)
- Badge rendering within cells

### 12.3 Edit Panel

Slide-in form panel (`fadeSlideIn` animation):
- All tool fields editable
- Save/Cancel buttons
- Persists via `updateTool()` → localStorage

### 12.4 Donut Chart

CSS `conic-gradient` chart on Dashboard showing public vs private repo split. No charting library — pure CSS.

### 12.5 Toggle Switches

CSS-only toggle switches for enable/disable tool state in Settings grid.

### 12.6 Badges

Inline coloured labels:
- Status: Active (green), Inactive (grey), Draft (yellow)
- Visibility: Public (blue), Private (orange)

---

## 13. Typography

### Font Stack

```
"Segoe UI Variable", "Segoe UI", system-ui, -apple-system, sans-serif
```

### Type Scale

| Role     | Size | Weight | Usage                    |
|----------|------|--------|--------------------------|
| h1       | 24px | 600    | Page titles              |
| h2       | 20px | 600    | Section headers          |
| h3       | 16px | 600    | Card titles              |
| body     | 14px | 400    | Default content          |
| metadata | 12px | 400    | Labels, timestamps       |

---

## 14. Motion & Interaction

### Transition Standard

- Duration: **150–200ms**
- Easing: `ease-in-out`

### Interaction Patterns

| Element          | Behaviour                                      |
|------------------|------------------------------------------------|
| Card hover       | Background shift                               |
| Nav collapse     | Width animation (180ms ease-in-out)            |
| Button hover     | Background colour shift (150ms)                |
| Table row hover  | Background highlight (150ms)                   |
| Theme switch     | Instant class swap, no animation               |
| Edit panel       | `fadeSlideIn` — slide from right + fade in     |
| Toggle switch    | CSS transition on knob position + bg colour    |
| Import button    | Turns green with "Added!" text temporarily     |

---

## 15. Accessibility

### Implemented

| Feature              | Status |
|----------------------|--------|
| Semantic HTML        | ✅     |
| ARIA labels on icons | ✅     |
| Keyboard navigation  | ✅     |
| Focus indicators     | ✅     |
| WCAG AA contrast     | ✅ (all 3 themes) |

---

## 16. Development Setup

### Quick Start

```bash
# Clone
git clone https://github.com/bradlaw76/Generic.Website.git
cd Generic.Website/Generic

# Serve
python -m http.server 8080

# Open
# http://localhost:8080
```

No `npm install`. No build. No config.

### Adding a New Tool

**Via JSON:** Add entry to `data/tools.json`, refresh browser.  
**Via UI:** Settings → Tab 2 → fill form → Add Tool.  
**Via GitHub:** Settings → Tab 3 → Poll → + Add to Portfolio.

### SpecKit CLI (Optional)

To install or update the SpecKit CLI using `uv` tools:

```bash
uv tool install specify-cli --force --from git+https://github.com/github/spec-kit.git
```

Notes:
- Requires `uv` installed on your system.
- `--force` ensures the CLI is updated to the latest commit.
- Use this when you want the local SpecKit CLI to track the GitHub repository tip.

#### Initialize in this repo

Run either of the following to initialize SpecKit here with Copilot integration:

```bash
# If the shim exposes `specify` directly
specify init --here --force --ai copilot

# If the command is exposed as a uv-managed tool
uv tool run specify-cli -- init --here --force --ai copilot
```

- To initialize with Claude instead of Copilot, use:

```bash
# Direct shim
specify init --here --force --ai claude

# Via uv-managed tool
uv tool run specify-cli -- init --here --force --ai claude
```

- `--here`: initialize in the current directory
- `--force`: overwrite existing local config if present
- `--ai copilot`: configure Copilot as the agent integration
  - swap to `--ai claude` to use Claude instead

---

## 17. Visual Tone Guardrails

| Rule                            | Rationale                      |
|---------------------------------|--------------------------------|
| No hero sections                | Application, not marketing     |
| No marketing gradients          | Enterprise data surface        |
| No oversized typography         | Dense, functional layout       |
| Accent used sparingly           | Brand highlight, not decoration|
| Data-first layout               | Content over chrome            |
| Cards over panels               | Consistent containment         |
| Minimal elevation               | Flat hierarchy, subtle depth   |

---

## 18. Demo Reference

`demo.html` in the project root is the original visual prototype. It implements the 3-theme system, collapsible SideNav, TopBar, and sample pages in a single HTML file with zero dependencies. The production app faithfully replicates this visual reference across all pages.

---

## 19. Future Enhancements

Not in scope for current version:

| Feature                              | Notes                           |
|--------------------------------------|---------------------------------|
| Authentication / SSO                 | No server backend            |
| API integration layer                | Local-first architecture      |
| Advanced grid (sort, filter, resize) | Current grid is read+edit only|
| ~~Image/screenshot management~~      | ✅ Implemented v3.1.0         |
| Export/import portfolio as JSON      | Could add file download       |
| CI/CD pipeline                       | Manual deploy via GitHub Pages|
| Automated testing                    | No test framework (zero deps) |
| PWA / offline support               | Could add service worker      |
| Dark mode auto-detect               | `prefers-color-scheme` media query |

---

## 20. File Manifest

### Implemented Files

| File                              | Category   | Lines  |
|-----------------------------------|------------|--------|
| `index.html`                      | Entry      | ~35    |
| `data/tools.json`                 | Data       | ~131   |
| `src/app/shell.js`               | Core       | ~96    |
| `src/app/router.js`              | Core       | ~131   |
| `src/layout/top-bar.js`          | Layout     | ~78    |
| `src/layout/side-nav.js`         | Layout     | ~120   |
| `src/layout/content-area.js`     | Layout     | ~20    |
| `src/pages/settings.js`          | Pages      | ~994   |
| `src/pages/tool-detail.js`       | Pages      | ~470   |
| `src/pages/speckkit.js`          | Pages      | ~600   |
| `src/pages/vscode.js`            | Pages      | ~174   |
| `src/pages/add-tool.js`          | Pages      | ~10    |
| `src/platform/tool-registry.js`  | Platform   | ~220   |
| `src/platform/navigation-engine.js` | Platform | —     |
| `src/platform/tool-types.js`     | Platform   | —      |
| `src/shared/icons.js`            | Shared     | ~50    |
| `src/tools/dashboard/index.js`   | Dashboard  | ~190   |
| `src/theme/theme-switcher.js`    | Theme      | ~40    |
| `src/styles/reset.css`           | Styles     | —      |
| `src/styles/themes.css`          | Styles     | ~70    |
| `src/styles/typography.css`      | Styles     | —      |
| `src/styles/layout.css`          | Styles     | ~231   |
| `src/styles/components.css`      | Styles     | ~1050  |
| `src/styles/presentation.css`    | Styles     | —      |
| `images/Generic.ASCII.png`       | Assets     | —      |
| `speckit-presentation.html`      | Static     | —      |
| `demo.html`                      | Reference  | —      |

### Spec Documents

| File                    | Purpose                              |
|-------------------------|--------------------------------------|
| `README.md`             | Project overview + setup             |
| `CONSTITUTION.md`       | Engineering principles               |
| `PLAN.md`               | Architecture decisions               |
| `PROJECT-INDEX.md`      | File-level module index              |
| `TASKS.md`              | Feature completion checklist         |
| `SPEC-KIT.md`           | This file — full specification       |
| `SYSTEM_MANIFEST.json.md` | Machine-readable project metadata |

---

*End of Spec Kit — Generic Tool Portfolio v3.1.0*
