import type { ToolConfig } from '@/types';
import type { SearchResult } from '@/types/search';

/**
 * Pre-computed search index for fast lookups.
 * Stores lowercase versions of tool names and descriptions
 * to avoid repeated `.toLowerCase()` calls per keystroke.
 */
export interface SearchIndex {
  tools: ToolConfig[];
  lowerNames: string[];
  lowerDescriptions: string[];
}

/**
 * Build a pre-computed search index for fast lookups.
 * Called once on module initialization to avoid repeated toLowerCase() calls.
 *
 * @param tools - Array of tool configurations to index
 * @returns SearchIndex with pre-computed lowercase strings
 */
export function buildSearchIndex(tools: ToolConfig[]): SearchIndex {
  return {
    tools,
    lowerNames: tools.map(t => t.name.toLowerCase()),
    lowerDescriptions: tools.map(t => t.description.toLowerCase()),
  };
}

/**
 * Search tools using pre-computed lowercase index.
 * Returns max 20 results to prevent DOM overload.
 *
 * @param query - The search query string
 * @param tools - Array of tool configurations to search through
 * @param index - Optional pre-computed search index for performance
 * @returns Array of SearchResult with match metadata, empty if query < 2 chars
 */
export function searchTools(query: string, tools: ToolConfig[], index?: SearchIndex): SearchResult[] {
  if (query.length < 2) return [];

  const lowerQuery = query.toLowerCase();
  const results: SearchResult[] = [];
  const maxResults = 20;

  const src = index || buildSearchIndex(tools);

  for (let i = 0; i < src.tools.length && results.length < maxResults; i++) {
    const nameIndex = src.lowerNames[i].indexOf(lowerQuery);
    if (nameIndex !== -1) {
      results.push({ tool: src.tools[i], matchType: 'name', matchIndex: nameIndex });
      continue;
    }

    const descIndex = src.lowerDescriptions[i].indexOf(lowerQuery);
    if (descIndex !== -1) {
      results.push({ tool: src.tools[i], matchType: 'description', matchIndex: descIndex });
    }
  }

  return results;
}
