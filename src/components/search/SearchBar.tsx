'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { searchTools } from '@/lib/search';
import { toolsRegistry } from '@/data/tools-registry';
import { categories } from '@/data/categories';
import type { SearchResult } from '@/types/search';

/**
 * SearchBar component with debounced input and dropdown results.
 * Displays matching tools by name and description with links to tool pages.
 */
export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced search - 300ms delay
  const handleSearch = useCallback((value: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      const searchResults = searchTools(value, toolsRegistry);
      setResults(searchResults);
      setIsOpen(value.length >= 2);
    }, 300);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    handleSearch(value);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const getCategoryName = (categoryId: string): string => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.name ?? categoryId;
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={handleInputChange}
          placeholder={`Search ${toolsRegistry.length} tools...`}
          aria-label="Search tools by name or description"
          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-300 focus:bg-white transition-all min-h-[44px]"
        />
      </div>
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto">
          {results.length > 0 ? (
            <ul role="listbox" aria-label="Search results" className="py-2">
              {results.map((result) => (
                <li key={result.tool.id} role="option" aria-selected={false}>
                  <Link
                    href={`/${result.tool.category}/${result.tool.slug}`}
                    className="block px-4 py-2.5 hover:bg-indigo-50 transition-colors mx-2 rounded-lg"
                    onClick={() => {
                      setIsOpen(false);
                      setQuery('');
                    }}
                  >
                    <div className="font-medium text-gray-900 text-sm">
                      {result.tool.name}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {getCategoryName(result.tool.category)}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-4 text-sm text-gray-400 text-center">
              No tools found. Try browsing categories instead.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
