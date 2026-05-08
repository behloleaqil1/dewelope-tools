// SEO-related TypeScript interfaces

/**
 * Page Metadata for SEO
 */
export interface PageMetadata {
  title: string;
  description: string;
  canonical: string;
  structuredData: WebApplicationSchema;
}

/**
 * JSON-LD WebApplication Schema (schema.org)
 */
export interface WebApplicationSchema {
  '@context': 'https://schema.org';
  '@type': 'WebApplication';
  name: string;
  description: string;
  url: string;
  applicationCategory: string;
  operatingSystem: string;
  offers: { '@type': 'Offer'; price: '0'; priceCurrency: 'USD' };
}

/**
 * Sitemap Entry for XML sitemap generation
 */
export interface SitemapEntry {
  url: string;
  lastModified: string;
  changeFrequency: 'daily' | 'weekly' | 'monthly';
  priority: number;
}
