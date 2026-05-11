'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TemperatureToColor - Map temperature values to color (blue=cold to red=hot).
 * Creates a visual color representation of temperature on a gradient scale.
 */
export default function TemperatureToColor({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [temperature, setTemperature] = useState('');
  const [minTemp, setMinTemp] = useState('-20');
  const [maxTemp, setMaxTemp] = useState('50');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ color: string; hex: string; percentage: number; label: string } | null>(null);

  const tempToColor = (temp: number, min: number, max: number): { r: number; g: number; b: number } => {
    // Normalize to 0-1 range
    const t = Math.max(0, Math.min(1, (temp - min) / (max - min)));

    let r: number, g: number, b: number;

    if (t < 0.25) {
      // Blue to Cyan
      const s = t / 0.25;
      r = 0;
      g = Math.round(s * 255);
      b = 255;
    } else if (t < 0.5) {
      // Cyan to Green
      const s = (t - 0.25) / 0.25;
      r = 0;
      g = 255;
      b = Math.round((1 - s) * 255);
    } else if (t < 0.75) {
      // Green to Yellow
      const s = (t - 0.5) / 0.25;
      r = Math.round(s * 255);
      g = 255;
      b = 0;
    } else {
      // Yellow to Red
      const s = (t - 0.75) / 0.25;
      r = 255;
      g = Math.round((1 - s) * 255);
      b = 0;
    }

    return { r, g, b };
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    return '#' + [r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('').toUpperCase();
  };

  const getLabel = (percentage: number): string => {
    if (percentage < 20) return 'Very Cold';
    if (percentage < 40) return 'Cold';
    if (percentage < 60) return 'Moderate';
    if (percentage < 80) return 'Warm';
    return 'Hot';
  };

  const calculate = () => {
    const temp = parseFloat(temperature);
    const min = parseFloat(minTemp);
    const max = parseFloat(maxTemp);

    if (isNaN(temp)) {
      setError('Please enter a valid temperature.');
      setResult(null);
      return;
    }

    if (isNaN(min) || isNaN(max) || min >= max) {
      setError('Min must be less than Max.');
      setResult(null);
      return;
    }

    setError('');

    const { r, g, b } = tempToColor(temp, min, max);
    const hex = rgbToHex(r, g, b);
    const percentage = Math.round(((temp - min) / (max - min)) * 100);
    const label = getLabel(Math.max(0, Math.min(100, percentage)));

    setResult({ color: `rgb(${r}, ${g}, ${b})`, hex, percentage: Math.max(0, Math.min(100, percentage)), label });
  };

  const copyText = result
    ? `Temperature: ${temperature}°\nColor: ${result.hex}\nRGB: ${result.color}\nScale: ${result.percentage}% (${result.label})\nRange: ${minTemp}° to ${maxTemp}°`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-temp`} className="block text-sm font-medium text-gray-700 mb-1">
          Temperature Value
        </label>
        <input
          id={`${toolId}-temp`}
          type="text"
          inputMode="decimal"
          value={temperature}
          onChange={(e) => {
            setTemperature(e.target.value);
            if (error) setError('');
          }}
          placeholder="e.g. 25"
          aria-label={`Temperature value for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <div className="grid grid-cols-2 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-min`} className="block text-sm font-medium text-gray-700 mb-1">
            Min Temperature
          </label>
          <input
            id={`${toolId}-min`}
            type="text"
            inputMode="decimal"
            value={minTemp}
            onChange={(e) => setMinTemp(e.target.value)}
            placeholder="-20"
            aria-label={`Minimum temperature for ${toolName}`}
            className="input-field"
          />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-max`} className="block text-sm font-medium text-gray-700 mb-1">
            Max Temperature
          </label>
          <input
            id={`${toolId}-max`}
            type="text"
            inputMode="decimal"
            value={maxTemp}
            onChange={(e) => setMaxTemp(e.target.value)}
            placeholder="50"
            aria-label={`Maximum temperature for ${toolName}`}
            className="input-field"
          />
        </InputArea>
      </div>

      <button onClick={calculate} aria-label="Map temperature to color" className="btn-primary">
        Map to Color
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div
                className="w-24 h-24 rounded-lg border border-gray-300"
                style={{ backgroundColor: result.hex }}
                aria-label="Temperature color preview"
              />
              <div>
                <div className="text-lg font-bold text-gray-800">{result.label}</div>
                <div className="text-sm font-mono text-gray-600">{result.hex}</div>
                <div className="text-sm text-gray-600">{result.color}</div>
                <div className="text-xs text-gray-500">{result.percentage}% of scale</div>
              </div>
            </div>
            <div className="h-4 rounded-full" style={{ background: 'linear-gradient(to right, #0000FF, #00FFFF, #00FF00, #FFFF00, #FF0000)' }}>
              <div
                className="w-3 h-3 bg-white border-2 border-gray-800 rounded-full relative top-0.5"
                style={{ marginLeft: `calc(${result.percentage}% - 6px)` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>{minTemp}° (Cold)</span>
              <span>{maxTemp}° (Hot)</span>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
