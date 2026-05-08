import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import sitemap from '@/app/sitemap';
import { getAllTools, toolsRegistry } from '@/data/tools-registry';
import { categories } from '@/data/categories';
import { generateToolStructuredData } from '@/lib/seo/structured-data';
import { generateToolMetadata } from '@/lib/seo/metadata';

/**
 * Property-based tests for SEO module: sitemap, structured data, and canonical URLs.
 *
 * Validates: Requirements 9.2, 9.3, 9.5, 9.6
 */

describe('Feature: online-tools-hub, Property 24: Sitemap Reflects Current Registry State', () => {
  const sitemapEntries = sitemap();
  const allTools = getAllTools();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dewelopetools.com';

  it('the sitemap SHALL contain exactly 1 + categories + tools entries (homepage + category pages + tool pages)', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          const expectedCount = 1 + categories.length + allTools.length;
          // 1 homepage + 6 categories + 41 tools = 48
          expect(sitemapEntries.length).toBe(expectedCount);
          expect(sitemapEntries.length).toBe(48);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('every tool in the registry SHALL have a corresponding URL in the sitemap', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allTools),
        (tool) => {
          const expectedUrl = `${baseUrl}/${tool.category}/${tool.slug}`;
          const urls = sitemapEntries.map((entry) => entry.url);
          expect(urls).toContain(expectedUrl);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('every category SHALL have a corresponding URL in the sitemap', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...categories),
        (category) => {
          const expectedUrl = `${baseUrl}/${category.slug}`;
          const urls = sitemapEntries.map((entry) => entry.url);
          expect(urls).toContain(expectedUrl);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('no duplicate URLs SHALL exist in the sitemap', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          const urls = sitemapEntries.map((entry) => entry.url);
          const uniqueUrls = new Set(urls);
          expect(uniqueUrls.size).toBe(urls.length);
        }
      ),
      { numRuns: 100 }
    );
  });
});


describe('Feature: online-tools-hub, Property 25: Structured Data Schema Validity', () => {
  it('for any tool configuration, the generated JSON-LD structured data SHALL conform to the schema.org WebApplication type with all required fields', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...toolsRegistry),
        (tool) => {
          const structuredData = generateToolStructuredData(tool);

          // Must have @context set to schema.org
          expect(structuredData['@context']).toBe('https://schema.org');

          // Must have @type set to WebApplication
          expect(structuredData['@type']).toBe('WebApplication');

          // Must have a non-empty name
          expect(structuredData.name).toBeDefined();
          expect(typeof structuredData.name).toBe('string');
          expect(structuredData.name.length).toBeGreaterThan(0);

          // Must have a non-empty description
          expect(structuredData.description).toBeDefined();
          expect(typeof structuredData.description).toBe('string');
          expect(structuredData.description.length).toBeGreaterThan(0);

          // Must have a valid url
          expect(structuredData.url).toBeDefined();
          expect(typeof structuredData.url).toBe('string');
          expect(structuredData.url.length).toBeGreaterThan(0);
          expect(structuredData.url).toMatch(/^https?:\/\//);

          // Must have applicationCategory
          expect(structuredData.applicationCategory).toBeDefined();
          expect(typeof structuredData.applicationCategory).toBe('string');
          expect(structuredData.applicationCategory.length).toBeGreaterThan(0);

          // Must have operatingSystem
          expect(structuredData.operatingSystem).toBeDefined();
          expect(typeof structuredData.operatingSystem).toBe('string');
          expect(structuredData.operatingSystem.length).toBeGreaterThan(0);

          // Must have offers with correct structure
          expect(structuredData.offers).toBeDefined();
          expect(structuredData.offers['@type']).toBe('Offer');
          expect(structuredData.offers.price).toBe('0');
          expect(structuredData.offers.priceCurrency).toBe('USD');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('the structured data name SHALL match the tool name from the registry', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...toolsRegistry),
        (tool) => {
          const structuredData = generateToolStructuredData(tool);
          expect(structuredData.name).toBe(tool.name);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('the structured data url SHALL contain the tool category and slug', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...toolsRegistry),
        (tool) => {
          const structuredData = generateToolStructuredData(tool);
          expect(structuredData.url).toContain(`/${tool.category}/${tool.slug}`);
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Feature: online-tools-hub, Property 26: Canonical URL Uniqueness', () => {
  it('for any tool page, the SEO module SHALL generate exactly one canonical URL', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...toolsRegistry),
        (tool) => {
          const metadata = generateToolMetadata(tool);

          // Must have alternates with canonical
          expect(metadata.alternates).toBeDefined();
          expect(metadata.alternates!.canonical).toBeDefined();
          expect(typeof metadata.alternates!.canonical).toBe('string');
          expect((metadata.alternates!.canonical as string).length).toBeGreaterThan(0);

          // Canonical URL must be a valid URL format
          expect(metadata.alternates!.canonical).toMatch(/^https?:\/\//);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('no two tool pages SHALL share the same canonical URL', () => {
    const canonicalUrls = toolsRegistry.map((tool) => {
      const metadata = generateToolMetadata(tool);
      return metadata.alternates!.canonical as string;
    });

    const uniqueUrls = new Set(canonicalUrls);
    expect(uniqueUrls.size).toBe(canonicalUrls.length);
  });

  it('the canonical URL SHALL contain the tool category and slug path', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...toolsRegistry),
        (tool) => {
          const metadata = generateToolMetadata(tool);
          const canonical = metadata.alternates!.canonical as string;

          // Canonical URL must include the tool's category and slug
          expect(canonical).toContain(`/${tool.category}/${tool.slug}`);
        }
      ),
      { numRuns: 100 }
    );
  });
});
