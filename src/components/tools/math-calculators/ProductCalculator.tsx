'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ProductCalculator - Multiply a list of numbers together with running product display.
 * Accepts numbers separated by commas, spaces, or newlines.
 */
export default function ProductCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{ numbers: number[]; runningProducts: number[]; total: number } | null>(null);
  const [error, setError] = useState('');

  const calculate = () => {
    setError('');
    const parts = input.split(/[\s,;\n]+/).filter(Boolean);
    const numbers: number[] = [];

    for (const part of parts) {
      const num = parseFloat(part);
      if (isNaN(num)) {
        setError(`Invalid number: "${part}"`);
        setResult(null);
        return;
      }
      numbers.push(num);
    }

    if (numbers.length === 0) {
      setError('Please enter at least one number.');
      setResult(null);
      return;
    }

    const runningProducts: number[] = [];
    let product = 1;
    for (const n of numbers) {
      product *= n;
      runningProducts.push(product);
    }

    setResult({ numbers, runningProducts, total: product });
  };

  const copyText = result
    ? `Numbers: ${result.numbers.join(', ')}\nProduct: ${result.total}\nRunning products: ${result.runningProducts.join(', ')}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter numbers (separated by commas, spaces, or newlines)
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="2, 3, 5, 7"
          aria-label={`Number list for ${toolName}`}
          className="input-field h-36 resize-y font-mono"
        />
      </InputArea>

      <button onClick={calculate} className="btn-primary">Calculate Product</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-3xl font-bold text-blue-600">{result.total}</div>
              <div className="text-xs text-gray-500 mt-1">Product ({result.numbers.length} numbers)</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="text-sm font-medium text-gray-700 mb-2">Running Product</div>
              <div className="space-y-1">
                {result.numbers.map((num, i) => (
                  <div key={i} className="flex justify-between text-sm font-mono text-gray-700">
                    <span>{i > 0 ? `× ${num}` : num}</span>
                    <span className="text-gray-500">= {result.runningProducts[i]}</span>
                  </div>
                ))}
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
