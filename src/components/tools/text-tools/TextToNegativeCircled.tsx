'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

// Negative circled Latin letters (A-Z): U+1F150 to U+1F169 (outlined) or dingbat negative circled
const NEGATIVE_CIRCLED_UPPER: Record<string, string> = {
  A: '🅐', B: '🅑', C: '🅒', D: '🅓', E: '🅔', F: '🅕', G: '🅖', H: '🅗',
  I: '🅘', J: '🅙', K: '🅚', L: '🅛', M: '🅜', N: '🅝', O: '🅞', P: '🅟',
  Q: '🅠', R: '🅡', S: '🅢', T: '🅣', U: '🅤', V: '🅥', W: '🅦', X: '🅧',
  Y: '🅨', Z: '🅩',
};

// Negative circled numbers: ❶❷❸❹❺❻❼❽❾❿
const NEGATIVE_CIRCLED_NUMBERS: Record<string, string> = {
  '1': '❶', '2': '❷', '3': '❸', '4': '❹', '5': '❺',
  '6': '❻', '7': '❼', '8': '❽', '9': '❾', '0': '⓿',
};

// Regular circled numbers: ①②③④⑤⑥⑦⑧⑨⓪
const CIRCLED_NUMBERS: Record<string, string> = {
  '1': '①', '2': '②', '3': '③', '4': '④', '5': '⑤',
  '6': '⑥', '7': '⑦', '8': '⑧', '9': '⑨', '0': '⓪',
};

// Regular circled letters
const CIRCLED_UPPER: Record<string, string> = {
  A: 'Ⓐ', B: 'Ⓑ', C: 'Ⓒ', D: 'Ⓓ', E: 'Ⓔ', F: 'Ⓕ', G: 'Ⓖ', H: 'Ⓗ',
  I: 'Ⓘ', J: 'Ⓙ', K: 'Ⓚ', L: 'Ⓛ', M: 'Ⓜ', N: 'Ⓝ', O: 'Ⓞ', P: 'Ⓟ',
  Q: 'Ⓠ', R: 'Ⓡ', S: 'Ⓢ', T: 'Ⓣ', U: 'Ⓤ', V: 'Ⓥ', W: 'Ⓦ', X: 'Ⓧ',
  Y: 'Ⓨ', Z: 'Ⓩ',
};

/**
 * TextToNegativeCircled - Convert text to negative circled Unicode characters.
 * Supports negative circled letters and numbers (❶❷❸ style).
 */
export default function TextToNegativeCircled({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [style, setStyle] = useState<'negative' | 'circled'>('negative');
  const [output, setOutput] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!input.trim()) {
      setOutput('');
      return;
    }

    debounceRef.current = setTimeout(() => {
      const letterMap = style === 'negative' ? NEGATIVE_CIRCLED_UPPER : CIRCLED_UPPER;
      const numberMap = style === 'negative' ? NEGATIVE_CIRCLED_NUMBERS : CIRCLED_NUMBERS;

      const result = input
        .split('')
        .map((char) => {
          const upper = char.toUpperCase();
          if (letterMap[upper]) return letterMap[upper];
          if (numberMap[char]) return numberMap[char];
          return char;
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
          placeholder="Type text here... e.g. ABC 123"
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y"
        />

        <label htmlFor={`${toolId}-style`} className="block text-sm font-medium text-gray-700 mt-3 mb-1">
          Style
        </label>
        <select
          id={`${toolId}-style`}
          value={style}
          onChange={(e) => setStyle(e.target.value as 'negative' | 'circled')}
          aria-label={`Style selection for ${toolName}`}
          className="input-field w-56"
        >
          <option value="negative">Negative Circled (🅐 ❶❷❸)</option>
          <option value="circled">Circled (Ⓐ ①②③)</option>
        </select>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Circled Unicode Output</label>
            <div className="text-2xl text-gray-800 p-4 bg-gray-50 rounded-lg border border-gray-100 break-all leading-relaxed">
              {output}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Letters A-Z and digits 0-9 are converted. Spaces and symbols remain unchanged.
            </div>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
