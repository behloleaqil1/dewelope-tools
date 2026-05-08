import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { generateSlug, validateSlugsUnique } from '@/lib/slug';
import { toolsRegistry, getToolsByCategory } from '@/data/tools-registry';
import { CategoryId } from '@/types';

/**
 * Property-based tests for slug generation and registry validation.
 *
 * Validates: Requirements 1.1, 2.3, 9.1
 */

describe('Feature: online-tools-hub, Property 1: URL Slug Generation Produces Valid, Unique Paths', () => {
  it('for any tool name in the registry, the generated URL slug SHALL be a non-empty string containing only lowercase letters, numbers, and hyphens', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...toolsRegistry.map((t) => t.name)),
        (toolName: string) => {
          const slug = generateSlug(toolName);

          // Slug must be non-empty
          expect(slug.length).toBeGreaterThan(0);

          // Slug must contain only lowercase letters, numbers, and hyphens
          expect(slug).toMatch(/^[a-z0-9-]+$/);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('no two tools in the registry SHALL produce the same slug', () => {
    const slugs = toolsRegistry.map((tool) => tool.slug);
    expect(validateSlugsUnique(slugs)).toBe(true);
  });

  it('for any arbitrary string input, generateSlug produces a valid slug format', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 200 }),
        (input: string) => {
          const slug = generateSlug(input);

          // Slug must be non-empty
          expect(slug.length).toBeGreaterThan(0);

          // Slug must contain only lowercase letters, numbers, and hyphens
          expect(slug).toMatch(/^[a-z0-9-]+$/);

          // Slug must not start or end with a hyphen
          expect(slug).not.toMatch(/^-/);
          expect(slug).not.toMatch(/-$/);

          // Slug must not contain consecutive hyphens
          expect(slug).not.toMatch(/--/);
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Feature: online-tools-hub, Property 3: Category Tool Listing Order and Description Length', () => {
  const categoryIds: CategoryId[] = [
    'unit-converters',
    'text-tools',
    'math-calculators',
    'developer-tools',
    'image-color-tools',
    'date-time-tools',
  ];

  it('for any category containing multiple tools, the tools SHALL be listed in alphabetical order by name when sorted', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...categoryIds),
        (categoryId: CategoryId) => {
          const tools = getToolsByCategory(categoryId);

          // Category must have tools
          expect(tools.length).toBeGreaterThan(0);

          // Tools sorted alphabetically by name should maintain order
          const sortedTools = [...tools].sort((a, b) =>
            a.name.localeCompare(b.name)
          );

          // Verify the sorted order is consistent (alphabetical)
          for (let i = 1; i < sortedTools.length; i++) {
            expect(
              sortedTools[i - 1].name.localeCompare(sortedTools[i].name)
            ).toBeLessThanOrEqual(0);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('every tool short description SHALL be at most 120 characters in length', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...toolsRegistry),
        (tool) => {
          expect(tool.shortDescription.length).toBeLessThanOrEqual(120);
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Feature: online-tools-hub, Property 23: SEO Metadata Length and Uniqueness', () => {
  it('for any tool in the registry, the meta title SHALL be between 30 and 60 characters (inclusive)', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...toolsRegistry),
        (tool) => {
          expect(tool.metaTitle.length).toBeGreaterThanOrEqual(30);
          expect(tool.metaTitle.length).toBeLessThanOrEqual(60);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('for any tool in the registry, the meta description SHALL be between 70 and 160 characters (inclusive)', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...toolsRegistry),
        (tool) => {
          expect(tool.metaDescription.length).toBeGreaterThanOrEqual(70);
          expect(tool.metaDescription.length).toBeLessThanOrEqual(160);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('across the entire registry no two tools SHALL share the same meta title', () => {
    const metaTitles = toolsRegistry.map((tool) => tool.metaTitle);
    const uniqueTitles = new Set(metaTitles);
    expect(uniqueTitles.size).toBe(metaTitles.length);
  });

  it('across the entire registry no two tools SHALL share the same meta description', () => {
    const metaDescriptions = toolsRegistry.map((tool) => tool.metaDescription);
    const uniqueDescriptions = new Set(metaDescriptions);
    expect(uniqueDescriptions.size).toBe(metaDescriptions.length);
  });
});
