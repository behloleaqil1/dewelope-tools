// Search functionality TypeScript interfaces

import type { CategoryId, ToolConfig } from './index';

/**
 * Search result with match metadata
 */
export interface SearchResult {
  tool: ToolConfig;
  matchType: 'name' | 'description';
  matchIndex: number;
}

/**
 * In-memory search index
 */
export interface SearchIndex {
  tools: ToolSearchEntry[];
}

/**
 * Tool entry optimized for search matching
 */
export interface ToolSearchEntry {
  id: string;
  name: string;                  // Lowercased for matching
  description: string;           // Lowercased for matching
  category: CategoryId;
  slug: string;
  categorySlug: string;
}
