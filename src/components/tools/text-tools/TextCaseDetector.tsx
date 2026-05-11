'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

interface CaseResult {
  name: string;
  match: boolean;
  description: string;
}

/**
 * TextCaseDetector - Detect what case format text is in (camelCase, snake_case, UPPER, etc.)
 * Analyzes input text and identifies matching naming conventions.
 */
export default function TextCaseDetector({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<CaseResult[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!input.trim()) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(() => {
      const text = input.trim();
      const detected: CaseResult[] = [
        {
          name: 'camelCase',
          match: /^[a-z][a-zA-Z0-9]*$/.test(text) && /[A-Z]/.test(text),
          description: 'Starts lowercase, words separated by uppercase letters',
        },
        {
          name: 'PascalCase',
          match: /^[A-Z][a-zA-Z0-9]*$/.test(text) && /[a-z]/.test(text) && /[A-Z].*[a-z]/.test(text),
          description: 'Each word starts with uppercase letter',
        },
        {
          name: 'snake_case',
          match: /^[a-z][a-z0-9]*(_[a-z0-9]+)+$/.test(text),
          description: 'Lowercase words separated by underscores',
        },
        {
          name: 'SCREAMING_SNAKE_CASE',
          match: /^[A-Z][A-Z0-9]*(_[A-Z0-9]+)+$/.test(text),
          description: 'Uppercase words separated by underscores',
        },
        {
          name: 'kebab-case',
          match: /^[a-z][a-z0-9]*(-[a-z0-9]+)+$/.test(text),
          description: 'Lowercase words separated by hyphens',
        },
        {
          name: 'UPPER-KEBAB-CASE',
          match: /^[A-Z][A-Z0-9]*(-[A-Z0-9]+)+$/.test(text),
          description: 'Uppercase words separated by hyphens',
        },
        {
          name: 'dot.case',
          match: /^[a-z][a-z0-9]*(\.[a-z0-9]+)+$/.test(text),
          description: 'Lowercase words separated by dots',
        },
        {
          name: 'UPPERCASE',
          match: /^[A-Z][A-Z0-9]*$/.test(text) && text.length > 1 && !/[_\-.]/.test(text),
          description: 'All characters are uppercase',
        },
        {
          name: 'lowercase',
          match: /^[a-z][a-z0-9]*$/.test(text) && text.length > 1 && !/[_\-.]/.test(text),
          description: 'All characters are lowercase',
        },
        {
          name: 'Title Case',
          match: /^[A-Z][a-z]+(\s[A-Z][a-z]+)+$/.test(text),
          description: 'Each word starts with uppercase, separated by spaces',
        },
        {
          name: 'Sentence case',
          match: /^[A-Z][a-z]+(\s[a-z]+)+$/.test(text),
          description: 'First word capitalized, rest lowercase',
        },
        {
          name: 'flatcase',
          match: /^[a-z]+$/.test(text) && text.length > 1,
          description: 'All lowercase with no separators',
        },
      ];
      setResults(detected);
    }, 200);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input]);

  const matchedCases = results.filter((r) => r.match);
  const copyText = matchedCases.length > 0
    ? `Input: ${input}\nDetected: ${matchedCases.map((r) => r.name).join(', ')}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter text to detect case format
        </label>
        <input
          id={`${toolId}-input`}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. myVariableName, my_variable, MY_CONSTANT"
          aria-label={`Text input for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <OutputArea hasContent={results.length > 0}>
        {results.length > 0 && (
          <div className="space-y-3">
            {matchedCases.length > 0 && (
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <div className="text-sm font-medium text-green-800 mb-1">Detected Format:</div>
                <div className="text-lg font-bold text-green-700">
                  {matchedCases.map((r) => r.name).join(', ')}
                </div>
              </div>
            )}
            {matchedCases.length === 0 && (
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <div className="text-sm font-medium text-yellow-800">
                  No standard case format detected. The text may be mixed or use a custom format.
                </div>
              </div>
            )}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">All Formats Checked</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {results.map((r, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded border text-sm ${r.match ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`text-lg ${r.match ? 'text-green-500' : 'text-gray-300'}`}>
                        {r.match ? '✓' : '✗'}
                      </span>
                      <span className={`font-mono font-medium ${r.match ? 'text-green-700' : 'text-gray-500'}`}>
                        {r.name}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 ml-7">{r.description}</div>
                  </div>
                ))}
              </div>
            </div>
            {copyText && <CopyToClipboard text={copyText} />}
          </div>
        )}
      </OutputArea>
    </div>
  );
}
