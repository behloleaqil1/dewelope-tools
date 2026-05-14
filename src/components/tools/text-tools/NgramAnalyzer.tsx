'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * NgramAnalyzer - Generate n-grams from text and show frequency
 */
export default function NgramAnalyzer({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [n, setN] = useState('2');
  const [ngramType, setNgramType] = useState<'word' | 'char'>('word');
  const [result, setResult] = useState<Array<[string, number]>>([]);
  const [error, setError] = useState<string | undefined>();

  function analyze() {
    setError(undefined);
    setResult([]);

    if (!input.trim()) { setError('Please enter text'); return; }

    const size = parseInt(n);
    if (isNaN(size) || size < 1 || size > 10) { setError('N must be between 1 and 10'); return; }

    const freq = new Map<string, number>();

    if (ngramType === 'word') {
      const words = input.trim().toLowerCase().split(/\s+/);
      for (let i = 0; i <= words.length - size; i++) {
        const ngram = words.slice(i, i + size).join(' ');
        freq.set(ngram, (freq.get(ngram) || 0) + 1);
      }
    } else {
      const text = input.toLowerCase();
      for (let i = 0; i <= text.length - size; i++) {
        const ngram = text.substring(i, i + size);
        freq.set(ngram, (freq.get(ngram) || 0) + 1);
      }
    }

    const sorted = [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 50);
    setResult(sorted);
  }

  const copyText = result.map(([ngram, count]) => `${ngram}: ${count}`).join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Text Input</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter text to generate n-grams" aria-label={`Text input for ${toolName}`} className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y" />
        <div className="flex gap-3 mt-3">
          <div className="flex-1">
            <label htmlFor={`${toolId}-n`} className="block text-sm font-medium text-gray-700 mb-1">N (gram size)</label>
            <input id={`${toolId}-n`} type="number" min="1" max="10" value={n} onChange={(e) => setN(e.target.value)} aria-label={`N-gram size for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex-1">
            <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select id={`${toolId}-type`} value={ngramType} onChange={(e) => setNgramType(e.target.value as 'word' | 'char')} aria-label={`N-gram type for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="word">Word n-grams</option>
              <option value="char">Character n-grams</option>
            </select>
          </div>
        </div>
      </InputArea>

      <button onClick={analyze} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Generate N-grams</button>

      <OutputArea hasContent={result.length > 0}>
        {result.length > 0 && (
          <div className="space-y-3">
            <div className="text-sm text-gray-600 mb-2">Top {result.length} {ngramType} {n}-grams:</div>
            <div className="max-h-64 overflow-y-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b"><th className="text-left p-2">N-gram</th><th className="text-right p-2">Count</th></tr></thead>
                <tbody>
                  {result.map(([ngram, count], i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="p-2 font-mono">{ngram}</td>
                      <td className="p-2 text-right font-semibold">{count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
