import { ToolConfig } from '@/types';
import { WebApplicationSchema } from '@/types/seo';

/**
 * Base URL for the site, configurable via environment variable.
 * Defaults to 'https://dewelopetools.com' if not set.
 */
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://tools.dewelope.com';

/**
 * Maps category IDs to human-readable application category names
 * suitable for schema.org applicationCategory field.
 */
const CATEGORY_MAP: Record<string, string> = {
  'unit-converters': 'UtilityApplication',
  'text-tools': 'UtilityApplication',
  'math-calculators': 'UtilityApplication',
  'developer-tools': 'DeveloperApplication',
  'image-color-tools': 'DesignApplication',
  'date-time-tools': 'UtilityApplication',
};

/**
 * Generates JSON-LD WebApplication structured data for a tool page.
 * Conforms to schema.org WebApplication type with all required fields.
 *
 * @param tool - The tool configuration from the registry
 * @returns WebApplicationSchema object ready to be serialized as JSON-LD
 */
export function generateToolStructuredData(tool: ToolConfig): WebApplicationSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.name,
    description: tool.description,
    url: `${BASE_URL}/${tool.category}/${tool.slug}`,
    applicationCategory: CATEGORY_MAP[tool.category] || 'UtilityApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };
}
