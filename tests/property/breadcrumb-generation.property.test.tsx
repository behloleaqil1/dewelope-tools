import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import * as fc from 'fast-check';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import { toolsRegistry } from '@/data/tools-registry';
import { categories } from '@/data/categories';

// Mock next/link to render as a simple anchor
vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

/**
 * Property-based tests for breadcrumb generation correctness.
 *
 * Validates: Requirements 1.3
 */
describe('Feature: online-tools-hub, Property 2: Breadcrumb Generation Correctness', () => {
  it('for any tool configuration, the generated breadcrumb path SHALL contain exactly 3 segments (Home → Category → Tool), where each segment link corresponds to the correct route and the category segment matches the tool parent category name', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...toolsRegistry),
        (tool) => {
          // Find the parent category for this tool
          const parentCategory = categories.find((cat) => cat.id === tool.category);
          expect(parentCategory).toBeDefined();

          const { container } = render(
            <Breadcrumbs
              category={{ name: parentCategory!.name, slug: parentCategory!.slug }}
              tool={{ name: tool.name, slug: tool.slug }}
            />
          );

          // Get all list items (breadcrumb segments)
          const listItems = container.querySelectorAll('ol > li');

          // Filter out separator items (aria-hidden="true") to get actual segments
          const segments = Array.from(listItems).filter(
            (li) => li.getAttribute('aria-hidden') !== 'true'
          );

          // Property: exactly 3 segments (Home, Category, Tool)
          expect(segments).toHaveLength(3);

          // Segment 1: Home with link to "/"
          const homeLink = segments[0].querySelector('a');
          expect(homeLink).not.toBeNull();
          expect(homeLink!.getAttribute('href')).toBe('/');
          expect(homeLink!.textContent).toBe('Home');

          // Segment 2: Category with link to "/{category-slug}"
          const categoryLink = segments[1].querySelector('a');
          expect(categoryLink).not.toBeNull();
          expect(categoryLink!.getAttribute('href')).toBe(`/${parentCategory!.slug}`);
          // Category segment matches the tool's parent category name
          expect(categoryLink!.textContent).toBe(parentCategory!.name);

          // Segment 3: Tool name (current page, not a link)
          const toolSpan = segments[2].querySelector('span');
          expect(toolSpan).not.toBeNull();
          expect(toolSpan!.textContent).toBe(tool.name);
        }
      ),
      { numRuns: 100 }
    );
  });
});
