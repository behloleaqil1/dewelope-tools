'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CircleAreaCalculator - Calculate circle area from radius or diameter using A = πr².
 */
export default function CircleAreaCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [inputType, setInputType] = useState<'radius' | 'diameter'>('radius');
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ area: number; circumference: number; formula: string } | null>(null);

  const calculate = () => {
    setError('');
    setResult(null);
    const num = parseFloat(value);
    if (isNaN(num) || num <= 0) {
      setError('Please enter a valid positive number.');
      return;
    }
    const r = inputType === 'radius' ? num : num / 2;
    const area = Math.PI * r * r;
    const circumference = 2 * Math.PI * r;
    const formula = inputType === 'radius'
      ? `A = πr² = π × ${r}² = ${area.toFixed(6)}`
      : `A = π(d/2)² = π × (${num}/2)² = π × ${r}² = ${area.toFixed(6)}`;
    setResult({ area, circumference, formula });
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="flex gap-2 mb-2">
        <button onClick={() => { setInputType('radius'); setResult(null); setError(''); }} className={`px-4 py-2 rounded text-sm font-medium ${inputType === 'radius' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`} aria-label="Input radius">Radius</button>
        <button onClick={() => { setInputType('diameter'); setResult(null); setError(''); }} className={`px-4 py-2 rounded text-sm font-medium ${inputType === 'diameter' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`} aria-label="Input diameter">Diameter</button>
      </div>

      <InputArea error={error}>
        <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">{inputType === 'radius' ? 'Radius' : 'Diameter'}</label>
        <input id={`${toolId}-value`} type="text" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} placeholder="e.g. 5" aria-label={`${inputType} for ${toolName}`} className="input-field" />
      </InputArea>

      <button onClick={calculate} className="btn-primary" aria-label="Calculate circle area">Calculate</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-sm text-gray-500">Area</div>
                <div className="text-xl font-bold text-blue-600">{result.area.toFixed(6)}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-sm text-gray-500">Circumference</div>
                <div className="text-xl font-bold text-blue-600">{result.circumference.toFixed(6)}</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">{result.formula}</div>
            <CopyToClipboard text={`Area: ${result.area.toFixed(6)}\nCircumference: ${result.circumference.toFixed(6)}\n${result.formula}`} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
