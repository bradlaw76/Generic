// =============================================================================
// SPECKKIT PRESENTATION — Overview + 20-slide interactive deck
// Version: 2.2.0 | Last Updated: 2026-02-16
//
// COMPONENT: SpeckKitPresentation
// DESCRIPTION: SpeckKit overview with feature cards, followed by a full slide
//              presentation embedded in the app shell. Features chapter sidebar,
//              keyboard navigation (arrow keys), slide counter, and themed
//              slides covering the SpeckKit methodology.
// ENVIRONMENT: Vanilla JS (ES Module) — GitHub Pages
// =============================================================================

import { icon } from "../shared/icons.js";

/**
 * Returns the SpeckKit overview HTML (feature grid + registry link).
 */
function overviewHTML() {
  return `
    <div class="section-header" style="margin-bottom:16px;">
      <div class="section-header-left">
        <h2 class="section-title">${icon("speckkit")} SpeckKit Project Development</h2>
        <span class="badge badge-success">Active</span>
      </div>
    </div>

    <div class="card" style="margin-bottom:16px;">
      <p style="margin-bottom:0;">
        SpeckKit is a centralized governance registry that provides code standards,
        component header templates, UI reference models, and agent behavior defaults
        for all projects in the portfolio. It enforces consistency through Git
        submodules, auto-applied code standards, and structured UI reference catalogs.
      </p>
    </div>

    <div class="sk-feature-grid" style="margin-bottom:16px;">
      <div class="sk-feature-card">
        <div class="sk-icon" style="background-color: var(--color-success);">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
        </div>
        <h3>Code Standards</h3>
        <p>Structured comment headers for every component file. Auto-applied by default — no configuration required.</p>
        <div class="sk-status" style="color: var(--color-success);">Auto-Applied</div>
      </div>
      <div class="sk-feature-card">
        <div class="sk-icon" style="background-color: var(--color-primary);">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
        </div>
        <h3>UI References</h3>
        <p>Platform-specific UI description models. Available for Dynamics 365 layouts, grids, and Copilot panels.</p>
        <div class="sk-status" style="color: var(--color-primary);">Available on Request</div>
      </div>
      <div class="sk-feature-card">
        <div class="sk-icon" style="background-color: var(--color-accent);">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6A3.6 3.6 0 1 1 12 8.4a3.6 3.6 0 0 1 0 7.2z"/></svg>
        </div>
        <h3>Agent Behavior</h3>
        <p>Configurable defaults for AI coding assistants. Defines auto-apply vs. ask-first behavior for all resources.</p>
        <div class="sk-status" style="color: var(--color-accent);">Configured</div>
      </div>
    </div>

    <div class="card" style="margin-bottom:24px;">
      <h3>Registry</h3>
      <p style="margin-bottom:12px;">All projects in the portfolio reference SpeckKit for engineering standards, component documentation, and UI patterns.</p>
      <div class="button-group">
        <a href="https://github.com/bradlaw76/SpeckKit-Project-Development" target="_blank" rel="noopener noreferrer"
           class="button button-primary button-sm" style="text-decoration:none;">
          ${icon("openInNew")} View Registry
        </a>
        <a href="speckit-presentation.html" target="_blank" rel="noopener noreferrer"
           class="button button-outline button-sm" style="text-decoration:none;">
          ${icon("openInNew")} Open Fullscreen Presentation
        </a>
      </div>
    </div>
  `;
}

/**
 * Chapter definitions: label + slide indices.
 * @type {{ label: string, slides: number[] }[]}
 */
const CHAPTERS = [
  { label: "Introduction",                 slides: [0, 1, 2, 3] },
  { label: "Architecture & Components",    slides: [4, 5, 6, 7] },
  { label: "The Workflow",                 slides: [8, 9, 10] },
  { label: "Real-World Benefits",          slides: [11, 12, 13] },
  { label: "Limitations & Considerations", slides: [14, 15, 16] },
  { label: "Effective Usage Tips",          slides: [17, 18] },
  { label: "Wrap-up",                      slides: [19] },
];

/**
 * Returns the HTML for every slide.
 */
