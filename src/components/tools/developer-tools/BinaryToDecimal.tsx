'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * BinaryToDecimal - Converts between binary, octal, decimal, and hexadecimal number systems.
 * Provides all four representations simultaneously.
 */
export default function BinaryToDecimal({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [inputBase, setInputBase] = useState<'binary' | 'octal' | 'decimal' | 'hex'>('decimal');
  const [results, setResults] = useState<{ binary: string; octal: string; decimal: string; hex: string } | null>(null);
  const [error, setError] = useState<string | undefined>();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!input.trim()) {
      setResults(null);
      setError(undefined);
      return;
    }

    debounceRef.current = setTimeout(() => {
      setError(undefined);
      const trimmed = input.trim();

      let decimal: number;
      try {
        switch (inputBase) {
          case 'binary':
            if (!/^[01]+$/.test(trimmed)) { setError('Binary must contain only 0 and 1'); return; }
            decimal = parseInt(trimmed, 2);
            break;
          case 'octal':
            if (!/^[0-7]+$/.test(trimmed)) { setError('Octal must contain only digits 0-7'); return; }
            decimal = parseInt(trimmed, 8);
            break;
          case 'decimal':
            if (!/^-?\d+$/.test(trimmed)) { setError('Decimal must contain only digits'); return; }
            decimal = parseInt(trimmed, 10);
            break;
          case 'hex':
            if (!/^[0-9a-fA-F]+$/.test(trimmed)) { setError('Hex must contain only 0-9 and A-F'); return; }
            decimal = parseInt(trimmed, 16);
            break;
        }
      } catch {
        setError('Invalid input for the selected base');
        return;
      }

      if (isNaN(decimal)) {
        setError('Could not parse the input number');
        return;
      }

      setResults({
        binary: (decimal >>> 0).toString(2),
        octal: (decimal >>> 0).toString(8),
        decimal: decimal.toString(10),
        hex: (decimal >>> 0).toString(16).toUpperCase(),
      });
    }, 200);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input, inputBase]);

  const copyText = results
    ? `Binary: ${results.binary}\nOctal: ${results.octal}\nDecimal: ${results.decimal}\nHexadecimal: ${results.hex}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter a number for {toolName}
        </label>
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <input
              id={`${toolId}-input`}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={inputBase === 'binary' ? '10110' : inputBase === 'octal' ? '755' : inputBase === 'hex' ? 'FF' : '255'}
              aria-label={`Number input in ${inputBase}`}
              className="input-field font-mono"
            />
          </div>
          <div className="w-32">
            <select
              value={inputBase}
              onChange={(e) => setInputBase(e.target.value as typeof inputBase)}
              aria-label="Input number base"
              className="input-field text-sm"
            >
              <option value="binary">Binary (2)</option>
              <option value="octal">Octal (8)</option>
              <option value="decimal">Decimal (10)</option>
              <option value="hex">Hex (16)</option>
            </select>
          </div>
        </div>
      </InputArea>

      <OutputArea hasContent={results !== null}>
        {results && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="text-xs text-gray-500 mb-1">Binary (base 2)</div>
                <div className="text-sm font-mono font-bold text-blue-600 break-all">{results.binary}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="text-xs text-gray-500 mb-1">Octal (base 8)</div>
                <div className="text-sm font-mono font-bold text-green-600 break-all">{results.octal}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="text-xs text-gray-500 mb-1">Decimal (base 10)</div>
                <div className="text-sm font-mono font-bold text-purple-600 break-all">{results.decimal}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="text-xs text-gray-500 mb-1">Hexadecimal (base 16)</div>
                <div className="text-sm font-mono font-bold text-orange-600 break-all">{results.hex}</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
