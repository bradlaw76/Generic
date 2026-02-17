// =============================================================================
// NAVIGATION ENGINE — Groups tools by category for SideNav rendering
// Version: 2.0.0 | Last Updated: 2026-02-16
// =============================================================================

import { getActiveTools } from "./tool-registry.js";

/**
 * Groups active tools by category for nav rendering.
 * @returns {import('./tool-types.js').NavigationGroup[]}
 */
export function buildToolGroups() {
  const tools = getActiveTools();
  const groupMap = new Map();

  for (const tool of tools) {
    if (!groupMap.has(tool.category)) {
      groupMap.set(tool.category, []);
    }
    groupMap.get(tool.category).push(tool);
  }

  return Array.from(groupMap.entries()).map(([label, groupTools]) => ({
    label,
    tools: groupTools,
  }));
}
