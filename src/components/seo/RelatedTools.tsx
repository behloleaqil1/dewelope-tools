import Link from 'next/link';
import { ToolConfig, CategoryId } from '@/types';
import { getToolsByCategory } from '@/data/tools-registry';

interface RelatedToolsProps {
  currentToolId: string;
  category: CategoryId;
  categorySlug: string;
}

/**
 * RelatedTools - Displays 3-4 related tools from the same category.
 * Creates internal links which boost SEO through improved site crawlability.
 */
export default function RelatedTools({ currentToolId, category, categorySlug }: RelatedToolsProps) {
  const allCategoryTools = getToolsByCategory(category);
  const relatedTools: ToolConfig[] = allCategoryTools
    .filter((tool) => tool.id !== currentToolId)
    .slice(0, 4);

  if (relatedTools.length === 0) return null;

  return (
    <section aria-label="Related tools" className="mt-12 pt-8 border-t border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Related Tools
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {relatedTools.map((tool) => (
          <Link
            key={tool.id}
            href={`/${categorySlug}/${tool.slug}`}
            className="card p-4 group block"
          >
            <h3 className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
              {tool.name}
            </h3>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
              {tool.shortDescription}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
