import { ToolConfig } from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://tools.dewelope.com';

/**
 * Generates JSON-LD BreadcrumbList structured data for a tool page.
 * Helps Google understand site hierarchy and display breadcrumbs in search results.
 *
 * @param tool - The tool configuration from the registry
 * @param categoryName - The human-readable category name
 * @returns BreadcrumbList schema object for JSON-LD injection
 */
export function generateBreadcrumbSchema(tool: ToolConfig, categoryName: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${BASE_URL}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: categoryName,
        item: `${BASE_URL}/${tool.category}/`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: tool.name,
        item: `${BASE_URL}/${tool.category}/${tool.slug}/`,
      },
    ],
  };
}
