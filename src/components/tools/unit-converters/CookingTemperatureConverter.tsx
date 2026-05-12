'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CookingTemperatureConverter - Converts oven temperatures between Fahrenheit, Celsius, and Gas Mark.
 * Includes common oven temperature presets for quick reference.
 */
export default function CookingTemperatureConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('fahrenheit');
  const [result, setResult] = useState<{ fahrenheit: string; celsius: string; gasMark: string; description: string } | null>(null);
  const [error, setError] = useState<string | undefined>();

  const GAS_MARKS: { mark: number; fahrenheit: number }[] = [
    { mark: 0.25, fahrenheit: 225 },
    { mark: 0.5, fahrenheit: 250 },
    { mark: 1, fahrenheit: 275 },
    { mark: 2, fahrenheit: 300 },
    { mark: 3, fahrenheit: 325 },
    { mark: 4, fahrenheit: 350 },
    { mark: 5, fahrenheit: 375 },
    { mark: 6, fahrenheit: 400 },
    { mark: 7, fahrenheit: 425 },
    { mark: 8, fahrenheit: 450 },
    { mark: 9, fahrenheit: 475 },
    { mark: 10, fahrenheit: 500 },
  ];

  function getDescription(f: number): string {
    if (f <= 250) return 'Very Low / Slow';
    if (f <= 300) return 'Low / Slow';
    if (f <= 350) return 'Moderate';
    if (f <= 400) return 'Moderately Hot';
    if (f <= 450) return 'Hot';
    if (f <= 500) return 'Very Hot';
    return 'Extremely Hot';
  }

  function fahrenheitToGasMark(f: number): string {
    if (f < 225) return '< ¼';
    if (f > 500) return '> 10';
    // Find closest gas mark
    let closest = GAS_MARKS[0];
    let minDiff = Math.abs(f - GAS_MARKS[0].fahrenheit);
    for (const gm of GAS_MARKS) {
      const diff = Math.abs(f - gm.fahrenheit);
      if (diff < minDiff) {
        minDiff = diff;
        closest = gm;
      }
    }
    return closest.mark.toString();
  }

  function gasMarkToFahrenheit(mark: number): number {
    const entry = GAS_MARKS.find((gm) => gm.mark === mark);
    if (entry) return entry.fahrenheit;
    // Interpolate
    if (mark < 0.25) return 225;
    if (mark > 10) return 500;
    // Linear approximation
    return Math.round(250 + (mark - 0.5) * 25);
  }

  function convert() {
    setError(undefined);
    setResult(null);

    const num = parseFloat(value);
    if (!value.trim() || isNaN(num)) {
      setError('Please enter a valid number');
      return;
    }

    let fahrenheit: number;

    if (fromUnit === 'fahrenheit') {
      fahrenheit = num;
    } else if (fromUnit === 'celsius') {
      fahrenheit = (num * 9) / 5 + 32;
    } else {
      // gas mark
      fahrenheit = gasMarkToFahrenheit(num);
    }

    const celsius = ((fahrenheit - 32) * 5) / 9;
    const gasMark = fahrenheitToGasMark(fahrenheit);

    setResult({
      fahrenheit: Math.round(fahrenheit).toString(),
      celsius: Math.round(celsius).toString(),
      gasMark,
      description: getDescription(fahrenheit),
    });
  }

  const copyText = result
    ? `${result.fahrenheit}°F = ${result.celsius}°C = Gas Mark ${result.gasMark} (${result.description})`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">
          Temperature Value
        </label>
        <input
          id={`${toolId}-value`}
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="e.g. 350"
          aria-label={`Temperature value for ${toolName}`}
          className="input-field"
        />
        <div className="mt-3">
          <label htmlFor={`${toolId}-unit`} className="block text-xs text-gray-500 mb-1">From Unit</label>
          <select
            id={`${toolId}-unit`}
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            aria-label="Temperature unit"
            className="input-field text-sm"
          >
            <option value="fahrenheit">Fahrenheit (°F)</option>
            <option value="celsius">Celsius (°C)</option>
            <option value="gasmark">Gas Mark</option>
          </select>
        </div>
      </InputArea>

      <button onClick={convert} aria-label="Convert cooking temperature" className="btn-primary">
        Convert
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600 font-mono">{result.fahrenheit}°F</div>
                <div className="text-xs text-gray-500 mt-1">Fahrenheit</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-green-600 font-mono">{result.celsius}°C</div>
                <div className="text-xs text-gray-500 mt-1">Celsius</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-orange-600 font-mono">{result.gasMark}</div>
                <div className="text-xs text-gray-500 mt-1">Gas Mark</div>
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
              <span className="text-sm font-medium text-gray-700">{result.description}</span>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
