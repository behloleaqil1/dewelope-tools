'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

interface CharFreq {
  char: string;
  count: number;
  percentage: number;
}

/**
 * TextFrequencyAnalysis - Performs frequency analysis of characters in text.
 * Useful for cryptography, linguistics, and text analysis.
 */
export default function TextFrequencyAnalysis({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [frequencies, setFrequencies] = useState<CharFreq[]>([]);
  const [sortBy, setSortBy] = useState<'frequency' | 'alphabetical'>('frequency');
  const [includeSpaces, setIncludeSpaces] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!input) {
      setFrequencies([]);
      return;
    }

    debounceRef.current = setTimeout(() => {
      let text = input;
      if (!caseSensitive) text = text.toLowerCase();
      if (!includeSpaces) text = text.replace(/\s/g, '');

      const charMap = new Map<string, number>();
      for (const char of text) {
        charMap.set(char, (charMap.get(char) || 0) + 1);
      }

      const total = text.length;
      const freqs: CharFreq[] = Array.from(charMap.entries()).map(([char, count]) => ({
        char,
        count,
        percentage: (count / total) * 100,
      }));

      if (sortBy === 'frequency') {
        freqs.sort((a, b) => b.count - a.count);
      } else {
        freqs.sort((a, b) => a.char.localeCompare(b.char));
      }

      setFrequencies(freqs);
    }, 300);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input, sortBy, includeSpaces, caseSensitive]);

  const copyText = frequencies.map((f) => {
    const displayChar = f.char === ' ' ? '(space)' : f.char === '\n' ? '(newline)' : f.char === '\t' ? '(tab)' : f.char;
    return `${displayChar}: ${f.count} (${f.percentage.toFixed(2)}%)`;
  }).join('\n');

  const maxCount = frequencies.length > 0 ? frequencies[0].count : 1;

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter text to analyze
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to perform frequency analysis..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-40 resize-y font-mono"
        />
        <div className="flex flex-wrap gap-4 mt-3">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={includeSpaces}
              onChange={(e) => setIncludeSpaces(e.target.checked)}
              className="rounded"
            />
            Include spaces
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={(e) => setCaseSensitive(e.target.checked)}
              className="rounded"
            />
            Case sensitive
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'frequency' | 'alphabetical')}
            aria-label="Sort order"
            className="text-sm border border-gray-300 rounded px-2 py-1"
          >
            <option value="frequency">Sort by frequency</option>
            <option value="alphabetical">Sort alphabetically</option>
          </select>
        </div>
      </InputArea>

      <OutputArea hasContent={frequencies.length > 0}>
        {frequencies.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">
                Character Frequency ({frequencies.length} unique characters)
              </h3>
              <CopyToClipboard text={copyText} />
            </div>
            <div className="space-y-1 max-h-80 overflow-y-auto">
              {frequencies.map((f, idx) => {
                const displayChar = f.char === ' ' ? '␣' : f.char === '\n' ? '↵' : f.char === '\t' ? '⇥' : f.char;
                return (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <span className="w-8 font-mono text-center font-bold text-gray-800">{displayChar}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                      <div
                        className="bg-blue-500 h-full rounded-full transition-all"
                        style={{ width: `${(f.count / maxCount) * 100}%` }}
                      />
                    </div>
                    <span className="w-12 text-right font-mono text-gray-600">{f.count}</span>
                    <span className="w-16 text-right font-mono text-gray-500">{f.percentage.toFixed(1)}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
