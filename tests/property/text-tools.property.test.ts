import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { generateLoremIpsum } from '@/lib/text-tools';

/**
 * Property-based tests for text tools.
 *
 * Validates: Requirements 4.7
 */

describe('Feature: online-tools-hub, Property 11: Lorem Ipsum Paragraph Count', () => {
  it('for any integer n in the range [1, 50], the Lorem Ipsum Generator SHALL produce output containing exactly n paragraphs separated by double newlines', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 50 }),
        (n: number) => {
          const output = generateLoremIpsum(n);

          // Output should be a non-empty string
          expect(output.length).toBeGreaterThan(0);

          // Count paragraphs by splitting on double newlines
          const paragraphs = output.split('\n\n');

          // There should be exactly n paragraphs
          expect(paragraphs.length).toBe(n);

          // Each paragraph should be non-empty
          for (const paragraph of paragraphs) {
            expect(paragraph.trim().length).toBeGreaterThan(0);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
