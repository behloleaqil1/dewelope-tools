'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * NumberFactorization - Find the prime factorization of a number.
 * Shows prime factors, factor tree representation, and all divisors.
 */
export default function NumberFactorization({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{
    number: number;
    primeFactors: { factor: number; exponent: number }[];
    allDivisors: number[];
    factorization: string;
    isPrime: boolean;
  } | null>(null);

  const factorize = () => {
    const n = parseInt(input.trim());
    if (isNaN(n) || n < 2 || n > 999999999) {
      setError('Enter a valid integer between 2 and 999,999,999');
      setResult(null);
      return;
    }

    setError('');

    // Prime factorization
    const factors: { factor: number; exponent: number }[] = [];
    let remaining = n;

    for (let i = 2; i * i <= remaining; i++) {
      if (remaining % i === 0) {
        let exp = 0;
        while (remaining % i === 0) {
          remaining /= i;
          exp++;
        }
        factors.push({ factor: i, exponent: exp });
      }
    }
    if (remaining > 1) {
      factors.push({ factor: remaining, exponent: 1 });
    }

    // Generate factorization string
    const factorization = factors
      .map(f => f.exponent > 1 ? `${f.factor}^${f.exponent}` : `${f.factor}`)
      .join(' × ');

    // Find all divisors
    const divisors: number[] = [1];
    for (const { factor, exponent } of factors) {
      const currentDivisors = [...divisors];
      for (let e = 1; e <= exponent; e++) {
        const power = Math.pow(factor, e);
        for (const d of currentDivisors) {
          divisors.push(d * power);
        }
      }
    }
    divisors.sort((a, b) => a - b);

    setResult({
      number: n,
      primeFactors: factors,
      allDivisors: divisors,
      factorization,
      isPrime: factors.length === 1 && factors[0].exponent === 1,
    });
  };

  const copyText = result
    ? `Number: ${result.number}\nPrime Factorization: ${result.factorization}\nNumber of Divisors: ${result.allDivisors.length}\nAll Divisors: ${result.allDivisors.join(', ')}\nIs Prime: ${result.isPrime ? 'Yes' : 'No'}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter a Number (2 - 999,999,999)
        </label>
        <input
          id={`${toolId}-input`}
          type="text"
          inputMode="numeric"
          value={input}
          onChange={(e) => { setInput(e.target.value); if (error) setError(''); }}
          placeholder="e.g. 360"
          aria-label={`Number input for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <button onClick={factorize} aria-label="Factorize number" className="btn-primary">
        Factorize
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-sm text-gray-500 mb-1">Prime Factorization of {result.number}</div>
              <div className="text-2xl font-bold text-blue-600 font-mono">{result.factorization}</div>
              {result.isPrime && (
                <div className="text-sm text-green-600 mt-1 font-medium">✓ This number is prime</div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="text-xs text-gray-500">Prime Factors</div>
                <div className="text-lg font-semibold text-gray-800">
                  {result.primeFactors.map(f => f.factor).join(', ')}
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="text-xs text-gray-500">Number of Divisors</div>
                <div className="text-lg font-semibold text-gray-800">{result.allDivisors.length}</div>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="text-sm font-medium text-gray-700 mb-1">All Divisors:</div>
              <div className="text-sm font-mono text-gray-600 break-all">
                {result.allDivisors.join(', ')}
              </div>
            </div>

            {result.primeFactors.length > 1 && (
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="text-sm font-medium text-gray-700 mb-1">Factor Breakdown:</div>
                <div className="text-sm font-mono text-gray-600">
                  {result.primeFactors.map(f => (
                    <div key={f.factor}>
                      {f.factor}{f.exponent > 1 ? `^${f.exponent} = ${Math.pow(f.factor, f.exponent)}` : ''}
                    </div>
                  ))}
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
