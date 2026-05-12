'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const WINGDINGS2_MAP: Record<string, string> = {
  A: '🅐', B: '🅑', C: '🅒', D: '🅓', E: '🅔', F: '🅕', G: '🅖', H: '🅗',
  I: '🅘', J: '🅙', K: '🅚', L: '🅛', M: '🅜', N: '🅝', O: '🅞', P: '🅟',
  Q: '🅠', R: '🅡', S: '🅢', T: '🅣', U: '🅤', V: '🅥', W: '🅦', X: '🅧',
  Y: '🅨', Z: '🅩',
  a: '⓪', b: '①', c: '②', d: '③', e: '④', f: '⑤', g: '⑥', h: '⑦',
  i: '⑧', j: '⑨', k: '⊕', l: '⊖', m: '⊗', n: '⊘', o: '⊙', p: '⊚',
  q: '⊛', r: '⊜', s: '⊝', t: '⟐', u: '⬟', v: '⬠', w: '⬡', x: '⎔',
  y: '⏣', z: '⏢',
  '0': '🔟', '1': '❶', '2': '❷', '3': '❸', '4': '❹',
  '5': '❺', '6': '❻', '7': '❼', '8': '❽', '9': '❾',
};

/**
 * TextToWingdings2 - Convert text to Wingdings 2 style Unicode symbols.
 * Maps letters and digits to visually distinct Unicode symbols.
 */
export default function TextToWingdings2({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!input) { setOutput(''); return; }

    debounceRef.current = setTimeout(() => {
      const result = input.split('').map(ch => WINGDINGS2_MAP[ch] || ch).join('');
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
            <label className="block text-sm font-medium text-gray-700">Wingdings 2 Result</label>
            <pre className="whitespace-pre-wrap text-lg text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
