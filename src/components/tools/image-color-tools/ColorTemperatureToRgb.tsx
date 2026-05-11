'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorTemperatureToRgb - Converts color temperature (Kelvin) to RGB values.
 * Uses Tanner Helland's algorithm for approximation.
 */
export default function ColorTemperatureToRgb({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [kelvin, setKelvin] = useState('6500');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ r: number; g: number; b: number } | null>(null);

  const kelvinToRgb = (temp: number): { r: number; g: number; b: number } => {
    const t = temp / 100;
    let r: number, g: number, b: number;

    // Red
    if (t <= 66) {
      r = 255;
    } else {
      r = 329.698727446 * Math.pow(t - 60, -0.1332047592);
    }

    // Green
    if (t <= 66) {
      g = 99.4708025861 * Math.log(t) - 161.1195681661;
    } else {
      g = 288.1221695283 * Math.pow(t - 60, -0.0755148492);
    }

    // Blue
    if (t >= 66) {
      b = 255;
    } else if (t <= 19) {
      b = 0;
    } else {
      b = 138.5177312231 * Math.log(t - 10) - 305.0447927307;
    }

    return {
      r: Math.max(0, Math.min(255, Math.round(r))),
      g: Math.max(0, Math.min(255, Math.round(g))),
      b: Math.max(0, Math.min(255, Math.round(b))),
    };
  };

  const convert = () => {
    const temp = parseFloat(kelvin);
    if (isNaN(temp) || temp < 1000 || temp > 40000) {
      setError('Please enter a value between 1000K and 40000K');
      setResult(null);
      return;
    }

    setError('');
    setResult(kelvinToRgb(temp));
  };

  const hexValue = result ? `#${result.r.toString(16).padStart(2, '0')}${result.g.toString(16).padStart(2, '0')}${result.b.toString(16).padStart(2, '0')}` : '';

  const copyText = result
    ? `Temperature: ${kelvin}K\nRGB: rgb(${result.r}, ${result.g}, ${result.b})\nHex: ${hexValue}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-kelvin`} className="block text-sm font-medium text-gray-700 mb-1">
          Color Temperature (Kelvin)
        </label>
        <input
          id={`${toolId}-kelvin`}
          type="text"
          inputMode="numeric"
          value={kelvin}
          onChange={(e) => { setKelvin(e.target.value); if (error) setError(''); }}
          placeholder="e.g. 6500"
          aria-label={`Color temperature in Kelvin for ${toolName}`}
          className="input-field"
        />
        <p className="text-xs text-gray-500 mt-1">Range: 1000K (warm/red) to 40000K (cool/blue). Daylight is ~6500K.</p>
      </InputArea>

      <button onClick={convert} aria-label="Convert temperature to RGB" className="btn-primary">
        Convert to RGB
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            {/* Color preview */}
            <div
              className="w-full h-24 rounded-lg border border-gray-200"
              style={{ backgroundColor: hexValue }}
            />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-red-600">{result.r}</div>
                <div className="text-xs text-gray-500">Red</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-green-600">{result.g}</div>
                <div className="text-xs text-gray-500">Green</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-blue-600">{result.b}</div>
                <div className="text-xs text-gray-500">Blue</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-800">{hexValue}</div>
                <div className="text-xs text-gray-500">Hex</div>
              </div>
            </div>

            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
              rgb({result.r}, {result.g}, {result.b})
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
