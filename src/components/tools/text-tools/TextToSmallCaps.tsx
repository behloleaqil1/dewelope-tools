'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToSmallCaps - Converts text to Unicode small caps characters.
 */

const SMALL_CAPS: Record<string, string> = {
  a: '\u1D00', b: '\u0299', c: '\u1D04', d: '\u1D05', e: '\u1D07',
  f: '\uA730', g: '\u0262', h: '\u029C', i: '\u026A', j: '\u1D0A',
  k: '\u1D0B', l: '\u029F', m: '\u1D0D', n: '\u0274', o: '\u1D0F',
  p: '\u1D18', q: '\u01EB', r: '\u0280', s: '\u0455', t: '\u1D1B',
  u: '\u1D1C', v: '\u1D20', w: '\u1D21', x: '\u0078', y: '\u028F',
  z: '\u1D22',
};

export default function TextToSmallCaps({ toolId, toolName }: { toolId: string; toolName: string }) {
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
      const result = Array.from(input)
        .map((char) => {
          const lower = char.toLowerCase();
          if (SMALL_CAPS[lower]) {
            return char === char.toUpperCase() ? char : SMALL_CAPS[lower];
          }
          return char;
        })
        .join('');
      setOutput(result);
    }, 200);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input]);

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter text to convert to small caps
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type text here to convert to small caps..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-36 resize-y font-mono"
        />
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Small Caps Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 p-4 bg-gray-50 rounded-lg border border-gray-100 max-h-64 overflow-y-auto break-all">
              {output}
            </pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
