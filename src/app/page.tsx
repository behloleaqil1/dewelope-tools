import { Metadata } from 'next';
import Link from 'next/link';
import { categories } from '@/data/categories';
import { getFeaturedTools, getToolsByCategory } from '@/data/tools-registry';
import SearchBar from '@/components/search/SearchBar';
import { CategoryId } from '@/types';

export function generateMetadata(): Metadata {
  return {
    title: 'DeWelope Tools - Free Online Utility Tools',
    description:
      'Free online tools for developers and everyday use. Unit converters, text tools, calculators, developer utilities, image tools, and date-time tools.',
    alternates: {
      canonical: '/',
    },
  };
}

export default function HomePage() {
  const featuredTools = getFeaturedTools();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero section */}
      <header className="text-center py-12 md:py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4">
          Free Online Tools
        </h1>
        <p className="text-lg text-gray-500 max-w-lg mx-auto mb-8">
          Browser-based utility tools for developers and everyday tasks. No installs, no sign-ups.
        </p>
        <div className="max-w-xl mx-auto">
          <SearchBar />
        </div>
      </header>

      {/* Category grid */}
      <section className="mb-16" aria-label="Tool categories">
        <h2 className="section-title mb-6">Browse by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => {
            const toolCount = getToolsByCategory(category.id as CategoryId).length;
            return (
              <Link
                key={category.id}
                href={`/${category.slug}`}
                className="card p-5 group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl" aria-hidden="true">
                    {category.icon}
                  </span>
                  <h3 className="text-base font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {category.name}
                  </h3>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed mb-3">
                  {category.description}
                </p>
                <span className="badge">
                  {toolCount} tools
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured tools */}
      <section className="mb-16" aria-label="Featured tools">
        <h2 className="section-title mb-6">Featured Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredTools.map((tool) => {
            const category = categories.find((c) => c.id === tool.category);
            return (
              <Link
                key={tool.id}
                href={`/${tool.category}/${tool.slug}`}
                className="card p-5 group"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {tool.name}
                  </h3>
                  <svg className="w-4 h-4 text-gray-300 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed mb-3">
                  {tool.shortDescription}
                </p>
                <span className="text-xs font-medium text-indigo-500">
                  {category?.name}
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
