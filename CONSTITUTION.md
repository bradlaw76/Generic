# GENERIC D365 MODERN SHELL — CONSTITUTION

## Engineering Principles & Standards

> **Version:** 1.0.0  
> **Last updated:** 2026-02-16  
> **Authority:** This document governs all code contributions. Violations block merge.

---

## Table of Contents

1. [Preamble](#1-preamble)
2. [Code Quality Principles](#2-code-quality-principles)
3. [Testing Standards](#3-testing-standards)
4. [User Experience Consistency](#4-user-experience-consistency)
5. [Performance Requirements](#5-performance-requirements)
6. [Enforcement](#6-enforcement)

---

## 1. Preamble

This constitution defines the non-negotiable engineering principles for the Generic D365 Modern Shell. Every contributor, every commit, and every review must comply. These principles exist to protect long-term maintainability, user trust, and application credibility.

**The application favors vanilla HTML, CSS, and JavaScript.** External libraries are introduced only when they provide irreplaceable value. Simplicity is a feature.

---

## 2. Code Quality Principles

### P1 — Vanilla First

> Prefer native browser APIs and vanilla HTML/CSS/JS over library abstractions.

- Use standard DOM APIs before reaching for a library
- CSS custom properties over CSS-in-JS where possible
- Native `fetch` over HTTP client libraries
- Native ES modules over bundler-specific patterns
- A new dependency must justify itself against a vanilla alternative

### P2 — Minimal Dependencies

> Every dependency is a liability. Add only what you cannot reasonably build.

| Allowed                        | Justification              |
|--------------------------------|----------------------------|
| Vite                           | Bundler (locked)           |
| better-sqlite3 / sql.js       | Local SQLite (locked)      |
| Fluent UI v9 (optional)       | Design token consistency   |
| No other runtime dependencies without explicit approval |

- `node_modules` size must stay under 50MB (production deps)
- No utility libraries (lodash, underscore, moment)
- No CSS frameworks (Tailwind, Bootstrap)
- Date handling: native `Intl.DateTimeFormat` and `Date`

### P3 — Strict Type Safety

> TypeScript strict mode is non-negotiable.

```json
{
  "strict": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "noImplicitReturns": true,
  "noFallthroughCasesInSwitch": true,
  "noUncheckedIndexedAccess": true
}
```

- Zero `any` types in committed code
- Explicit return types on all exported functions
- Interface over type alias for object shapes
- No `@ts-ignore` or `@ts-expect-error` without linked issue

### P4 — Single Responsibility

> Every file, function, and component does one thing.

- Files: ≤ 200 lines (soft limit), ≤ 300 lines (hard limit)
- Functions: ≤ 40 lines, ≤ 4 parameters
- Components: one concern, props-driven, no side effects in render
- No god files, no mega-functions

### P5 — No Dead Code

> If it's not used, it doesn't exist.

- No commented-out code blocks
- No unused imports, variables, or functions (enforced by TS strict)
- No placeholder files without implementation
- Remove before commit, not "later"

### P6 — Naming Clarity

> Names are documentation. Abbreviations are debt.

| Element    | Convention          | Example                    |
|------------|---------------------|----------------------------|
| Files      | PascalCase (.tsx)   | `SideNav.tsx`              |
| Files      | camelCase (.ts)     | `navConfig.ts`             |
| Components | PascalCase          | `AppCard`                  |
| Functions  | camelCase, verb-led | `toggleTheme()`            |
| Constants  | UPPER_SNAKE         | `MAX_NAV_WIDTH`            |
| CSS vars   | kebab-case          | `--dark-layer1`            |
| Booleans   | is/has/should       | `isCollapsed`, `hasError`  |

### P7 — Explicit Over Implicit

> Code should explain itself without comments.

- Favor explicit conditionals over ternary chains
- Destructure props at the function signature
- Use named exports over default exports (except tool page index files)
- No magic numbers — use named constants

---

## 3. Testing Standards

### T1 — Test Pyramid

| Level        | Tool              | Coverage Target | What to Test                    |
|--------------|-------------------|-----------------|---------------------------------|
| Unit         | Vitest            | ≥ 80%           | Utility functions, state logic  |
| Component    | Vitest + Testing Library | ≥ 70%   | Render, props, user interaction |
| Integration  | Playwright        | Critical paths  | Nav, routing, theme toggle      |
| Visual       | Manual + screenshot| Baseline        | Dark/light parity               |

### T2 — Test File Convention

```
src/
  components/
    AppCard.tsx
    AppCard.test.ts       ← co-located test
  utils/
    formatDate.ts
    formatDate.test.ts    ← co-located test
```

- Test files live next to source files
- Name: `{source}.test.ts` or `{source}.test.tsx`
- No separate `__tests__` directories

### T3 — What Must Be Tested

| Category            | Required Tests                              |
|---------------------|---------------------------------------------|
| Theme toggle        | Switches class/tokens, persists to storage  |
| SideNav collapse    | Width changes, labels hide, no layout shift |
| Route navigation    | Each nav item loads correct page            |
| Data display        | Grid renders rows, handles empty state      |
| Keyboard nav        | Tab order, Enter/Space activation           |
| SQLite operations   | CRUD operations, error handling             |
| Image references    | Local paths resolve, no broken refs         |

### T4 — Test Quality Rules

- No `test.skip` or `test.todo` in main branch
- Tests must not depend on execution order
- No network calls in unit/component tests (mock all I/O)
- Assertions must be specific (no `toBeTruthy()` for object checks)
- Each test has exactly one reason to fail

### T5 — Pre-Commit Gate

Before any commit:

```bash
npm run lint        # zero warnings
npm run typecheck   # zero errors
npm run test        # all pass
```

All three must pass. No exceptions.

---

## 4. User Experience Consistency

### UX1 — Visual Consistency Contract

> Every screen must look like it belongs to the same application.

- All colors from Circuit palette tokens — zero hardcoded hex
- All spacing from 4px grid system (4, 8, 12, 16, 20, 24, 32, 48)
- All type sizes from the defined scale (12, 14, 16, 20, 24)
- All border-radius: 4px (buttons) or 6px (cards)
- All transitions: 150–180ms ease-in-out

### UX2 — Dark/Light Parity

> Both themes are first-class citizens.

- Every component must be verified in both modes
- No "light mode only" or "dark mode only" styling
- Contrast must meet WCAG AA in both modes
- Screenshots of both modes required for visual review

### UX3 — Layout Stability

> The user must never see unexpected movement.

- No Cumulative Layout Shift (CLS) on page load
- No jitter on SideNav collapse/expand
- Content area smoothly adjusts (180ms transition)
- No flash of unstyled content (FOUC)
- Reserve space for async content (skeleton/placeholder)

### UX4 — Loading States

> Every async operation must show feedback.

| Duration     | Feedback Required                    |
|--------------|--------------------------------------|
| < 100ms      | None (instant perceived)             |
| 100–300ms    | Subtle indicator (opacity shift)     |
| 300ms–2s     | Spinner or skeleton                  |
| > 2s         | Progress bar + cancel option         |

### UX5 — Error States

> Errors are part of the design, not afterthoughts.

- Every data-loading component has an error state
- Error messages are human-readable (no stack traces in UI)
- Recovery action always available (retry, dismiss, navigate back)
- Errors logged to console with context (component, action, data)

### UX6 — Interaction Feedback

> Every user action must produce visible feedback.

- Buttons: hover state + active/pressed state
- Nav items: hover background + active indicator
- Form inputs: focus ring (visible, high contrast)
- Destructive actions: confirmation required
- Toast/notification for completed background actions

### UX7 — Local-First Data

> Images are never uploaded. Metadata lives in SQLite.

- Images referenced by local file path only
- No CDN, no cloud storage, no Base64 embedding in DB
- SQLite database stored in the application's data directory
- All data operations are synchronous or near-synchronous
- Offline-capable by design (no network dependency)

---

## 5. Performance Requirements

### PERF1 — Load Time Budgets

| Metric                        | Target      | Hard Limit  |
|-------------------------------|-------------|-------------|
| First Contentful Paint (FCP)  | < 500ms     | < 1000ms    |
| Largest Contentful Paint (LCP)| < 1000ms    | < 2000ms    |
| Time to Interactive (TTI)     | < 1000ms    | < 2000ms    |
| Total bundle size (gzipped)   | < 150KB     | < 300KB     |
| Main thread blocking          | < 50ms      | < 100ms     |

### PERF2 — Runtime Performance

| Metric                        | Target      | Hard Limit  |
|-------------------------------|-------------|-------------|
| Theme toggle latency          | < 16ms      | < 50ms      |
| SideNav animation             | 60fps       | No drop below 30fps |
| Route transition              | < 200ms     | < 500ms     |
| SQLite query (simple)         | < 10ms      | < 50ms      |
| SQLite query (complex/join)   | < 50ms      | < 200ms     |
| DOM node count (per page)     | < 500       | < 1500      |

### PERF3 — Asset Rules

- No images in the application bundle
- SVG icons inline or sprite-based (no icon font)
- CSS: single file per scope, no duplicate selectors
- No `@import` chains — use Vite's CSS handling
- Lazy-load tool pages (code splitting per route)

### PERF4 — Memory Management

- No memory leaks: all event listeners cleaned up on unmount
- No global state accumulation
- SQLite connections: open once, reuse, close on app exit
- Large data sets: paginate, don't load all into memory
- Monitor: heap size should not grow unbounded over time

### PERF5 — Build Optimization

```bash
npm run build    # must complete in < 15 seconds
```

- Tree-shaking enabled (Vite default)
- No barrel files that defeat tree-shaking
- Code splitting: one chunk per tool/route
- Vendor chunk: shared dependencies isolated
- Source maps: generated but not deployed to production

### PERF6 — Measurement

Performance is not optional — it's measured on every release:

```bash
npm run lighthouse   # automated Lighthouse CI
npm run bundle-size  # track bundle size over time
```

| Gate              | Threshold                          |
|-------------------|------------------------------------|
| Lighthouse perf   | ≥ 90                               |
| Bundle size delta | ≤ +5KB per PR (alerts on exceed)   |
| Test suite time   | < 30 seconds total                 |

---

## 6. Enforcement

### Review Checklist

Every pull request must answer YES to all:

- [ ] Zero TypeScript errors (`strict: true`)
- [ ] Zero lint warnings
- [ ] All tests pass
- [ ] No new `any` types
- [ ] No hardcoded colors
- [ ] Verified in both dark and light mode
- [ ] No new dependencies without justification
- [ ] Performance budget not exceeded
- [ ] Loading and error states handled
- [ ] Keyboard accessible

### Violation Severity

| Level    | Examples                                      | Action        |
|----------|-----------------------------------------------|---------------|
| Critical | `any` type, hardcoded color, broken a11y      | Block merge   |
| Major    | Missing tests, perf budget exceeded            | Block merge   |
| Minor    | Naming convention, file length soft limit      | Fix in PR     |
| Advisory | Code style preference, optimization suggestion | Author choice |

### Exceptions

No principle is absolute. Exceptions require:

1. Written justification in the PR description
2. Linked tracking issue for resolution
3. Approval from at least one other reviewer
4. Time-boxed: exception expires after 2 sprints

---

*End of Constitution — Generic D365 Modern Shell v1.0.0*
