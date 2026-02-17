---

# GENERIC TOOL PORTFOLIO — BASELINE SPEC

## Full Technical Specification

### Version: 3.1.0 (Baseline Lock Target)

---

# 1. Objective

Build a Git-hosted, modular application shell that visually mirrors Dynamics 365 Modern UI while running on a zero-dependency, vanilla HTML/CSS/JavaScript stack.

Design goals:
- Three first-class themes (Circuit Dark, Circuit Light, Dynamics 365)
- Hash-based routing with instant navigation and no layout shift
- Local-first data model with JSON baseline + localStorage overrides
- Tool portfolio UX with detail pages, screenshots, and settings

This is an application shell, not a marketing site.

---

# 2. Technology Stack (Locked)

| Layer        | Choice                                    | Rationale                          |
| ------------ | ----------------------------------------- | ---------------------------------- |
| UI Runtime   | Vanilla HTML/CSS/JavaScript               | Zero dependencies, native browser  |
| Language     | JavaScript ES Modules                     | No transpile/build step            |
| Bundler      | None                                      | Static files, browser caching      |
| UI Library   | None (CSS custom properties + components) | D365 look via CSS tokens           |
| Routing      | Hash-based router (vanilla)               | Static-host friendly               |
| State        | localStorage + in-memory                  | Local-first; no global store       |
| Hosting      | Git + GitHub Pages                        | Static hosting                     |

---

# 3. Repository Structure

```
Generic/
├─ index.html
├─ demo.html
├─ data/
│  └─ tools.json
├─ images/
├─ src/
│  ├─ app/
│  │   ├─ shell.js
│  │   └─ router.js
│  ├─ layout/
│  │   ├─ top-bar.js
│  │   ├─ side-nav.js
│  │   └─ content-area.js
│  ├─ pages/
│  │   ├─ settings.js
│  │   ├─ tool-detail.js
│  │   ├─ speckkit.js
│  │   └─ vscode.js
│  ├─ platform/
│  │   ├─ tool-registry.js
│  │   ├─ navigation-engine.js
│  │   └─ tool-types.js
│  ├─ shared/
│  │   ├─ icons.js
│  │   └─ components/
│  ├─ styles/
│  │   ├─ reset.css
│  │   ├─ themes.css
│  │   ├─ typography.css
│  │   ├─ layout.css
│  │   ├─ components.css
│  │   └─ presentation.css
│  ├─ theme/
│  │   └─ theme-switcher.js
│  └─ tools/
│      └─ dashboard/
│          └─ index.js
└─ README.md
```

---

# 4. Design System Integration

## 4.1 Color System

Circuit palette with structured neutrals and Microsoft Fluent tones via CSS custom properties.

Implementation rule: No raw hex values in JS. Components must use CSS custom properties defined by theme classes.

---

# 5. Theming Architecture

## 5.1 CSS Custom Properties

Three themes via `<body>` classes:
- `theme-dark` (Circuit Dark)
- `theme-light` (Circuit Light)
- `theme-d365` (Dynamics 365)

## 5.2 Theme Switching

Theme toggle swaps `<body>` class; selection persisted as `generic-d365-theme` in `localStorage`. Switch latency < 16ms.

---

# 6. Layout Contract

## 6.1 TopBar
Fixed 48px header; logo/title left; theme dropdown; settings gear. Subtle bottom border.

## 6.2 SideNav
Collapsible (240px / 64px); icon+label; active indicator bar; hover background; smooth width transition.

## 6.3 ContentArea
Padded (24px), scrollable, responsive; no layout shift during nav collapse.

---

# 7. Routing & Navigation

Vanilla hash-based router (`src/app/router.js`):
- `registerRoute(pattern, handler)` with `:param` support (e.g., `/tools/:id`)
- `navigate(path)` for programmatic navigation
- Cleanup function support on route change
- Lazy page modules via dynamic `import()`

Routes:
| Pattern      | Module                      |
|--------------|-----------------------------|
| `/`          | `tools/dashboard/index.js`  |
| `/tools/:id` | `pages/tool-detail.js`      |
| `/settings`  | `pages/settings.js`         |
| `/speckkit`  | `pages/speckkit.js`         |
| `/vscode`    | `pages/vscode.js`           |

---

# 8. State & Data

Source of truth: `data/tools.json` loaded via `fetch()` at startup.

Runtime persistence: localStorage overlay
- `generic_user_tools` — user-added tools
- `generic_tool_edits` — field-level overrides
- `generic_disabled_tools` — disabled IDs
- `generic_github_pat` — optional GitHub token

Merge strategy in `src/platform/tool-registry.js`:
1. Load JSON baseline
2. Append user tools
3. Overlay edits per ID

Public API:
- `loadTools()`, `getAllTools()`, `getActiveTools()`, `getToolById(id)`
- `addTool(entry)`, `updateTool(id, changes)`, `toggleToolDisabled(id)`, `removeUserTool(id)`

---

# 9. UI Implementation

Page modules export `render(container, ...args)` and build DOM via template literals; attach events post-insertion.

Shared components reside in `src/shared/components/`; icons in `src/shared/icons.js` (inline SVG functions).

Tool Detail page supports metadata, tags, long description, screenshots (repo + local uploads), edit panel, and lightbox viewer.

Settings page provides tool grid management, add-new-tool form, and optional GitHub repo sync.

---

# 10. Performance Targets

Load time:
- First Contentful Paint < 500ms
- Time to Interactive < 500ms
- Total JS payload < 100KB (uncompressed)
- Total CSS payload < 50KB (uncompressed)

Runtime:
- Theme toggle < 16ms
- Route transition < 200ms
- SideNav animation 60fps
- Page render (innerHTML) < 50ms
- localStorage read/write < 5ms

Asset rules: inline SVG icons; static CSS; ES modules; lazy page imports.

---

# 11. User Experience Consistency

- All colours via CSS vars; spacing on 4px grid; defined type scale
- Border-radius: 4px (buttons) / 6px (cards); transitions 150–200ms
- Layout stability: no jitter, no flash of unstyled content
- D365 aesthetic adherence (TopBar, SideNav, data grids, cards, badges)
- Interaction feedback for buttons, nav, toggles, edits, imports, copy

---

# 12. Development Workflow

```powershell
# Start dev server (Windows)
cd "d:\Onedrive\OneDrive - Microsoft - Nov 24\OneDrive - Microsoft\DEMO\My Github\Generic.Website\Generic"
python -m http.server 8000 --bind 127.0.0.1

# Open
# http://127.0.0.1:8000/demo.html
```

Edit files → refresh. No build step, no watch process.

---

# 13. Governance & Standards

This spec is governed by SpeckKit:
- Component header comment block applied to new code files
- Respect architecture and tool isolation rules
- UI references are ask-first; opt-in when tasks involve D365 context

See [CONSTITUTION.md](CONSTITUTION.md), [PLAN.md](PLAN.md), and [SYSTEM_MANIFEST.json.md](SYSTEM_MANIFEST.json.md).

---

# 14. Baseline Lock Criteria

Baseline is complete when:
- Themes render correctly; toggle persists
- SideNav collapses smoothly
- Routing works with `/tools/:id`
- Dashboard metrics display
- Tool Detail and Settings pages functional
- No console errors; no hardcoded colours in JS

---

# 15. Future Scalability (Out of Scope v3.1.0)

- Authentication, server APIs, global state manager, test framework
- PWA features
- Advanced data grid features (resize, virtualization)

---

*End of Spec — Generic Tool Portfolio v3.1.0*
