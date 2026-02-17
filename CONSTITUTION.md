# GENERIC TOOL PORTFOLIO — CONSTITUTION

## Engineering Principles & Standards

> **Version:** 3.0.0  
> **Last updated:** 2026-02-16  
> **Authority:** This document governs all code contributions.

---

## Table of Contents

1. [Preamble](#1-preamble)
2. [Code Quality Principles](#2-code-quality-principles)
3. [User Experience Consistency](#3-user-experience-consistency)
4. [Performance Requirements](#4-performance-requirements)
5. [Enforcement](#5-enforcement)

---

## 1. Preamble

This constitution defines the engineering principles for the Generic Tool Portfolio. Every contributor and every commit must comply. These principles protect maintainability, user trust, and application credibility.

**This application uses zero dependencies.** No npm packages, no build tools, no frameworks. Pure HTML, CSS, and JavaScript served as static files. This is the defining architectural constraint — it is not a compromise, it is a feature.

---

## 2. Code Quality Principles

### P1 — Zero Dependencies

> No npm packages. No build tools. No frameworks. No exceptions.

This is the foundational principle. The project operates entirely on native browser APIs:

| Concern          | Solution                                    |
|------------------|---------------------------------------------|
| UI rendering     | `innerHTML` + template literals             |
| State management | `localStorage` + in-memory arrays           |
| Routing          | Hash-based router (131 lines of JS)         |
| Theming          | CSS custom properties + class swap           |
| HTTP requests    | Native `fetch()`                            |
| Icons            | Inline SVG functions                        |
| Bundling         | None — native ES module `import()`          |
| Dev server       | `python -m http.server 8080`                |

**Why?** The workspace lives on a OneDrive-synced path that breaks `node_modules`. Rather than fight the toolchain, we eliminated it entirely.

### P2 — Vanilla First

> Use standard browser APIs before inventing abstractions.

- DOM APIs (`createElement`, `querySelector`, `addEventListener`)
- ES module `import` / `export` / dynamic `import()`
- CSS custom properties for theming
- `fetch()` for HTTP
- `localStorage` for persistence
- `Intl.DateTimeFormat` for date formatting
- `crypto.randomUUID()` for IDs

### P3 — Single Responsibility

> Every file, function, and module does one thing.

- Files: ≤ 300 lines preferred (Settings is the exception at ~994 lines)
- Functions: ≤ 50 lines, ≤ 5 parameters
- Modules: one page or one concern per file
- No god files, no mega-functions

### P4 — No Dead Code

> If it's not used, it doesn't exist.

- No commented-out code blocks
- No unused imports, variables, or functions
- No placeholder files without implementation
- Remove before commit, not "later"

### P5 — Naming Clarity

> Names are documentation. Abbreviations are debt.

| Element    | Convention          | Example                    |
|------------|---------------------|----------------------------|
| Files      | kebab-case (.js)    | `tool-registry.js`         |
| Files      | kebab-case (.css)   | `components.css`           |
| Functions  | camelCase, verb-led | `toggleToolDisabled()`     |
| Constants  | UPPER_SNAKE         | `MAX_NAV_WIDTH`            |
| CSS vars   | kebab-case          | `--bg-primary`             |
| CSS classes| kebab-case          | `.stat-card`               |
| Booleans   | is/has/should       | `isCollapsed`, `hasError`  |
| IDs        | kebab-case          | `generic-sidebar`          |

### P6 — Explicit Over Implicit

> Code should explain itself without comments.

- Named constants over magic numbers
- Template literals for HTML construction
- Named functions over anonymous callbacks (for event listeners)
- Comment blocks on module headers (SpeckKit standard)

### P7 — Data Isolation

> Tools may NOT modify core layout. No cross-tool imports.

- `src/pages/` modules may import from `src/platform/` and `src/shared/` only
- `src/tools/` modules may import from `src/platform/` and `src/shared/` only
- `src/platform/` may NOT import from `src/pages/` or `src/tools/`
- No global CSS injection from page modules
- All tool data flows through `tool-registry.js`

---

## 3. User Experience Consistency

### UX1 — Visual Consistency Contract

> Every screen must look like it belongs to the same application.

- All colours from CSS custom properties — zero hardcoded hex values in JS
- All spacing on 4px grid (4, 8, 12, 16, 20, 24, 32, 48)
- All type sizes from the defined scale (12, 14, 16, 20, 24)
- All border-radius: 4px (buttons) or 6px (cards)
- All transitions: 150–200ms ease-in-out

### UX2 — Three Themes Are First-Class

> Circuit Dark, Circuit Light, and Dynamics 365 are equally supported.

- Every component must render correctly in all three themes
- No theme-specific logic in JS — all via CSS custom properties
- Theme switch is instant (class swap on `<body>`)
- Contrast must be readable in all themes
- Default: Circuit Dark (`theme-dark`)

### UX3 — Layout Stability

> The user must never see unexpected movement.

- No layout shift on page load or route change
- No jitter on SideNav collapse/expand
- Content area smoothly adjusts (CSS transitions)
- No flash of unstyled content

### UX4 — D365 Aesthetic

> The application mirrors the Dynamics 365 Modern UI.

- TopBar: 48px fixed header with left-aligned navigation
- SideNav: collapsible (240px / 64px) with grouped items
- Data grids: row hover, column alignment, header styling
- Cards: subtle elevation, consistent padding
- Badges: inline coloured labels (Active/Inactive, Public/Private)

### UX5 — Interaction Feedback

> Every user action must produce visible feedback.

- Buttons: hover + active states via CSS
- Nav items: hover background + active indicator
- Toggle switches: animated state change
- Edit panel: slide-in animation (`fadeSlideIn`)
- Import: button turns green "Added!" temporarily
- Copy: confirmation feedback on clipboard actions

### UX6 — Local-First Data

> No server. No database. localStorage is the persistence layer.

- Static `data/tools.json` as the immutable baseline
- User modifications stored in localStorage
- All data operations are synchronous
- No network dependency (GitHub polling is optional)
- Offline-capable by design

---

## 4. Performance Requirements

### PERF1 — Load Time

| Metric                         | Target          |
|--------------------------------|-----------------|
| First Contentful Paint         | < 500ms         |
| Time to Interactive            | < 500ms         |
| Total JS payload               | < 100KB (uncompressed) |
| Total CSS payload              | < 50KB (uncompressed)  |

No build step means no bundle overhead, no framework boot, no hydration delay.

### PERF2 — Runtime Performance

| Metric                         | Target          |
|--------------------------------|-----------------|
| Theme toggle latency           | < 16ms (1 frame)|
| Route transition               | < 200ms         |
| SideNav animation              | 60fps           |
| Page render (innerHTML)        | < 50ms          |
| localStorage read/write        | < 5ms           |

### PERF3 — Asset Rules

- SVG icons inline — no icon font, no external library
- CSS loaded statically in `<head>` (6 files)
- JS loaded as ES modules — browser handles caching
- Lazy-load pages via dynamic `import()` in route handlers
- One logo image (`Generic.ASCII.png`) — no other raster images in app shell

### PERF4 — DOM Hygiene

- Route changes replace `innerHTML` on content area — no DOM accumulation
- Event listeners attached after `innerHTML` insertion, scoped to content
- Cleanup functions returned from route handlers for intervals/listeners
- No global event listeners beyond router (`hashchange`) and theme (`click`)

---

## 5. Enforcement

### Commit Checklist

Every commit should be verified:

- [ ] Zero console errors
- [ ] No hardcoded colour values in JS
- [ ] Renders correctly in all three themes
- [ ] No new dependencies (npm, CDN, or inline library)
- [ ] Loading and error states handled for async operations
- [ ] SpeckKit component header comment block applied to new files

### Violation Severity

| Level    | Examples                                      | Action        |
|----------|-----------------------------------------------|---------------|
| Critical | Adding npm dependency, hardcoded colours       | Block commit  |
| Major    | Broken theme rendering, layout shift           | Fix before commit |
| Minor    | Naming convention, file length soft limit      | Fix in next commit |
| Advisory | Code style preference, optimisation suggestion | Author choice |

### The One Exception

**No principle is absolute.** But exceptions require:

1. Clear justification documented in the commit message
2. A plan to resolve the exception in a follow-up
3. The exception must not violate the zero-dependency principle

The zero-dependency principle itself has no exceptions.

---

*End of Constitution — Generic Tool Portfolio v3.0.0*
