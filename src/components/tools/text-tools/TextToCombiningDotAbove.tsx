'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToCombiningDotAbove - Add combining dot above (U+0307) to characters.
 * Transforms consonants or all characters by appending the combining diacritical mark.
 */
export default function TextToCombiningDotAbove({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'consonants' | 'all'>('all');
  const [output, setOutput] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const COMBINING_DOT_ABOVE = '\u0307';
  const VOWELS = new Set('aeiouAEIOU');

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!input) {
      setOutput('');
      return;
    }

    debounceRef.current = setTimeout(() => {
      const result = input.split('').map(char => {
        if (mode === 'consonants') {
          if (/[a-zA-Z]/.test(char) && !VOWELS.has(char)) {
            return char + COMBINING_DOT_ABOVE;
          }
          return char;
        }
        if (/[a-zA-Z]/.test(char)) {
          return char + COMBINING_DOT_ABOVE;
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
          placeholder="Type text to add combining dot above..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />
        <div className="mt-2 flex gap-4">
          <label className="flex items-center text-sm">
            <input type="radio" name={`${toolId}-mode`} checked={mode === 'all'} onChange={() => setMode('all')} className="mr-1" />
            All letters
          </label>
          <label className="flex items-center text-sm">
            <input type="radio" name={`${toolId}-mode`} checked={mode === 'consonants'} onChange={() => setMode('consonants')} className="mr-1" />
            Consonants only
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
