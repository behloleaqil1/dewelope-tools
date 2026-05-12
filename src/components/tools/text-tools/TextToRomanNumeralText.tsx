'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToRomanNumeralText - Replace numbers in text with Roman numerals.
 * Converts integers 1-3999 to their Roman numeral equivalents within text.
 */
export default function TextToRomanNumeralText({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toRoman = (num: number): string => {
    if (num < 1 || num > 3999) return num.toString();
    const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
    const symbols = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
    let result = '';
    let remaining = num;
    for (let i = 0; i < values.length; i++) {
      while (remaining >= values[i]) {
        result += symbols[i];
        remaining -= values[i];
      }
    }
    return result;
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!input) {
      setOutput('');
      return;
    }

    debounceRef.current = setTimeout(() => {
      const result = input.replace(/\d+/g, (match) => {
        const num = parseInt(match, 10);
        if (num >= 1 && num <= 3999) return toRoman(num);
        return match;
      });
      setOutput(result);
    }, 300);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input]);

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter text with numbers
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Chapter 1: Introduction. Chapter 2: Methods. Page 42."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-40 resize-y font-mono"
        />
        <p className="text-xs text-gray-500 mt-1">Numbers 1–3999 are converted to Roman numerals. Numbers outside this range are left unchanged.</p>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
