'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const STOP_WORDS = new Set(['the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'shall', 'can', 'need', 'dare', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through', 'during', 'before', 'after', 'and', 'but', 'or', 'nor', 'not', 'so', 'yet', 'both', 'either', 'neither', 'each', 'every', 'all', 'any', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'only', 'own', 'same', 'than', 'too', 'very', 'just', 'because', 'if', 'when', 'that', 'this', 'it', 'its', 'i', 'me', 'my', 'we', 'our', 'you', 'your', 'he', 'him', 'his', 'she', 'her', 'they', 'them', 'their', 'what', 'which', 'who', 'whom']);

/**
 * WordFrequencyAnalyzer - Analyzes word frequency in text and displays as a table.
 */
export default function WordFrequencyAnalyzer({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [text, setText] = useState('');
  const [excludeStopWords, setExcludeStopWords] = useState(true);
  const [minLength, setMinLength] = useState(2);
  const [error, setError] = useState<string | undefined>();
  const [result, setResult] = useState<{ words: { word: string; count: number; percentage: number }[]; totalWords: number; uniqueWords: number } | null>(null);

  const analyze = () => {
    setError(undefined);
    setResult(null);
    if (!text.trim()) { setError('Please enter text to analyze'); return; }

    const words = text.toLowerCase().replace(/[^a-z\s'-]/g, '').split(/\s+/).filter(w => w.length >= minLength);
    const filtered = excludeStopWords ? words.filter(w => !STOP_WORDS.has(w)) : words;

    const freq: Record<string, number> = {};
    for (const word of filtered) {
      freq[word] = (freq[word] || 0) + 1;
    }

    const totalWords = filtered.length;
    const sorted = Object.entries(freq)
      .map(([word, count]) => ({ word, count, percentage: (count / totalWords) * 100 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 50);

    setResult({ words: sorted, totalWords, uniqueWords: Object.keys(freq).length });
  };

  const copyText = result ? `Total words: ${result.totalWords}\nUnique words: ${result.uniqueWords}\n\n${result.words.map(w => `${w.word}: ${w.count} (${w.percentage.toFixed(1)}%)`).join('\n')}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Text to Analyze</label>
        <textarea id={`${toolId}-input`} value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste your text here to analyze word frequency..." aria-label={`Text input for ${toolName}`} className="input-field min-h-[100px]" />
        <div className="flex items-center gap-4 mt-2">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={excludeStopWords} onChange={(e) => setExcludeStopWords(e.target.checked)} aria-label="Exclude common stop words" className="rounded" />
            Exclude stop words
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            Min length:
            <input type="number" min={1} max={10} value={minLength} onChange={(e) => setMinLength(parseInt(e.target.value) || 1)} aria-label="Minimum word length" className="input-field w-16" />
          </label>
        </div>
      </InputArea>
      <button onClick={analyze} aria-label="Analyze word frequency" className="btn-primary">Analyze</button>
      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-800">{result.totalWords}</div>
                <div className="text-xs text-gray-500">Total Words</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-800">{result.uniqueWords}</div>
                <div className="text-xs text-gray-500">Unique Words</div>
              </div>
            </div>
            <div className="max-h-64 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 sticky top-0">
                  <tr><th className="text-left p-2">Word</th><th className="text-right p-2">Count</th><th className="text-right p-2">%</th><th className="p-2 w-24">Bar</th></tr>
                </thead>
                <tbody>
                  {result.words.map((w, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="p-2 font-mono">{w.word}</td>
                      <td className="p-2 text-right">{w.count}</td>
                      <td className="p-2 text-right">{w.percentage.toFixed(1)}%</td>
                      <td className="p-2"><div className="bg-blue-200 h-3 rounded" style={{ width: `${Math.min(100, (w.count / result.words[0].count) * 100)}%` }} /></td>
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
