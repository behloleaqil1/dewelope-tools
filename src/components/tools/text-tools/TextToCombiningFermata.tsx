'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToCombiningFermata - Add combining fermata (U+0352) above each character in text.
 * The fermata is a musical notation symbol that looks like a dot under an arc.
 */
export default function TextToCombiningFermata({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [skipSpaces, setSkipSpaces] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!input) { setOutput(''); return; }

    debounceRef.current = setTimeout(() => {
      const COMBINING_FERMATA = '\u0352';
      const result = Array.from(input).map(char => {
        if (skipSpaces && (char === ' ' || char === '\n' || char === '\t')) return char;
        return char + COMBINING_FERMATA;
      }).join('');
      setOutput(result);
    }, 200);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input, skipSpaces]);

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Enter text</label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type text to add combining fermata above characters..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />
        <label className="flex items-center gap-2 text-sm mt-2">
          <input type="checkbox" checked={skipSpaces} onChange={(e) => setSkipSpaces(e.target.checked)} aria-label="Skip spaces" />
          Skip whitespace characters
        </label>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Result with Combining Fermata (U+0352)</label>
            <pre className="whitespace-pre-wrap text-lg font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
