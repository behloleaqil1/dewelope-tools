'use client';

import { useState } from 'react';
import { ToolEngineProps } from '@/types';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';
import { generateRandomNumbers } from '@/lib/text-tools';

/**
 * RandomNumberGenerator - Generate random numbers within a configurable range.
 */
export default function RandomNumberGenerator({ toolId }: ToolEngineProps) {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(1);
  const [decimals, setDecimals] = useState(0);
  const [results, setResults] = useState<number[]>([]);
  const [error, setError] = useState<string | undefined>();

  function handleGenerate() {
    if (min >= max) {
      setError('Minimum must be less than maximum');
      setResults([]);
      return;
    }
    setError(undefined);
    const nums = generateRandomNumbers({ min, max, count, decimals });
    setResults(nums);
  }

  const outputText = results.join(', ');

  return (
    <div className="space-y-4">
      <InputArea error={error}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label htmlFor={`${toolId}-min`} className="block text-sm font-medium text-gray-700 mb-1">
              Min
            </label>
            <input
              id={`${toolId}-min`}
              type="number"
              value={min}
              onChange={(e) => setMin(parseInt(e.target.value) || 0)}
              aria-label="Minimum value"
              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-max`} className="block text-sm font-medium text-gray-700 mb-1">
              Max
            </label>
            <input
              id={`${toolId}-max`}
              type="number"
              value={max}
              onChange={(e) => setMax(parseInt(e.target.value) || 0)}
              aria-label="Maximum value"
              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-count`} className="block text-sm font-medium text-gray-700 mb-1">
              Count
            </label>
            <input
              id={`${toolId}-count`}
              type="number"
              min={1}
              max={100}
              value={count}
              onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
              aria-label="Number of random numbers to generate"
              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-decimals`} className="block text-sm font-medium text-gray-700 mb-1">
              Decimals
            </label>
            <input
              id={`${toolId}-decimals`}
              type="number"
              min={0}
              max={10}
              value={decimals}
              onChange={(e) => setDecimals(Math.max(0, Math.min(10, parseInt(e.target.value) || 0)))}
              aria-label="Number of decimal places"
              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]"
            />
          </div>
        </div>
      </InputArea>

      <button
        onClick={handleGenerate}
        aria-label="Generate random numbers"
        className="px-6 py-3 text-sm font-medium rounded-md min-h-[44px] bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Generate
      </button>

      <OutputArea hasContent={results.length > 0}>
        {results.length > 0 && (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {results.map((num, i) => (
                <span key={i} className="px-3 py-1.5 bg-gray-100 rounded-md text-sm font-mono text-gray-800">
                  {num}
                </span>
              ))}
            </div>
            <CopyToClipboard text={outputText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
