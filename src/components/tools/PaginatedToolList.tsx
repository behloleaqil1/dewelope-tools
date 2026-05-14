'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { ToolConfig } from '@/types';
import PaginationControls from './PaginationControls';

interface PaginatedToolListProps {
  tools: ToolConfig[];
  pageSize: number;
}

/**
 * Client component handling pagination state for large category tool lists.
 * First page is visible on initial SSG render (no JS required).
 * Navigation controls appear when totalPages > 1.
 */
export default function PaginatedToolList({ tools, pageSize }: PaginatedToolListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(tools.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const visibleTools = tools.slice(startIndex, startIndex + pageSize);

  return (
    <section aria-label="Tools list">
      <h2 className="sr-only">Available Tools</h2>
      <ul className="space-y-3">
        {visibleTools.map((tool) => (
          <li key={tool.id}>
            <Link
              href={`/${tool.category}/${tool.slug}`}
              className="card p-5 block group"
            >
              <article>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {tool.name}
                  </h3>
                  <svg
                    className="w-4 h-4 text-gray-300 group-hover:text-indigo-400 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
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
      {totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </section>
  );
}
