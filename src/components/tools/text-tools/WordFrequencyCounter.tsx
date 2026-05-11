'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * WordFrequencyCounter - Counts the frequency of each word in the input text.
 * Displays results sorted by frequency (most common first).
 */
export default function WordFrequencyCounter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<{ word: string; count: number }[]>([]);
  const [totalWords, setTotalWords] = useState(0);
  const [uniqueWords, setUniqueWords] = useState(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!input.trim()) {
      setResults([]);
      setTotalWords(0);
      setUniqueWords(0);
      return;
    }

    debounceRef.current = setTimeout(() => {
      const words = input
        .toLowerCase()
        .replace(/[^\w\s'-]/g, '')
        .split(/\s+/)
        .filter((w) => w.length > 0);

      const freq: Record<string, number> = {};
      for (const word of words) {
        freq[word] = (freq[word] || 0) + 1;
      }

      const sorted = Object.entries(freq)
        .map(([word, count]) => ({ word, count }))
        .sort((a, b) => b.count - a.count);

      setResults(sorted);
      setTotalWords(words.length);
      setUniqueWords(sorted.length);
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [input]);

  const copyText = results.length > 0
    ? `Total words: ${totalWords}\nUnique words: ${uniqueWords}\n\n${results.map((r) => `${r.word}: ${r.count}`).join('\n')}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter text to analyze word frequency
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your text here to see how often each word appears..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-40 resize-y"
        />
      </InputArea>

      <OutputArea hasContent={results.length > 0}>
        {results.length > 0 && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600">{totalWords}</div>
                <div className="text-xs text-gray-500">Total Words</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-green-600">{uniqueWords}</div>
                <div className="text-xs text-gray-500">Unique Words</div>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto border border-gray-200 rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="text-left px-4 py-2 text-gray-600 font-medium">#</th>
                    <th className="text-left px-4 py-2 text-gray-600 font-medium">Word</th>
                    <th className="text-right px-4 py-2 text-gray-600 font-medium">Count</th>
                    <th className="text-right px-4 py-2 text-gray-600 font-medium">%</th>
                  </tr>
                </thead>
                <tbody>
                  {results.slice(0, 100).map((r, i) => (
                    <tr key={r.word} className="border-t border-gray-100">
                      <td className="px-4 py-2 text-gray-400">{i + 1}</td>
                      <td className="px-4 py-2 font-mono text-gray-800">{r.word}</td>
                      <td className="px-4 py-2 text-right font-semibold text-gray-700">{r.count}</td>
                      <td className="px-4 py-2 text-right text-gray-500">
                        {((r.count / totalWords) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {results.length > 100 && (
              <p className="text-xs text-gray-500 text-center">Showing top 100 of {results.length} unique words</p>
            )}

            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
