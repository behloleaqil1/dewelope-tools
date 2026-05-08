import Link from 'next/link';
import { categories } from '@/data/categories';

/**
 * Footer - Site-wide footer with keyword-rich about section and category links.
 * Provides crawlable internal links on every page for improved SEO.
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-100 bg-white px-4 lg:px-6 py-10 mt-auto">
      <div className="max-w-[1600px] mx-auto">
        {/* About section with keyword-rich text */}
        <div className="mb-8 pb-8 border-b border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-sm font-semibold text-gray-900 mb-2">About DeWelope Tools</h2>
              <p className="text-xs text-gray-500 leading-relaxed">
                DeWelope Tools is a collection of 41 free online tools for developers, designers, and everyday users. All tools run entirely in your browser — no data is sent to any server, ensuring complete privacy. From unit converters and text manipulation to developer utilities and color tools, everything works instantly with no sign-up required.
              </p>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900 mb-2">Tool Categories</h2>
              <nav aria-label="Category links">
                <ul className="grid grid-cols-2 gap-1">
                  {categories.map((category) => (
                    <li key={category.id}>
                      <Link
                        href={`/${category.slug}`}
                        className="text-xs text-gray-500 hover:text-indigo-600 transition-colors"
                      >
                        <span aria-hidden="true">{category.icon}</span> {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </div>

        {/* Copyright and nav */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            © {currentYear} DeWelope Tools. All rights reserved.
          </p>
          <nav aria-label="Footer navigation">
            <ul className="flex items-center gap-6 text-sm text-gray-400">
              <li>
                <Link href="/" className="hover:text-indigo-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-indigo-600 transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-indigo-600 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
