import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { categories, getCategoryBySlug } from '@/data/categories';
import { getToolsByCategory } from '@/data/tools-registry';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import AdUnit from '@/components/ads/AdUnit';
import { CategoryId } from '@/types';

interface CategoryPageProps {
  params: { category: string };
}

/**
 * Generate static params for all 6 category pages at build time.
 */
export function generateStaticParams() {
  return categories.map((cat) => ({
    category: cat.slug,
  }));
}

/**
 * Generate SEO metadata for each category page.
 */
export function generateMetadata({ params }: CategoryPageProps): Metadata {
  const category = getCategoryBySlug(params.category);

  if (!category) {
    return {
      title: 'Category Not Found',
    };
  }

  const title = `${category.name} - Free Online Tools`;
  const description = category.description;
  const tools = getToolsByCategory(category.id as CategoryId);
  const keywords = tools.flatMap((t) => t.keywords).slice(0, 10);

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${category.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/${category.slug}`,
      siteName: 'DeWelope Tools',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

/**
 * Category page listing all tools in the category alphabetically.
 */
export default function CategoryPage({ params }: CategoryPageProps) {
  const category = getCategoryBySlug(params.category);

  if (!category) {
    notFound();
  }

  const tools = getToolsByCategory(category.id as CategoryId).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <div className="max-w-4xl mx-auto">
      <Breadcrumbs category={{ name: category.name, slug: category.slug }} />

      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-2">
          <span className="mr-2" aria-hidden="true">{category.icon}</span>{category.name}
        </h1>
        <p className="text-gray-500 leading-relaxed">{category.description}</p>
        {category.seoDescription && (
          <p className="text-sm text-gray-600 leading-relaxed mt-4">
            {category.seoDescription}
          </p>
        )}
      </header>

      {/* Ad: top of category page */}
      <AdUnit position="leaderboard" size="responsive" className="mb-6" />

      <section aria-label={`Tools in ${category.name}`}>
        <h2 className="sr-only">Available Tools</h2>
        <ul className="space-y-3">
          {tools.map((tool) => (
            <li key={tool.id}>
              <Link
                href={`/${category.slug}/${tool.slug}`}
                className="card p-5 block group"
              >
                <article>
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {tool.name}
                    </h3>
                    <svg className="w-4 h-4 text-gray-300 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {tool.shortDescription}
                  </p>
                </article>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Ad: bottom of category page */}
      <AdUnit position="in-content" size="responsive" className="mt-8" />
    </div>
  );
}
