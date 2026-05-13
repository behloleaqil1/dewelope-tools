'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToCombiningDoubleAcute - Add combining double acute accent (U+030B) to characters.
 * Transforms vowels or all characters by appending the combining diacritical mark.
 */
export default function TextToCombiningDoubleAcute({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'vowels' | 'all'>('vowels');
  const [output, setOutput] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const COMBINING_DOUBLE_ACUTE = '\u030B';
  const VOWELS = new Set('aeiouAEIOU');

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!input) {
      setOutput('');
      return;
    }

    debounceRef.current = setTimeout(() => {
      const result = input.split('').map(char => {
        if (mode === 'vowels') {
          return VOWELS.has(char) ? char + COMBINING_DOUBLE_ACUTE : char;
        }
        if (/[a-zA-Z]/.test(char)) {
          return char + COMBINING_DOUBLE_ACUTE;
        }
        return char;
      }).join('');
      setOutput(result);
    }, 200);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input, mode]);

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter text
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type text to add combining double acute accent..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />
        <div className="mt-2 flex gap-4">
          <label className="flex items-center text-sm">
            <input type="radio" name={`${toolId}-mode`} checked={mode === 'vowels'} onChange={() => setMode('vowels')} className="mr-1" />
            Vowels only
          </label>
          <label className="flex items-center text-sm">
            <input type="radio" name={`${toolId}-mode`} checked={mode === 'all'} onChange={() => setMode('all')} className="mr-1" />
            All letters
          </label>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
