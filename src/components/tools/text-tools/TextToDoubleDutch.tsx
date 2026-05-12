'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToDoubleDutch - Convert text to Double Dutch encoding.
 * Double Dutch inserts "ub" before each vowel sound in a word.
 */
export default function TextToDoubleDutch({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const encode = (text: string): string => {
    return text.replace(/[a-zA-Z]+/g, (word) => {
      let result = '';
      for (let i = 0; i < word.length; i++) {
        const char = word[i];
        const lower = char.toLowerCase();
        if ('aeiou'.includes(lower)) {
          const prefix = char === char.toUpperCase() ? 'Ub' : 'ub';
          result += prefix + lower;
        } else {
          result += char;
        }
      }
      return result;
    });
  };

  const decode = (text: string): string => {
    return text.replace(/[a-zA-Z]+/g, (word) => {
      let result = '';
      let i = 0;
      while (i < word.length) {
        if (i + 2 < word.length && word.slice(i, i + 2).toLowerCase() === 'ub' && 'aeiou'.includes(word[i + 2].toLowerCase())) {
          const isUpper = word[i] === 'U';
          const vowel = isUpper ? word[i + 2].toUpperCase() : word[i + 2];
          result += vowel;
          i += 3;
        } else {
          result += word[i];
          i++;
        }
      }
      return result;
    });
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!input.trim()) {
      setOutput('');
      return;
    }

    debounceRef.current = setTimeout(() => {
      setOutput(mode === 'encode' ? encode(input) : decode(input));
    }, 300);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input, mode]);

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Mode:</label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input type="radio" name={`${toolId}-mode`} checked={mode === 'encode'} onChange={() => setMode('encode')} className="text-blue-600" />
              <span className="text-sm text-gray-700">Encode</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input type="radio" name={`${toolId}-mode`} checked={mode === 'decode'} onChange={() => setMode('decode')} className="text-blue-600" />
              <span className="text-sm text-gray-700">Decode</span>
            </label>
          </div>
          <div>
            <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
              {mode === 'encode' ? 'Enter text to encode' : 'Enter Double Dutch text to decode'}
            </label>
            <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder={mode === 'encode' ? 'Hello World' : 'Hubellubo Wuborld'} aria-label={`Text input for ${toolName}`} className="input-field h-32 resize-y font-mono" />
          </div>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{mode === 'encode' ? 'Double Dutch' : 'Decoded Text'}</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre>
            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded border border-gray-200">
              Rule: Insert &quot;ub&quot; before each vowel (a, e, i, o, u) in every word.
            </div>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
