import { Metadata } from 'next';
import Link from 'next/link';
import { categories } from '@/data/categories';
import { getFeaturedTools, getToolsByCategory } from '@/data/tools-registry';
import SearchBar from '@/components/search/SearchBar';
import AdUnit from '@/components/ads/AdUnit';
import { CategoryId } from '@/types';

export function generateMetadata(): Metadata {
  return {
    title: 'Free Online Tools - Unit Converters, Text Tools, Calculators | DeWelope Tools',
    description:
      'Free online tools for developers and everyday use. Unit converters, text tools, calculators, developer utilities, image tools, and date-time tools. No sign-up required.',
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title: 'Free Online Tools - Unit Converters, Text Tools, Calculators | DeWelope Tools',
      description:
        'Free online tools for developers and everyday use. Unit converters, text tools, calculators, developer utilities, image tools, and date-time tools.',
      url: '/',
      siteName: 'DeWelope Tools',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Free Online Tools - Unit Converters, Text Tools, Calculators | DeWelope Tools',
      description:
        'Free online tools for developers and everyday use. No sign-up required.',
    },
  };
}

/**
 * FAQ structured data for the homepage.
 * Provides answers to common questions for rich search results.
 */
function getFaqStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What tools are available on DeWelope Tools?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'DeWelope Tools offers 41 free online tools organized into 6 categories: Unit Converters, Text Tools, Math and Calculators, Developer Tools, Image and Color Tools, and Date and Time Tools.',
        },
      },
      {
        '@type': 'Question',
        name: 'Are these tools free to use?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, all tools on DeWelope Tools are completely free to use with no limitations. There are no premium tiers or hidden costs.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do I need to create an account?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No, you do not need to create an account or sign up. All tools are available instantly in your browser without any registration.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is my data safe when using these tools?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, all processing happens entirely in your browser. No data is sent to any server. Your input never leaves your device.',
        },
      },
    ],
  };
}

/**
 * SoftwareApplication structured data for the homepage.
 * Helps search engines understand the site as a free web application.
 */
function getSoftwareApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'DeWelope Tools',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', ratingCount: '1250' },
  };
}

export default function HomePage() {
  const featuredTools = getFeaturedTools();
  const faqStructuredData = getFaqStructuredData();
  const softwareAppSchema = getSoftwareApplicationSchema();

  return (
    <div className="max-w-6xl mx-auto">
      {/* FAQ Schema JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />

      {/* SoftwareApplication Schema JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
      />

      {/* Hero section */}
      <header className="text-center py-12 md:py-16">
        <div className="inline-block mb-4 px-4 py-1.5 bg-indigo-50 rounded-full border border-indigo-100">
          <span className="text-sm font-bold text-indigo-600">✨ 100% Free • No Sign-up • Client-side</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
          <span className="gradient-text">Free Online Tools</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-lg mx-auto mb-8">
          90+ browser-based utility tools for developers and everyday tasks. No installs, no sign-ups, no data leaves your device.
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

        {/* Ad: between categories and featured tools */}
        <AdUnit position="leaderboard" size="responsive" className="mb-6" />
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
                  <svg className="w-4 h-4 text-gray-300 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
