'use client';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/**
 * PaginationControls - Navigation controls for paginated tool lists.
 * Renders Previous/Next buttons, page number indicators, and ellipsis for large page counts.
 * Clamps page numbers to [1, totalPages] range.
 */
export default function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationControlsProps) {
  const clampedPage = Math.max(1, Math.min(currentPage, totalPages));

  const handlePageChange = (page: number) => {
    const clamped = Math.max(1, Math.min(page, totalPages));
    onPageChange(clamped);
  };

  /**
   * Generate page numbers to display with ellipsis for large page counts.
   * Shows first page, last page, and pages around the current page.
   */
  const getPageNumbers = (): (number | 'ellipsis')[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | 'ellipsis')[] = [];

    // Always show first page
    pages.push(1);

    if (clampedPage > 3) {
      pages.push('ellipsis');
    }

    // Pages around current
    const start = Math.max(2, clampedPage - 1);
    const end = Math.min(totalPages - 1, clampedPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (clampedPage < totalPages - 2) {
      pages.push('ellipsis');
    }

    // Always show last page
    pages.push(totalPages);

    return pages;
  };

  return (
    <nav
      className="flex items-center justify-center gap-1 mt-8 py-4"
      aria-label="Pagination navigation"
    >
      <button
        onClick={() => handlePageChange(clampedPage - 1)}
        disabled={clampedPage <= 1}
        className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed text-gray-700 hover:bg-gray-100"
        aria-label="Go to previous page"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Previous
      </button>

      <div className="flex items-center gap-1 mx-2">
        {getPageNumbers().map((page, index) =>
          page === 'ellipsis' ? (
            <span
              key={`ellipsis-${index}`}
              className="px-2 py-2 text-sm text-gray-400"
              aria-hidden="true"
            >
              &hellip;
            </span>
          ) : (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`min-w-[40px] min-h-[40px] px-3 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                page === clampedPage
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              aria-label={`Go to page ${page}`}
              aria-current={page === clampedPage ? 'page' : undefined}
            >
              {page}
            </button>
          )
        )}
      </div>

      <button
        onClick={() => handlePageChange(clampedPage + 1)}
        disabled={clampedPage >= totalPages}
        className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed text-gray-700 hover:bg-gray-100"
        aria-label="Go to next page"
      >
        Next
        <svg
          className="w-4 h-4"
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
      </button>
    </nav>
  );
}
