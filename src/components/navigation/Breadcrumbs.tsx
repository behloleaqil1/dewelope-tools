import Link from 'next/link';

export interface BreadcrumbsProps {
  category: {
    name: string;
    slug: string;
  };
  tool?: {
    name: string;
    slug: string;
  };
}

/**
 * Breadcrumb navigation component.
 * Generates Home → Category → Tool path with JSON-LD structured data for SEO.
 */
export default function Breadcrumbs({ category, tool }: BreadcrumbsProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tools.dewelope.com';

  // Build breadcrumb items for structured data
  const items = [
    { name: 'Home', url: `${baseUrl}/` },
    { name: category.name, url: `${baseUrl}/${category.slug}` },
  ];

  if (tool) {
    items.push({ name: tool.name, url: `${baseUrl}/${category.slug}/${tool.slug}` });
  }

  // JSON-LD BreadcrumbList structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ol className="flex items-center gap-1 text-sm text-gray-600 flex-wrap">
        {/* Home */}
        <li className="flex items-center">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
        </li>

        {/* Separator */}
        <li className="flex items-center" aria-hidden="true">
          <span className="mx-1">→</span>
        </li>

        {/* Category */}
        <li className="flex items-center">
          {tool ? (
            <Link href={`/${category.slug}`} className="hover:text-blue-600 transition-colors">
              {category.name}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium" aria-current="page">
              {category.name}
            </span>
          )}
        </li>

        {/* Tool (if present) */}
        {tool && (
          <>
            <li className="flex items-center" aria-hidden="true">
              <span className="mx-1">→</span>
            </li>
            <li className="flex items-center">
              <span className="text-gray-900 font-medium" aria-current="page">
                {tool.name}
              </span>
            </li>
          </>
        )}
      </ol>
    </nav>
  );
}
