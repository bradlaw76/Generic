# Copilot Instructions

## SpeckKit Integration

This project is governed by the SpeckKit registry.

**Registry:** https://github.com/bradlaw76/SpeckKit-Project-Development
**Agent Defaults:** https://raw.githubusercontent.com/bradlaw76/SpeckKit-Project-Development/main/AGENT_BEHAVIOR_DEFAULTS.jsonc
**Local Submodule:** `.speckkit-registry/`

---

## Code Standards (Auto-Apply — DEFAULT YES)

When creating or modifying component files, ALWAYS apply the component header
comment block. Do NOT skip unless the user explicitly says to omit comments.

**Template:** https://raw.githubusercontent.com/bradlaw76/SpeckKit-Project-Development/main/code-standards/comments/component-header-block.md
**Catalog:** https://raw.githubusercontent.com/bradlaw76/SpeckKit-Project-Development/main/code-standards/CODE_STANDARDS_CATALOG.json.md
**Local:** `.speckkit-registry/code-standards/comments/component-header-block.md`

### Rules
1. Apply the component header comment block to every new component file.
2. Update CHANGELOG, LAST UPDATED, and VERSION when modifying existing components.
3. Fill in all bracketed values based on project context.
4. Only skip if user explicitly says "no comments" or "skip header."

### Adaptation for This Project (React / TypeScript)

This project uses React + TypeScript + Fluent UI. When applying the header template:

| Power Pages Section | This Project Equivalent |
|--------------------|--------------------|
| Portal URL | `localhost:3000` / deployment URL |
| Site Setting | Environment variable / `.env` |
| Table Permission | Tool Contract (`ToolDefinition`) |
| Web Role | N/A (no auth in v1) |
| CSRF Token | N/A (no API in v1) |
| `/_api/[entity]` | N/A (local state only in v1) |
| OData | N/A |
| Liquid | JSX / React components |
| ENVIRONMENT | React 18 + Vite + TypeScript |

Use `//` or `/* */` comment syntax instead of `<!-- -->` for `.ts` / `.tsx` files.

---

## UI References (Ask First — DEFAULT ASK)

UI references are available for platform-specific context. Confirm with the
user before loading.

**Catalog:** https://raw.githubusercontent.com/bradlaw76/SpeckKit-Project-Development/main/ui-references/UI_REFERENCE_CATALOG.json.md
**Local:** `.speckkit-registry/ui-references/UI_REFERENCE_CATALOG.json.md`

### Available References

| ID | Platform | Path |
|----|----------|------|
| dynamics365-contact-center-cases-grid | Dynamics 365 | ui-references/dynamics365/ui/contact-center-cases-grid.jsonc |

### Rules
1. Ask: "Should I load UI reference context for [platform]?"
2. Only load if user confirms or the task clearly involves that platform's UI.
3. Use `reusablePatterns` for component conventions.
4. Use `visualIndicators` for color/badge mappings.

---

## Project Architecture

This is a **Generic D365 Tool Platform** — a React + Fluent UI shell hosting modular "Tool Packages."

### Key Contracts
- **ToolDefinition** — Strict interface in `src/platform/ToolTypes.ts`
- **ToolRegistry** — Central registration in `src/platform/NavigationEngine.ts`
- **Tool Contract** — Each tool exports `tool.config.ts` conforming to `ToolDefinition`

### Tool Isolation Rules
- Tools may use Fluent UI and shared utilities
- Tools may NOT modify core layout
- Tools may NOT inject global CSS
- No cross-tool imports allowed
- `src/core/` may NOT import from individual tools

### Adding a New Tool
1. Create folder under `src/tools/{tool-id}/`
2. Add `tool.config.ts` (mandatory — must conform to `ToolDefinition`)
3. Add `index.tsx` (default export component)
4. Add `routes.tsx` (optional sub-routes)
5. Import tool config into `src/platform/NavigationEngine.ts`
6. Add lazy import entry in `src/core/Router.tsx`

No nav edits. No router edits. No layout edits.

---

## Agent Behavior Summary

| Resource | Default | Action |
|----------|---------|--------|
| Code Standards (comment headers) | **YES** | Apply automatically |
| UI References (platform layouts) | **ASK** | Confirm with user |
