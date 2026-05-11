'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToPigLatinAdvanced - Advanced Pig Latin converter with configurable rules.
 * Supports ay/way/yay endings, custom suffixes, and preserves capitalization and punctuation.
 */
export default function TextToPigLatinAdvanced({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [consonantSuffix, setConsonantSuffix] = useState('ay');
  const [vowelSuffix, setVowelSuffix] = useState('way');
  const [preserveCase, setPreserveCase] = useState(true);
  const [handleY, setHandleY] = useState<'consonant' | 'vowel'>('consonant');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!input) {
      setOutput('');
      return;
    }

    debounceRef.current = setTimeout(() => {
      const vowels = handleY === 'vowel' ? 'aeiouy' : 'aeiou';

      const result = input.replace(/\b([a-zA-Z]+)\b/g, (word) => {
        const lower = word.toLowerCase();
        const isAllCaps = word === word.toUpperCase() && word.length > 1;
        const isCapitalized = word[0] === word[0].toUpperCase() && !isAllCaps;

        let pigWord: string;
        if (vowels.includes(lower[0])) {
          pigWord = lower + vowelSuffix;
        } else {
          let consonantCluster = '';
          let rest = lower;
          while (rest.length > 0 && !vowels.includes(rest[0])) {
            consonantCluster += rest[0];
            rest = rest.slice(1);
          }
          if (rest.length === 0) {
            pigWord = lower + consonantSuffix;
          } else {
            pigWord = rest + consonantCluster + consonantSuffix;
          }
        }

        if (!preserveCase) return pigWord;
        if (isAllCaps) return pigWord.toUpperCase();
        if (isCapitalized) return pigWord.charAt(0).toUpperCase() + pigWord.slice(1);
        return pigWord;
      });

      setOutput(result);
    }, 300);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input, consonantSuffix, vowelSuffix, preserveCase, handleY]);

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter English text
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. Hello world, this is a test of Pig Latin"
          aria-label={`Text input for ${toolName}`}
          className="input-field h-40 resize-y"
        />
      </InputArea>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label htmlFor={`${toolId}-csuffix`} className="block text-sm font-medium text-gray-700 mb-1">
            Consonant Suffix
          </label>
          <select id={`${toolId}-csuffix`} value={consonantSuffix} onChange={(e) => setConsonantSuffix(e.target.value)} className="input-field" aria-label="Consonant suffix">
            <option value="ay">-ay (standard)</option>
            <option value="yay">-yay</option>
            <option value="hay">-hay</option>
          </select>
        </div>
        <div>
          <label htmlFor={`${toolId}-vsuffix`} className="block text-sm font-medium text-gray-700 mb-1">
            Vowel Suffix
          </label>
          <select id={`${toolId}-vsuffix`} value={vowelSuffix} onChange={(e) => setVowelSuffix(e.target.value)} className="input-field" aria-label="Vowel suffix">
            <option value="way">-way</option>
            <option value="yay">-yay</option>
            <option value="hay">-hay</option>
          </select>
        </div>
        <div>
          <label htmlFor={`${toolId}-y`} className="block text-sm font-medium text-gray-700 mb-1">
            Treat Y as
          </label>
          <select id={`${toolId}-y`} value={handleY} onChange={(e) => setHandleY(e.target.value as 'consonant' | 'vowel')} className="input-field" aria-label="Y treatment">
            <option value="consonant">Consonant</option>
            <option value="vowel">Vowel</option>
          </select>
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" checked={preserveCase} onChange={(e) => setPreserveCase(e.target.checked)} className="rounded border-gray-300" />
            Preserve case
          </label>
        </div>
      </div>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Pig Latin Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-3 rounded-lg border border-gray-200">{output}</pre>
            <div className="text-xs text-gray-500 mt-2">
              <strong>Rules:</strong> Consonant words → move cluster to end + &quot;{consonantSuffix}&quot;. Vowel words → append &quot;{vowelSuffix}&quot;. Y treated as {handleY}.
            </div>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
