'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToPigLatin - Converts English text to Pig Latin.
 * Rules: consonant clusters move to end + "ay"; words starting with vowels get "way" appended.
 */
export default function TextToPigLatin({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!input) {
      setOutput('');
      return;
    }

    debounceRef.current = setTimeout(() => {
      const result = input.replace(/\b([a-zA-Z]+)\b/g, (word) => {
        const lower = word.toLowerCase();
        const isCapitalized = word[0] === word[0].toUpperCase();

        const vowels = 'aeiou';
        if (vowels.includes(lower[0])) {
          const pigWord = lower + 'way';
          return isCapitalized ? pigWord.charAt(0).toUpperCase() + pigWord.slice(1) : pigWord;
        }

        let consonantCluster = '';
        let rest = lower;
        while (rest.length > 0 && !vowels.includes(rest[0])) {
          consonantCluster += rest[0];
          rest = rest.slice(1);
        }

        if (rest.length === 0) {
          const pigWord = lower + 'ay';
          return isCapitalized ? pigWord.charAt(0).toUpperCase() + pigWord.slice(1) : pigWord;
        }

        const pigWord = rest + consonantCluster + 'ay';
        return isCapitalized ? pigWord.charAt(0).toUpperCase() + pigWord.slice(1) : pigWord;
      });
      setOutput(result);
    }, 300);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input]);

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
          placeholder="e.g. Hello world, this is a test"
          aria-label={`Text input for ${toolName}`}
          className="input-field h-40 resize-y"
        />
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Pig Latin Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-3 rounded-lg border border-gray-200">{output}</pre>
            <div className="text-xs text-gray-500 mt-2">
              <strong>Rules:</strong> Consonant clusters move to end + &quot;ay&quot;. Words starting with vowels get &quot;way&quot; appended.
            </div>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
