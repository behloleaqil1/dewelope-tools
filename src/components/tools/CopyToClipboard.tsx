'use client';

import { useState, useCallback } from 'react';

interface CopyToClipboardProps {
  text: string;
  className?: string;
}

/**
 * CopyToClipboard - A button that copies text to the clipboard.
 * Shows "Copied!" confirmation for 3 seconds after a successful copy.
 */
export default function CopyToClipboard({ text, className = '' }: CopyToClipboardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Graceful fallback
    }
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
        copied
          ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-200 scale-95'
          : 'bg-gray-100 text-gray-600 border-2 border-gray-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 active:scale-95'
      } ${className}`}
      aria-label={copied ? 'Copied to clipboard' : 'Copy to clipboard'}
    >
      {copied ? (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          <span>Copied!</span>
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span>Copy</span>
        </>
      )}
    </button>
  );
}
