'use client';

import { useState } from 'react';
import { ToolEngineProps } from '@/types';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';
import { convertNumberBase } from '@/lib/calculators';

/**
 * NumberBaseConverter - Converts numbers between binary, octal, decimal, and hexadecimal.
 * Displays all four representations simultaneously.
 * Validates input based on the selected source base.
 */
export default function NumberBaseConverter({ toolId, toolName }: ToolEngineProps) {
  const [value, setValue] = useState('');
  const [fromBase, setFromBase] = useState<number>(10);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{
    binary: string;
    octal: string;
    decimal: string;
    hexadecimal: string;
  } | null>(null);

  const baseOptions = [
    { value: 2, label: 'Binary (Base 2)' },
    { value: 8, label: 'Octal (Base 8)' },
    { value: 10, label: 'Decimal (Base 10)' },
    { value: 16, label: 'Hexadecimal (Base 16)' },
  ];

  const getValidChars = (base: number): string => {
    switch (base) {
      case 2: return '0-1';
      case 8: return '0-7';
      case 10: return '0-9';
      case 16: return '0-9, A-F';
      default: return '';
    }
  };

  const validateInput = (input: string, base: number): string | null => {
    const trimmed = input.trim();
    if (!trimmed) {
      return 'Please enter a value';
    }

    const patterns: Record<number, RegExp> = {
      2: /^[01]+$/,
      8: /^[0-7]+$/,
      10: /^[0-9]+$/,
      16: /^[0-9a-fA-F]+$/,
    };

    const pattern = patterns[base];
    if (pattern && !pattern.test(trimmed)) {
      return `Invalid input for base ${base}. Valid characters: ${getValidChars(base)}`;
    }

    return null;
  };

  const calculate = () => {
    const validationError = validateInput(value, fromBase);
    if (validationError) {
      setError(validationError);
      setResult(null);
      return;
    }

    try {
      const converted = convertNumberBase(value, fromBase);
      setError('');
      setResult(converted);
    } catch (e) {
      if (e instanceof RangeError) {
        setError('Value must be between 0 and 2^64 - 1');
      } else {
        setError('Invalid input value');
      }
      setResult(null);
    }
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (error) {
      setError('');
    }
  };

  const handleBaseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFromBase(Number(e.target.value));
    setResult(null);
    setError('');
  };

  return (
    <div className="space-y-6" data-tool-id={toolId}>
      <div className="space-y-4">
        <InputArea>
          <label htmlFor="base-from" className="block text-sm font-medium text-gray-700">
            Input Base
          </label>
          <select
            id="base-from"
            value={fromBase}
            onChange={handleBaseChange}
            aria-label={`Source number base for ${toolName}`}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
          >
            {baseOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </InputArea>

        <InputArea error={error}>
          <label htmlFor="base-value" className="block text-sm font-medium text-gray-700">
            Value (valid characters: {getValidChars(fromBase)})
          </label>
          <input
            id="base-value"
            type="text"
            value={value}
            onChange={handleValueChange}
            placeholder={`Enter a base ${fromBase} number`}
            aria-label={`Number value in base ${fromBase} for ${toolName}`}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
          />
        </InputArea>

        <button
          onClick={calculate}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-h-[44px] min-w-[44px]"
        >
          Convert
        </button>
      </div>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded border border-gray-200">
                <div className="text-sm text-gray-500">Binary (Base 2)</div>
                <div className="text-md font-mono font-semibold text-gray-800 break-all">
                  {result.binary}
                </div>
              </div>
              <div className="bg-white p-3 rounded border border-gray-200">
                <div className="text-sm text-gray-500">Octal (Base 8)</div>
                <div className="text-md font-mono font-semibold text-gray-800 break-all">
                  {result.octal}
                </div>
              </div>
              <div className="bg-white p-3 rounded border border-gray-200">
                <div className="text-sm text-gray-500">Decimal (Base 10)</div>
                <div className="text-md font-mono font-semibold text-gray-800 break-all">
                  {result.decimal}
                </div>
              </div>
              <div className="bg-white p-3 rounded border border-gray-200">
                <div className="text-sm text-gray-500">Hexadecimal (Base 16)</div>
                <div className="text-md font-mono font-semibold text-gray-800 break-all">
                  {result.hexadecimal}
                </div>
              </div>
            </div>
            <CopyToClipboard
              text={`Binary: ${result.binary}\nOctal: ${result.octal}\nDecimal: ${result.decimal}\nHex: ${result.hexadecimal}`}
            />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
