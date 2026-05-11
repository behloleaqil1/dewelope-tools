'use client';

import Link from 'next/link';
import SearchBar from '@/components/search/SearchBar';

interface HeaderProps {
  onMenuToggle: () => void;
  isSidebarOpen: boolean;
}

export default function Header({ onMenuToggle, isSidebarOpen }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-gray-100/80 px-4 lg:px-6 py-3">
      <div className="flex items-center justify-between max-w-[1600px] mx-auto">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2.5 rounded-xl hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors"
            aria-label={isSidebarOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isSidebarOpen}
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {isSidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md transition-transform group-hover:scale-110 group-hover:rotate-3" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)' }}>
              <span className="text-white text-lg">⚡</span>
            </div>
            <span className="text-lg font-extrabold text-gray-900 group-hover:text-indigo-600 transition-colors tracking-tight">
              DeWelope<span className="text-indigo-500">Tools</span>
            </span>
          </Link>
        </div>
        <div className="hidden sm:block flex-1 max-w-md mx-6">
          <SearchBar />
        </div>
        <div className="hidden md:flex items-center gap-2">
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
            🎉 91+ free tools
          </span>
        </div>
      </div>
    </header>
  );
}
