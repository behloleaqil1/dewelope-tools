'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ScientificNotationConverter - Converts numbers to/from scientific notation.
 * Handles very large and very small numbers with configurable precision.
 */
export default function ScientificNotationConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'toScientific' | 'toDecimal'>('toScientific');
  const [precision, setPrecision] = useState('6');
  const [result, setResult] = useState<{ scientific: string; decimal: string; exponent: number; coefficient: number } | null>(null);
  const [error, setError] = useState<string | undefined>();

  function convert() {
    setError(undefined);
    setResult(null);

    const trimmed = input.trim();
    if (!trimmed) {
      setError('Please enter a number');
      return;
    }

    const prec = parseInt(precision) || 6;

    if (mode === 'toScientific') {
      const num = parseFloat(trimmed);
      if (isNaN(num)) {
        setError('Please enter a valid number');
        return;
      }
      if (num === 0) {
        setResult({ scientific: '0 × 10⁰', decimal: '0', exponent: 0, coefficient: 0 });
        return;
      }
      const exp = Math.floor(Math.log10(Math.abs(num)));
      const coeff = num / Math.pow(10, exp);
      const scientific = `${coeff.toFixed(prec)} × 10${superscript(exp)}`;
      setResult({ scientific, decimal: trimmed, exponent: exp, coefficient: coeff });
    } else {
      // Parse scientific notation like "2.5e3", "2.5 × 10^3", "2.5E-4"
      const normalized = trimmed
        .replace(/×\s*10\^?/i, 'e')
        .replace(/\s*[xX]\s*10\^?/i, 'e')
        .replace(/\s+/g, '');
      const num = parseFloat(normalized);
      if (isNaN(num)) {
        setError('Please enter valid scientific notation (e.g., 2.5e3 or 2.5 × 10^3)');
        return;
      }
      const exp = Math.floor(Math.log10(Math.abs(num)));
      const coeff = num / Math.pow(10, exp);
      const decimal = num.toFixed(Math.max(0, prec - exp));
      const scientific = `${coeff.toFixed(prec)} × 10${superscript(exp)}`;
      setResult({ scientific, decimal: removeTrailingZeros(decimal), exponent: exp, coefficient: coeff });
    }
  }

  function superscript(n: number): string {
    const superDigits: Record<string, string> = {
      '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
      '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻',
    };
    return String(n).split('').map((c) => superDigits[c] || c).join('');
  }

  function removeTrailingZeros(s: string): string {
    if (s.includes('.')) {
      return s.replace(/\.?0+$/, '');
    }
    return s;
  }

  const copyText = result
    ? `Scientific: ${result.scientific}\nDecimal: ${result.decimal}\nCoefficient: ${result.coefficient}\nExponent: ${result.exponent}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="flex gap-2 mb-2">
        <button
          onClick={() => setMode('toScientific')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === 'toScientific' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          aria-label="Convert to scientific notation"
        >
          Number → Scientific
        </button>
        <button
          onClick={() => setMode('toDecimal')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === 'toDecimal' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          aria-label="Convert to decimal"
        >
          Scientific → Number
        </button>
      </div>

      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          {mode === 'toScientific' ? 'Enter a number' : 'Enter scientific notation'}
        </label>
        <input
          id={`${toolId}-input`}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'toScientific' ? '0.000345 or 1500000' : '2.5e3 or 3.45 × 10^-4'}
          aria-label={`Number input for ${toolName}`}
          className="input-field font-mono"
        />
        <div className="mt-2">
          <label htmlFor={`${toolId}-precision`} className="text-xs text-gray-500 mr-2">Decimal places:</label>
          <input
            id={`${toolId}-precision`}
            type="number"
            min="1"
            max="15"
            value={precision}
            onChange={(e) => setPrecision(e.target.value)}
            className="w-16 input-field text-sm inline-block"
            aria-label="Decimal precision"
          />
        </div>
      </InputArea>

      <button onClick={convert} aria-label="Convert number" className="btn-primary">
        Convert
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600 font-mono">{result.scientific}</div>
                <div className="text-xs text-gray-500 mt-1">Scientific Notation</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-green-600 font-mono break-all">{result.decimal}</div>
                <div className="text-xs text-gray-500 mt-1">Decimal Form</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <span className="font-medium">Coefficient:</span> {result.coefficient.toFixed(parseInt(precision) || 6)} &nbsp;|&nbsp;
              <span className="font-medium">Exponent:</span> {result.exponent}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
