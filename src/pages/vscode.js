// =============================================================================
// VS CODE & HOW — Development workflow and tooling page
// Version: 2.0.0 | Last Updated: 2026-02-16
//
// COMPONENT: VSCodePage
// DESCRIPTION: Explains the VS Code-centric development workflow, extensions
//              used, and the approach behind building these tools.
// ENVIRONMENT: Vanilla JS (ES Module) — GitHub Pages
// =============================================================================

import { icon } from "../shared/icons.js";

/**
 * Renders the VS Code & How page.
 * @param {HTMLElement} container
 */
export function render(container) {
  const page = document.createElement("div");
  page.className = "page-content content-page";

  page.innerHTML = `
    <h1>${icon("vscode")} VS Code &amp; How I Build</h1>

    <div class="card">
      <h2>Development Environment</h2>
      <p>
        Every tool in this portfolio was built using
        <strong>Visual Studio Code</strong> as the primary IDE, paired with
        AI-assisted development through <strong>GitHub Copilot</strong>. The
        workflow prioritises speed, consistency, and spec-driven output.
      </p>
    </div>

    <div class="card">
      <h2>Key Extensions</h2>
      <ul>
        <li>
          <strong>GitHub Copilot</strong> — AI pair-programmer for code
          generation, refactoring, and documentation
        </li>
        <li>
          <strong>GitHub Copilot Chat</strong> — Conversational coding with
          slash commands and agent mode
        </li>
        <li>
          <strong>Live Server</strong> — Local dev server with hot-reload for
          static sites like this one
        </li>
        <li>
          <strong>ESLint</strong> — JavaScript linting for code quality
        </li>
        <li>
          <strong>Prettier</strong> — Consistent code formatting across all
          files
        </li>
        <li>
          <strong>GitLens</strong> — Enhanced Git history, blame, and diff
          views
        </li>
      </ul>
    </div>

    <div class="card">
      <h2>The Workflow</h2>
      <ol>
        <li>
          <strong>Spec First</strong> — Write the specification documents
          (CONSTITUTION, SPEC-KIT, PLAN, TASKS) before writing any code.
          This follows the <a href="#/speckkit">SpeckKit methodology</a>.
        </li>
        <li>
          <strong>Agent-Driven Scaffolding</strong> — Use Copilot Chat in
          agent mode to generate the initial project scaffold from the spec.
          The agent reads the spec files and produces code that conforms to
          the defined contracts.
        </li>
        <li>
          <strong>Iterative Refinement</strong> — Build feature-by-feature,
          validating each module against the spec. Copilot assists with
          boilerplate, edge cases, and documentation headers.
        </li>
        <li>
          <strong>Local Testing</strong> — Run a local HTTP server (Python
          or Live Server extension) to verify the application in-browser.
          No build step required for vanilla JS projects.
        </li>
        <li>
          <strong>Commit &amp; Deploy</strong> — Push to GitHub. For static
          sites, GitHub Pages handles deployment automatically.
        </li>
      </ol>
    </div>

    <div class="card">
      <h2>Why Vanilla JS?</h2>
      <p>
        This project deliberately avoids frameworks like React, Vue, or
        Angular. The reasons:
      </p>
      <ul>
        <li><strong>Zero Dependencies</strong> — No <code>node_modules</code>,
            no build step, no bundler config. Clone and open.</li>
        <li><strong>Instant Deployment</strong> — Push HTML/CSS/JS files to
            GitHub Pages. No CI pipeline needed.</li>
        <li><strong>Transparency</strong> — Every line of code is visible and
            debuggable in the browser DevTools. No compiled output to
            decipher.</li>
        <li><strong>Longevity</strong> — Vanilla JS doesn't go out of style.
            No framework version upgrades to manage.</li>
      </ul>
    </div>

    <div class="card">
      <h2>Project Structure</h2>
      <pre><code>Generic/
├── index.html              Entry point
├── data/
│   └── tools.json          Tool portfolio data (single source of truth)
├── src/
│   ├── app/
│   │   ├── shell.js        Main orchestrator
│   │   └── router.js       Hash-based SPA router
│   ├── platform/
│   │   ├── tool-types.js   JSDoc type definitions
│   │   ├── tool-registry.js  Data loader (fetches tools.json)
│   │   └── navigation-engine.js  Groups tools for nav
│   ├── layout/
│   │   ├── top-bar.js      Header bar
│   │   ├── side-nav.js     Left navigation (data-driven)
│   │   └── content-area.js Content container
│   ├── theme/
│   │   └── theme-switcher.js  3-theme system
│   ├── shared/
│   │   ├── icons.js        SVG icon registry
│   │   └── components/     Reusable UI components
│   ├── tools/
│   │   └── dashboard/      Landing page (D365 grid)
│   ├── pages/
│   │   ├── tool-detail.js  Individual tool detail page
│   │   ├── add-tool.js     Add New Tool form
│   │   ├── speckkit.js     SpeckKit methodology
│   │   └── vscode.js       VS Code & How I Build
│   └── styles/             CSS modules
└── .speckkit-registry/     SpeckKit submodule</code></pre>
    </div>

    <div class="card">
      <h2>Links</h2>
      <ul>
        <li>
          <a href="https://code.visualstudio.com/" target="_blank"
             rel="noopener noreferrer">
            ${icon("link")} Visual Studio Code
          </a>
        </li>
        <li>
          <a href="https://github.com/features/copilot" target="_blank"
             rel="noopener noreferrer">
            ${icon("link")} GitHub Copilot
          </a>
        </li>
        <li>
          <a href="https://github.com/bradlaw76" target="_blank"
             rel="noopener noreferrer">
            ${icon("link")} My GitHub Profile
          </a>
        </li>
      </ul>
    </div>
  `;

  container.appendChild(page);
}