function slidesHTML() {
  return `

<!-- Slide 1 — Title -->
<div class="pres-slide active" data-chapter="0">
  <div class="pres-slide-content">
    <h1>GitHub Spec Kit</h1>
    <div class="pres-subtitle">Accelerating Spec-Driven Development with AI</div>
    <p class="pres-tagline">"Intent is the new source of truth"</p>
  </div>
</div>

<!-- Slide 2 — The Problem -->
<div class="pres-slide" data-chapter="0">
  <div class="pres-slide-content">
    <h2>The Problem</h2>
    <div class="pres-split">
      <div class="pres-panel">
        <h3>&#10060; Traditional AI Coding</h3>
        <p>Context lost in chat threads</p>
        <p>Unclear requirements</p>
        <p>Misaligned code generation</p>
        <p>Repeated rework</p>
      </div>
      <div class="pres-panel good">
        <h3>&#10003; Spec-Driven Approach</h3>
        <p>Structured specifications</p>
        <p>Clear requirements upfront</p>
        <p>AI generates aligned code</p>
        <p>Reduced iteration cycles</p>
      </div>
    </div>
  </div>
</div>

<!-- Slide 3 — What is Spec Kit? -->
<div class="pres-slide" data-chapter="0">
  <div class="pres-slide-content">
    <h2>What is Spec Kit?</h2>
    <p class="pres-text">Open-source toolkit that makes specifications <span class="pres-highlight">"executable"</span> for AI code generation</p>
    <div class="pres-workflow">
      <div class="pres-wf-step">
        <div class="pres-wf-circle">&#128221;</div>
        <div class="pres-wf-label">Write Spec</div>
      </div>
      <div class="pres-arrow">&rarr;</div>
      <div class="pres-wf-step">
        <div class="pres-wf-circle">&#129302;</div>
        <div class="pres-wf-label">AI Generates</div>
      </div>
      <div class="pres-arrow">&rarr;</div>
      <div class="pres-wf-step">
        <div class="pres-wf-circle">&#128187;</div>
        <div class="pres-wf-label">Quality Code</div>
      </div>
    </div>
    <p class="pres-text" style="margin-top:32px;">Experimental GitHub project designed for AI-assisted coding</p>
  </div>
</div>

<!-- Slide 4 — Core Philosophy -->
<div class="pres-slide" data-chapter="0">
  <div class="pres-slide-content">
    <h2>Core Philosophy</h2>
    <div class="pres-quote">
      <p>"Intent is the new source of truth"</p>
    </div>
    <div style="display:flex;gap:16px;justify-content:center;margin-top:40px;flex-wrap:wrap;">
      <span class="pres-badge">WHAT to build</span>
      <span class="pres-badge">WHY it matters</span>
      <span class="pres-badge">HOW to implement</span>
    </div>
    <p class="pres-text" style="margin-top:40px;text-align:center;">Define the "What" and "Why" before the "How"</p>
  </div>
</div>

<!-- Slide 5 — Five Key Artifacts -->
<div class="pres-slide" data-chapter="1">
  <div class="pres-slide-content">
    <h2>Five Key Artifacts</h2>
    <div class="pres-artifacts">
      <div class="pres-artifact">
        <div class="pres-artifact-icon">&#127963;&#65039;</div>
        <div><h4>constitution.md</h4><p>Project playbook: rules, constraints, standards</p></div>
      </div>
      <div class="pres-artifact">
        <div class="pres-artifact-icon">&#128203;</div>
        <div><h4>spec.md</h4><p>Functional specification: requirements, user stories, acceptance criteria</p></div>
      </div>
      <div class="pres-artifact">
        <div class="pres-artifact-icon">&#127959;&#65039;</div>
        <div><h4>plan.md</h4><p>Technical design: architecture, tech stack, module breakdown</p></div>
      </div>
      <div class="pres-artifact">
        <div class="pres-artifact-icon">&#9989;</div>
        <div><h4>tasks.md</h4><p>Implementation breakdown: step-by-step tasks with dependencies</p></div>
      </div>
      <div class="pres-artifact">
        <div class="pres-artifact-icon">&#128187;</div>
        <div><h4>Code</h4><p>Generated implementation aligned with all specifications</p></div>
      </div>
    </div>
  </div>
</div>

<!-- Slide 6 — Constitution -->
<div class="pres-slide" data-chapter="1">
  <div class="pres-slide-content">
    <h2>constitution.md</h2>
    <p class="pres-text">The project's immutable engineering playbook</p>
    <div class="pres-pill"><h4>Global Context</h4><p>Coding standards, naming conventions, tech stack preferences</p></div>
    <div class="pres-pill"><h4>Reusable Rules</h4><p>Security constraints, compliance requirements, forbidden frameworks</p></div>
    <div class="pres-pill"><h4>AI Guardrails</h4><p>Ensures AI respects project principles across all features</p></div>
  </div>
</div>

<!-- Slide 7 — The Progression -->
<div class="pres-slide" data-chapter="1">
  <div class="pres-slide-content">
    <h2>The Progression</h2>
    <div class="pres-progression">
      <div class="pres-prog-row">
        <div class="pres-wf-circle">&#128203;<br>Spec</div>
        <div class="pres-prog-info">
          <h4>What &amp; Why</h4>
          <p>Requirements, user stories, acceptance criteria</p>
        </div>
      </div>
      <div class="pres-prog-arrow">&darr;</div>
      <div class="pres-prog-row">
        <div class="pres-wf-circle">&#127959;&#65039;<br>Plan</div>
        <div class="pres-prog-info">
          <h4>How</h4>
          <p>Architecture decisions, design patterns, data models</p>
        </div>
      </div>
      <div class="pres-prog-arrow">&darr;</div>
      <div class="pres-prog-row">
        <div class="pres-wf-circle">&#9989;<br>Tasks</div>
        <div class="pres-prog-info">
          <h4>Steps</h4>
          <p>Granular implementation roadmap with testable units</p>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Slide 8 — Supporting Files -->
<div class="pres-slide" data-chapter="1">
  <div class="pres-slide-content">
    <h2>Supporting Files</h2>
    <ul class="pres-bullets">
      <li>Agent-specific prompts (AGENTS.md) for different AI tools</li>
      <li>Memory files for persistent context across sessions</li>
      <li>Quality check scripts and test harnesses</li>
    </ul>
    <p class="pres-text" style="margin-top:32px;">Integrates with <span class="pres-highlight">Model-Context-Protocol</span> (MCP) for standardized AI interactions</p>
  </div>
</div>

<!-- Slide 9 — The Five Commands -->
<div class="pres-slide" data-chapter="2">
  <div class="pres-slide-content">
    <h2>The Five Commands</h2>
    <div class="pres-cmd-grid">
      <div class="pres-wf-step"><div class="pres-wf-circle">/constitution</div><div class="pres-wf-label">Set rules</div></div>
      <div class="pres-wf-step"><div class="pres-wf-circle">/specify</div><div class="pres-wf-label">Define requirements</div></div>
      <div class="pres-wf-step"><div class="pres-wf-circle">/plan</div><div class="pres-wf-label">Design architecture</div></div>
      <div class="pres-wf-step"><div class="pres-wf-circle">/tasks</div><div class="pres-wf-label">Break down work</div></div>
      <div class="pres-wf-step"><div class="pres-wf-circle">/implement</div><div class="pres-wf-label">Generate code</div></div>
    </div>
    <p class="pres-text" style="margin-top:40px;text-align:center;">Plus: <span class="pres-highlight">/clarify</span> to refine specs, <span class="pres-highlight">/analyze</span> to validate consistency</p>
  </div>
</div>

<!-- Slide 10 — Example Flow -->
<div class="pres-slide" data-chapter="2">
  <div class="pres-slide-content">
    <h2>Example: Profile Picture Upload</h2>
    <div class="pres-pill"><h4>1. Specify</h4><p>"Users can upload avatar image (JPEG/PNG, &le;5MB) with preview and error handling"</p></div>
    <div class="pres-pill"><h4>2. Plan</h4><p>React component + Express API + AWS S3 pre-signed URLs for direct upload</p></div>
    <div class="pres-pill"><h4>3. Tasks</h4><p>Add avatarUrl field, create API endpoint, build upload component, write tests</p></div>
    <div class="pres-pill"><h4>4. Implement</h4><p>AI generates code for each task, developer reviews and verifies</p></div>
  </div>
</div>

<!-- Slide 11 — VS Code Integration -->
<div class="pres-slide" data-chapter="2">
  <div class="pres-slide-content">
    <h2>VS Code Integration</h2>
    <p class="pres-text">Works with your favorite AI assistant</p>
    <div style="display:flex;gap:16px;justify-content:center;margin:32px 0;flex-wrap:wrap;">
      <span class="pres-badge">GitHub Copilot</span>
      <span class="pres-badge">Claude Code</span>
      <span class="pres-badge">OpenAI GPT</span>
      <span class="pres-badge">Google Gemini</span>
    </div>
    <div class="pres-pill" style="margin-top:32px;"><h4>Slash Commands in Chat</h4><p>Type /speckit.specify in your AI interface to trigger the workflow</p></div>
    <div class="pres-pill"><h4>SpecKit Companion Extension</h4><p>Enhanced UX for managing specs directly in VS Code</p></div>
  </div>
</div>

<!-- Slide 12 — Speed & Quality -->
<div class="pres-slide" data-chapter="3">
  <div class="pres-slide-content">
    <h2>Speed &amp; Quality</h2>
    <div style="text-align:center;">
      <div class="pres-big-number">60 &rarr; 20</div>
      <p class="pres-text">Months of development time (automotive case study)</p>
    </div>
    <div class="pres-grid cols-3" style="margin-top:40px;">
      <div class="pres-grid-item"><h4>Faster Development</h4><p>Structured workflow reduces rework cycles</p></div>
      <div class="pres-grid-item"><h4>Better Alignment</h4><p>Code matches requirements by design</p></div>
      <div class="pres-grid-item"><h4>Reduced Rework</h4><p>Clear specs prevent misunderstandings</p></div>
    </div>
  </div>
</div>

<!-- Slide 13 — Use Cases -->
<div class="pres-slide" data-chapter="3">
  <div class="pres-slide-content">
    <h2>Use Cases</h2>
    <div class="pres-grid">
      <div class="pres-grid-item"><h4>&#128640; Greenfield Projects</h4><p>Start new applications with clear architecture and aligned code from day one</p></div>
      <div class="pres-grid-item"><h4>&#128295; Complex Features</h4><p>Add sophisticated functionality to existing systems with confidence</p></div>
      <div class="pres-grid-item"><h4>&#9851;&#65039; Legacy Modernization</h4><p>Capture intended behavior and regenerate without technical debt</p></div>
      <div class="pres-grid-item"><h4>&#10003; Compliance Workflows</h4><p>Ensure security and privacy requirements are captured upfront</p></div>
    </div>
  </div>
</div>

<!-- Slide 14 — Team Alignment -->
<div class="pres-slide" data-chapter="3">
  <div class="pres-slide-content">
    <h2>Team Alignment</h2>
    <ul class="pres-bullets">
      <li>Specs serve as <span class="pres-highlight">communication tool</span> between developers, PMs, and QA</li>
      <li><span class="pres-highlight">Knowledge retention</span> &mdash; decisions persist in repository, not lost in chat</li>
      <li><span class="pres-highlight">Cross-functional review</span> &mdash; validate requirements before coding begins</li>
    </ul>
    <div class="pres-quote" style="margin-top:32px;">
      <p>Your role isn't just to steer. It's to verify.</p>
      <cite>&mdash; GitHub Blog on Spec-Driven Development</cite>
    </div>
  </div>
</div>

<!-- Slide 15 — Know the Limits -->
<div class="pres-slide" data-chapter="4">
  <div class="pres-slide-content">
    <h2>Know the Limits</h2>
    <div class="pres-warning red">
      <h4>&#9888;&#65039; Experimental &amp; Evolving</h4>
      <p>Launched mid-2025, actively developed with frequent updates and potential breaking changes</p>
    </div>
    <div class="pres-pill"><h4>Learning Curve</h4><p>Requires strong writing and systems design skills &mdash; quality specs need practice</p></div>
    <div class="pres-pill"><h4>Overhead for Small Projects</h4><p>Simple bug fixes or scripts don't justify the multi-phase structure</p></div>
  </div>
</div>

<!-- Slide 16 — Not a Silver Bullet -->
<div class="pres-slide" data-chapter="4">
  <div class="pres-slide-content">
    <h2>Not a Silver Bullet</h2>
    <div class="pres-split">
      <div class="pres-panel good">
        <h3>&#10003; When It Excels</h3>
        <p>Substantial features</p>
        <p>New components</p>
        <p>Complex integrations</p>
        <p>Well-defined requirements</p>
      </div>
      <div class="pres-panel">
        <h3>&#10060; Watch Out For</h3>
        <p>Context length limits</p>
        <p>Quality depends on spec quality</p>
        <p>AI can still generate errors</p>
        <p>Requires diligent verification</p>
      </div>
    </div>
  </div>
</div>

<!-- Slide 17 — Comparison -->
<div class="pres-slide" data-chapter="4">
  <div class="pres-slide-content">
    <h2>Comparison to Alternatives</h2>
    <table class="pres-table">
      <tr><th>Tool</th><th>Approach</th><th>Key Difference</th></tr>
      <tr><td><strong>Spec Kit</strong></td><td>Comprehensive, verbose</td><td>8 commands, thousands of lines, GitHub integration</td></tr>
      <tr><td><strong>OpenSpec</strong></td><td>Lightweight, concise</td><td>3 commands, hundreds of lines, TypeScript-based</td></tr>
      <tr><td><strong>Kiro</strong></td><td>Simple, free-form</td><td>3-step workflow, memory-based guidance</td></tr>
      <tr><td><strong>Tessl</strong></td><td>Ambitious, spec-as-source</td><td>Private beta, spec-code round-tripping</td></tr>
    </table>
  </div>
</div>

<!-- Slide 18 — Best Practices -->
<div class="pres-slide" data-chapter="5">
  <div class="pres-slide-content">
    <h2>Best Practices</h2>
    <div class="pres-pill"><h4>&#128161; Invest in the Spec</h4><p>Code quality = spec quality. Allocate time to thoroughly write requirements.</p></div>
    <div class="pres-pill"><h4>&#127963;&#65039; Use Constitution Wisely</h4><p>Capture project-wide principles once, apply everywhere automatically.</p></div>
    <div class="pres-pill"><h4>&#9989; Don't Skip Verification</h4><p>Review AI-generated code like any team member's work. Run tests, verify acceptance criteria.</p></div>
  </div>
</div>

<!-- Slide 19 — Common Pitfalls -->
<div class="pres-slide" data-chapter="5">
  <div class="pres-slide-content">
    <h2>Common Pitfalls</h2>
    <div class="pres-warning red">
      <h4>&#10060; Treating as Magic</h4>
      <p>Not a "push-button and forget" solution &mdash; engineering judgment still required</p>
    </div>
    <div class="pres-warning amber">
      <h4>&#9888;&#65039; Overly Broad Specs</h4>
      <p>Break large projects into focused specs &mdash; one per major feature or epic</p>
    </div>
    <div class="pres-warning teal">
      <h4>&#128173; Ignoring AI Limits</h4>
      <p>LLMs can hallucinate &mdash; use task breakdown to isolate and fix issues incrementally</p>
    </div>
  </div>
</div>

<!-- Slide 20 — What to Do Monday -->
<div class="pres-slide" data-chapter="6">
  <div class="pres-slide-content">
    <h2>What to Do Monday Morning</h2>
    <div class="pres-roadmap">
      <div class="pres-roadmap-step">
        <div class="pres-roadmap-number">1</div>
        <h4>Install CLI</h4>
        <p>uv tool install specify-cli --from git+...</p>
      </div>
      <div class="pres-roadmap-step">
        <div class="pres-roadmap-number">2</div>
        <h4>Initialize Project</h4>
        <p>specify init my-app --ai claude</p>
      </div>
      <div class="pres-roadmap-step">
        <div class="pres-roadmap-number">3</div>
        <h4>Start Small</h4>
        <p>Pick one feature to build spec-first</p>
      </div>
      <div class="pres-roadmap-step">
        <div class="pres-roadmap-number">4</div>
        <h4>Iterate &amp; Learn</h4>
        <p>Refine your specs as you go</p>
      </div>
    </div>
    <div style="text-align:center;margin-top:48px;">
      <p class="pres-text">&#127775; <a href="https://github.com/github/spec-kit" target="_blank" rel="noopener noreferrer" style="color:#60a5fa;">github.com/github/spec-kit</a></p>
    </div>
  </div>
</div>

  `;
}

