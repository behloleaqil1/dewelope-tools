'use client';

import { useState, useEffect, useRef } from 'react';
import { ToolEngineProps } from '@/types';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';
import { testRegex, RegexMatch } from '@/lib/developer-tools';

const MAX_LENGTH = 1048576; // 1MB

/**
 * RegexTester - Test regex patterns against strings with highlighted matches.
 * Displays syntax-highlighted output showing matched portions.
 * Requirements: 6.2, 6.3, 6.5, 6.6, 6.7
 */
export default function RegexTester({ toolId }: ToolEngineProps) {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('');
  const [matches, setMatches] = useState<RegexMatch[]>([]);
  const [error, setError] = useState<string | undefined>();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!pattern || !testString) {
      setMatches([]);
      setError(undefined);
      return;
    }

    if (testString.length > MAX_LENGTH) {
      setError(`Test string exceeds maximum size of 1 MB (${MAX_LENGTH.toLocaleString()} characters)`);
      setMatches([]);
      return;
    }

    debounceRef.current = setTimeout(() => {
      const result = testRegex(pattern, flags, testString);
      if (result.valid) {
        setMatches(result.matches);
        setError(undefined);
      } else {
        setMatches([]);
        setError(result.error);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [pattern, flags, testString]);

  /**
   * Render the test string with highlighted matches.
   */
  function renderHighlightedText(): React.ReactNode {
    if (matches.length === 0) {
      return <span className="text-gray-800">{testString}</span>;
    }

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    const sortedMatches = [...matches].sort((a, b) => a.index - b.index);

    sortedMatches.forEach((m, i) => {
      if (m.index > lastIndex) {
        parts.push(
          <span key={`text-${i}`} className="text-gray-800">
            {testString.slice(lastIndex, m.index)}
          </span>
        );
      }
      parts.push(
        <span
          key={`match-${i}`}
          className="bg-yellow-200 text-yellow-900 rounded px-0.5 font-semibold"
        >
          {m.match}
        </span>
      );
      lastIndex = m.index + m.match.length;
    });

    if (lastIndex < testString.length) {
      parts.push(
        <span key="text-end" className="text-gray-800">
          {testString.slice(lastIndex)}
        </span>
      );
    }

    return parts;
  }

  const matchSummary = matches.length > 0
    ? matches.map((m) => `"${m.match}" at index ${m.index}`).join('\n')
    : '';

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
        <InputArea error={error}>
          <label htmlFor={`${toolId}-pattern`} className="block text-sm font-medium text-gray-700 mb-1">
            Regex Pattern
          </label>
          <input
            id={`${toolId}-pattern`}
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="Enter regex pattern (e.g. \d+)"
            aria-label="Regular expression pattern"
            className="w-full p-3 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]"
          />
        </InputArea>

        <div>
          <label htmlFor={`${toolId}-flags`} className="block text-sm font-medium text-gray-700 mb-1">
            Flags
          </label>
          <input
            id={`${toolId}-flags`}
            type="text"
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
            placeholder="gi"
            aria-label="Regex flags"
            className="w-full p-3 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[80px] min-h-[44px]"
          />
        </div>
      </div>

      <div>
        <label htmlFor={`${toolId}-test`} className="block text-sm font-medium text-gray-700 mb-1">
          Test String
        </label>
        <textarea
          id={`${toolId}-test`}
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          placeholder="Enter text to test the regex pattern against..."
          aria-label="Test string for regex matching"
          className="w-full h-36 p-3 border border-gray-300 rounded-lg resize-y font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="text-xs text-gray-500 text-right">
          {testString.length.toLocaleString()} / {MAX_LENGTH.toLocaleString()} characters
        </div>
      </div>

      <OutputArea hasContent={matches.length > 0 || (!!testString && !!pattern && !error)}>
        <div className="space-y-3">
          <div className="text-sm text-gray-600 font-medium">
            {matches.length} match{matches.length !== 1 ? 'es' : ''} found
          </div>
          {testString && pattern && !error && (
            <pre className="whitespace-pre-wrap text-sm font-mono p-3 bg-white rounded border border-gray-200">
              {renderHighlightedText()}
            </pre>
          )}
          {matches.length > 0 && (
            <div className="space-y-1">
              <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">Match Details</div>
              <div className="max-h-40 overflow-y-auto">
                {matches.map((m, i) => (
                  <div key={i} className="text-xs font-mono text-gray-700 py-0.5">
                    <span className="text-blue-600">#{i + 1}</span>{' '}
                    <span className="bg-yellow-100 px-1 rounded">&quot;{m.match}&quot;</span>{' '}
                    at index {m.index}
                    {m.groups && m.groups.length > 0 && (
                      <span className="text-purple-600"> groups: [{m.groups.join(', ')}]</span>
                    )}
                  </div>
                ))}
              </div>
              <CopyToClipboard text={matchSummary} />
            </div>
          )}
        </div>
      </OutputArea>
    </div>
  );
}
