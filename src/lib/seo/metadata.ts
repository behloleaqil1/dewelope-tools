import { Metadata } from 'next';
import { ToolConfig, CategoryConfig } from '@/types';

/**
 * Base URL for the site, configurable via environment variable.
 * Defaults to 'https://dewelopetools.com' if not set.
 */
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://tools.dewelope.com';

/**
 * Generates Next.js Metadata object for a tool page.
 * Uses the tool's metaTitle (30-60 chars) and metaDescription (70-160 chars)
 * from the registry, and generates a canonical URL.
 *
 * @param tool - The tool configuration from the registry
 * @returns Next.js Metadata object with title, description, and canonical URL
 */
export function generateToolMetadata(tool: ToolConfig): Metadata {
  const canonical = `${BASE_URL}/${tool.category}/${tool.slug}`;

  return {
    title: tool.metaTitle,
    description: tool.metaDescription,
    keywords: tool.keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      title: tool.metaTitle,
      description: tool.metaDescription,
      url: canonical,
      type: 'website',
    },
  };
}

/**
 * Generates Next.js Metadata object for a category page.
 * Creates a title and description from the category configuration
 * and generates a canonical URL.
 *
 * @param category - The category configuration
 * @returns Next.js Metadata object with title, description, and canonical URL
 */
export function generateCategoryMetadata(category: CategoryConfig): Metadata {
  const canonical = `${BASE_URL}/${category.slug}`;
  const title = `${category.name} - Free Online Tools`;
  const description = category.description.length > 160
    ? category.description.slice(0, 157) + '...'
    : category.description;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
    },
  };
}
