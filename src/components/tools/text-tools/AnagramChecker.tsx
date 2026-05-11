'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * AnagramChecker - Checks if two words or phrases are anagrams of each other.
 * Ignores spaces, punctuation, and case.
 */
export default function AnagramChecker({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [result, setResult] = useState<{ isAnagram: boolean; sorted1: string; sorted2: string } | null>(null);
  const [error, setError] = useState<string | undefined>();

  const check = () => {
    setError(undefined);
    setResult(null);

    if (!text1.trim() || !text2.trim()) {
      setError('Please enter both words or phrases');
      return;
    }

    const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    const sorted = (s: string) => clean(s).split('').sort().join('');

    const sorted1 = sorted(text1);
    const sorted2 = sorted(text2);
    const isAnagram = sorted1.length > 0 && sorted1 === sorted2;

    setResult({ isAnagram, sorted1, sorted2 });
  };

  const copyText = result
    ? `"${text1}" and "${text2}" are ${result.isAnagram ? '' : 'NOT '}anagrams of each other.`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-text1`} className="block text-sm font-medium text-gray-700 mb-1">
          First word or phrase
        </label>
        <input
          id={`${toolId}-text1`}
          type="text"
          value={text1}
          onChange={(e) => setText1(e.target.value)}
          placeholder="e.g. listen"
          aria-label={`First text for ${toolName}`}
          className="input-field"
        />
        <label htmlFor={`${toolId}-text2`} className="block text-sm font-medium text-gray-700 mb-1 mt-3">
          Second word or phrase
        </label>
        <input
          id={`${toolId}-text2`}
          type="text"
          value={text2}
          onChange={(e) => setText2(e.target.value)}
          placeholder="e.g. silent"
          aria-label={`Second text for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <button onClick={check} aria-label="Check anagram" className="btn-primary">
        Check Anagram
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className={`text-center p-4 rounded-lg border ${result.isAnagram ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className={`text-2xl font-bold ${result.isAnagram ? 'text-green-600' : 'text-red-600'}`}>
                {result.isAnagram ? '✓ Anagram' : '✗ Not an Anagram'}
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-2 text-sm">
              <div><span className="font-medium text-gray-600">Sorted letters (1):</span> <span className="font-mono">{result.sorted1}</span></div>
              <div><span className="font-medium text-gray-600">Sorted letters (2):</span> <span className="font-mono">{result.sorted2}</span></div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
