'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PowerOfTwoChecker - Checks if a number is a power of 2.
 * Shows the exponent if it is, and the nearest powers of 2 if it isn't.
 */
export default function PowerOfTwoChecker({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{
    isPowerOfTwo: boolean;
    number: number;
    exponent?: number;
    nearestLower?: { value: number; exponent: number };
    nearestUpper?: { value: number; exponent: number };
  } | null>(null);
  const [error, setError] = useState<string | undefined>();

  function handleCheck() {
    setError(undefined);
    setResult(null);

    const num = parseInt(input.trim(), 10);
    if (!input.trim() || isNaN(num)) {
      setError('Please enter a valid integer');
      return;
    }

    if (num <= 0) {
      setError('Please enter a positive integer');
      return;
    }

    const isPowerOfTwo = (num & (num - 1)) === 0;

    if (isPowerOfTwo) {
      const exponent = Math.log2(num);
      setResult({ isPowerOfTwo: true, number: num, exponent });
    } else {
      const lowerExp = Math.floor(Math.log2(num));
      const upperExp = lowerExp + 1;
      setResult({
        isPowerOfTwo: false,
        number: num,
        nearestLower: { value: Math.pow(2, lowerExp), exponent: lowerExp },
        nearestUpper: { value: Math.pow(2, upperExp), exponent: upperExp },
      });
    }
  }

  const copyText = result
    ? result.isPowerOfTwo
      ? `${result.number} is a power of 2 (2^${result.exponent} = ${result.number})`
      : `${result.number} is NOT a power of 2. Nearest: 2^${result.nearestLower?.exponent} = ${result.nearestLower?.value}, 2^${result.nearestUpper?.exponent} = ${result.nearestUpper?.value}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter a Number
        </label>
        <input
          id={`${toolId}-input`}
          type="text"
          inputMode="numeric"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. 256"
          aria-label={`Number input for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <button onClick={handleCheck} aria-label="Check if power of 2" className="btn-primary">
        Check
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className={`p-4 rounded-lg border text-center ${result.isPowerOfTwo ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className={`text-xl font-bold ${result.isPowerOfTwo ? 'text-green-700' : 'text-red-700'}`}>
                {result.isPowerOfTwo ? '✓ Yes' : '✗ No'} — {result.number} is {result.isPowerOfTwo ? '' : 'NOT '}a power of 2
              </div>
              {result.isPowerOfTwo && (
                <div className="text-sm text-green-600 mt-1">
                  2<sup>{result.exponent}</sup> = {result.number}
                </div>
              )}
            </div>
            {!result.isPowerOfTwo && result.nearestLower && result.nearestUpper && (
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                  <div className="text-lg font-bold text-gray-700">{result.nearestLower.value}</div>
                  <div className="text-xs text-gray-500">2<sup>{result.nearestLower.exponent}</sup> (lower)</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                  <div className="text-lg font-bold text-gray-700">{result.nearestUpper.value}</div>
                  <div className="text-xs text-gray-500">2<sup>{result.nearestUpper.exponent}</sup> (upper)</div>
                </div>
              </div>
            )}
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
