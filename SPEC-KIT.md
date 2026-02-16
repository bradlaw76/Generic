# GENERIC D365 MODERN SHELL — SPEC KIT

## Version 1.0.0 | Baseline Lock

> **Last updated:** 2026-02-16  
> **Status:** Baseline specification — ready for implementation  
> **Type:** Application Shell (not a marketing site)

---

## Table of Contents

1. [Overview](#1-overview)
2. [Goals & Constraints](#2-goals--constraints)
3. [Technology Stack](#3-technology-stack)
4. [Repository Structure](#4-repository-structure)
5. [Design System — Circuit Palette](#5-design-system--circuit-palette)
6. [Theming Architecture](#6-theming-architecture)
7. [Layout Contract](#7-layout-contract)
8. [Routing & Tool Injection](#8-routing--tool-injection)
9. [Component Library](#9-component-library)
10. [Typography](#10-typography)
11. [Motion & Interaction](#11-motion--interaction)
12. [Accessibility](#12-accessibility)
13. [Git Workflow & Versioning](#13-git-workflow--versioning)
14. [Development Setup](#14-development-setup)
15. [Baseline Lock Criteria](#15-baseline-lock-criteria)
16. [Visual Tone Guardrails](#16-visual-tone-guardrails)
17. [Demo Reference](#17-demo-reference)
18. [Future Scalability (Out of Scope v1)](#18-future-scalability-out-of-scope-v1)
19. [File Manifest](#19-file-manifest)

### Companion Documents

| Document             | Purpose                                          |
|----------------------|--------------------------------------------------|
| `CONSTITUTION.md`    | Engineering principles: code quality, testing, UX, performance |
| `PLAN.md`            | Architecture decisions: vanilla-first, Vite, SQLite, local images |
| `TASKS.md`           | 121 implementation tasks across 13 phases        |

---

## 1. Overview

Build a Git-hosted, modular, Fluent UI–based React shell that:

- Visually resembles a modern Dynamics 365 experience
- Uses a custom **Circuit** color palette
- Supports dark/light modes with localStorage persistence
- Allows easy tool injection via config (no shell edits required)
- Scales into a full application platform

**This is an application shell, not a landing page.**

---

## 2. Goals & Constraints

### Goals

| # | Goal                              | Measure                                      |
|---|-----------------------------------|----------------------------------------------|
| 1 | D365-authentic look               | Visual density matches D365 tone             |
| 2 | Token-only theming                | Zero hardcoded hex values in components      |
| 3 | Modular tool injection            | Add tool = new folder + 1 config entry       |
| 4 | Dark/Light parity                 | Both modes fully styled, toggle persistent   |
| 5 | No layout jitter                  | SideNav collapse smooth, no content shift    |
| 6 | Accessibility baseline            | WCAG AA contrast, keyboard nav, ARIA labels  |

### Constraints (v1.0.0)

- No global state manager (Redux/Zustand)
- No authentication/authorization
- No API integration layer
- No role-based navigation
- No module federation
- Local + Context state only

---

## 3. Technology Stack

| Layer        | Choice                          | Rationale                 | Locked |
|--------------|---------------------------------|---------------------------|--------|
| UI Framework | React 18                        | Component modularity      | ✅     |
| Language     | TypeScript (strict)             | Long-term maintainability | ✅     |
| Bundler      | Vite                            | Fast dev + clean output   | ✅     |
| UI Library   | Fluent UI v9                    | Authentic Microsoft UX    | ✅     |
| Routing      | React Router v6                 | Lazy tool injection       | ✅     |
| Icons        | @fluentui/react-icons           | Consistent icon set       | ✅     |
| State        | Local + Context only (v1)       | No global store yet       | ✅     |
| Hosting      | Git + Static (GitHub Pages/Azure SWA) | —                   | ✅     |

---

## 4. Repository Structure

```
generic-d365-modern-shell/
│
├─ src/
│  ├─ app/                          # Application shell & orchestration
│  │   ├─ AppShell.tsx              #   Main shell orchestrator
│  │   ├─ routes.tsx                #   Dynamic route generation from navConfig
│  │   ├─ navConfig.ts              #   Tool registration config (single source of truth)
│  │   └─ AppContext.tsx            #   Application-level context
│  │
│  ├─ layout/                       # Layout primitives
│  │   ├─ TopBar.tsx                #   48px fixed header
│  │   ├─ SideNav.tsx               #   Collapsible navigation (240px / 64px)
│  │   └─ ContentArea.tsx           #   Scrollable main content area
│  │
│  ├─ theme/                        # Theming system
│  │   ├─ circuitTokens.ts          #   Circuit color palette definitions
│  │   ├─ darkTheme.ts              #   Dark mode Fluent theme overrides
│  │   ├─ lightTheme.ts             #   Light mode Fluent theme overrides
│  │   └─ ThemeProvider.tsx         #   Theme context + localStorage persistence
│  │
│  ├─ components/                   # Shared component library
│  │   ├─ AppCard.tsx               #   Standard card component
│  │   ├─ SectionHeader.tsx         #   Section headers with optional actions
│  │   └─ DataGrid.tsx              #   Basic data table component
│  │
│  ├─ tools/                        # Modular tool pages
│  │   ├─ Dashboard/
│  │   │   └─ index.tsx             #   Dashboard with stats + data grid
│  │   └─ SampleTool/
│  │       └─ index.tsx             #   Example tool implementation
│  │
│  ├─ main.tsx                      # Entry point (React StrictMode)
│  ├─ App.tsx                       # Root component
│  └─ index.css                     # Global CSS reset
│
├─ index.html                       # HTML shell
├─ package.json                     # Dependencies + scripts
├─ tsconfig.json                    # Strict TypeScript config
├─ tsconfig.node.json               # Node TypeScript config
├─ vite.config.ts                   # Vite bundler config
├─ .gitignore                       # Git ignore patterns
├─ README.md                        # Usage guide
└─ VERIFICATION.md                  # Baseline lock checklist
```

**Total: 22 files**

---

## 5. Design System — Theme System v1.2

Three themes are supported. All share a unified CSS custom property contract.

### 5.1 Unified Token Contract

All components consume these tokens — never raw hex values:

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

Fluent UI / Microsoft standard feel:

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

**No raw hex values in components.** All colors flow through CSS custom property tokens.

---

## 6. Theming Architecture

### 6.1 Three Themes

| Theme Class    | Name           | Character                        |
|----------------|----------------|----------------------------------|
| `theme-dark`   | Circuit Dark   | Deep, high-contrast dev palette  |
| `theme-light`  | Circuit Light  | Clean, bright Circuit variant    |
| `theme-d365`   | Dynamics 365   | Official Microsoft Fluent feel   |

### 6.2 CSS Custom Properties (No JavaScript Objects)

All themes are implemented as CSS class selectors on `<body>`, each defining the same set of custom properties. Components consume tokens — never theme-specific logic.

```css
body.theme-dark  { --bg-primary: #0B0D10; /* ... */ }
body.theme-light { --bg-primary: #F4F7FA; /* ... */ }
body.theme-d365  { --bg-primary: #F3F2F1; /* ... */ }
```

### 6.3 Theme Switching

```ts
const THEMES = ['theme-dark', 'theme-light', 'theme-d365'];

function setTheme(theme: string): void {
  THEMES.forEach(t => document.body.classList.remove(t));
  document.body.classList.add(theme);
  localStorage.setItem('theme', theme);
}
```

- Theme selected via dropdown (not binary toggle)
- Persisted to `localStorage`
- Instant switch — no re-render, no flash
- Default: `theme-dark`

---

## 7. Layout Contract

### 7.1 TopBar

| Property    | Value                                            |
|-------------|--------------------------------------------------|
| Height      | 48px                                             |
| Position    | `fixed`, top: 0                                  |
| Z-index     | 1000                                             |
| Border      | Subtle bottom border (1px stroke)                |
| Shadow      | None (no heavy shadow)                           |
| Style       | Fluent CommandBar aesthetic                      |

**Contains:**
- App title (left-aligned)
- Hamburger menu toggle (left)
- Optional breadcrumb (center)
- Search (right)
- Theme selector dropdown (right) — 3 themes: Circuit Dark, Circuit Light, D365
- Profile avatar (right)

### 7.2 SideNav

| Property         | Value                          |
|------------------|--------------------------------|
| Expanded width   | 240px                          |
| Collapsed width  | 64px                           |
| Transition       | `width 180ms ease-in-out`      |
| Active indicator | 3px left border (brand accent) |
| Hover            | Background shift to layer 3    |

**Collapsed state:**
- Icon only (no labels)
- Tooltip on hover

### 7.3 ContentArea

| Property    | Value                                    |
|-------------|------------------------------------------|
| Padding     | 24px                                     |
| Scroll      | `overflow-y: auto`                       |
| Position    | Fills remaining space after TopBar + Nav |
| Transition  | `left 180ms ease-in-out` on nav collapse |

**No layout shift during nav collapse.**

---

## 8. Routing & Tool Injection

### 8.1 navConfig.ts — Single Source of Truth

```ts
export const navItems = [
  {
    label: "Dashboard",
    path: "/",
    icon: Home24Regular,
    element: lazy(() => import("../tools/Dashboard"))
  },
  {
    label: "Sample Tool",
    path: "/sample",
    icon: Toolbox24Regular,
    element: lazy(() => import("../tools/SampleTool"))
  }
];
```

### 8.2 routes.tsx — Dynamic Route Generation

Routes are automatically built from `navConfig`. No manual route registration.

### 8.3 Adding a New Tool

1. Create `src/tools/NewTool/index.tsx`
2. Add entry to `src/app/navConfig.ts`
3. Import icon from `@fluentui/react-icons`
4. **Done** — no shell edits required

```tsx
// Example: src/tools/Reports/index.tsx
const Reports = () => <div>Reports Tool</div>;
export default Reports;

// navConfig.ts addition
import { DocumentTable24Regular } from '@fluentui/react-icons';
{
  label: 'Reports',
  path: '/reports',
  icon: DocumentTable24Regular,
  element: lazy(() => import('../tools/Reports')),
}
```

---

## 9. Component Library

### 9.1 AppCard

| Property | Value                        |
|----------|------------------------------|
| Padding  | 16–24px                      |
| Radius   | 6px                          |
| Border   | 1px subtle stroke            |
| Shadow   | Slight elevation (1px 2px)   |
| Style    | No heavy shadow; data-first  |

### 9.2 SectionHeader

| Property    | Value                          |
|-------------|--------------------------------|
| Title       | 20px / weight 600              |
| Layout      | Flex row, space-between        |
| Right slot  | Optional action button         |
| Spacing     | Dense (16px margin-bottom)     |

### 9.3 DataGrid (v1 Minimal)

| Property        | Value                       |
|-----------------|-----------------------------|
| Base            | Fluent Table                |
| Row hover       | Background highlight (150ms)|
| Header          | Sticky (optional)           |
| Virtualization  | Not included (v1)           |
| All styling     | Fluent `makeStyles`         |

---

## 10. Typography

### Font Stack

```
"Segoe UI Variable", "Segoe UI", system-ui, sans-serif
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

## 11. Motion & Interaction

### Transition Standard

- Duration: **150–180ms**
- Easing: `ease-in-out`

### Interaction Patterns

| Element       | Behavior                                  |
|---------------|-------------------------------------------|
| Card hover    | Slight background shift, optional 1px lift|
| Nav collapse  | Width animation only (no opacity fade)    |
| Button hover  | Background color shift (150ms)            |
| Table row     | Background highlight on hover (150ms)     |
| Theme switch  | Instant swap, no animation                |
| Theme dropdown| Fade in, close on outside click           |

---

## 12. Accessibility

### Baseline Requirements (v1)

| Requirement       | Standard                           |
|-------------------|------------------------------------|
| Color contrast    | WCAG AA minimum                    |
| Focus indicators  | Visible outlines on all interactives|
| Keyboard nav      | Full SideNav + TopBar navigation   |
| ARIA labels       | All toggle buttons + icon buttons  |
| Screen reader     | Semantic HTML structure            |

---

## 13. Git Workflow & Versioning

### Branch Strategy

```
main            ← production-ready
dev             ← integration branch
feature/*       ← individual feature work
```

### Versioning

Semantic versioning: `v1.0.0`

### First Commit

```bash
git init
git add .
git commit -m "v1.0.0 baseline"
```

---

## 14. Development Setup

### 14.1 Create Project

```bash
npm create vite@latest generic-d365-modern-shell -- --template react-ts
cd generic-d365-modern-shell
npm install
```

### 14.2 Install Dependencies

```bash
npm install @fluentui/react-components
npm install react-router-dom
npm install @fluentui/react-icons    # optional but recommended
```

### 14.3 TypeScript Config

```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### 14.4 Run

```bash
npm run dev      # development server
npm run build    # production build
```

---

## 15. Baseline Lock Criteria

v1.0.0 is **locked** when ALL of these pass:

| #  | Criterion                          | Status |
|----|------------------------------------|--------|
| 1  | AppShell renders without errors    | ☐      |
| 2  | SideNav collapse/expand works      | ☐      |
| 3  | All 3 themes work (dark/light/d365)| ☐      |
| 4  | Navigation routing functional      | ☐      |
| 5  | Dashboard page renders             | ☐      |
| 6  | Sample tool page renders           | ☐      |
| 7  | No hardcoded color values          | ☐      |
| 8  | No console errors                  | ☐      |
| 9  | Visual density matches D365 tone   | ☐      |
| 10 | No layout jitter on nav collapse   | ☐      |

**Only then begin building tools.**

---

## 16. Visual Tone Guardrails

To maintain D365 credibility:

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

## 17. Demo Reference

A standalone HTML demo exists at `demo.html` in the project root. It implements:

- 3-theme system (Circuit Dark, Circuit Light, Dynamics 365) via CSS custom properties
- Theme selector dropdown with visual indicators
- Collapsible SideNav (240px ↔ 64px) with smooth transitions
- TopBar with hamburger menu, theme toggle, and profile icon
- Dashboard page with stat cards + data table
- Sample Tool page with configuration cards
- localStorage theme persistence
- All Circuit palette tokens applied
- No external dependencies (pure HTML/CSS/JS)

**Use this as the visual reference target for the React implementation.**

---

## 18. Future Scalability (Out of Scope v1)

These are explicitly excluded from v1.0.0 and will be layered in future versions:

| Feature                   | Target Version |
|---------------------------|----------------|
| Global state (Redux/Zustand) | v1.1+       |
| Authentication/SSO        | v1.2+          |
| API integration layer     | v1.2+          |
| Role-based navigation     | v1.3+          |
| Module federation         | v2.0+          |
| Advanced DataGrid (virtual, sort, filter) | v1.1+ |
| Command palette / search  | v1.1+          |
| Notification system       | v1.1+          |
| Breadcrumb navigation     | v1.1+          |

---

## 19. File Manifest

### Current Repository Contents

| File              | Type       | Purpose                                    |
|-------------------|------------|--------------------------------------------|
| `demo.html`       | HTML       | Standalone visual reference implementation |
| `PROJECT-INDEX.md`| Markdown   | Project structure & feature documentation  |
| `README.md`       | Markdown   | Repository description                     |
| `spec.chatgpt`    | Text       | Original technical specification           |
| `SPEC-KIT.md`     | Markdown   | **This file** — unified spec kit          |
| `CONSTITUTION.md` | Markdown   | Engineering principles & standards         |
| `PLAN.md`         | Markdown   | Implementation plan & architecture decisions|
| `TASKS.md`        | Markdown   | 121 tasks across 13 phases                 |
| `Generic.ASCII.png`| Image     | Project logo/branding asset                |

### Target Implementation (22 files)

| File                              | Category     |
|-----------------------------------|--------------|
| `src/App.tsx`                     | Core         |
| `src/main.tsx`                    | Core         |
| `src/index.css`                   | Core         |
| `src/app/AppShell.tsx`            | Shell        |
| `src/app/routes.tsx`              | Shell        |
| `src/app/navConfig.ts`            | Shell        |
| `src/app/AppContext.tsx`          | Shell        |
| `src/layout/TopBar.tsx`           | Layout       |
| `src/layout/SideNav.tsx`          | Layout       |
| `src/layout/ContentArea.tsx`      | Layout       |
| `src/theme/circuitTokens.ts`      | Theme        |
| `src/theme/darkTheme.ts`          | Theme        |
| `src/theme/lightTheme.ts`         | Theme        |
| `src/theme/ThemeProvider.tsx`      | Theme        |
| `src/components/AppCard.tsx`       | Components   |
| `src/components/SectionHeader.tsx` | Components   |
| `src/components/DataGrid.tsx`      | Components   |
| `src/tools/Dashboard/index.tsx`    | Tools        |
| `src/tools/SampleTool/index.tsx`   | Tools        |
| `package.json`                     | Config       |
| `tsconfig.json`                    | Config       |
| `vite.config.ts`                   | Config       |

---

*End of Spec Kit — Generic D365 Modern Shell v1.0.0*
