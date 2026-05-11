'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CircleCalculator - Calculate area, circumference, diameter from radius (or any from any).
 */
export default function CircleCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [inputType, setInputType] = useState<'radius' | 'diameter' | 'circumference' | 'area'>('radius');
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [result, setResult] = useState<{ radius: number; diameter: number; circumference: number; area: number } | null>(null);

  function calculate() {
    setError(undefined);
    setResult(null);

    const num = parseFloat(value);
    if (!value.trim() || isNaN(num) || num <= 0) {
      setError('Please enter a positive number');
      return;
    }

    let radius: number;
    switch (inputType) {
      case 'radius':
        radius = num;
        break;
      case 'diameter':
        radius = num / 2;
        break;
      case 'circumference':
        radius = num / (2 * Math.PI);
        break;
      case 'area':
        radius = Math.sqrt(num / Math.PI);
        break;
    }

    setResult({
      radius,
      diameter: radius * 2,
      circumference: 2 * Math.PI * radius,
      area: Math.PI * radius * radius,
    });
  }

  const copyText = result
    ? `Radius: ${result.radius.toFixed(6)}\nDiameter: ${result.diameter.toFixed(6)}\nCircumference: ${result.circumference.toFixed(6)}\nArea: ${result.area.toFixed(6)}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">
          Calculate from
        </label>
        <select
          id={`${toolId}-type`}
          value={inputType}
          onChange={(e) => setInputType(e.target.value as typeof inputType)}
          aria-label={`Input type for ${toolName}`}
          className="input-field text-sm mb-3"
        >
          <option value="radius">Radius</option>
          <option value="diameter">Diameter</option>
          <option value="circumference">Circumference</option>
          <option value="area">Area</option>
        </select>

        <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">
          {inputType.charAt(0).toUpperCase() + inputType.slice(1)} value
        </label>
        <input
          id={`${toolId}-value`}
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={`Enter ${inputType} value`}
          aria-label={`${inputType} value`}
          className="input-field"
        />
      </InputArea>

      <button onClick={calculate} aria-label="Calculate circle properties" className="btn-primary">
        Calculate
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600 font-mono">{result.radius.toFixed(6)}</div>
                <div className="text-xs text-gray-500 mt-1">Radius</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600 font-mono">{result.diameter.toFixed(6)}</div>
                <div className="text-xs text-gray-500 mt-1">Diameter</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600 font-mono">{result.circumference.toFixed(6)}</div>
                <div className="text-xs text-gray-500 mt-1">Circumference</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600 font-mono">{result.area.toFixed(6)}</div>
                <div className="text-xs text-gray-500 mt-1">Area</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
              C = 2πr = {result.circumference.toFixed(6)} | A = πr² = {result.area.toFixed(6)}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
