'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * VowelCounter - Counts vowels and consonants in text with per-vowel breakdown.
 */
export default function VowelCounter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{ vowels: number; consonants: number; breakdown: Record<string, number>; total: number } | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!input.trim()) { setResult(null); return; }

    debounceRef.current = setTimeout(() => {
      const text = input.toLowerCase();
      const vowelSet = new Set(['a', 'e', 'i', 'o', 'u']);
      const breakdown: Record<string, number> = { a: 0, e: 0, i: 0, o: 0, u: 0 };
      let vowels = 0, consonants = 0;

      for (const char of text) {
        if (/[a-z]/.test(char)) {
          if (vowelSet.has(char)) {
            vowels++;
            breakdown[char]++;
          } else {
            consonants++;
          }
        }
      }

      setResult({ vowels, consonants, breakdown, total: vowels + consonants });
    }, 200);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input]);

  const copyText = result ? `Vowels: ${result.vowels}\nConsonants: ${result.consonants}\nTotal letters: ${result.total}\n\nBreakdown: A=${result.breakdown.a} E=${result.breakdown.e} I=${result.breakdown.i} O=${result.breakdown.o} U=${result.breakdown.u}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Enter text for {toolName}</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type or paste text to count vowels and consonants..." aria-label={`Text input for ${toolName}`} className="input-field h-32 resize-y" />
      </InputArea>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.vowels}</div>
                <div className="text-xs text-gray-500">Vowels</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200 text-center">
                <div className="text-2xl font-bold text-green-600">{result.consonants}</div>
                <div className="text-xs text-gray-500">Consonants</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-gray-600">{result.total}</div>
                <div className="text-xs text-gray-500">Total Letters</div>
              </div>
            </div>
            <div className="flex justify-center gap-4">
              {Object.entries(result.breakdown).map(([vowel, count]) => (
                <div key={vowel} className="text-center">
                  <div className="text-lg font-bold text-purple-600 uppercase">{vowel}</div>
                  <div className="text-sm text-gray-600">{count}</div>
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
