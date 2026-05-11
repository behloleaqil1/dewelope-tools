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
      className={`rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-5 transition-all duration-300 ${hasContent ? 'border-solid border-indigo-100 bg-white shadow-sm' : ''} ${className}`}
    >
      {hasContent ? (
        children
      ) : (
        <div className="flex flex-col items-center justify-center py-8 gap-2">
          <span className="text-2xl">✨</span>
          <p className="text-gray-400 text-sm font-medium">Results will appear here</p>
        </div>
      )}
    </div>
  );
}
