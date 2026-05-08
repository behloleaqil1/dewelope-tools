'use client';

interface OutputAreaProps {
  children: React.ReactNode;
  className?: string;
  hasContent: boolean;
}

/**
 * OutputArea - A wrapper for tool output sections.
 * Uses aria-live="polite" to announce results to screen readers.
 */
export default function OutputArea({ children, className = '', hasContent }: OutputAreaProps) {
  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className={`rounded-xl border border-gray-100 bg-white p-5 shadow-sm ${className}`}
    >
      {hasContent ? (
        children
      ) : (
        <div className="flex items-center justify-center py-8">
          <p className="text-gray-300 text-sm italic">Results will appear here</p>
        </div>
      )}
    </div>
  );
}
