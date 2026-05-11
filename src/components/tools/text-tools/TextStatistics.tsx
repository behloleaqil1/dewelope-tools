'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextStatistics - Show detailed text stats including average word length, longest word,
 * sentence count, paragraph count, and more.
 */
export default function TextStatistics({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [stats, setStats] = useState<Record<string, string | number> | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!input.trim()) {
      setStats(null);
      return;
    }

    debounceRef.current = setTimeout(() => {
      const text = input;
      const words = text.trim().split(/\s+/).filter((w) => w.length > 0);
      const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
      const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
      const charCount = text.length;
      const charNoSpaces = text.replace(/\s/g, '').length;
      const wordCount = words.length;
      const avgWordLength = wordCount > 0 ? (words.reduce((sum, w) => sum + w.length, 0) / wordCount).toFixed(2) : '0';
      const longestWord = words.reduce((longest, w) => w.length > longest.length ? w : longest, '');
      const shortestWord = words.reduce((shortest, w) => w.length < shortest.length ? w : shortest, words[0] || '');
      const uniqueWords = new Set(words.map((w) => w.toLowerCase().replace(/[^a-z]/g, ''))).size;

      setStats({
        'Characters (with spaces)': charCount,
        'Characters (no spaces)': charNoSpaces,
        'Words': wordCount,
        'Unique Words': uniqueWords,
        'Sentences': sentences.length,
        'Paragraphs': paragraphs.length,
        'Average Word Length': avgWordLength,
        'Longest Word': longestWord,
        'Shortest Word': shortestWord || '-',
        'Reading Time': `${Math.max(1, Math.ceil(wordCount / 200))} min`,
        'Speaking Time': `${Math.max(1, Math.ceil(wordCount / 130))} min`,
      });
    }, 200);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [input]);

  const copyText = stats ? Object.entries(stats).map(([k, v]) => `${k}: ${v}`).join('\n') : '';

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
          placeholder="Paste or type your text here..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-48 resize-y"
        />
      </InputArea>

      <OutputArea hasContent={stats !== null}>
        {stats && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.entries(stats).map(([key, value]) => (
                <div key={key} className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                  <div className="text-lg font-bold text-gray-800 font-mono">{value}</div>
                  <div className="text-xs text-gray-500 mt-1">{key}</div>
                </div>
              ))}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
