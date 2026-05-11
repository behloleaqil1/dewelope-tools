'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * WordDensityAnalyzer - Analyze keyword density for SEO (1-word, 2-word, 3-word phrases).
 */
export default function WordDensityAnalyzer({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{
    totalWords: number;
    oneWord: { word: string; count: number; density: number }[];
    twoWord: { word: string; count: number; density: number }[];
    threeWord: { word: string; count: number; density: number }[];
  } | null>(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<1 | 2 | 3>(1);

  const STOP_WORDS = new Set(['the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'shall', 'can', 'need', 'dare', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'and', 'but', 'or', 'nor', 'not', 'so', 'yet', 'both', 'either', 'neither', 'each', 'every', 'all', 'any', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'only', 'own', 'same', 'than', 'too', 'very', 'just', 'because', 'if', 'when', 'while', 'that', 'this', 'these', 'those', 'it', 'its', 'he', 'she', 'they', 'them', 'his', 'her', 'their', 'my', 'your', 'our', 'i', 'me', 'we', 'you', 'him', 'us']);

  const analyze = () => {
    if (!input.trim()) {
      setError('Please enter some text to analyze');
      setResult(null);
      return;
    }
    setError('');

    const words = input.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);
    const totalWords = words.length;

    if (totalWords < 2) {
      setError('Please enter at least 2 words');
      setResult(null);
      return;
    }

    // 1-word analysis (excluding stop words)
    const oneWordMap: Record<string, number> = {};
    words.forEach(w => {
      if (!STOP_WORDS.has(w) && w.length > 1) {
        oneWordMap[w] = (oneWordMap[w] || 0) + 1;
      }
    });

    // N-gram analysis
    const getNgrams = (n: number) => {
      const map: Record<string, number> = {};
      for (let i = 0; i <= words.length - n; i++) {
        const phrase = words.slice(i, i + n).join(' ');
        map[phrase] = (map[phrase] || 0) + 1;
      }
      return map;
    };

    const twoWordMap = getNgrams(2);
    const threeWordMap = getNgrams(3);

    const toSorted = (map: Record<string, number>) =>
      Object.entries(map)
        .map(([word, count]) => ({ word, count, density: (count / totalWords) * 100 }))
        .filter(item => item.count >= 2)
        .sort((a, b) => b.count - a.count)
        .slice(0, 20);

    setResult({
      totalWords,
      oneWord: toSorted(oneWordMap),
      twoWord: toSorted(twoWordMap),
      threeWord: toSorted(threeWordMap),
    });
  };

  const currentData = result ? (activeTab === 1 ? result.oneWord : activeTab === 2 ? result.twoWord : result.threeWord) : [];
  const copyText = result
    ? `Total Words: ${result.totalWords}\n\nTop Keywords (${activeTab}-word):\n${currentData.map(d => `${d.word}: ${d.count} (${d.density.toFixed(2)}%)`).join('\n')}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter text to analyze keyword density
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your content here to analyze keyword density for SEO..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-40 resize-y"
        />
      </InputArea>

      <button onClick={analyze} aria-label="Analyze keyword density" className="btn-primary">
        Analyze Density
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-blue-600">{result.totalWords}</div>
              <div className="text-xs text-gray-500">Total Words</div>
            </div>

            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
              {([1, 2, 3] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 px-3 text-sm rounded-md transition-colors ${activeTab === tab ? 'bg-white shadow text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-800'}`}
                >
                  {tab}-Word
                </button>
              ))}
            </div>

            {currentData.length > 0 ? (
              <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-100">
                      <th className="text-left p-2 font-medium text-gray-700">Keyword</th>
                      <th className="text-center p-2 font-medium text-gray-700">Count</th>
                      <th className="text-center p-2 font-medium text-gray-700">Density</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map((item, i) => (
                      <tr key={i} className="border-b border-gray-100 last:border-0">
                        <td className="p-2 font-mono text-gray-800">{item.word}</td>
                        <td className="p-2 text-center text-gray-600">{item.count}</td>
                        <td className="p-2 text-center">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${item.density > 3 ? 'bg-red-100 text-red-700' : item.density > 1.5 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                            {item.density.toFixed(2)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-sm text-gray-500 text-center py-4">No repeated {activeTab}-word phrases found (minimum 2 occurrences)</div>
            )}

            <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded border border-blue-200">
              💡 Ideal keyword density for SEO is typically 1-3%. Above 3% may be considered keyword stuffing.
            </div>

            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
