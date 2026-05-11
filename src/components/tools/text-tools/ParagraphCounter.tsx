'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ParagraphCounter - Counts paragraphs with stats (avg words per paragraph, longest, shortest).
 */
export default function ParagraphCounter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{
    count: number;
    avgWords: number;
    longest: { index: number; words: number; text: string };
    shortest: { index: number; words: number; text: string };
    totalWords: number;
    paragraphs: { index: number; words: number }[];
  } | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!input.trim()) { setResult(null); return; }

    debounceRef.current = setTimeout(() => {
      const paragraphs = input.split(/\n\s*\n/).filter(p => p.trim().length > 0);
      if (paragraphs.length === 0) { setResult(null); return; }

      const stats = paragraphs.map((p, i) => ({
        index: i + 1,
        words: p.trim().split(/\s+/).filter(w => w.length > 0).length,
        text: p.trim(),
      }));

      const totalWords = stats.reduce((sum, s) => sum + s.words, 0);
      const avgWords = totalWords / stats.length;
      const longest = stats.reduce((max, s) => s.words > max.words ? s : max, stats[0]);
      const shortest = stats.reduce((min, s) => s.words < min.words ? s : min, stats[0]);

      setResult({
        count: stats.length,
        avgWords: Math.round(avgWords * 10) / 10,
        longest: { index: longest.index, words: longest.words, text: longest.text.slice(0, 80) },
        shortest: { index: shortest.index, words: shortest.words, text: shortest.text.slice(0, 80) },
        totalWords,
        paragraphs: stats.map(s => ({ index: s.index, words: s.words })),
      });
    }, 300);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input]);

  const copyText = result
    ? `Paragraphs: ${result.count}\nTotal Words: ${result.totalWords}\nAvg Words/Paragraph: ${result.avgWords}\nLongest: Paragraph ${result.longest.index} (${result.longest.words} words)\nShortest: Paragraph ${result.shortest.index} (${result.shortest.words} words)`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter text (separate paragraphs with blank lines)
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your text here...&#10;&#10;Separate paragraphs with blank lines.&#10;&#10;Each block of text separated by an empty line counts as one paragraph."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-48 resize-y"
        />
      </InputArea>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.count}</div>
                <div className="text-xs text-gray-500">Paragraphs</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.totalWords}</div>
                <div className="text-xs text-gray-500">Total Words</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.avgWords}</div>
                <div className="text-xs text-gray-500">Avg Words/Para</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <div className="text-sm font-medium text-green-700">Longest (#{result.longest.index})</div>
                <div className="text-lg font-bold text-green-600">{result.longest.words} words</div>
                <div className="text-xs text-gray-500 mt-1 truncate">{result.longest.text}...</div>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                <div className="text-sm font-medium text-orange-700">Shortest (#{result.shortest.index})</div>
                <div className="text-lg font-bold text-orange-600">{result.shortest.words} words</div>
                <div className="text-xs text-gray-500 mt-1 truncate">{result.shortest.text}...</div>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="text-sm font-medium text-gray-700 mb-2">Words per paragraph:</div>
              <div className="flex flex-wrap gap-2">
                {result.paragraphs.map(p => (
                  <span key={p.index} className="px-2 py-1 text-xs bg-white border border-gray-200 rounded">
                    #{p.index}: {p.words}
                  </span>
                ))}
              </div>
            </div>

            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
