# GENERIC TOOL PORTFOLIO — CONSTITUTION

## Consolidated Governance Document

> **Version:** 3.1.0
> **Ratified:** 2026-02-17
> **Last Amended:** 2026-02-17
> **Authority:** This document governs all code contributions.

---

## Core Principles

### I. Zero Dependencies (NON-NEGOTIABLE)

No npm packages. No build tools. No frameworks. No exceptions.

The project operates entirely on native browser APIs:
- UI rendering via `innerHTML` + template literals
- State management via `localStorage` + in-memory arrays
- Routing via hash-based router (131 lines of JS)
- Theming via CSS custom properties + class swap
- HTTP requests via native `fetch()`
- Icons via inline SVG functions
- Bundling: None — native ES module `import()`
- Dev server: `python -m http.server 8000`

**Why?** The workspace lives on a OneDrive-synced path that breaks `node_modules`. Rather than fight the toolchain, we eliminated it entirely.

### II. Vanilla First

Use standard browser APIs before inventing abstractions:
- DOM APIs (`createElement`, `querySelector`, `addEventListener`)
- ES module `import` / `export` / dynamic `import()`
- CSS custom properties for theming
- `fetch()` for HTTP
- `localStorage` for persistence
- `Intl.DateTimeFormat` for date formatting
- `crypto.randomUUID()` for IDs

### III. Single Responsibility

Every file, function, and module does one thing:
- Files: ≤ 300 lines preferred
- Functions: ≤ 50 lines, ≤ 5 parameters
- Modules: one page or one concern per file
- No god files, no mega-functions

### IV. Data Isolation

Tools may NOT modify core layout. No cross-tool imports:
- `src/pages/` modules may import from `src/platform/` and `src/shared/` only
- `src/tools/` modules may import from `src/platform/` and `src/shared/` only
- `src/platform/` may NOT import from `src/pages/` or `src/tools/`
- No global CSS injection from page modules
- All tool data flows through `tool-registry.js`

### V. Local-First Data

No server. No database. localStorage is the persistence layer:
- Static `data/tools.json` as the immutable baseline
- User modifications stored in localStorage
- All data operations are synchronous
- No network dependency (GitHub polling is optional)
- Offline-capable by design

---

## SpeckKit Governance

This project is governed by the SpeckKit registry and shared agent defaults.

| Item | Reference |
|------|-----------|
| Registry | https://github.com/bradlaw76/SpeckKit-Project-Development |
| Agent Defaults | AGENT_BEHAVIOR_DEFAULTS.jsonc |
| Local Submodule | `.speckkit-registry/` |

Governing rules:
- Component header comment block is mandatory for any new component/module
- Update version and last updated stamps when modifying core components
- Respect the platform architecture and tool isolation rules
- UI references are opt-in and must be explicitly loaded by request
- All decisions prioritize maintainability, clarity, and local-first execution

---

## Architecture Contract

The application is a Generic D365 Tool Platform built with vanilla ES modules and CSS.

Key contracts:
- `ToolDefinition` — strict interface: `src/platform/tool-types.js`
- `ToolRegistry` — central registration: `src/platform/tool-registry.js`
- Navigation Engine — routes + tool discovery: `src/platform/navigation-engine.js`

Adding a new tool:
1. Create `src/tools/{tool-id}/`
2. Add `index.js` (default export component)
3. Add `tool.config.js` conforming to `ToolDefinition`
4. Optional: `routes.js` for sub-routes
5. Register in `src/platform/tool-registry.js`
6. Ensure lazy import route exists in `src/app/router.js`

---

## User Experience Consistency

### Visual Consistency Contract
- All colours from CSS custom properties — zero hardcoded hex values in JS
- All spacing on 4px grid (4, 8, 12, 16, 20, 24, 32, 48)
- All type sizes from the defined scale (12, 14, 16, 20, 24)
- All border-radius: 4px (buttons) or 6px (cards)
- All transitions: 150–200ms ease-in-out

### Three Themes Are First-Class
- Circuit Dark, Circuit Light, and Dynamics 365 equally supported
- Every component must render correctly in all three themes
- No theme-specific logic in JS — all via CSS custom properties
- Theme switch is instant (class swap on `<body>`)
- Default: Circuit Dark (`theme-dark`)

### D365 Aesthetic
- TopBar: 48px fixed header with left-aligned navigation
- SideNav: collapsible (240px / 64px) with grouped items
- Data grids: row hover, column alignment, header styling
- Cards: subtle elevation, consistent padding
- Badges: inline coloured labels (Active/Inactive, Public/Private)

---

## Performance Requirements

### Load Time
| Metric | Target |
|--------|--------|
| First Contentful Paint | < 500ms |
| Time to Interactive | < 500ms |
| Total JS payload | < 100KB (uncompressed) |
| Total CSS payload | < 50KB (uncompressed) |

### Runtime Performance
| Metric | Target |
|--------|--------|
| Theme toggle latency | < 16ms (1 frame) |
| Route transition | < 200ms |
| SideNav animation | 60fps |
| Page render (innerHTML) | < 50ms |
| localStorage read/write | < 5ms |

---

## Enforcement

### Commit Checklist
- [ ] Zero console errors
- [ ] No hardcoded colour values in JS
- [ ] Renders correctly in all three themes
- [ ] No new dependencies (npm, CDN, or inline library)
- [ ] Loading and error states handled for async operations
- [ ] SpeckKit component header comment block applied to new files

### Violation Severity
| Level | Examples | Action |
|-------|----------|--------|
| Critical | Adding npm dependency, hardcoded colours | Block commit |
| Major | Broken theme rendering, layout shift | Fix before commit |
| Minor | Naming convention, file length soft limit | Fix in next commit |
| Advisory | Code style preference, optimisation suggestion | Author choice |

### The One Exception
**No principle is absolute.** But exceptions require:
1. Clear justification documented in the commit message
2. A plan to resolve the exception in a follow-up
3. The exception must not violate the zero-dependency principle

The zero-dependency principle itself has no exceptions.

---

*Consolidated from: CONSTITUTION.md, SPEC-KIT.md governance sections*
