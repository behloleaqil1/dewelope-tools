'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const OLD_ENGLISH_MAP: Record<string, string> = {
  A: 'Ⱥ', B: 'Ƀ', C: 'Ȼ', D: 'Ð', E: 'Ɇ', F: 'Ƒ', G: 'Ǥ', H: 'Ħ',
  I: 'Ɨ', J: 'Ɉ', K: 'Ꝁ', L: 'Ł', M: 'Ɱ', N: 'Ꞑ', O: 'Ø', P: 'Ᵽ',
  Q: 'Ꝗ', R: 'Ɍ', S: 'Ꞩ', T: 'Ŧ', U: 'Ʉ', V: 'Ꝟ', W: 'Ⱳ', X: 'Ӿ',
  Y: 'Ɏ', Z: 'Ƶ',
  a: 'ⱥ', b: 'ƀ', c: 'ȼ', d: 'ð', e: 'ɇ', f: 'ƒ', g: 'ǥ', h: 'ħ',
  i: 'ɨ', j: 'ɉ', k: 'ꝁ', l: 'ł', m: 'ɱ', n: 'ꞑ', o: 'ø', p: 'ᵽ',
  q: 'ꝗ', r: 'ɍ', s: 'ꞩ', t: 'ŧ', u: 'ʉ', v: 'ꝟ', w: 'ⱳ', x: 'ӿ',
  y: 'ɏ', z: 'ƶ',
};

/**
 * TextToOldEnglish - Convert text to Old English-style Unicode characters.
 * Maps A-Z and a-z to visually similar archaic/medieval Unicode glyphs.
 */
export default function TextToOldEnglish({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!input) { setOutput(''); return; }

    debounceRef.current = setTimeout(() => {
      const result = input.split('').map(ch => OLD_ENGLISH_MAP[ch] || ch).join('');
      setOutput(result);
    }, 200);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input]);

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
          placeholder="e.g. Hello World"
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Old English Result</label>
            <pre className="whitespace-pre-wrap text-lg text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
