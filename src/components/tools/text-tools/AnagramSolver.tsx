'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * AnagramSolver - Find anagrams of input word by generating permutations
 */
export default function AnagramSolver({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<string[]>([]);
  const [error, setError] = useState<string | undefined>();

  function solve() {
    setError(undefined);
    setResult([]);

    const word = input.trim().toLowerCase();
    if (!word) { setError('Please enter a word'); return; }
    if (word.length > 8) { setError('Word must be 8 characters or fewer (too many permutations)'); return; }
    if (!/^[a-z]+$/.test(word)) { setError('Please enter only letters'); return; }

    const perms = new Set<string>();
    permute(word.split(''), 0, perms);
    perms.delete(word);

    const sorted = [...perms].sort();
    setResult(sorted);
  }

  function permute(arr: string[], start: number, results: Set<string>) {
    if (start === arr.length - 1) {
      results.add(arr.join(''));
      return;
    }
    for (let i = start; i < arr.length; i++) {
      [arr[start], arr[i]] = [arr[i], arr[start]];
      permute(arr, start + 1, results);
      [arr[start], arr[i]] = [arr[i], arr[start]];
    }
  }

  const copyText = result.join(', ');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Word (max 8 letters)</label>
        <input id={`${toolId}-input`} type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter a word to find anagrams" aria-label={`Word input for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" maxLength={8} />
      </InputArea>

      <button onClick={solve} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Find Anagrams</button>

      <OutputArea hasContent={result.length > 0}>
        {result.length > 0 && (
          <div className="space-y-3">
            <div className="text-sm text-gray-600">Found {result.length} anagram{result.length !== 1 ? 's' : ''}:</div>
            <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto">
              {result.map((anagram, i) => (
                <span key={i} className="px-2 py-1 bg-blue-50 border border-blue-200 rounded text-sm font-mono">{anagram}</span>
              ))}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
