'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const BOXED_UPPER: Record<string, string> = {
  A: '🄰', B: '🄱', C: '🄲', D: '🄳', E: '🄴', F: '🄵', G: '🄶', H: '🄷',
  I: '🄸', J: '🄹', K: '🄺', L: '🄻', M: '🄼', N: '🄽', O: '🄾', P: '🄿',
  Q: '🅀', R: '🅁', S: '🅂', T: '🅃', U: '🅄', V: '🅅', W: '🅆', X: '🅇',
  Y: '🅈', Z: '🅉',
};

const SQUARED_UPPER: Record<string, string> = {
  A: '🅰', B: '🅱', C: '🅲', D: '🅳', E: '🅴', F: '🅵', G: '🅶', H: '🅷',
  I: '🅸', J: '🅹', K: '🅺', L: '🅻', M: '🅼', N: '🅽', O: '🅾', P: '🅿',
  Q: '🆀', R: '🆁', S: '🆂', T: '🆃', U: '🆄', V: '🆅', W: '🆆', X: '🆇',
  Y: '🆈', Z: '🆉',
};

/**
 * TextToBoxedUnicode - Convert text to boxed/squared Unicode characters.
 * Supports outlined squares and filled negative squared styles.
 */
export default function TextToBoxedUnicode({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [style, setStyle] = useState<'outlined' | 'filled'>('outlined');
  const [output, setOutput] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!input.trim()) {
      setOutput('');
      return;
    }

    debounceRef.current = setTimeout(() => {
      const map = style === 'outlined' ? BOXED_UPPER : SQUARED_UPPER;
      const result = input
        .split('')
        .map((char) => {
          const upper = char.toUpperCase();
          return map[upper] || char;
        })
        .join('');
      setOutput(result);
    }, 200);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input, style]);

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
          placeholder="Type text here... e.g. HELLO"
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y"
        />

        <label htmlFor={`${toolId}-style`} className="block text-sm font-medium text-gray-700 mt-3 mb-1">
          Style
        </label>
        <select
          id={`${toolId}-style`}
          value={style}
          onChange={(e) => setStyle(e.target.value as 'outlined' | 'filled')}
          aria-label={`Style selection for ${toolName}`}
          className="input-field w-48"
        >
          <option value="outlined">Outlined Squares (🄰🄱🄲)</option>
          <option value="filled">Filled Squares (🅰🅱🅲)</option>
        </select>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Boxed Unicode Output</label>
            <div className="text-2xl text-gray-800 p-4 bg-gray-50 rounded-lg border border-gray-100 break-all leading-relaxed">
              {output}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Only A-Z letters are converted. Numbers, spaces, and symbols remain unchanged.
            </div>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
