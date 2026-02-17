# Generic — Tool Portfolio

A Dynamics 365-styled portfolio showcase built with **vanilla HTML, CSS & JavaScript** — zero dependencies, zero build step.

![License](https://img.shields.io/badge/license-MIT-blue)
![Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)
![Platform](https://img.shields.io/badge/platform-GitHub%20Pages-orange)

---

## Overview

Generic is a single-page application that presents a curated portfolio of tools, utilities, and publications in a shell that mirrors the **Dynamics 365 Modern UI**. Every tool entry is data-driven — loaded from `data/tools.json` and localStorage — and the entire app runs directly in the browser with no server-side logic.

### Key Features

- **D365 Modern Shell** — TopBar, collapsible SideNav, themed content area
- **3 Themes** — Circuit Dark, Circuit Light, Dynamics 365 (CSS custom properties)
- **Metrics Dashboard** — stat cards, category breakdown, priority distribution, public/private donut chart
- **Settings Page** — tool management grid with inline editing, add-new-tool form, GitHub repository sync
- **GitHub Integration** — polls `bradlaw76` repos, supports optional PAT for private repos, auto-import to portfolio
- **Tool Detail Pages** — full metadata display, inline edit panel, screenshot upload (Add Files + drag-and-drop)
- **SpeckKit Presentation** — 20-slide interactive methodology overview
- **VS Code & How I Build** — development environment showcase

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Language | JavaScript (ES Modules) |
| Markup | HTML5 |
| Styling | CSS3 with custom properties |
| Framework | None |
| Build Tool | None |
| Dependencies | **Zero** |
| Data Layer | `data/tools.json` + `localStorage` |
| Routing | Hash-based SPA router |
| Dev Server | Python `http.server` (port 8080) |
| Production | GitHub Pages (static hosting) |

---

## Quick Start

```bash
# Clone the repo
git clone https://github.com/bradlaw76/Generic.Website.git
cd Generic.Website/Generic

# Serve locally (Python 3)
python -m http.server 8080

# Open in browser
# http://localhost:8080
```

No `npm install`. No build step. Just serve and open.

---

## Project Structure

```
Generic/
├── index.html                 # Entry point — loads CSS + shell.js (ES module)
├── data/
│   └── tools.json             # 8 tool definitions (source of truth)
├── images/
│   └── Generic.ASCII.png      # Logo (TopBar + Dashboard)
├── src/
│   ├── app/
│   │   ├── shell.js           # Main orchestrator — layout, routes, init
│   │   └── router.js          # Hash-based SPA router with params
│   ├── layout/
│   │   ├── top-bar.js         # Logo, title, settings gear, theme selector
│   │   ├── side-nav.js        # Collapsible nav — categories + admin
│   │   └── content-area.js    # Route target container
│   ├── pages/
│   │   ├── settings.js        # 3-tab Settings (grid, add tool, GitHub sync)
│   │   ├── tool-detail.js     # Tool detail + screenshot upload + lightbox
│   │   ├── speckkit.js        # SpeckKit overview + 20-slide presentation
│   │   ├── vscode.js          # VS Code & How I Build page
│   │   └── add-tool.js        # Legacy route (redirects to /settings)
│   ├── platform/
│   │   ├── tool-registry.js   # Data layer — CRUD + localStorage merge
│   │   ├── navigation-engine.js
│   │   └── tool-types.js      # Field definitions & schemas
│   ├── shared/
│   │   ├── icons.js           # 18 inline SVG icon functions
│   │   └── components/        # Shared UI components
│   ├── styles/
│   │   ├── reset.css          # CSS reset
│   │   ├── themes.css         # 3 theme definitions (dark, light, D365)
│   │   ├── typography.css     # Font stack & text utilities
│   │   ├── layout.css         # Shell grid layout
│   │   ├── components.css     # All component styles
│   │   └── presentation.css   # SpeckKit slide styles
│   ├── theme/
│   │   └── theme-switcher.js  # Theme persistence & dropdown
│   └── tools/
│       └── dashboard/
│           └── index.js       # Metrics-only dashboard with donut chart
├── speckit-presentation.html  # Standalone SpeckKit presentation
├── demo.html                  # Demo / landing page
├── CONSTITUTION.md            # Engineering principles
├── PLAN.md                    # Architecture & design decisions
├── PROJECT-INDEX.md           # File-level module index
├── SPEC-KIT.md                # Full specification document
├── TASKS.md                   # Feature completion checklist
└── SYSTEM_MANIFEST.json.md    # Machine-readable project manifest
```

---

## Routes

| Hash Route | Page | Description |
|------------|------|-------------|
| `#/` | Dashboard | Metrics cards, category breakdown, donut chart |
| `#/tools/:id` | Tool Detail | Metadata, edit, screenshot upload, lightbox |
| `#/settings` | Settings | Tool grid, add tool form, GitHub sync |
| `#/speckkit` | SpeckKit | Methodology overview + 20-slide deck |
| `#/vscode` | VS Code | Dev environment & workflow page |

---

## Data Model

Tools are defined in `data/tools.json` with the following schema:

```json
{
  "id": "string",
  "name": "string",
  "version": "string",
  "status": "Active | Inactive | Draft",
  "priority": "High | Normal | Low",
  "category": "Generic Tools | Publications | Development",
  "description": "string",
  "longDescription": "string",
  "repoUrl": "string",
  "screenshots": [],
  "tags": ["string"],
  "dateCreated": "YYYY-MM-DD",
  "lastUpdated": "YYYY-MM-DD",
  "origin": "Web | GitHub"
}
```

### localStorage Keys

| Key | Purpose |
|-----|---------|
| `generic_user_tools` | User-added tools (via Settings or auto-import) |
| `generic_tool_edits` | Edit overrides for any tool |
| `generic_disabled_tools` | Disabled tool IDs |
| `generic_screenshots_{id}` | User-uploaded screenshot data URLs per tool |
| `generic_github_pat` | GitHub Personal Access Token (optional) |
| `generic_theme` | Active theme selection |

---

## GitHub Integration

The Settings page (Tab 3) can poll GitHub for repos owned by `bradlaw76`:

- **Public mode** — `GET /users/bradlaw76/repos` (no auth)
- **Authenticated mode** — `GET /user/repos` with Bearer token (shows private repos)

Discovered repos appear in an untracked table with:
- **Generate JSON** — copies a `tools.json`-compatible entry
- **+ Add to Portfolio** — instantly imports the repo as a tool

---

## SpeckKit

This project participates in the [SpeckKit governance framework](https://github.com/bradlaw76/SpeckKit-Project-Development):
- Component header comment blocks auto-applied
- Code standards catalog referenced
- Agent behavior defaults followed

---

## License

MIT
