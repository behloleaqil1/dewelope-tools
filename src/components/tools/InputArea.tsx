'use client';

interface InputAreaProps {
  children: React.ReactNode;
  error?: string;
  className?: string;
}

/**
 * InputArea - A wrapper for tool input sections.
 * Displays validation errors with aria-live="assertive" for immediate
 * screen reader announcements.
 */
export default function InputArea({ children, error, className = '' }: InputAreaProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {children}
      <div
        aria-live="assertive"
        aria-atomic="true"
        className="min-h-[1.25rem]"
      >
        {error && (
          <p className="text-sm text-red-500 font-medium flex items-center gap-1.5" role="alert">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
