{
  "system": {
    "name": "Generic Tool Portfolio",
    "version": "3.0.0",
    "status": "PRODUCTION",
    "type": "static-spa"
  },
  "purpose": {
    "summary": "Vanilla HTML/CSS/JS portfolio application presenting tools, utilities, and publications in a Dynamics 365–styled shell. Zero dependencies, hash-based SPA routing, 3 CSS themes (Circuit Dark, Circuit Light, D365), localStorage persistence, GitHub API integration for repo discovery and auto-import."
  },
  "architecture": {
    "language": "JavaScript (ES Modules)",
    "markup": "HTML5",
    "styling": "CSS3 + Custom Properties",
    "framework": "None",
    "buildTool": "None",
    "dataLayer": "JSON file + localStorage",
    "routing": "Hash-based SPA router (router.js)",
    "hosting": "GitHub Pages (static)",
    "devServer": "python -m http.server 8080",
    "dependencies": 0
  },
  "registry": {
    "indexUrl": "https://github.com/bradlaw76/SpeckKit-Project-Development/blob/main/system-manifests/MANIFEST_INDEX.json.md",
    "projectId": "generic-tool-portfolio"
  },
  "review": {
    "speckitEnabled": true,
    "scope": ["spec", "code-standards"]
  },
  "codeStandards": {
    "source": "SpeckKit-Project-Development",
    "catalogUrl": "https://raw.githubusercontent.com/bradlaw76/SpeckKit-Project-Development/main/code-standards/CODE_STANDARDS_CATALOG.json.md",
    "standards": [
      {
        "id": "component-header-block",
        "url": "https://raw.githubusercontent.com/bradlaw76/SpeckKit-Project-Development/main/code-standards/comments/component-header-block.md",
        "localPath": ".speckkit-registry/code-standards/comments/component-header-block.md",
        "defaultApply": true
      }
    ]
  },
  "uiReferences": {
    "source": "SpeckKit-Project-Development",
    "catalogUrl": "https://raw.githubusercontent.com/bradlaw76/SpeckKit-Project-Development/main/ui-references/UI_REFERENCE_CATALOG.json.md",
    "references": [
      {
        "id": "dynamics365-contact-center-cases-grid",
        "url": "https://raw.githubusercontent.com/bradlaw76/SpeckKit-Project-Development/main/ui-references/dynamics365/ui/contact-center-cases-grid.jsonc",
        "localPath": ".speckkit-registry/ui-references/dynamics365/ui/contact-center-cases-grid.jsonc",
        "defaultApply": false
      }
    ]
  },
  "specDocuments": {
    "readme": "README.md",
    "plan": "PLAN.md",
    "constitution": "CONSTITUTION.md",
    "specKit": "SPEC-KIT.md",
    "tasks": "TASKS.md",
    "projectIndex": "PROJECT-INDEX.md",
    "manifest": "SYSTEM_MANIFEST.json.md"
  }
}
