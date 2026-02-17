// =============================================================================
// VS CODE & HOW — Development workflow and tooling page
// Version: 2.1.0 | Last Updated: 2026-02-17
// CHANGELOG: 2.1.0 — Added embedded presentation deck + fullscreen link
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
    <div class="button-group" style="margin: 12px 0 20px;">
      <button class="button button-primary" id="vsDeckOpenBtn" aria-expanded="false" aria-controls="vsDeckWrapper" title="Open VS Code Presentation">
        ▶ Open Presentation Deck
      </button>
      <a class="button button-outline" href="vscode-presentation.html" target="_blank" rel="noopener" title="Open Fullscreen Presentation">
        ${icon("openInNew")} Open Fullscreen Presentation
      </a>
    </div>

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

  // ── Embedded Presentation Deck (SpeckKit-style) ──
  const deck = document.createElement("div");
  deck.className = "pres-wrapper";
  deck.id = "vsDeckWrapper";
  deck.style.display = "none";
  deck.innerHTML = `
    <aside class="pres-sidebar" aria-label="Presentation chapters">
      <div class="pres-sidebar-label">Chapters</div>
      <button class="pres-chapter-btn" data-target="0">Overview</button>
      <button class="pres-chapter-btn" data-target="2">Editor Setup</button>
      <button class="pres-chapter-btn" data-target="5">Workflow</button>
      <button class="pres-chapter-btn" data-target="8">Debugging</button>
      <button class="pres-chapter-btn" data-target="10">Testing</button>
      <button class="pres-chapter-btn" data-target="12">Productivity</button>
      <button class="pres-chapter-btn" data-target="14">SpeckKit Integration</button>
      <button class="pres-chapter-btn" data-target="17">Resources</button>
    </aside>
    <section class="pres-stage">
      <div class="pres-counter"><span id="vsDeckCounter"></span></div>
      <div id="vsSlides"></div>
    </section>
  `;
  container.appendChild(deck);

  const slides = [
    // 0 Overview
    `
    <div class="pres-slide">
      <div class="pres-slide-content">
        <h1>VS Code for SpeckKit</h1>
        <p class="pres-subtitle">A practical workflow using VS Code + Copilot to deliver spec-driven tools.</p>
        <p class="pres-tagline">Focus: same length and intent as the SpeckKit deck, tailored to IDE usage.</p>
      </div>
    </div>`,
    `
    <div class="pres-slide">
      <div class="pres-slide-content">
        <div class="pres-bullets">
          <li>Spec-first mindset: CONSTITUTION, SPEC-KIT, PLAN, TASKS</li>
          <li>Agent-assisted scaffolding: GitHub Copilot for structure</li>
          <li>Vanilla JS: zero dependencies, fast iteration</li>
          <li>Git discipline: small commits, descriptive messages</li>
        </div>
      </div>
    </div>`,

    // 2 Editor Setup
    `
    <div class="pres-slide">
      <div class="pres-slide-content">
        <h2>Editor Setup</h2>
        <div class="pres-grid cols-3">
          <div class="pres-grid-item"><h4>Settings Sync</h4><p>Keep fonts, themes, keybinds in sync across devices.</p></div>
          <div class="pres-grid-item"><h4>Extensions</h4><p>Copilot, ESLint, Prettier, GitLens, Live Server.</p></div>
          <div class="pres-grid-item"><h4>Workspace</h4><p>Trust folders; configure editor.formatOnSave.</p></div>
        </div>
      </div>
    </div>`,
    `
    <div class="pres-slide">
      <div class="pres-slide-content">
        <div class="pres-pill"><h4>Devcontainers (optional)</h4><p>Use for consistent tooling across machines when needed.</p></div>
        <div class="pres-pill"><h4>Tasks</h4><p>Create tasks for serve, lint, format to streamline repeatables.</p></div>
      </div>
    </div>`,

    // 5 Workflow
    `
    <div class="pres-slide">
      <div class="pres-slide-content">
        <h2>Workflow</h2>
        <div class="pres-workflow">
          <div class="pres-wf-step"><div class="pres-wf-circle">Spec</div><div class="pres-wf-label">Write docs</div></div>
          <div class="pres-arrow">→</div>
          <div class="pres-wf-step"><div class="pres-wf-circle">Scaffold</div><div class="pres-wf-label">Agent assists</div></div>
          <div class="pres-arrow">→</div>
          <div class="pres-wf-step"><div class="pres-wf-circle">Iterate</div><div class="pres-wf-label">Feature by feature</div></div>
          <div class="pres-arrow">→</div>
          <div class="pres-wf-step"><div class="pres-wf-circle">Verify</div><div class="pres-wf-label">Serve & test</div></div>
        </div>
      </div>
    </div>`,
    `
    <div class="pres-slide">
      <div class="pres-slide-content">
        <div class="pres-bullets">
          <li>Use Copilot Chat to apply diffs precisely.</li>
          <li>Prefer small, isolated changes; update CHANGELOG & version.</li>
          <li>Keep layout stable; respect tool isolation rules.</li>
        </div>
      </div>
    </div>`,

    // 8 Debugging
    `
    <div class="pres-slide">
      <div class="pres-slide-content">
        <h2>Debugging</h2>
        <div class="pres-grid">
          <div class="pres-grid-item"><h4>Breakpoints</h4><p>Set in sources; step through router handlers.</p></div>
          <div class="pres-grid-item"><h4>Network</h4><p>Inspect fetches for tools.json and cache behavior.</p></div>
        </div>
        <div class="pres-warning amber"><h4>ESM Caching</h4><p>Disable cache or add <code>?v=dev</code> to import paths during dev.</p></div>
      </div>
    </div>`,
    `
    <div class="pres-slide">
      <div class="pres-slide-content">
        <div class="pres-quote"><p>“Make it testable and observable.”</p><cite>Debugging mantra</cite></div>
      </div>
    </div>`,

    // 10 Testing
    `
    <div class="pres-slide">
      <div class="pres-slide-content">
        <h2>Testing</h2>
        <div class="pres-bullets">
          <li>Start with targeted manual checks for changed modules.</li>
          <li>Broaden to flows: navigation, edits, uploads.</li>
          <li>Use tasks.json to script repeatable checks when possible.</li>
        </div>
      </div>
    </div>`,
    `
    <div class="pres-slide">
      <div class="pres-slide-content">
        <div class="pres-grid cols-3">
          <div class="pres-grid-item"><h4>Lint</h4><p>ESLint for quality.</p></div>
          <div class="pres-grid-item"><h4>Format</h4><p>Prettier for consistency.</p></div>
          <div class="pres-grid-item"><h4>Serve</h4><p>Python http.server / Live Server.</p></div>
        </div>
      </div>
    </div>`,

    // 12 Productivity
    `
    <div class="pres-slide">
      <div class="pres-slide-content">
        <h2>Productivity</h2>
        <div class="pres-bullets">
          <li>Multi-cursor, block select, and quick rename.</li>
          <li>Snippets: component headers, card blocks, route handlers.</li>
          <li>Command Palette: navigate, diff, toggle word wrap.</li>
        </div>
      </div>
    </div>`,
    `
    <div class="pres-slide">
      <div class="pres-slide-content">
        <div class="pres-grid">
          <div class="pres-grid-item"><h4>Refactor</h4><p>Extract functions; reduce duplication.</p></div>
          <div class="pres-grid-item"><h4>Search</h4><p>Use ripgrep-like workspace search patterns.</p></div>
        </div>
      </div>
    </div>`,

    // 14 SpeckKit Integration
    `
    <div class="pres-slide">
      <div class="pres-slide-content">
        <h2>SpeckKit Integration</h2>
        <div class="pres-artifacts">
          <div class="pres-artifact"><div class="pres-artifact-icon">📘</div><div><h4>Code Standards</h4><p>Apply component headers; bump versions on changes.</p></div></div>
          <div class="pres-artifact"><div class="pres-artifact-icon">🧭</div><div><h4>Agent Defaults</h4><p>Follow tooling rules and isolation constraints.</p></div></div>
          <div class="pres-artifact"><div class="pres-artifact-icon">🔗</div><div><h4>UI References</h4><p>Optional, load when relevant to the target UI.</p></div></div>
        </div>
      </div>
    </div>`,
    `
    <div class="pres-slide">
      <div class="pres-slide-content">
        <div class="pres-split">
          <div class="pres-panel"><h3>Pitfalls</h3><p>Unbounded changes, missed cleanup, stale cache issues.</p></div>
          <div class="pres-panel good"><h3>Solutions</h3><p>Small diffs, router teardowns, cache controls, docs updates.</p></div>
        </div>
      </div>
    </div>`,

    // 17 Resources
    `
    <div class="pres-slide">
      <div class="pres-slide-content">
        <h2>Resources</h2>
        <div class="pres-bullets">
          <li>Visual Studio Code — code.visualstudio.com</li>
          <li>GitHub Copilot — github.com/features/copilot</li>
          <li>SpeckKit Registry — github.com/bradlaw76/SpeckKit-Project-Development</li>
        </div>
      </div>
    </div>`,
  ];

  const slidesHost = deck.querySelector("#vsSlides");
  slidesHost.innerHTML = slides.join("");
  const slideEls = Array.from(slidesHost.querySelectorAll(".pres-slide"));
  const counterEl = deck.querySelector("#vsDeckCounter");
  const chapterBtns = Array.from(deck.querySelectorAll(".pres-chapter-btn"));

  let idx = 0;
  function show(i) {
    idx = Math.max(0, Math.min(slideEls.length - 1, i));
    slideEls.forEach((el, j) => el.classList.toggle("active", j === idx));
    if (counterEl) counterEl.textContent = `${idx + 1} / ${slideEls.length}`;
    chapterBtns.forEach((b) => b.classList.toggle("active", parseInt(b.dataset.target, 10) === idx));
  }
  show(0);

  chapterBtns.forEach((btn) => {
    btn.addEventListener("click", () => show(parseInt(btn.dataset.target, 10)));
  });

  function keyHandler(e) {
    if (deck.style.display === "none") return;
    if (e.key === "ArrowRight") show(idx + 1);
    if (e.key === "ArrowLeft") show(idx - 1);
    if (e.key === "Escape") {
      deck.style.display = "none";
      openBtn.setAttribute("aria-expanded", "false");
    }
  }
  document.addEventListener("keydown", keyHandler);

  const openBtn = page.querySelector("#vsDeckOpenBtn");
  openBtn.addEventListener("click", () => {
    const isOpen = deck.style.display !== "none";
    deck.style.display = isOpen ? "none" : "flex";
    openBtn.setAttribute("aria-expanded", String(!isOpen));
    openBtn.textContent = isOpen ? "▶ Open Presentation Deck" : "✕ Close Presentation Deck";
    if (!isOpen) {
      show(idx); // refresh counter
      deck.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  // Provide cleanup to router
  return () => {
    document.removeEventListener("keydown", keyHandler);
    if (deck && deck.parentElement) deck.remove();
  };
}
