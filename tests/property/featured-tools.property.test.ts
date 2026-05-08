import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { getFeaturedTools } from '@/data/tools-registry';
import type { CategoryId } from '@/types';

/**
 * Property-based tests for featured tools diversity.
 *
 * Validates: Requirements 13.4
 */

const allCategoryIds: CategoryId[] = [
  'unit-converters',
  'text-tools',
  'math-calculators',
  'developer-tools',
  'image-color-tools',
  'date-time-tools',
];

describe('Feature: online-tools-hub, Property 30: Featured Tools Diversity', () => {
  it('for any configuration of the homepage, the featured tools section SHALL display at least 6 tools representing at least 3 distinct categories', () => {
    fc.assert(
      fc.property(
        // Use a seed-based arbitrary to run the same assertion across many iterations,
        // verifying the property holds regardless of any random context
        fc.integer({ min: 0, max: 1000000 }),
        (_seed: number) => {
          const featuredTools = getFeaturedTools();

          // Must have at least 6 featured tools
          expect(featuredTools.length).toBeGreaterThanOrEqual(6);

          // Must represent at least 3 distinct categories
          const distinctCategories = new Set(featuredTools.map((tool) => tool.category));
          expect(distinctCategories.size).toBeGreaterThanOrEqual(3);

          // All categories must be valid
          for (const category of distinctCategories) {
            expect(allCategoryIds).toContain(category);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('each featured tool SHALL have a valid name, short description, and category', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 1000000 }),
        (_seed: number) => {
          const featuredTools = getFeaturedTools();

          for (const tool of featuredTools) {
            // Each tool must have a non-empty name
            expect(tool.name.length).toBeGreaterThan(0);

            // Each tool must have a short description
            expect(tool.shortDescription.length).toBeGreaterThan(0);

            // Each tool must have a valid category
            expect(allCategoryIds).toContain(tool.category);

            // The featured flag must be true
            expect(tool.featured).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
