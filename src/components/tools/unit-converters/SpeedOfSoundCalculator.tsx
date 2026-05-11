'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SpeedOfSoundCalculator - Calculate speed of sound at different temperatures.
 * Uses the formula for dry air: c = 331.3 × sqrt(1 + T/273.15) m/s
 */
export default function SpeedOfSoundCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [temperature, setTemperature] = useState('20');
  const [tempUnit, setTempUnit] = useState<'celsius' | 'fahrenheit' | 'kelvin'>('celsius');
  const [result, setResult] = useState<{ ms: number; kmh: number; mph: number; knots: number; ftPerSec: number; mach: number; tempC: number } | null>(null);
  const [error, setError] = useState('');

  const toKelvin = (val: number, unit: string): number => {
    switch (unit) {
      case 'celsius': return val + 273.15;
      case 'fahrenheit': return (val - 32) * 5 / 9 + 273.15;
      case 'kelvin': return val;
      default: return val;
    }
  };

  const calculate = () => {
    setError('');
    setResult(null);

    const tempVal = parseFloat(temperature);
    if (isNaN(tempVal)) { setError('Please enter a valid temperature'); return; }

    const kelvin = toKelvin(tempVal, tempUnit);
    if (kelvin < 0) { setError('Temperature cannot be below absolute zero'); return; }

    const tempC = kelvin - 273.15;

    // Speed of sound in dry air
    const speedMs = 331.3 * Math.sqrt(1 + tempC / 273.15);
    const speedKmh = speedMs * 3.6;
    const speedMph = speedMs * 2.23694;
    const speedKnots = speedMs * 1.94384;
    const speedFtPerSec = speedMs * 3.28084;
    const mach = 1; // By definition, Mach 1 at this temperature

    setResult({
      ms: speedMs,
      kmh: speedKmh,
      mph: speedMph,
      knots: speedKnots,
      ftPerSec: speedFtPerSec,
      mach,
      tempC,
    });
  };

  const copyText = result
    ? `Speed of Sound at ${result.tempC.toFixed(1)}°C:\n${result.ms.toFixed(2)} m/s\n${result.kmh.toFixed(2)} km/h\n${result.mph.toFixed(2)} mph\n${result.knots.toFixed(2)} knots\n${result.ftPerSec.toFixed(2)} ft/s`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-temp`} className="block text-sm font-medium text-gray-700 mb-1">
              Temperature
            </label>
            <input
              id={`${toolId}-temp`}
              type="text"
              inputMode="decimal"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              placeholder="e.g. 20"
              aria-label={`Temperature for ${toolName}`}
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-unit`} className="block text-sm font-medium text-gray-700 mb-1">
              Unit
            </label>
            <select
              id={`${toolId}-unit`}
              value={tempUnit}
              onChange={(e) => setTempUnit(e.target.value as typeof tempUnit)}
              aria-label={`Temperature unit for ${toolName}`}
              className="input-field"
            >
              <option value="celsius">Celsius (°C)</option>
              <option value="fahrenheit">Fahrenheit (°F)</option>
              <option value="kelvin">Kelvin (K)</option>
            </select>
          </div>
        </div>
      </InputArea>

      <button onClick={calculate} aria-label="Calculate speed of sound" className="btn-primary">
        Calculate
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-3xl font-bold text-blue-600">{result.ms.toFixed(2)} m/s</div>
              <div className="text-sm text-gray-500 mt-1">Speed of sound at {result.tempC.toFixed(1)}°C (Mach {result.mach})</div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-700">{result.kmh.toFixed(2)}</div>
                <div className="text-xs text-gray-500">km/h</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-700">{result.mph.toFixed(2)}</div>
                <div className="text-xs text-gray-500">mph</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-700">{result.knots.toFixed(2)}</div>
                <div className="text-xs text-gray-500">knots</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-700">{result.ftPerSec.toFixed(2)}</div>
                <div className="text-xs text-gray-500">ft/s</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-700">{result.ms.toFixed(2)}</div>
                <div className="text-xs text-gray-500">m/s</div>
              </div>
            </div>

            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
              Formula: c = 331.3 × √(1 + T/273.15) m/s (dry air)
            </div>

            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
