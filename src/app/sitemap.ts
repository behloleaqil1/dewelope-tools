import { MetadataRoute } from 'next';
import { getAllTools } from '@/data/tools-registry';
import { categories } from '@/data/categories';

/**
 * Generate XML sitemap for all pages in the Online Tools Hub.
 * Derives all entries from the tools registry and categories data.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://tools.dewelope.com';

  const now = new Date().toISOString();

  // Homepage
  const homepageEntry: MetadataRoute.Sitemap[number] = {
    url: `${baseUrl}/`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 1.0,
  };

  // Category pages (trailing slash to match GitHub Pages canonical URLs)
  const categoryEntries: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/${category.slug}/`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Tool pages (trailing slash to match GitHub Pages canonical URLs)
  const toolEntries: MetadataRoute.Sitemap = getAllTools().map((tool) => ({
    url: `${baseUrl}/${tool.category}/${tool.slug}/`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [homepageEntry, ...categoryEntries, ...toolEntries];
}
