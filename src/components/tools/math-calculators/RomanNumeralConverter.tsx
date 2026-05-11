'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * RomanNumeralConverter - Converts between Roman numerals and decimal numbers.
 * Supports values from 1 to 3999.
 */
export default function RomanNumeralConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [mode, setMode] = useState<'toRoman' | 'toDecimal'>('toRoman');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const romanValues: [string, number][] = [
    ['M', 1000], ['CM', 900], ['D', 500], ['CD', 400],
    ['C', 100], ['XC', 90], ['L', 50], ['XL', 40],
    ['X', 10], ['IX', 9], ['V', 5], ['IV', 4], ['I', 1],
  ];

  const toRoman = (num: number): string => {
    let result = '';
    for (const [symbol, value] of romanValues) {
      while (num >= value) {
        result += symbol;
        num -= value;
      }
    }
    return result;
  };

  const toDecimal = (roman: string): number => {
    const map: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
    let result = 0;
    for (let i = 0; i < roman.length; i++) {
      const current = map[roman[i]];
      const next = map[roman[i + 1]];
      if (next && current < next) {
        result -= current;
      } else {
        result += current;
      }
    }
    return result;
  };

  const isValidRoman = (str: string): boolean => {
    return /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/i.test(str);
  };

  const convert = () => {
    const trimmed = input.trim();
    if (!trimmed) {
      setError('Please enter a value');
      setOutput('');
      return;
    }

    setError('');

    if (mode === 'toRoman') {
      const num = parseInt(trimmed);
      if (isNaN(num) || num < 1 || num > 3999) {
        setError('Please enter a number between 1 and 3999');
        setOutput('');
        return;
      }
      setOutput(toRoman(num));
    } else {
      const upper = trimmed.toUpperCase();
      if (!isValidRoman(upper)) {
        setError('Please enter a valid Roman numeral (I, V, X, L, C, D, M)');
        setOutput('');
        return;
      }
      setOutput(toDecimal(upper).toString());
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="flex gap-2">
        <button
          onClick={() => { setMode('toRoman'); setInput(''); setOutput(''); setError(''); }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === 'toRoman' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          aria-label="Convert decimal to Roman numeral"
        >
          Decimal → Roman
        </button>
        <button
          onClick={() => { setMode('toDecimal'); setInput(''); setOutput(''); setError(''); }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === 'toDecimal' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          aria-label="Convert Roman numeral to decimal"
        >
          Roman → Decimal
        </button>
      </div>

      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          {mode === 'toRoman' ? 'Enter a number (1-3999)' : 'Enter a Roman numeral'}
        </label>
        <input
          id={`${toolId}-input`}
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (error) setError('');
          }}
          placeholder={mode === 'toRoman' ? 'e.g. 2024' : 'e.g. MMXXIV'}
          aria-label={`Input for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <button onClick={convert} aria-label="Convert" className="btn-primary">
        Convert
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Result</label>
            <p className="text-2xl font-bold text-gray-800">{output}</p>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
