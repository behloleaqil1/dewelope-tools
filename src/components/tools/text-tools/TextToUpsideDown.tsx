'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const FLIP_MAP: Record<string, string> = {
  a: '\u0250', b: 'q', c: '\u0254', d: 'p', e: '\u01DD', f: '\u025F',
  g: '\u0183', h: '\u0265', i: '\u0131', j: '\u027E', k: '\u029E', l: 'l',
  m: '\u026F', n: 'u', o: 'o', p: 'd', q: 'b', r: '\u0279',
  s: 's', t: '\u0287', u: 'n', v: '\u028C', w: '\u028D', x: 'x',
  y: '\u028E', z: 'z',
  A: '\u2200', B: '\u15FA', C: '\u0186', D: '\u15E1', E: '\u018E', F: '\u2132',
  G: '\u2141', H: 'H', I: 'I', J: '\u017F', K: '\u22CA', L: '\u2142',
  M: 'W', N: 'N', O: 'O', P: '\u0500', Q: '\u038C', R: '\u1D1A',
  S: 'S', T: '\u22A5', U: '\u2229', V: '\u039B', W: 'M', X: 'X',
  Y: '\u2144', Z: 'Z',
  '0': '0', '1': '\u0196', '2': '\u1105', '3': '\u0190', '4': '\u3123',
  '5': '\u03DB', '6': '9', '7': '\u3125', '8': '8', '9': '6',
  '.': '\u02D9', ',': '\u02BB', '?': '\u00BF', '!': '\u00A1', "'": ',',
  '"': '\u201E', '(': ')', ')': '(', '[': ']', ']': '[',
  '{': '}', '}': '{', '<': '>', '>': '<', '&': '\u214B',
  '_': '\u203E', ';': '\u061B', '/': '\\', '\\': '/',
};

/**
 * TextToUpsideDown - Flips text upside down using Unicode character mapping.
 */
export default function TextToUpsideDown({ toolId, toolName }: { toolId: string; toolName: string }) {
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
      const flipped = input
        .split('')
        .map((char) => FLIP_MAP[char] || char)
        .reverse()
        .join('');
      setOutput(flipped);
    }, 200);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input]);

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter text to flip upside down
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type or paste text here..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Upside Down Text</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
