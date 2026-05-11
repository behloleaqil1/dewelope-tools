'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * BinaryCalculator - Performs binary arithmetic operations (AND, OR, XOR, NOT, shift).
 * Accepts decimal or binary input and shows results in both formats.
 */
export default function BinaryCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [inputA, setInputA] = useState('');
  const [inputB, setInputB] = useState('');
  const [operation, setOperation] = useState<'AND' | 'OR' | 'XOR' | 'NOT' | 'LSHIFT' | 'RSHIFT'>('AND');
  const [inputFormat, setInputFormat] = useState<'decimal' | 'binary'>('decimal');
  const [shiftAmount, setShiftAmount] = useState('1');
  const [result, setResult] = useState<{ decimal: number; binary: string; hex: string } | null>(null);
  const [error, setError] = useState('');

  const parseInput = (val: string): number | null => {
    const trimmed = val.trim();
    if (!trimmed) return null;
    if (inputFormat === 'binary') {
      if (!/^[01]+$/.test(trimmed)) return null;
      return parseInt(trimmed, 2);
    }
    const num = parseInt(trimmed);
    return isNaN(num) ? null : num;
  };

  const calculate = () => {
    setError('');
    setResult(null);

    const a = parseInput(inputA);
    if (a === null) {
      setError(`Invalid ${inputFormat} value for A`);
      return;
    }

    let res: number;

    if (operation === 'NOT') {
      res = ~a >>> 0;
      // Show as 32-bit
    } else if (operation === 'LSHIFT' || operation === 'RSHIFT') {
      const shift = parseInt(shiftAmount);
      if (isNaN(shift) || shift < 0 || shift > 31) {
        setError('Shift amount must be 0-31');
        return;
      }
      res = operation === 'LSHIFT' ? (a << shift) >>> 0 : a >>> shift;
    } else {
      const b = parseInput(inputB);
      if (b === null) {
        setError(`Invalid ${inputFormat} value for B`);
        return;
      }
      switch (operation) {
        case 'AND': res = (a & b) >>> 0; break;
        case 'OR': res = (a | b) >>> 0; break;
        case 'XOR': res = (a ^ b) >>> 0; break;
        default: res = 0;
      }
    }

    setResult({
      decimal: res,
      binary: res.toString(2),
      hex: res.toString(16).toUpperCase(),
    });
  };

  const needsSecondInput = !['NOT', 'LSHIFT', 'RSHIFT'].includes(operation);
  const needsShift = operation === 'LSHIFT' || operation === 'RSHIFT';

  const copyText = result
    ? `Decimal: ${result.decimal}\nBinary: ${result.binary}\nHex: 0x${result.hex}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="flex gap-2 flex-wrap">
        {(['decimal', 'binary'] as const).map((fmt) => (
          <button
            key={fmt}
            onClick={() => { setInputFormat(fmt); setResult(null); }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${inputFormat === fmt ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            aria-label={`Input format: ${fmt}`}
          >
            {fmt.charAt(0).toUpperCase() + fmt.slice(1)} Input
          </button>
        ))}
      </div>

      <InputArea error={error}>
        <label htmlFor={`${toolId}-op`} className="block text-sm font-medium text-gray-700 mb-1">
          Operation
        </label>
        <select
          id={`${toolId}-op`}
          value={operation}
          onChange={(e) => { setOperation(e.target.value as typeof operation); setResult(null); }}
          aria-label={`Operation for ${toolName}`}
          className="input-field"
        >
          <option value="AND">AND (&amp;)</option>
          <option value="OR">OR (|)</option>
          <option value="XOR">XOR (^)</option>
          <option value="NOT">NOT (~)</option>
          <option value="LSHIFT">Left Shift (&lt;&lt;)</option>
          <option value="RSHIFT">Right Shift (&gt;&gt;&gt;)</option>
        </select>

        <label htmlFor={`${toolId}-a`} className="block text-sm font-medium text-gray-700 mb-1 mt-3">
          Value A
        </label>
        <input
          id={`${toolId}-a`}
          type="text"
          value={inputA}
          onChange={(e) => setInputA(e.target.value)}
          placeholder={inputFormat === 'binary' ? 'e.g. 1010' : 'e.g. 10'}
          aria-label={`Value A for ${toolName}`}
          className="input-field"
        />

        {needsSecondInput && (
          <>
            <label htmlFor={`${toolId}-b`} className="block text-sm font-medium text-gray-700 mb-1 mt-3">
              Value B
            </label>
            <input
              id={`${toolId}-b`}
              type="text"
              value={inputB}
              onChange={(e) => setInputB(e.target.value)}
              placeholder={inputFormat === 'binary' ? 'e.g. 1100' : 'e.g. 12'}
              aria-label={`Value B for ${toolName}`}
              className="input-field"
            />
          </>
        )}

        {needsShift && (
          <>
            <label htmlFor={`${toolId}-shift`} className="block text-sm font-medium text-gray-700 mb-1 mt-3">
              Shift Amount (0-31)
            </label>
            <input
              id={`${toolId}-shift`}
              type="text"
              inputMode="numeric"
              value={shiftAmount}
              onChange={(e) => setShiftAmount(e.target.value)}
              placeholder="e.g. 2"
              aria-label={`Shift amount for ${toolName}`}
              className="input-field"
            />
          </>
        )}
      </InputArea>

      <button onClick={calculate} aria-label="Calculate binary operation" className="btn-primary">
        Calculate
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-800">{result.decimal}</div>
                <div className="text-xs text-gray-500 mt-1">Decimal</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-800 font-mono break-all">{result.binary}</div>
                <div className="text-xs text-gray-500 mt-1">Binary</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-800 font-mono">0x{result.hex}</div>
                <div className="text-xs text-gray-500 mt-1">Hexadecimal</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
