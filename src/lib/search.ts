import type { ToolConfig } from '@/types';
import type { SearchResult } from '@/types/search';

/**
 * Search tools by name and description using case-insensitive substring matching.
 *
 * @param query - The search query string
 * @param tools - Array of tool configurations to search through
 * @returns Array of SearchResult with match metadata, empty if query < 2 chars
 */
export function searchTools(query: string, tools: ToolConfig[]): SearchResult[] {
  // Return empty results for queries shorter than 2 characters
  if (query.length < 2) {
    return [];
  }

  const lowerQuery = query.toLowerCase();
  const results: SearchResult[] = [];

  for (const tool of tools) {
    const nameIndex = tool.name.toLowerCase().indexOf(lowerQuery);
    if (nameIndex !== -1) {
      results.push({
        tool,
        matchType: 'name',
        matchIndex: nameIndex,
      });
      continue;
    }

    const descriptionIndex = tool.description.toLowerCase().indexOf(lowerQuery);
    if (descriptionIndex !== -1) {
      results.push({
        tool,
        matchType: 'description',
        matchIndex: descriptionIndex,
      });
    }
  }

  return results;
}
