// =============================================================================
// TOOL TYPES — Data model for portfolio tool entries (JSDoc typed)
// Version: 2.0.0 | Last Updated: 2026-02-16
//
// Each entry in data/tools.json conforms to this shape.
// =============================================================================

/**
 * @typedef {Object} ToolEntry
 * @property {string} id            - Unique identifier (kebab-case)
 * @property {string} name          - Display name
 * @property {string} version       - Semantic version
 * @property {string} status        - Status label (Active, Draft, Archived)
 * @property {string} priority      - Priority level (High, Normal, Low)
 * @property {string} category      - Nav group / category label
 * @property {string} description   - Short description (grid row)
 * @property {string} longDescription - Rich detail (detail page, supports \n)
 * @property {string} [repoUrl]     - GitHub repository URL
 * @property {string[]} [screenshots] - Relative paths to screenshot images
 * @property {string[]} [tags]      - Tags for filtering
 * @property {string} [dateCreated] - ISO date string
 * @property {string} [lastUpdated] - ISO date string
 * @property {string} [origin]      - Origin channel (Web, Phone, Chat, etc.)
 */

/**
 * @typedef {Object} NavigationGroup
 * @property {string} label
 * @property {ToolEntry[]} tools
 */

/** Platform version */
export const PLATFORM_VERSION = "2.0.0";
