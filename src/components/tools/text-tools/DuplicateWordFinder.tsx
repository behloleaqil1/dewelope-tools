'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * DuplicateWordFinder - Finds and highlights duplicate/repeated words in text.
 * Detects consecutive repeated words and overall word frequency duplicates.
 */
export default function DuplicateWordFinder({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<{ consecutive: { word: string; line: number; position: number }[]; frequent: { word: string; count: number }[] } | null>(null);
  const [caseSensitive, setCaseSensitive] = useState(false);

  const findDuplicates = () => {
    if (!input.trim()) {
      setResults(null);
      return;
    }

    const lines = input.split('\n');
    const consecutive: { word: string; line: number; position: number }[] = [];
    const wordCounts: Map<string, number> = new Map();

    lines.forEach((line, lineIndex) => {
      const words = line.split(/\s+/).filter(Boolean);
      words.forEach((word, wordIndex) => {
        const normalizedWord = caseSensitive ? word : word.toLowerCase();
        const cleanWord = normalizedWord.replace(/[.,!?;:'"()[\]{}]/g, '');

        if (cleanWord) {
          wordCounts.set(cleanWord, (wordCounts.get(cleanWord) || 0) + 1);
        }

        if (wordIndex > 0) {
          const prevWord = caseSensitive ? words[wordIndex - 1] : words[wordIndex - 1].toLowerCase();
          const prevClean = prevWord.replace(/[.,!?;:'"()[\]{}]/g, '');
          if (cleanWord && cleanWord === prevClean) {
            consecutive.push({ word: words[wordIndex], line: lineIndex + 1, position: wordIndex + 1 });
          }
        }
      });
    });

    const frequent = Array.from(wordCounts.entries())
      .filter(([, count]) => count > 1)
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 50);

    setResults({ consecutive, frequent });
  };

  const copyText = results
    ? `Consecutive duplicates: ${results.consecutive.length}\n${results.consecutive.map((d) => `  "${d.word}" at line ${d.line}, position ${d.position}`).join('\n')}\n\nRepeated words:\n${results.frequent.map((f) => `  "${f.word}" × ${f.count}`).join('\n')}`
    : '';

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
          placeholder="Paste your text here to find duplicate words..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-48 resize-y"
        />
      </InputArea>

      <div className="flex items-center gap-4">
        <button onClick={findDuplicates} aria-label="Find duplicate words" className="btn-primary">
          Find Duplicates
        </button>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={(e) => setCaseSensitive(e.target.checked)}
            aria-label="Case sensitive matching"
            className="rounded border-gray-300"
          />
          Case sensitive
        </label>
      </div>

      <OutputArea hasContent={results !== null}>
        {results && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Consecutive Duplicates ({results.consecutive.length})
              </h3>
              {results.consecutive.length === 0 ? (
                <p className="text-sm text-green-600">No consecutive duplicate words found.</p>
              ) : (
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 max-h-48 overflow-auto">
                  {results.consecutive.map((d, i) => (
                    <div key={i} className="text-sm text-gray-800 py-1">
                      <span className="font-mono text-red-600">&quot;{d.word}&quot;</span>
                      <span className="text-gray-500"> — line {d.line}, word {d.position}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Repeated Words ({results.frequent.length})
              </h3>
              {results.frequent.length === 0 ? (
                <p className="text-sm text-green-600">No repeated words found.</p>
              ) : (
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 max-h-48 overflow-auto">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {results.frequent.map((f, i) => (
                      <div key={i} className="text-sm text-gray-800 flex justify-between px-2 py-1 bg-white rounded border">
                        <span className="font-mono truncate">{f.word}</span>
                        <span className="text-gray-500 ml-2">×{f.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
