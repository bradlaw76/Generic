# GENERIC TOOL PORTFOLIO — PLAN

## Architecture & Design Decisions

> **Version:** 3.2.0  
> **Last updated:** 2026-02-17  
> **Guiding principle:** Zero dependencies. No build step. Vanilla everything.

---

## Table of Contents

1. [Architecture Philosophy](#1-architecture-philosophy)
2. [Technology Decisions](#2-technology-decisions)
3. [Project Structure](#3-project-structure)
4. [Data Layer](#4-data-layer)
5. [UI Implementation](#5-ui-implementation)
6. [Theming Strategy](#6-theming-strategy)
7. [Routing & Navigation](#7-routing--navigation)
8. [GitHub Integration](#8-github-integration)
9. [Development Workflow](#9-development-workflow)
10. [Dependency Inventory](#10-dependency-inventory)
11. [SpeckKit Implementation Plan](#11-speckkit-implementation-plan)
12. [Screenshot Persistence](#12-screenshot-persistence)

---

## 1. Architecture Philosophy


This project uses **zero** npm packages, **zero** build tools, and **zero** frameworks. The entire application runs from raw HTML, CSS, and JavaScript files served statically.

- **HTML** — single `index.html` entry point
- **CSS** — 6 stylesheets with custom properties for theming

### Why Zero Dependencies?

| Concern              | Framework Approach            | This Project (Chosen)            |
|----------------------|-------------------------------|----------------------------------|
| Bundle size          | 140KB+ (React + ReactDOM)     | **0KB** — native browser APIs    |
| Build step           | Vite/Webpack/esbuild          | **None** — serve and open        |
| Theme switching      | Context + Provider re-render  | CSS class swap — instant         |
| Component model      | JSX + virtual DOM             | ES modules + `innerHTML`         |
| State management     | useState / Redux / Zustand    | localStorage + DOM               |
| Routing              | React Router (~12KB)          | 131-line hash router             |
| Dev server           | Vite HMR                      | `python -m http.server 8080`     |
| Time to interactive  | Hydration delay               | **Instant** — no framework boot  |
| OneDrive compat.     | `npm install` fails on paths  | **No npm** — no path issues      |

The OneDrive workspace path makes `node_modules` unreliable. This architecture eliminates the problem entirely.

---

## 2. Technology Decisions

### Locked Stack

| Layer       | Choice                     | Rationale                                     |
|-------------|----------------------------|-----------------------------------------------|
| Language    | JavaScript (ES Modules)    | Native browser support, no transpile step      |
| Markup      | HTML5                      | Single `index.html`, everything else dynamic   |
| Styling     | CSS3 + Custom Properties   | 3 themes, no preprocessor needed               |
| Data        | JSON + localStorage        | Portable, zero-server, instant persistence     |
| Routing     | Hash-based SPA router      | No server config, works on GitHub Pages        |
| Icons       | Inline SVGs (functions)    | No icon library dependency                     |
| Dev server  | Python `http.server`       | Pre-installed, zero config                     |

|-------------------|------------------------------------------------------|
| React / Vue / etc.| Unnecessary runtime; vanilla JS is simpler here      |
| TypeScript        | Build step required; not justified for this scope    |
| Vite / Webpack    | No build needed — native ES modules work directly    |
| Tailwind CSS      | Adds build pipeline; CSS custom properties suffice   |
| SQLite (sql.js)   | 400KB WASM payload; localStorage is adequate         |
| npm (any)         | OneDrive path breaks `node_modules`; not needed      |
| Axios             | Native `fetch` is sufficient                         |
| Moment.js         | `Intl.DateTimeFormat` / `toLocaleDateString` suffice |

---

## 3. Project Structure

```
Generic/
├── index.html                     # Entry point — loads CSS + shell.js
├── data/
│   └── tools.json                 # 8 tool definitions (source of truth)
├── images/
│   └── Generic.ASCII.png          # Logo
├── src/
│   ├── app/
│   │   ├── shell.js               # Main orchestrator — layout + routes
│   │   └── router.js              # Hash router with parameterised patterns
│   ├── layout/
│   │   ├── top-bar.js             # Logo, title, theme selector, settings gear
│   │   ├── side-nav.js            # Collapsible nav with category groups
│   │   └── content-area.js        # Route target container
│   ├── pages/
│   │   ├── settings.js            # 3-tab settings (grid, add tool, GitHub)
│   │   ├── tool-detail.js         # Tool metadata + inline edit panel
│   │   ├── speckkit.js            # SpeckKit overview + 20-slide deck
│   │   ├── vscode.js              # VS Code & How I Build page
│   │   └── add-tool.js            # Legacy redirect to /settings
│   ├── platform/
│   │   ├── tool-registry.js       # Data CRUD — JSON + localStorage merge
│   │   ├── navigation-engine.js   # Navigation configuration
│   │   └── tool-types.js          # Schema definitions
│   ├── shared/
│   │   ├── icons.js               # 18 inline SVG icon functions
│   │   └── components/            # Shared UI components
│   ├── styles/
│   │   ├── reset.css              # CSS reset
│   │   ├── themes.css             # 3 theme token sets
│   │   ├── typography.css         # Font stack & text utilities
│   │   ├── layout.css             # Shell grid + top-bar logo
│   │   ├── components.css         # All component styles (~1050 lines)
│   │   └── presentation.css       # SpeckKit slide styles
│   ├── theme/
│   │   └── theme-switcher.js      # Theme persistence + dropdown logic
│   └── tools/
│       └── dashboard/
│           └── index.js           # Metrics dashboard with donut chart
├── speckit-presentation.html      # Standalone SpeckKit presentation
└── demo.html                      # Original demo prototype
```

---

## 4. Data Layer

### 4.1 Source of Truth: `data/tools.json`

The JSON file contains 8 tool definitions loaded at startup via `fetch()`. This file is the static baseline — never modified at runtime.

### 4.2 Runtime Persistence: localStorage

All user modifications are layered on top of `tools.json` via localStorage:

| Key                    | Type       | Purpose                                  |
|------------------------|------------|------------------------------------------|
| `generic_user_tools`   | JSON array | Tools added via Settings or auto-import  |
| `generic_tool_edits`   | JSON object| Edit overrides keyed by tool ID          |
| `generic_disabled_tools`| JSON array| IDs of disabled tools                    |
| `generic_github_pat`   | String     | GitHub Personal Access Token (optional)  |
| `generic-d365-theme`   | String     | Active theme class name                  |

### 4.3 Data Merge Strategy

`tool-registry.js` → `loadTools()`:

1. `fetch('data/tools.json')` → base array
2. Read `generic_user_tools` → append user-added tools
3. Read `generic_tool_edits` → overlay field-level edits on any tool
4. Return merged array — callers see a single unified list

### 4.4 CRUD Operations

| Function              | Source            | Persistence                       |
|-----------------------|-------------------|-----------------------------------|
| `loadTools()`         | JSON + localStorage| Read-only merge                  |
| `getAllTools()`        | In-memory cache   | —                                 |
| `getActiveTools()`    | Filters disabled  | Reads `generic_disabled_tools`    |
| `getToolById(id)`     | In-memory lookup  | —                                 |
| `addTool(tool)`       | User action       | Writes `generic_user_tools`       |
| `updateTool(id, edits)` | User action    | Writes `generic_tool_edits`       |
| `toggleToolDisabled(id)` | User action   | Writes `generic_disabled_tools`   |
| `removeUserTool(id)`  | User action       | Updates `generic_user_tools`      |

---

## 5. UI Implementation

### 5.1 Component Pattern

Components are ES modules exporting `render(container, ...args)` functions. Each page clears the container and builds DOM via `innerHTML` template literals:

```js
// Typical page module
export function render(container, data) {
  container.innerHTML = `
    <div class="page-content">
      <h1>${data.name}</h1>
      ...
    </div>
  `;
  // Attach event listeners after DOM insertion
  container.querySelector('.btn').addEventListener('click', handleClick);
}
```

### 5.2 Layout Components

| Component          | Module                 | Responsibility                        |
|--------------------|------------------------|---------------------------------------|
| TopBar             | `layout/top-bar.js`    | Logo, title, theme dropdown, gear     |
| SideNav            | `layout/side-nav.js`   | Collapsible groups, tool categories   |
| ContentArea        | `layout/content-area.js`| Route target `<main>` element        |

Layout is rendered once by `shell.js` at startup. Only the content area re-renders on route changes.

### 5.3 Page Modules

| Page       | Module                          | Features                              |
|------------|---------------------------------|---------------------------------------|
| Dashboard  | `tools/dashboard/index.js`      | 4 stat cards, category bars, donut chart, recent list, quick actions |
| Settings   | `pages/settings.js`             | 3-tab interface: tool grid with edit, add-tool form, GitHub sync |
| Tool Detail| `pages/tool-detail.js`          | Full metadata, tags, edit panel       |
| SpeckKit   | `pages/speckkit.js`             | Governance overview, code standards, UI references policy, Specify CLI guidance |
| VS Code    | `pages/vscode.js`               | Dev environment showcase              |

### 5.4 Icons

`shared/icons.js` exports 18 functions returning inline SVG strings. No icon font, no sprite sheet, no external library.

### 5.5 Inline Edit Panels

Both the Settings grid and Tool Detail page support inline editing via `showEditPanel()` / `showDetailEditPanel()`. The edit panel renders a form with all tool fields and persists changes via `updateTool()` → localStorage.

---

## 6. Theming Strategy

### 6.1 Three Themes via CSS Custom Properties

All three themes are defined in `src/styles/themes.css` as class selectors on `<body>`:

| Theme Class    | Name           | Character                        |
|----------------|----------------|----------------------------------|
| `theme-dark`   | Circuit Dark   | Deep, high-contrast dev palette  |
| `theme-light`  | Circuit Light  | Clean, bright Circuit variant    |
| `theme-d365`   | Dynamics 365   | Official Microsoft Fluent feel   |

Each theme defines the same set of CSS custom properties (`--bg-primary`, `--text-primary`, `--color-primary`, `--shadow-card`, etc.). Components reference only the custom properties — never raw colour values.

### 6.2 Theme Switching

- Theme selector dropdown in TopBar (3 options)
- `setTheme()` swaps the class on `<body>` — instant, no re-render
- Selection persisted to `localStorage` key `generic-d365-theme`
- Default: `theme-dark`

---

## 7. Routing & Navigation

### 7.1 Hash Router

`src/app/router.js` (131 lines) implements a complete SPA router using `window.location.hash`:

- `registerRoute(pattern, handler)` — registers a pattern with placeholders (e.g. `/tools/:id`)
- `navigate(path)` — programmatic navigation via `location.hash`
- `startRouter()` — begins listening to `hashchange` events
- Pattern matching via `compilePattern()` — converts `/tools/:id` to regex
- Route handlers receive `(container, params)` and return optional cleanup functions
- Previous page cleanup called automatically on route change

### 7.2 Registered Routes

| Pattern        | Handler                            |
|----------------|------------------------------------|
| `/`            | `tools/dashboard/index.js`         |
| `/tools/:id`   | `pages/tool-detail.js`            |
| `/settings`    | `pages/settings.js`               |
| `/add-tool`    | Redirect → `/settings`            |
| `/speckkit`    | `pages/speckkit.js`               |
| `/vscode`      | `pages/vscode.js`                 |

### 7.3 Lazy Loading

Pages are loaded via dynamic `import()` in route handlers — the browser handles module caching natively. No bundler required.

### 7.4 SideNav Integration

`side-nav.js` renders navigation groups derived from tool categories. Active route highlighting uses `updateActiveNav()` called by the router on each transition.

---

## 8. GitHub Integration

### 8.1 Repository Polling

Settings Tab 3 ("GitHub Repository Sync") polls the GitHub API for repos owned by `bradlaw76`:

| Mode            | Endpoint                     | Auth Header         |
|-----------------|------------------------------|---------------------|
| Public (default)| `GET /users/bradlaw76/repos` | None                |
| Authenticated   | `GET /user/repos`            | `Bearer <PAT>`     |

Pagination is handled automatically (follows `Link` headers up to 10 pages).

### 8.2 PAT Management

- Optional password input with Show/Hide toggle
- Token stored in `localStorage` key `generic_github_pat`
- Clear button removes token and reverts to public mode

### 8.3 Repo Classification

Polled repos are classified as:
- **Tracked** — already exists in the tool portfolio (matched by `repoUrl`)
- **Untracked** — not yet in the portfolio

### 8.4 Import Options

For untracked repos:
- **Generate JSON** — copies a `tools.json`-compatible JSON object to clipboard
- **+ Add to Portfolio** — instantly imports the repo as a new tool via `addTool()`

### 8.5 Visibility Badges

Public/Private badges appear throughout the app:
- Settings tool grid (Visibility column)
- Untracked repos table
- Tracked repos list

---

## 9. Development Workflow

### 9.1 Daily Flow

```bash
# Start dev server
python -m http.server 8080

# Open browser
# http://localhost:8080

# Edit files → refresh browser
```

No build step. No watch process. No HMR. Just edit and refresh.

### 9.2 Adding a New Tool

**Option A — Manual (data/tools.json)**
1. Add a JSON object to `data/tools.json`
2. Refresh the browser

**Option B — Settings UI (Add New Tool tab)**
1. Open Settings → Tab 2
2. Fill in the form
3. Click "Add Tool"

**Option C — GitHub Auto-Import**
1. Open Settings → Tab 3
2. Poll repos → click "+ Add to Portfolio" on any untracked repo

### 9.3 Deployment

Push to `main` → GitHub Pages serves the static files. No CI/CD pipeline needed.

---

## 10. Dependency Inventory

### Production Dependencies: **0**

| Package  | Status     |
|----------|------------|
| (none)   | ✅ Zero dependencies |

### Development Dependencies: **0**

| Package  | Status     |
|----------|------------|
| (none)   | ✅ No build tools |

### External Runtime APIs Used

| API              | Purpose                                 |
|------------------|-----------------------------------------|
| GitHub REST API  | Repository polling (optional, Settings) |
| localStorage     | User data persistence                   |
| fetch()          | Load `tools.json` + GitHub API calls    |

**Total dependencies: 0. Total build tools: 0. Total npm packages: 0.**

---

*End of Plan — Generic Tool Portfolio v3.0.0*

---

## 12. Screenshot Persistence

### Goal
Persist user-uploaded screenshots into the repository so they are available across sessions and on GitHub Pages.

### Approach
- Use the File System Access API (Edge/Chrome) from the Tool Detail page to write files under `images/tools/{id}/` and update `data/tools.json`.
- Fall back to manual file path updates if JSON write fails.

### Flow
1. Upload screenshots (localStorage `generic_screenshots_{id}`).
2. Click “Save to Project” → pick project root.
3. App writes `images/tools/{id}/screenshot-<timestamp>-N.ext` and updates `data/tools.json` → `screenshots` paths.
4. App clears localStorage entries and refreshes gallery.
5. Commit and push.

### Notes
- The FS API runs only in local dev, not on Pages.
- Videos (`mp4`, `webm`, `ogg`) are supported; file extensions are inferred from MIME.
