'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const NATO_NUMBERS: Record<string, string> = {
  '0': 'Zero',
  '1': 'Wun',
  '2': 'Too',
  '3': 'Tree',
  '4': 'Fow-er',
  '5': 'Fife',
  '6': 'Six',
  '7': 'Sev-en',
  '8': 'Ait',
  '9': 'Niner',
};

/**
 * TextToNatoNumbers - Convert numbers to NATO pronunciation.
 * Uses standard NATO/ICAO number pronunciation (niner, fife, tree, etc.)
 */
export default function TextToNatoNumbers({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!input.trim()) {
      setOutput('');
      return;
    }

    debounceRef.current = setTimeout(() => {
      const result = input
        .split('')
        .map((char) => {
          if (char === ' ') return '(space)';
          if (char === '.') return 'Decimal';
          if (char === '-') return 'Dash';
          if (char === ',') return 'Comma';
          return NATO_NUMBERS[char] || char;
        })
        .join(' ');
      setOutput(result);
    }, 200);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input]);

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter numbers to convert to NATO pronunciation
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type numbers here... e.g. 9025"
          aria-label={`Number input for ${toolName}`}
          className="input-field h-32 resize-y"
        />
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">NATO Number Pronunciation</label>
            <div className="text-sm text-gray-800 p-4 bg-gray-50 rounded-lg border border-gray-100 leading-relaxed">
              {output}
            </div>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>

      <details className="bg-gray-50 rounded-lg border border-gray-200">
        <summary className="px-4 py-2 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 rounded-lg">
          NATO Number Pronunciation Reference
        </summary>
        <div className="px-4 pb-3 grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
          {Object.entries(NATO_NUMBERS).map(([digit, word]) => (
            <div key={digit} className="text-center p-1">
              <span className="font-bold text-blue-600">{digit}</span>
              <span className="text-gray-500"> = {word}</span>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}
