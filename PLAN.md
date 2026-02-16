# GENERIC D365 MODERN SHELL — PLAN

## Implementation Plan & Architecture Decisions

> **Version:** 1.0.0  
> **Last updated:** 2026-02-16  
> **Guiding principle:** Vanilla first. Minimal libraries. Local data. No uploads.

---

## Table of Contents

1. [Architecture Philosophy](#1-architecture-philosophy)
2. [Technology Decisions](#2-technology-decisions)
3. [Project Structure](#3-project-structure)
4. [Build System — Vite](#4-build-system--vite)
5. [Data Layer — Local SQLite](#5-data-layer--local-sqlite)
6. [Image Handling — Local Only](#6-image-handling--local-only)
7. [UI Implementation — Vanilla HTML/CSS/JS](#7-ui-implementation--vanilla-htmlcssjs)
8. [Theming Strategy](#8-theming-strategy)
9. [Routing & Navigation](#9-routing--navigation)
10. [Development Workflow](#10-development-workflow)
11. [Dependency Inventory](#11-dependency-inventory)
12. [Migration Path from Demo](#12-migration-path-from-demo)

---

## 1. Architecture Philosophy

### Vanilla-First Principle

This project intentionally avoids heavy frameworks and libraries. The existing `demo.html` proves the shell works with **zero dependencies** — pure HTML, CSS, and JavaScript. The production implementation preserves this spirit:

- **HTML** for structure and semantics
- **CSS custom properties** for theming (no CSS-in-JS)
- **Vanilla JavaScript / TypeScript** for behavior
- **Vite** as the only build tool
- **SQLite** as the only data dependency

### Why Not React?

The original spec referenced React + Fluent UI. The revised plan explicitly moves away from that:

| Concern           | React Approach         | Vanilla Approach (Chosen)       |
|-------------------|------------------------|---------------------------------|
| Bundle size       | ~140KB+ (React + ReactDOM) | 0KB (native)                |
| Theme switching   | Context + FluentProvider | CSS custom properties          |
| Component model   | JSX Components         | Web Components or ES modules   |
| State management  | useState/Context       | Native events + DOM state      |
| Routing           | React Router (~12KB)   | History API + hash routing     |
| Build complexity  | JSX transform + deps   | Vite vanilla template          |
| Time to interactive| Higher (hydration)    | Instant (no framework boot)    |

### Decision: Vanilla TypeScript + Vite

- Use Vite's vanilla-ts template
- TypeScript for type safety without runtime cost
- No JSX — use template literals or DOM APIs
- CSS files loaded natively by Vite
- Code splitting via dynamic `import()`

---

## 2. Technology Decisions

### Locked Stack

| Layer       | Choice              | Rationale                                     |
|-------------|---------------------|-----------------------------------------------|
| Bundler     | Vite 5+             | Fast HMR, native ES modules, minimal config   |
| Language    | TypeScript (strict)  | Type safety, zero runtime overhead            |
| Markup      | Vanilla HTML         | Semantic, accessible, no transform needed     |
| Styling     | Vanilla CSS          | Custom properties, no preprocessor needed     |
| Scripting   | Vanilla JS/TS       | No framework runtime cost                      |
| Database    | SQLite (sql.js)      | Local, serverless, single-file database       |
| Images      | Local filesystem     | Never uploaded, paths stored in SQLite         |

### Explicitly Rejected

| Library/Framework | Reason for Rejection                         |
|-------------------|----------------------------------------------|
| React             | Unnecessary runtime for this application     |
| Vue, Svelte, etc. | Same — no framework runtime needed           |
| Tailwind CSS      | Utility classes add build complexity          |
| Bootstrap         | Opinionated styling conflicts with Circuit   |
| Lodash            | Native array/object methods suffice          |
| Axios             | Native `fetch` is sufficient                 |
| Moment.js         | `Intl.DateTimeFormat` is standard            |
| Express/Fastify   | No server — this is a static application     |
| Electron          | Not a desktop app (yet)                      |

---

## 3. Project Structure

```
generic-d365-modern-shell/
│
├─ src/
│  ├─ app/
│  │   ├─ shell.ts              # Main shell orchestrator
│  │   ├─ router.ts             # Hash-based router (vanilla)
│  │   └─ nav-config.ts         # Tool registration config
│  │
│  ├─ layout/
│  │   ├─ top-bar.ts            # TopBar component (48px header)
│  │   ├─ side-nav.ts           # SideNav component (collapsible)
│  │   └─ content-area.ts       # Main content container
│  │
│  ├─ theme/
│  │   ├─ circuit-tokens.css    # CSS custom properties (Circuit palette)
│  │   ├─ dark.css              # Dark mode overrides
│  │   ├─ light.css             # Light mode overrides
│  │   └─ theme-switcher.ts     # Toggle logic + localStorage
│  │
│  ├─ components/
│  │   ├─ app-card.ts           # Card component
│  │   ├─ section-header.ts     # Section header component
│  │   └─ data-grid.ts          # Data table component
│  │
│  ├─ tools/
│  │   ├─ dashboard/
│  │   │   ├─ index.ts          # Dashboard page logic
│  │   │   └─ dashboard.html    # Dashboard template
│  │   └─ sample-tool/
│  │       ├─ index.ts          # Sample tool logic
│  │       └─ sample-tool.html  # Sample tool template
│  │
│  ├─ data/
│  │   ├─ db.ts                 # SQLite connection manager
│  │   ├─ migrations.ts         # Schema creation / versioning
│  │   └─ queries.ts            # Typed query functions
│  │
│  ├─ styles/
│  │   ├─ reset.css             # CSS reset (minimal)
│  │   ├─ layout.css            # Shell layout styles
│  │   ├─ components.css        # Shared component styles
│  │   └─ typography.css        # Type scale + font stack
│  │
│  ├─ main.ts                   # Entry point
│  └─ index.css                 # CSS imports aggregator
│
├─ data/
│  └─ app.db                    # SQLite database file (gitignored)
│
├─ index.html                   # HTML shell
├─ package.json                 # Minimal dependencies
├─ tsconfig.json                # Strict TypeScript config
├─ vite.config.ts               # Vite config
├─ .gitignore                   # Includes data/*.db
└─ README.md                    # Usage guide
```

---

## 4. Build System — Vite

### 4.1 Project Initialization

```bash
npm create vite@latest generic-d365-modern-shell -- --template vanilla-ts
cd generic-d365-modern-shell
npm install
```

**Note:** `vanilla-ts` template — not `react-ts`.

### 4.2 Vite Configuration

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    target: 'es2022',
    outDir: 'dist',
    rollupOptions: {
      input: resolve(__dirname, 'index.html'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
```

### 4.3 Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit",
    "lint": "eslint src --ext .ts",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

---

## 5. Data Layer — Local SQLite

### 5.1 Why SQLite?

- **No server required** — runs entirely in the browser or Node
- **Single file database** — portable, backupable
- **SQL standard** — familiar, powerful queries
- **Zero network** — all data is local

### 5.2 Implementation: sql.js

[sql.js](https://github.com/sql-js/sql.js) compiles SQLite to WebAssembly, enabling SQLite in the browser with no server.

```bash
npm install sql.js
```

This is the **only runtime dependency** beyond Vite.

### 5.3 Database Schema (v1)

```sql
-- Metadata store
CREATE TABLE IF NOT EXISTS tools (
  id          TEXT PRIMARY KEY,
  label       TEXT NOT NULL,
  path        TEXT NOT NULL UNIQUE,
  icon        TEXT,
  sort_order  INTEGER DEFAULT 0,
  created_at  TEXT DEFAULT (datetime('now')),
  updated_at  TEXT DEFAULT (datetime('now'))
);

-- Image reference store (paths only, never blobs)
CREATE TABLE IF NOT EXISTS images (
  id          TEXT PRIMARY KEY,
  tool_id     TEXT NOT NULL,
  file_path   TEXT NOT NULL,          -- local filesystem path
  alt_text    TEXT,
  width       INTEGER,
  height      INTEGER,
  file_size   INTEGER,
  created_at  TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (tool_id) REFERENCES tools(id)
);

-- Key-value settings
CREATE TABLE IF NOT EXISTS settings (
  key         TEXT PRIMARY KEY,
  value       TEXT NOT NULL,
  updated_at  TEXT DEFAULT (datetime('now'))
);

-- Schema versioning
CREATE TABLE IF NOT EXISTS schema_version (
  version     INTEGER PRIMARY KEY,
  applied_at  TEXT DEFAULT (datetime('now'))
);
```

### 5.4 Connection Manager

```ts
// src/data/db.ts
import initSqlJs, { Database } from 'sql.js';

let db: Database | null = null;

export async function getDatabase(): Promise<Database> {
  if (db) return db;
  
  const SQL = await initSqlJs({
    locateFile: (file: string) => `https://sql.js.org/dist/${file}`,
  });
  
  // Load existing database from localStorage or create new
  const savedData = localStorage.getItem('app-db');
  if (savedData) {
    const buf = Uint8Array.from(atob(savedData), c => c.charCodeAt(0));
    db = new SQL.Database(buf);
  } else {
    db = new SQL.Database();
  }
  
  return db;
}

export function saveDatabase(): void {
  if (!db) return;
  const data = db.export();
  const base64 = btoa(String.fromCharCode(...data));
  localStorage.setItem('app-db', base64);
}
```

### 5.5 Data Rules

- Database persisted to `localStorage` (browser) or file (Node/Electron future)
- All queries are typed — no raw string SQL without type wrappers
- Migrations run on app startup, are idempotent
- Image file paths stored as strings — never binary data in DB
- `saveDatabase()` called after every write operation

---

## 6. Image Handling — Local Only

### 6.1 Core Rule

**Images are never uploaded anywhere.** They remain on the local filesystem.

### 6.2 How It Works

```
User selects image → File picker returns local path
                   → Path stored in SQLite `images.file_path`
                   → <img src="file:///..."> renders from local disk
                   → No copy, no upload, no encoding
```

### 6.3 Image Reference Pattern

```ts
// Store reference
function addImageRef(toolId: string, filePath: string, alt: string): void {
  db.run(
    `INSERT INTO images (id, tool_id, file_path, alt_text) VALUES (?, ?, ?, ?)`,
    [crypto.randomUUID(), toolId, filePath, alt]
  );
  saveDatabase();
}

// Render reference
function renderImage(filePath: string, alt: string): string {
  return `<img src="${filePath}" alt="${alt}" loading="lazy" />`;
}
```

### 6.4 What's NOT Allowed

| Action                | Status |
|-----------------------|--------|
| Upload to cloud       | ❌     |
| Encode as Base64      | ❌     |
| Store blob in SQLite  | ❌     |
| Copy to app directory | ❌ (v1)|
| CDN / external URL    | ❌     |
| Reference local path  | ✅     |

---

## 7. UI Implementation — Vanilla HTML/CSS/JS

### 7.1 Component Pattern

Components are ES modules that return DOM elements:

```ts
// src/components/app-card.ts
export interface AppCardProps {
  title: string;
  content: string;
  actions?: HTMLElement[];
}

export function createAppCard(props: AppCardProps): HTMLElement {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <h3>${props.title}</h3>
    <p>${props.content}</p>
  `;
  
  if (props.actions) {
    const group = document.createElement('div');
    group.className = 'button-group';
    props.actions.forEach(a => group.appendChild(a));
    card.appendChild(group);
  }
  
  return card;
}
```

### 7.2 Page Pattern

Each tool page is a module with a `render()` function:

```ts
// src/tools/dashboard/index.ts
export function render(container: HTMLElement): void {
  container.innerHTML = '';
  
  const header = createSectionHeader({ title: 'Dashboard' });
  const stats = createStatCards(getStats());
  const grid = createDataGrid(getRecentActivity());
  
  container.append(header, stats, grid);
}

export function destroy(): void {
  // Cleanup event listeners, intervals, etc.
}
```

### 7.3 Event Delegation

Use event delegation at the shell level, not per-element listeners:

```ts
document.querySelector('.content-area')?.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  
  if (target.matches('[data-action="refresh"]')) {
    handleRefresh();
  }
  if (target.matches('[data-action="delete"]')) {
    handleDelete(target.dataset.id);
  }
});
```

---

## 8. Theming Strategy

### 8.1 CSS Custom Properties (Not JavaScript)

The entire theme system runs through CSS custom properties. No JavaScript theme objects.

```css
/* src/theme/circuit-tokens.css */
:root {
  --brand-primary: #0078D4;
  --brand-secondary: #106EBE;
  --platform-green: #107C10;
  --signal-red: #D13438;
  --accent-cyan: #00B7C3;
  --accent-gold: #FFB900;
}

/* src/theme/dark.css */
body.dark-mode {
  --bg-layer1: #141414;
  --bg-layer2: #1E1E1E;
  --bg-layer3: #292929;
  --fg1: #FFFFFF;
  --fg2: #C8C8C8;
  --stroke: #3D3D3D;
}

/* src/theme/light.css */
body.light-mode {
  --bg-layer1: #FFFFFF;
  --bg-layer2: #F5F5F5;
  --bg-layer3: #EBEBEB;
  --fg1: #242424;
  --fg2: #605E5C;
  --stroke: #D1D1D1;
}
```

### 8.2 Theme Switcher

```ts
// src/theme/theme-switcher.ts
export function toggleTheme(): void {
  const isDark = document.body.classList.toggle('dark-mode');
  document.body.classList.toggle('light-mode', !isDark);
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

export function initTheme(): void {
  const saved = localStorage.getItem('theme') || 'dark';
  document.body.classList.add(saved === 'dark' ? 'dark-mode' : 'light-mode');
}
```

Zero JavaScript objects. Zero re-renders. Instant theme switch.

---

## 9. Routing & Navigation

### 9.1 Hash Router (No Library)

```ts
// src/app/router.ts
type RouteHandler = (container: HTMLElement) => void;
type CleanupFn = () => void;

const routes = new Map<string, RouteHandler>();
let currentCleanup: CleanupFn | null = null;

export function registerRoute(path: string, handler: RouteHandler): void {
  routes.set(path, handler);
}

export function navigate(path: string): void {
  window.location.hash = path;
}

function handleRoute(): void {
  const path = window.location.hash.slice(1) || '/';
  const handler = routes.get(path);
  const container = document.getElementById('contentArea');
  
  if (!container || !handler) return;
  
  // Cleanup previous page
  if (currentCleanup) currentCleanup();
  
  // Render new page
  handler(container);
}

window.addEventListener('hashchange', handleRoute);
window.addEventListener('DOMContentLoaded', handleRoute);
```

### 9.2 Lazy Loading Tools

```ts
// src/app/nav-config.ts
export const navItems = [
  {
    label: 'Dashboard',
    path: '/',
    icon: 'home',
    load: () => import('../tools/dashboard/index'),
  },
  {
    label: 'Sample Tool',
    path: '/sample',
    icon: 'grid',
    load: () => import('../tools/sample-tool/index'),
  },
];
```

Dynamic `import()` gives us code splitting for free via Vite.

---

## 10. Development Workflow

### 10.1 Daily Flow

```bash
npm run dev          # Start Vite dev server (port 3000)
# Edit files → instant HMR
npm run typecheck     # Verify types
npm run test          # Run tests
npm run build         # Production build
```

### 10.2 Adding a New Tool

1. Create `src/tools/my-tool/index.ts`
2. Export `render(container)` and `destroy()`
3. Add entry to `src/app/nav-config.ts`
4. Done — no other files need editing

### 10.3 Database Changes

1. Add migration to `src/data/migrations.ts`
2. Increment schema version
3. Migrations run automatically on next app load

---

## 11. Dependency Inventory

### Production Dependencies (Target: 1)

| Package  | Version | Size (gzip) | Purpose            | Alternative Considered |
|----------|---------|-------------|--------------------|-----------------------|
| sql.js   | 1.x     | ~400KB wasm | Local SQLite in browser | IndexedDB (less powerful) |

### Development Dependencies

| Package    | Purpose                  |
|------------|--------------------------|
| vite       | Build tool + dev server  |
| typescript | Type checking            |
| vitest     | Unit testing             |
| eslint     | Code linting             |
| playwright | Integration testing      |

**Total production runtime dependencies: 1**

---

## 12. Migration Path from Demo

The existing `demo.html` is the **visual blueprint**. The migration to TypeScript + Vite preserves everything:

| demo.html Feature        | Plan Implementation                            |
|--------------------------|------------------------------------------------|
| CSS custom properties    | → `src/theme/*.css` (same tokens)              |
| Inline `<style>`         | → Separate CSS files loaded by Vite            |
| Inline `<script>`        | → TypeScript modules with type safety          |
| `toggleTheme()`          | → `src/theme/theme-switcher.ts`                |
| `toggleNav()`            | → `src/layout/side-nav.ts`                     |
| `showPage()`             | → `src/app/router.ts` (hash-based)             |
| Dashboard HTML           | → `src/tools/dashboard/` module                |
| Sample Tool HTML         | → `src/tools/sample-tool/` module              |
| localStorage theme       | → Same pattern, same keys                      |
| SVG icons inline         | → Same inline SVGs, extracted to functions      |

**No visual regression.** The Vite build adds: TypeScript, modules, code splitting, SQLite — while keeping the same UI.

---

*End of Plan — Generic D365 Modern Shell v1.0.0*
