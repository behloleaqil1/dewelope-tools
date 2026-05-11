'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SyllableCounter - Count syllables in text using English syllable rules.
 * Uses vowel group counting with common English exceptions.
 */
export default function SyllableCounter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{ total: number; words: { word: string; count: number }[] } | null>(null);

  const countSyllables = (word: string): number => {
    const w = word.toLowerCase().replace(/[^a-z]/g, '');
    if (!w) return 0;
    if (w.length <= 3) return 1;

    let count = 0;
    const vowels = 'aeiouy';
    let prevVowel = false;

    for (let i = 0; i < w.length; i++) {
      const isVowel = vowels.includes(w[i]);
      if (isVowel && !prevVowel) {
        count++;
      }
      prevVowel = isVowel;
    }

    // Silent e at end
    if (w.endsWith('e') && !w.endsWith('le') && count > 1) {
      count--;
    }

    // Words ending in 'le' preceded by a consonant
    if (w.endsWith('le') && w.length > 2 && !vowels.includes(w[w.length - 3])) {
      // Already counted
    }

    // Ensure at least 1 syllable
    return Math.max(1, count);
  };

  const analyze = () => {
    const trimmed = input.trim();
    if (!trimmed) {
      setResult(null);
      return;
    }

    const words = trimmed.split(/\s+/).filter((w) => w.replace(/[^a-zA-Z]/g, '').length > 0);
    const wordResults = words.map((word) => ({
      word: word.replace(/[^a-zA-Z'-]/g, ''),
      count: countSyllables(word),
    })).filter((w) => w.word.length > 0);

    const total = wordResults.reduce((sum, w) => sum + w.count, 0);
    setResult({ total, words: wordResults });
  };

  const copyText = result
    ? `Total syllables: ${result.total}\nWord count: ${result.words.length}\n\nBreakdown:\n${result.words.map((w) => `${w.word}: ${w.count}`).join('\n')}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter text to count syllables
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. The quick brown fox jumps over the lazy dog"
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y"
        />
      </InputArea>

      <button onClick={analyze} aria-label="Count syllables" className="btn-primary">
        Count Syllables
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.total}</div>
                <div className="text-xs text-gray-500 mt-1">Total Syllables</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-green-600">{result.words.length}</div>
                <div className="text-xs text-gray-500 mt-1">Words</div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-48 overflow-y-auto">
              <div className="text-sm font-medium text-gray-700 mb-2">Word Breakdown</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                {result.words.map((w, i) => (
                  <div key={i} className="text-sm text-gray-600">
                    <span className="font-mono">{w.word}</span>: <span className="font-bold">{w.count}</span>
                  </div>
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
