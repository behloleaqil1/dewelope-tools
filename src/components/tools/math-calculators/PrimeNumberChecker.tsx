'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PrimeNumberChecker - Check if a number is prime and find nearby primes.
 */
export default function PrimeNumberChecker({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{ isPrime: boolean; number: number; nearbyPrimes: number[]; factors: number[] } | null>(null);
  const [error, setError] = useState<string | undefined>();

  function isPrime(n: number): boolean {
    if (n < 2) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;
    for (let i = 3; i <= Math.sqrt(n); i += 2) {
      if (n % i === 0) return false;
    }
    return true;
  }

  function getFactors(n: number): number[] {
    if (n < 2) return [];
    const factors: number[] = [];
    let num = n;
    for (let i = 2; i <= Math.sqrt(num); i++) {
      while (num % i === 0) {
        factors.push(i);
        num /= i;
      }
    }
    if (num > 1) factors.push(num);
    return factors;
  }

  function findNearbyPrimes(n: number): number[] {
    const primes: number[] = [];
    let below = n - 1;
    while (below >= 2 && primes.length < 3) {
      if (isPrime(below)) primes.unshift(below);
      below--;
    }
    let above = n + 1;
    while (primes.length < 6 && above < n + 100) {
      if (isPrime(above)) primes.push(above);
      above++;
    }
    return primes;
  }

  function handleCheck() {
    const num = parseInt(input);
    if (!input.trim() || isNaN(num) || num < 1 || num > 1000000000) {
      setError('Please enter a valid positive integer (1 to 1,000,000,000)');
      setResult(null);
      return;
    }

    setError(undefined);
    const prime = isPrime(num);
    const factors = prime ? [] : getFactors(num);
    const nearbyPrimes = findNearbyPrimes(num);

    setResult({ isPrime: prime, number: num, nearbyPrimes, factors });
  }

  const copyText = result
    ? `${result.number} is ${result.isPrime ? 'PRIME' : 'NOT PRIME'}${!result.isPrime && result.factors.length > 0 ? `\nPrime factors: ${result.factors.join(' × ')}` : ''}\nNearby primes: ${result.nearbyPrimes.join(', ')}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter a number
        </label>
        <input
          id={`${toolId}-input`}
          type="text"
          inputMode="numeric"
          value={input}
          onChange={(e) => { setInput(e.target.value); if (error) setError(undefined); }}
          placeholder="e.g. 97"
          aria-label={`Number input for ${toolName}`}
          className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]"
        />
      </InputArea>

      <button
        onClick={handleCheck}
        aria-label="Check if prime"
        className="px-6 py-3 text-sm font-medium rounded-md min-h-[44px] bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Check Prime
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className={`text-center p-4 rounded-lg border ${result.isPrime ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className={`text-2xl font-bold ${result.isPrime ? 'text-green-600' : 'text-red-600'}`}>
                {result.number.toLocaleString()} is {result.isPrime ? 'PRIME' : 'NOT PRIME'}
              </div>
            </div>
            {!result.isPrime && result.factors.length > 0 && (
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="text-sm font-medium text-gray-700">Prime Factorization</div>
                <div className="text-sm font-mono text-gray-800 mt-1">{result.factors.join(' × ')} = {result.number}</div>
              </div>
            )}
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="text-sm font-medium text-gray-700">Nearby Primes</div>
              <div className="text-sm font-mono text-gray-800 mt-1">{result.nearbyPrimes.join(', ')}</div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
