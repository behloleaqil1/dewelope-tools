'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const PARENTHESIZED_LOWER: Record<string, string> = {
  a: '⒜', b: '⒝', c: '⒞', d: '⒟', e: '⒠', f: '⒡', g: '⒢', h: '⒣',
  i: '⒤', j: '⒥', k: '⒦', l: '⒧', m: '⒨', n: '⒩', o: '⒪', p: '⒫',
  q: '⒬', r: '⒭', s: '⒮', t: '⒯', u: '⒰', v: '⒱', w: '⒲', x: '⒳',
  y: '⒴', z: '⒵',
};

const PARENTHESIZED_UPPER: Record<string, string> = {
  A: '🄐', B: '🄑', C: '🄒', D: '🄓', E: '🄔', F: '🄕', G: '🄖', H: '🄗',
  I: '🄘', J: '🄙', K: '🄚', L: '🄛', M: '🄜', N: '🄝', O: '🄞', P: '🄟',
  Q: '🄠', R: '🄡', S: '🄢', T: '🄣', U: '🄤', V: '🄥', W: '🄦', X: '🄧',
  Y: '🄨', Z: '🄩',
};

/**
 * TextToParenthesized - Convert text to parenthesized Unicode characters.
 * Maps a-z to ⒜-⒵ and A-Z to 🄐-🄩 parenthesized letter forms.
 */
export default function TextToParenthesized({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!input) { setOutput(''); return; }

    debounceRef.current = setTimeout(() => {
      const result = input.split('').map(ch => PARENTHESIZED_UPPER[ch] || PARENTHESIZED_LOWER[ch] || ch).join('');
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
            <label className="block text-sm font-medium text-gray-700">Parenthesized Result</label>
            <pre className="whitespace-pre-wrap text-lg text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
