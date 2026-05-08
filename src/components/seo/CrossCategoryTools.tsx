import Link from 'next/link';
import { CategoryId } from '@/types';
import { categories } from '@/data/categories';
import { getToolsByCategory } from '@/data/tools-registry';

interface CrossCategoryToolsProps {
  currentCategory: CategoryId;
}

/**
 * CrossCategoryTools - Shows 2 popular tools from other categories.
 * Creates cross-category internal links for improved crawlability and SEO.
 */
export default function CrossCategoryTools({ currentCategory }: CrossCategoryToolsProps) {
  const otherCategories = categories.filter((cat) => cat.id !== currentCategory);

  // Pick one featured tool from 2 different categories
  const crossTools = otherCategories
    .map((cat) => {
      const tools = getToolsByCategory(cat.id as CategoryId);
      const featured = tools.find((t) => t.featured) || tools[0];
      return featured ? { tool: featured, category: cat } : null;
    })
    .filter(Boolean)
    .slice(0, 2);

  if (crossTools.length === 0) return null;

  return (
    <section aria-label="More free tools" className="mt-8 pt-8 border-t border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        More Free Tools
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {crossTools.map((item) => {
          if (!item) return null;
          const { tool, category } = item;
          return (
            <Link
              key={tool.id}
              href={`/${category.slug}/${tool.slug}`}
              className="card p-4 group block"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm" aria-hidden="true">{category.icon}</span>
                <h3 className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {tool.name}
                </h3>
              </div>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                {tool.shortDescription}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