// ─────────────────────────────────────────────────────────────────────────────
// Render + Navigation Logic
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Renders the SpeckKit page: overview section + presentation deck.
 * @param {HTMLElement} container
 * @returns {() => void} cleanup function (removes keyboard listener)
 */
export function render(container) {
  // ── Overview section (scrollable with the normal content area) ──
  const overview = document.createElement("div");
  overview.className = "page-content";
  overview.innerHTML = overviewHTML();

  // Presentation toggle button
  const toggleBtn = document.createElement("button");
  toggleBtn.className = "button button-outline";
  toggleBtn.style.marginBottom = "24px";
  toggleBtn.textContent = "▶ Open Presentation Deck";
  overview.appendChild(toggleBtn);

  container.appendChild(overview);

  // ── Presentation wrapper (hidden by default) ──
  const presContainer = document.createElement("div");
  presContainer.style.display = "none";
  container.appendChild(presContainer);

  let presActive = false;

  function showPresentation() {
    presActive = true;
    overview.style.display = "none";
    presContainer.style.display = "block";
    container.style.padding = "0";
    container.style.overflow = "hidden";

    const wrapper = document.createElement("div");
    wrapper.className = "pres-wrapper";

    // ── Chapter sidebar ──
    const sidebar = document.createElement("aside");
    sidebar.className = "pres-sidebar";
    sidebar.innerHTML =
      '<div class="pres-sidebar-label">Chapters</div>' +
      '<button class="pres-chapter-btn" data-action="close" style="color:var(--color-warning);margin-bottom:8px;">← Back to Overview</button>' +
      CHAPTERS.map(
        (ch, i) =>
          `<button class="pres-chapter-btn${i === 0 ? " active" : ""}" data-chapter="${i}">${ch.label}</button>`
      ).join("");
    wrapper.appendChild(sidebar);

    // ── Stage ──
    const stage = document.createElement("div");
    stage.className = "pres-stage";

    const counter = document.createElement("div");
    counter.className = "pres-counter";
    counter.innerHTML =
      '<span id="presCurrentSlide">1</span> / <span id="presTotalSlides">20</span>';
    stage.appendChild(counter);

    const slidesEl = document.createElement("div");
    slidesEl.innerHTML = slidesHTML();
    stage.appendChild(slidesEl);

    const hint = document.createElement("div");
    hint.className = "pres-kb-hint";
    hint.textContent = "Use \u2190 \u2192 arrow keys to navigate";
    stage.appendChild(hint);

    wrapper.appendChild(stage);
    presContainer.innerHTML = "";
    presContainer.appendChild(wrapper);

    // ── Navigation state ──
    const slides = stage.querySelectorAll(".pres-slide");
    const totalSlides = slides.length;
    let current = 0;

    stage.querySelector("#presTotalSlides").textContent = totalSlides;

    function show(index) {
      if (index < 0 || index >= totalSlides) return;
      slides[current].classList.remove("active");
      current = index;
      slides[current].classList.add("active");
      stage.querySelector("#presCurrentSlide").textContent = current + 1;
      const chapterIdx = slides[current].dataset.chapter;
      sidebar.querySelectorAll(".pres-chapter-btn[data-chapter]").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.chapter === chapterIdx);
      });
    }

    // Chapter clicks
    sidebar.querySelectorAll(".pres-chapter-btn[data-chapter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const ch = parseInt(btn.dataset.chapter, 10);
        show(CHAPTERS[ch].slides[0]);
      });
    });

    // Back-to-overview button in sidebar
    sidebar.querySelector('[data-action="close"]').addEventListener("click", hidePresentation);

    // Keyboard
    onKeyRef = function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); show(current + 1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); show(current - 1); }
      else if (e.key === "Home") { e.preventDefault(); show(0); }
      else if (e.key === "End") { e.preventDefault(); show(totalSlides - 1); }
      else if (e.key === "Escape") { e.preventDefault(); hidePresentation(); }
    };
    document.addEventListener("keydown", onKeyRef);
  }

  function hidePresentation() {
    presActive = false;
    overview.style.display = "";
    presContainer.style.display = "none";
    presContainer.innerHTML = "";
    container.style.padding = "";
    container.style.overflow = "";
    if (onKeyRef) {
      document.removeEventListener("keydown", onKeyRef);
      onKeyRef = null;
    }
  }

  let onKeyRef = null;

  toggleBtn.addEventListener("click", showPresentation);

  // Return cleanup
  return () => {
    if (onKeyRef) document.removeEventListener("keydown", onKeyRef);
    container.style.padding = "";
    container.style.overflow = "";
  };
}
