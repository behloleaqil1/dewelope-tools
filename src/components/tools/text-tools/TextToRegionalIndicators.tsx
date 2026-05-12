'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToRegionalIndicators - Convert text to regional indicator emoji (🇦🇧🇨).
 * Maps A-Z to their regional indicator symbol equivalents (U+1F1E6 to U+1F1FF).
 */
export default function TextToRegionalIndicators({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [addSpaces, setAddSpaces] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!input) { setOutput(''); return; }

    debounceRef.current = setTimeout(() => {
      const result = input.split('').map(ch => {
        const upper = ch.toUpperCase();
        const code = upper.charCodeAt(0);
        if (code >= 65 && code <= 90) {
          // Regional indicator symbols: U+1F1E6 (A) to U+1F1FF (Z)
          return String.fromCodePoint(0x1F1E6 + (code - 65));
        }
        if (ch === ' ') return '  ';
        return ch;
      });
      setOutput(addSpaces ? result.join(' ') : result.join(''));
    }, 200);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input, addSpaces]);

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter text to convert
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. Hello"
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />
        <label className="flex items-center gap-2 text-sm mt-2">
          <input type="checkbox" checked={addSpaces} onChange={(e) => setAddSpaces(e.target.checked)} />
          Add spaces between letters (prevents flag combinations)
        </label>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Regional Indicator Result</label>
            <pre className="whitespace-pre-wrap text-2xl text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
