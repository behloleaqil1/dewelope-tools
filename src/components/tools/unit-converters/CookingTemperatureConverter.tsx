'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CookingTemperatureConverter - Convert between Celsius, Fahrenheit with common cooking presets (Gas Mark).
 */
export default function CookingTemperatureConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState<'celsius' | 'fahrenheit' | 'gas'>('celsius');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ celsius: number; fahrenheit: number; gas: string; description: string } | null>(null);

  const gasMarkToCelsius: Record<string, number> = {
    '1/4': 110, '1/2': 130, '1': 140, '2': 150, '3': 170, '4': 180,
    '5': 190, '6': 200, '7': 220, '8': 230, '9': 240, '10': 260,
  };

  const celsiusToGasMark = (c: number): string => {
    if (c < 110) return 'Below 1/4';
    if (c <= 120) return '1/4';
    if (c <= 135) return '1/2';
    if (c <= 145) return '1';
    if (c <= 160) return '2';
    if (c <= 175) return '3';
    if (c <= 185) return '4';
    if (c <= 195) return '5';
    if (c <= 210) return '6';
    if (c <= 225) return '7';
    if (c <= 235) return '8';
    if (c <= 250) return '9';
    if (c <= 270) return '10';
    return 'Above 10';
  };

  const getDescription = (c: number): string => {
    if (c < 150) return 'Very Cool / Very Slow';
    if (c < 170) return 'Cool / Slow';
    if (c < 190) return 'Moderate';
    if (c < 210) return 'Moderately Hot';
    if (c < 230) return 'Hot';
    if (c < 250) return 'Very Hot';
    return 'Extremely Hot';
  };

  const convert = () => {
    setError('');
    setResult(null);

    if (!value.trim()) {
      setError('Please enter a value');
      return;
    }

    let celsius: number;

    if (fromUnit === 'gas') {
      const gasVal = value.trim();
      const mapped = gasMarkToCelsius[gasVal];
      if (mapped === undefined) {
        setError('Gas Mark must be 1/4, 1/2, or 1-10');
        return;
      }
      celsius = mapped;
    } else {
      const num = parseFloat(value);
      if (isNaN(num)) {
        setError('Please enter a valid number');
        return;
      }
      celsius = fromUnit === 'fahrenheit' ? (num - 32) * 5 / 9 : num;
    }

    const fahrenheit = celsius * 9 / 5 + 32;
    const gas = celsiusToGasMark(celsius);
    const description = getDescription(celsius);

    setResult({ celsius, fahrenheit, gas, description });
  };

  const presets = [
    { label: 'Low & Slow (150°C)', c: 150 },
    { label: 'Moderate (180°C)', c: 180 },
    { label: 'Hot (200°C)', c: 200 },
    { label: 'Very Hot (220°C)', c: 220 },
    { label: 'Pizza (250°C)', c: 250 },
  ];

  const copyText = result
    ? `${result.celsius.toFixed(0)}°C = ${result.fahrenheit.toFixed(0)}°F = Gas Mark ${result.gas}\nDescription: ${result.description}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">
          Temperature Value
        </label>
        <div className="flex gap-2">
          <input
            id={`${toolId}-value`}
            type="text"
            inputMode="decimal"
            value={value}
            onChange={(e) => { setValue(e.target.value); if (error) setError(''); }}
            placeholder={fromUnit === 'gas' ? 'e.g. 6' : 'e.g. 180'}
            aria-label={`Temperature value for ${toolName}`}
            className="input-field flex-1"
          />
          <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value as typeof fromUnit)} className="input-field w-36" aria-label="Temperature unit">
            <option value="celsius">Celsius (°C)</option>
            <option value="fahrenheit">Fahrenheit (°F)</option>
            <option value="gas">Gas Mark</option>
          </select>
        </div>
        <div className="mt-3">
          <label className="block text-xs text-gray-500 mb-1">Quick Presets</label>
          <div className="flex flex-wrap gap-2">
            {presets.map((p) => (
              <button
                key={p.c}
                onClick={() => { setValue(String(p.c)); setFromUnit('celsius'); }}
                className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded border border-gray-300 text-gray-700"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </InputArea>

      <button onClick={convert} aria-label="Convert temperature" className="btn-primary">
        Convert
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600">{result.celsius.toFixed(0)}°C</div>
                <div className="text-xs text-gray-500 mt-1">Celsius</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-orange-600">{result.fahrenheit.toFixed(0)}°F</div>
                <div className="text-xs text-gray-500 mt-1">Fahrenheit</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-purple-600">Gas {result.gas}</div>
                <div className="text-xs text-gray-500 mt-1">Gas Mark</div>
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
              <span className="text-sm text-gray-700 font-medium">{result.description}</span>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
