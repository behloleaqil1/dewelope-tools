import { Metadata } from 'next';
import Link from 'next/link';
import { getFeaturedTools } from '@/data/tools-registry';
import { categories } from '@/data/categories';

export const metadata: Metadata = {
  title: 'Page Not Found - DeWelope Tools',
  description: 'The page you are looking for does not exist. Browse our free online tools including unit converters, text tools, calculators, and developer utilities.',
};

export default function NotFound() {
  const popularTools = getFeaturedTools().slice(0, 6);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <header className="text-center mb-12">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          The tool or page you are looking for does not exist. It may have been moved or removed.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
        >
          Go to Homepage
        </Link>
      </header>

      {/* Popular tools section for internal linking */}
      <section aria-label="Popular tools" className="mb-12">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">
          Popular Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {popularTools.map((tool) => {
            const category = categories.find((c) => c.id === tool.category);
            return (
              <Link
                key={tool.id}
                href={`/${tool.category}/${tool.slug}`}
                className="card p-4 group block"
              >
                <h3 className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {tool.shortDescription}
                </p>
                <span className="text-xs text-indigo-500 mt-2 inline-block">
                  {category?.name}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Browse categories */}
      <section aria-label="Browse categories" className="text-center">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Browse Categories
        </h2>
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/${category.slug}`}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-md bg-gray-100 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
            >
              <span aria-hidden="true">{category.icon}</span>
              {category.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
