# GENERIC D365 MODERN SHELL — TASKS

## Implementation Task Breakdown

> **Version:** 1.0.0  
> **Last updated:** 2026-02-16  
> **Tracking:** Checkbox-based. Check off as completed.

---

## Phase 0: Project Scaffolding

> **Goal:** Empty project that builds and runs  
> **Estimate:** 1 session

- [ ] **T0.1** — Initialize Vite project with `vanilla-ts` template
- [ ] **T0.2** — Configure `tsconfig.json` (strict mode, all flags from Constitution)
- [ ] **T0.3** — Configure `vite.config.ts` (aliases, build target, port)
- [ ] **T0.4** — Set up `.gitignore` (node_modules, dist, data/*.db)
- [ ] **T0.5** — Create `package.json` scripts (dev, build, preview, typecheck, lint, test)
- [ ] **T0.6** — Install dev dependencies (vitest, eslint, typescript)
- [ ] **T0.7** — Verify: `npm run dev` starts, `npm run build` succeeds
- [ ] **T0.8** — Initial git commit: `"T0: project scaffolding"`

---

## Phase 1: CSS Foundation & Theme System

> **Goal:** Circuit palette working in both dark and light modes  
> **Estimate:** 1 session  
> **Depends on:** Phase 0

- [ ] **T1.1** — Create `src/styles/reset.css` — minimal CSS reset
- [ ] **T1.2** — Create `src/theme/circuit-tokens.css` — brand colors, accent colors
- [ ] **T1.3** — Create `src/theme/dark.css` — dark mode neutral layers, foregrounds, strokes
- [ ] **T1.4** — Create `src/theme/light.css` — light mode neutral layers, foregrounds, strokes
- [ ] **T1.5** — Create `src/styles/typography.css` — font stack, type scale (12/14/16/20/24)
- [ ] **T1.6** — Create `src/index.css` — imports all CSS in correct order
- [ ] **T1.7** — Create `src/theme/theme-switcher.ts` — `toggleTheme()`, `initTheme()`, localStorage
- [ ] **T1.8** — Wire `index.html` to load `src/main.ts` → initializes theme
- [ ] **T1.9** — Verify: page renders in dark mode, toggle switches to light, persists on reload
- [ ] **T1.10** — Git commit: `"T1: CSS foundation and theme system"`

---

## Phase 2: Shell Layout

> **Goal:** TopBar + SideNav + ContentArea matching demo.html  
> **Estimate:** 1–2 sessions  
> **Depends on:** Phase 1

- [ ] **T2.1** — Create `src/styles/layout.css` — top-bar, side-nav, content-area styles
- [ ] **T2.2** — Create `src/layout/top-bar.ts` — render 48px fixed header with title, theme toggle, profile icon
- [ ] **T2.3** — Create `src/layout/side-nav.ts` — render collapsible nav (240px/64px), toggle function
- [ ] **T2.4** — Create `src/layout/content-area.ts` — scrollable main area, adjusts on nav collapse
- [ ] **T2.5** — Create `src/app/shell.ts` — orchestrates layout: mounts TopBar, SideNav, ContentArea
- [ ] **T2.6** — Add inline SVG icon functions for: hamburger, moon/sun, profile, home, grid
- [ ] **T2.7** — Wire `main.ts` to call `shell.init()`
- [ ] **T2.8** — Verify: layout matches demo.html, nav collapses smoothly (180ms), no jitter
- [ ] **T2.9** — Verify: dark/light both render correctly for all layout elements
- [ ] **T2.10** — Git commit: `"T2: shell layout (TopBar, SideNav, ContentArea)"`

---

## Phase 3: Router & Navigation

> **Goal:** Hash-based routing, nav items highlight, pages swap  
> **Estimate:** 1 session  
> **Depends on:** Phase 2

- [ ] **T3.1** — Create `src/app/router.ts` — hash router with `registerRoute()`, `navigate()`, cleanup
- [ ] **T3.2** — Create `src/app/nav-config.ts` — nav item definitions with lazy `load()` imports
- [ ] **T3.3** — Wire SideNav to read from `nav-config.ts` and render nav items dynamically
- [ ] **T3.4** — Wire nav item clicks to `navigate()` and update active indicator
- [ ] **T3.5** — Wire router `hashchange` listener to swap content area
- [ ] **T3.6** — Handle default route (`/` → Dashboard)
- [ ] **T3.7** — Handle unknown routes (404 fallback page)
- [ ] **T3.8** — Verify: clicking nav items changes URL hash and swaps content
- [ ] **T3.9** — Verify: active indicator (3px brand bar) follows current route
- [ ] **T3.10** — Git commit: `"T3: hash router and navigation"`

---

## Phase 4: Shared Components

> **Goal:** Reusable card, section header, and data grid components  
> **Estimate:** 1 session  
> **Depends on:** Phase 1

- [ ] **T4.1** — Create `src/styles/components.css` — card, section-header, data-grid, button styles
- [ ] **T4.2** — Create `src/components/app-card.ts` — `createAppCard({ title, content, actions })`
- [ ] **T4.3** — Create `src/components/section-header.ts` — `createSectionHeader({ title, action })`
- [ ] **T4.4** — Create `src/components/data-grid.ts` — `createDataGrid({ columns, rows })`
- [ ] **T4.5** — Create `src/components/button.ts` — `createButton({ label, variant, onClick })`
- [ ] **T4.6** — Verify: all components render with theme tokens (no hardcoded colors)
- [ ] **T4.7** — Verify: hover states, transitions (150ms), visual parity with demo.html
- [ ] **T4.8** — Git commit: `"T4: shared component library"`

---

## Phase 5: Dashboard Tool

> **Goal:** Dashboard page with stat cards + activity table  
> **Estimate:** 1 session  
> **Depends on:** Phase 3, Phase 4

- [ ] **T5.1** — Create `src/tools/dashboard/index.ts` — `render()` and `destroy()` exports
- [ ] **T5.2** — Render section header: "Dashboard"
- [ ] **T5.3** — Render 3 stat cards in grid layout (Total Records, Completion Rate, Active Tasks)
- [ ] **T5.4** — Render "Recent Activity" data grid (Name, Status, Value columns)
- [ ] **T5.5** — Wire to nav-config as default route (`/`)
- [ ] **T5.6** — Verify: matches demo.html dashboard layout in both themes
- [ ] **T5.7** — Git commit: `"T5: dashboard tool"`

---

## Phase 6: Sample Tool

> **Goal:** Sample tool page demonstrating the tool pattern  
> **Estimate:** 0.5 session  
> **Depends on:** Phase 3, Phase 4

- [ ] **T6.1** — Create `src/tools/sample-tool/index.ts` — `render()` and `destroy()` exports
- [ ] **T6.2** — Render section header with "New Action" primary button
- [ ] **T6.3** — Render "Tool Configuration" card with description + button group
- [ ] **T6.4** — Render "Integration Points" card with description
- [ ] **T6.5** — Wire to nav-config at path `/sample`
- [ ] **T6.6** — Verify: matches demo.html sample tool layout in both themes
- [ ] **T6.7** — Git commit: `"T6: sample tool"`

---

## Phase 7: SQLite Data Layer

> **Goal:** Local SQLite database for metadata storage  
> **Estimate:** 1–2 sessions  
> **Depends on:** Phase 0

- [ ] **T7.1** — Install `sql.js` dependency
- [ ] **T7.2** — Create `src/data/db.ts` — connection manager (init, get, save to localStorage)
- [ ] **T7.3** — Create `src/data/migrations.ts` — schema creation (tools, images, settings, schema_version)
- [ ] **T7.4** — Create `src/data/queries.ts` — typed CRUD functions for tools, images, settings
- [ ] **T7.5** — Run migrations on app startup (idempotent)
- [ ] **T7.6** — Store/retrieve theme preference via settings table (alongside localStorage)
- [ ] **T7.7** — Write unit tests for all query functions
- [ ] **T7.8** — Verify: database persists across page reloads
- [ ] **T7.9** — Verify: no data loss on theme toggle or navigation
- [ ] **T7.10** — Git commit: `"T7: SQLite data layer"`

---

## Phase 8: Image Reference System

> **Goal:** Store and display local image paths (no uploads)  
> **Estimate:** 1 session  
> **Depends on:** Phase 7

- [ ] **T8.1** — Create `src/components/image-picker.ts` — file input that captures local path
- [ ] **T8.2** — Create `src/components/image-display.ts` — renders `<img>` from local path
- [ ] **T8.3** — Wire image picker to store path in SQLite `images` table
- [ ] **T8.4** — Create image gallery component for tool pages
- [ ] **T8.5** — Handle missing/broken image paths gracefully (placeholder + error state)
- [ ] **T8.6** — Write tests for image CRUD operations
- [ ] **T8.7** — Verify: selecting image stores path, image renders from local filesystem
- [ ] **T8.8** — Git commit: `"T8: local image reference system"`

---

## Phase 9: Accessibility & Keyboard Navigation

> **Goal:** WCAG AA compliant, full keyboard support  
> **Estimate:** 1 session  
> **Depends on:** Phase 2, Phase 3

- [ ] **T9.1** — Add ARIA labels to all icon buttons (toggle, profile, hamburger)
- [ ] **T9.2** — Add ARIA roles to navigation (`nav`, `button`, `main`)
- [ ] **T9.3** — Implement keyboard navigation for SideNav (Tab, Arrow keys, Enter/Space)
- [ ] **T9.4** — Add visible focus indicators (outline) on all interactive elements
- [ ] **T9.5** — Verify WCAG AA contrast ratios for all text/background combinations
- [ ] **T9.6** — Test with screen reader (NVDA or VoiceOver)
- [ ] **T9.7** — Add `skip-to-content` link
- [ ] **T9.8** — Git commit: `"T9: accessibility and keyboard navigation"`

---

## Phase 10: Testing

> **Goal:** Test coverage meets Constitution thresholds  
> **Estimate:** 2 sessions  
> **Depends on:** All previous phases

- [ ] **T10.1** — Configure Vitest (`vitest.config.ts`, coverage thresholds)
- [ ] **T10.2** — Write unit tests for `theme-switcher.ts` (toggle, persist, init)
- [ ] **T10.3** — Write unit tests for `router.ts` (register, navigate, cleanup)
- [ ] **T10.4** — Write unit tests for `nav-config.ts` (items match expected shape)
- [ ] **T10.5** — Write component tests for `app-card`, `section-header`, `data-grid`
- [ ] **T10.6** — Write unit tests for `db.ts`, `queries.ts` (CRUD, migrations)
- [ ] **T10.7** — Install Playwright, write integration test: full nav flow
- [ ] **T10.8** — Write integration test: theme toggle persists
- [ ] **T10.9** — Write integration test: dashboard renders data
- [ ] **T10.10** — Verify: `npm run test` all pass, coverage ≥ 80% unit / ≥ 70% component
- [ ] **T10.11** — Git commit: `"T10: test suite"`

---

## Phase 11: Performance & Build Optimization

> **Goal:** Meet all PERF targets from Constitution  
> **Estimate:** 1 session  
> **Depends on:** Phase 10

- [ ] **T11.1** — Measure bundle size: must be < 150KB gzipped (excluding sql.js WASM)
- [ ] **T11.2** — Verify code splitting: each tool is a separate chunk
- [ ] **T11.3** — Run Lighthouse: performance score ≥ 90
- [ ] **T11.4** — Measure FCP < 500ms, LCP < 1000ms, TTI < 1000ms
- [ ] **T11.5** — Verify DOM node count < 500 per page
- [ ] **T11.6** — Check for memory leaks: event listeners cleaned up
- [ ] **T11.7** — Verify build completes in < 15 seconds
- [ ] **T11.8** — Add `npm run bundle-size` script to track size over time
- [ ] **T11.9** — Git commit: `"T11: performance optimization"`

---

## Phase 12: Baseline Lock & Release

> **Goal:** v1.0.0 release — all criteria met  
> **Estimate:** 0.5 session  
> **Depends on:** All phases

- [ ] **T12.1** — Run full baseline lock checklist (SPEC-KIT §15)
- [ ] **T12.2** — Verify: AppShell renders without errors
- [ ] **T12.3** — Verify: SideNav collapse/expand works in both themes
- [ ] **T12.4** — Verify: Dark/Light toggle works + persists
- [ ] **T12.5** — Verify: Navigation routing functional (all routes)
- [ ] **T12.6** — Verify: Dashboard renders stat cards + data grid
- [ ] **T12.7** — Verify: Sample tool renders correctly
- [ ] **T12.8** — Verify: Zero hardcoded colors in source
- [ ] **T12.9** — Verify: Zero console errors
- [ ] **T12.10** — Verify: No layout jitter on nav collapse
- [ ] **T12.11** — Verify: SQLite data persists across sessions
- [ ] **T12.12** — Verify: All tests pass, coverage thresholds met
- [ ] **T12.13** — Update README.md with final setup instructions
- [ ] **T12.14** — Tag release: `git tag v1.0.0`
- [ ] **T12.15** — Git commit: `"v1.0.0: baseline lock"`

---

## Summary

| Phase | Name                       | Tasks | Estimate    | Status      |
|-------|----------------------------|-------|-------------|-------------|
| 0     | Project Scaffolding        | 8     | 1 session   | ☐ Not started |
| 1     | CSS Foundation & Themes    | 10    | 1 session   | ☐ Not started |
| 2     | Shell Layout               | 10    | 1–2 sessions| ☐ Not started |
| 3     | Router & Navigation        | 10    | 1 session   | ☐ Not started |
| 4     | Shared Components          | 8     | 1 session   | ☐ Not started |
| 5     | Dashboard Tool             | 7     | 1 session   | ☐ Not started |
| 6     | Sample Tool                | 7     | 0.5 session | ☐ Not started |
| 7     | SQLite Data Layer          | 10    | 1–2 sessions| ☐ Not started |
| 8     | Image Reference System     | 8     | 1 session   | ☐ Not started |
| 9     | Accessibility              | 8     | 1 session   | ☐ Not started |
| 10    | Testing                    | 11    | 2 sessions  | ☐ Not started |
| 11    | Performance Optimization   | 9     | 1 session   | ☐ Not started |
| 12    | Baseline Lock & Release    | 15    | 0.5 session | ☐ Not started |
|       | **TOTAL**                  | **121**| **~13 sessions** |         |

---

## Dependency Graph

```
Phase 0 (Scaffold)
  ├─→ Phase 1 (CSS/Themes)
  │     ├─→ Phase 2 (Layout)
  │     │     ├─→ Phase 3 (Router)
  │     │     │     ├─→ Phase 5 (Dashboard)
  │     │     │     └─→ Phase 6 (Sample Tool)
  │     │     └─→ Phase 9 (Accessibility)
  │     └─→ Phase 4 (Components)
  │           ├─→ Phase 5 (Dashboard)
  │           └─→ Phase 6 (Sample Tool)
  └─→ Phase 7 (SQLite)
        └─→ Phase 8 (Images)

Phase 5 + 6 + 7 + 8 + 9
  └─→ Phase 10 (Testing)
        └─→ Phase 11 (Performance)
              └─→ Phase 12 (Release)
```

---

*End of Tasks — Generic D365 Modern Shell v1.0.0*
