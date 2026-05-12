'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const MEDIEVAL_MAP: Record<string, string> = {
  'A': '\u{1D504}', 'B': '\u{1D505}', 'C': '\u212D', 'D': '\u{1D507}', 'E': '\u{1D508}',
  'F': '\u{1D509}', 'G': '\u{1D50A}', 'H': '\u210C', 'I': '\u2111', 'J': '\u{1D50D}',
  'K': '\u{1D50E}', 'L': '\u{1D50F}', 'M': '\u{1D510}', 'N': '\u{1D511}', 'O': '\u{1D512}',
  'P': '\u{1D513}', 'Q': '\u{1D514}', 'R': '\u211C', 'S': '\u{1D516}', 'T': '\u{1D517}',
  'U': '\u{1D518}', 'V': '\u{1D519}', 'W': '\u{1D51A}', 'X': '\u{1D51B}', 'Y': '\u{1D51C}',
  'Z': '\u2128',
  'a': '\u{1D51E}', 'b': '\u{1D51F}', 'c': '\u{1D520}', 'd': '\u{1D521}', 'e': '\u{1D522}',
  'f': '\u{1D523}', 'g': '\u{1D524}', 'h': '\u{1D525}', 'i': '\u{1D526}', 'j': '\u{1D527}',
  'k': '\u{1D528}', 'l': '\u{1D529}', 'm': '\u{1D52A}', 'n': '\u{1D52B}', 'o': '\u{1D52C}',
  'p': '\u{1D52D}', 'q': '\u{1D52E}', 'r': '\u{1D52F}', 's': '\u{1D530}', 't': '\u{1D531}',
  'u': '\u{1D532}', 'v': '\u{1D533}', 'w': '\u{1D534}', 'x': '\u{1D535}', 'y': '\u{1D536}',
  'z': '\u{1D537}',
};

/**
 * TextToMedievalUnicode - Convert text to medieval-style Unicode characters (Fraktur).
 * Uses Mathematical Fraktur Unicode block for a gothic/medieval appearance.
 */
export default function TextToMedievalUnicode({ toolId, toolName }: { toolId: string; toolName: string }) {
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
      const converted = Array.from(input)
        .map((ch) => MEDIEVAL_MAP[ch] || ch)
        .join('');
      setOutput(converted);
    }, 200);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input]);

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter text to convert to medieval style
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text (e.g. Hello World)..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y"
        />
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Medieval Unicode Result</label>
            <div className="text-2xl font-normal text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 break-all">
              {output}
            </div>
            <p className="text-xs text-gray-500">Uses Mathematical Fraktur Unicode characters. Letters A-Z are converted; other characters remain unchanged.</p>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
