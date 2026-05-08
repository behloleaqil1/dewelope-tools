import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { searchTools } from '@/lib/search';
import type { ToolConfig } from '@/types';
import type { CategoryId } from '@/types';

/**
 * Property-based tests for search filtering correctness.
 *
 * Validates: Requirements 2.4
 */

// Arbitrary generator for a valid ToolConfig
const categoryIds: CategoryId[] = [
  'unit-converters',
  'text-tools',
  'math-calculators',
  'developer-tools',
  'image-color-tools',
  'date-time-tools',
];

const toolConfigArb: fc.Arbitrary<ToolConfig> = fc.record({
  id: fc.string({ minLength: 1, maxLength: 30 }).map((s) => s.replace(/\s/g, '-')),
  name: fc.string({ minLength: 1, maxLength: 100 }),
  description: fc.string({ minLength: 1, maxLength: 300 }),
  shortDescription: fc.string({ minLength: 1, maxLength: 120 }),
  category: fc.constantFrom(...categoryIds),
  slug: fc.string({ minLength: 1, maxLength: 50 }).map((s) => s.replace(/[^a-z0-9-]/gi, '').toLowerCase() || 'tool'),
  metaTitle: fc.string({ minLength: 30, maxLength: 60 }),
  metaDescription: fc.string({ minLength: 70, maxLength: 160 }),
  keywords: fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 1, maxLength: 5 }),
  featured: fc.boolean(),
  componentPath: fc.constant('src/components/tools/placeholder'),
  inputConfig: fc.constant({ type: 'text' as const }),
  outputConfig: fc.constant({ type: 'text' as const, copyable: true }),
});

// Generator for a search query of at least 2 characters (no empty/whitespace-only)
const searchQueryArb = fc.string({ minLength: 2, maxLength: 50 }).filter((s) => s.trim().length >= 2);

describe('Feature: online-tools-hub, Property 4: Search Filtering Correctness', () => {
  it('for any search query of at least 2 characters and any set of tools, the search function SHALL return exactly those tools where the query appears as a case-insensitive substring of either the tool name or description', () => {
    fc.assert(
      fc.property(
        searchQueryArb,
        fc.array(toolConfigArb, { minLength: 0, maxLength: 20 }),
        (query: string, tools: ToolConfig[]) => {
          const results = searchTools(query, tools);
          const lowerQuery = query.toLowerCase();

          // Compute expected matches: tools where query is a substring of name or description
          const expectedTools = tools.filter(
            (tool) =>
              tool.name.toLowerCase().includes(lowerQuery) ||
              tool.description.toLowerCase().includes(lowerQuery)
          );

          // Every returned result must be a tool that matches
          for (const result of results) {
            const matchesName = result.tool.name.toLowerCase().includes(lowerQuery);
            const matchesDescription = result.tool.description.toLowerCase().includes(lowerQuery);
            expect(matchesName || matchesDescription).toBe(true);
          }

          // The number of results must equal the number of expected matches
          expect(results.length).toBe(expectedTools.length);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('SHALL NOT return any tool that does not contain the query as a substring of name or description', () => {
    fc.assert(
      fc.property(
        searchQueryArb,
        fc.array(toolConfigArb, { minLength: 1, maxLength: 20 }),
        (query: string, tools: ToolConfig[]) => {
          const results = searchTools(query, tools);
          const lowerQuery = query.toLowerCase();
          const returnedToolIds = new Set(results.map((r) => r.tool.id));

          // Every tool NOT in results must NOT match the query
          for (const tool of tools) {
            if (!returnedToolIds.has(tool.id)) {
              const matchesName = tool.name.toLowerCase().includes(lowerQuery);
              const matchesDescription = tool.description.toLowerCase().includes(lowerQuery);
              expect(matchesName || matchesDescription).toBe(false);
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('search with a query that is a known substring of a tool name SHALL include that tool in results', () => {
    fc.assert(
      fc.property(
        toolConfigArb,
        fc.array(toolConfigArb, { minLength: 0, maxLength: 10 }),
        (targetTool: ToolConfig, otherTools: ToolConfig[]) => {
          // Extract a substring of at least 2 chars from the tool name
          if (targetTool.name.length < 2) return; // skip if name too short

          const substringLength = Math.min(targetTool.name.length, Math.max(2, Math.floor(targetTool.name.length / 2)));
          const query = targetTool.name.substring(0, substringLength);

          if (query.length < 2) return; // skip edge case

          const allTools = [targetTool, ...otherTools];
          const results = searchTools(query, allTools);

          // The target tool must appear in results
          const foundTarget = results.some((r) => r.tool.id === targetTool.id);
          expect(foundTarget).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});
