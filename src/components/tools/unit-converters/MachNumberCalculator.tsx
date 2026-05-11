'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * MachNumberCalculator - Convert between Mach number and speed at different altitudes.
 * Speed of sound varies with temperature/altitude.
 */

const ALTITUDES = [
  { label: 'Sea Level (15°C)', tempC: 15 },
  { label: '5,000 ft (-17.5°C)', tempC: -17.5 },
  { label: '10,000 ft (-4.8°C)', tempC: -4.8 },
  { label: '20,000 ft (-24.6°C)', tempC: -24.6 },
  { label: '30,000 ft (-44.4°C)', tempC: -44.4 },
  { label: '40,000 ft (-56.5°C)', tempC: -56.5 },
  { label: '50,000 ft (-56.5°C)', tempC: -56.5 },
  { label: 'Custom Temperature', tempC: NaN },
];

export default function MachNumberCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [mode, setMode] = useState<'machToSpeed' | 'speedToMach'>('machToSpeed');
  const [value, setValue] = useState('');
  const [altitudeIndex, setAltitudeIndex] = useState(0);
  const [customTemp, setCustomTemp] = useState('15');
  const [speedUnit, setSpeedUnit] = useState<'kmh' | 'mph' | 'ms' | 'knots'>('kmh');
  const [error, setError] = useState<string | undefined>();
  const [result, setResult] = useState<{ mach: number; kmh: number; mph: number; ms: number; knots: number; speedOfSound: number } | null>(null);

  function getTemperature(): number {
    const alt = ALTITUDES[altitudeIndex];
    if (isNaN(alt.tempC)) return parseFloat(customTemp);
    return alt.tempC;
  }

  function handleCalculate() {
    const num = parseFloat(value);
    if (isNaN(num) || num < 0) { setError('Enter a valid positive number'); setResult(null); return; }

    const tempC = getTemperature();
    if (isNaN(tempC)) { setError('Enter a valid temperature'); setResult(null); return; }

    setError(undefined);

    // Speed of sound in m/s: c = 331.3 * sqrt(1 + T/273.15)
    const speedOfSound = 331.3 * Math.sqrt(1 + tempC / 273.15);

    let machNumber: number;
    if (mode === 'machToSpeed') {
      machNumber = num;
    } else {
      // Convert input speed to m/s first
      let speedMs: number;
      switch (speedUnit) {
        case 'kmh': speedMs = num / 3.6; break;
        case 'mph': speedMs = num * 0.44704; break;
        case 'ms': speedMs = num; break;
        case 'knots': speedMs = num * 0.514444; break;
        default: speedMs = num;
      }
      machNumber = speedMs / speedOfSound;
    }

    const ms = machNumber * speedOfSound;
    const kmh = ms * 3.6;
    const mph = ms / 0.44704;
    const knots = ms / 0.514444;

    setResult({ mach: machNumber, kmh, mph, ms, knots, speedOfSound });
  }

  const copyText = result
    ? `Mach: ${result.mach.toFixed(4)}\nSpeed: ${result.kmh.toFixed(2)} km/h | ${result.mph.toFixed(2)} mph | ${result.ms.toFixed(2)} m/s | ${result.knots.toFixed(2)} knots\nSpeed of Sound: ${result.speedOfSound.toFixed(2)} m/s`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="flex gap-4 mb-3">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="radio" checked={mode === 'machToSpeed'} onChange={() => setMode('machToSpeed')} name="mach-mode" />
            Mach → Speed
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="radio" checked={mode === 'speedToMach'} onChange={() => setMode('speedToMach')} name="mach-mode" />
            Speed → Mach
          </label>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">
              {mode === 'machToSpeed' ? 'Mach Number' : 'Speed'}
            </label>
            <input id={`${toolId}-value`} type="text" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} placeholder={mode === 'machToSpeed' ? 'e.g. 1.5' : 'e.g. 900'} aria-label={`Value input for ${toolName}`} className="input-field" />
          </div>
          {mode === 'speedToMach' && (
            <div>
              <label htmlFor={`${toolId}-unit`} className="block text-sm font-medium text-gray-700 mb-1">Speed Unit</label>
              <select id={`${toolId}-unit`} value={speedUnit} onChange={(e) => setSpeedUnit(e.target.value as typeof speedUnit)} className="input-field text-sm" aria-label="Speed unit">
                <option value="kmh">km/h</option>
                <option value="mph">mph</option>
                <option value="ms">m/s</option>
                <option value="knots">knots</option>
              </select>
            </div>
          )}
          <div>
            <label htmlFor={`${toolId}-alt`} className="block text-sm font-medium text-gray-700 mb-1">Altitude / Temperature</label>
            <select id={`${toolId}-alt`} value={altitudeIndex} onChange={(e) => setAltitudeIndex(parseInt(e.target.value))} className="input-field text-sm" aria-label="Altitude selection">
              {ALTITUDES.map((alt, i) => (
                <option key={i} value={i}>{alt.label}</option>
              ))}
            </select>
          </div>
          {isNaN(ALTITUDES[altitudeIndex].tempC) && (
            <div>
              <label htmlFor={`${toolId}-temp`} className="block text-sm font-medium text-gray-700 mb-1">Temperature (°C)</label>
              <input id={`${toolId}-temp`} type="text" inputMode="decimal" value={customTemp} onChange={(e) => setCustomTemp(e.target.value)} className="input-field text-sm" aria-label="Custom temperature" />
            </div>
          )}
        </div>
      </InputArea>

      <button onClick={handleCalculate} aria-label="Calculate Mach conversion" className="btn-primary">
        Calculate
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-blue-600">Mach {result.mach.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">Mach Number</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-800">{result.kmh.toFixed(2)}</div>
                <div className="text-xs text-gray-500 mt-1">km/h</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-800">{result.mph.toFixed(2)}</div>
                <div className="text-xs text-gray-500 mt-1">mph</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-800">{result.ms.toFixed(2)}</div>
                <div className="text-xs text-gray-500 mt-1">m/s</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-800">{result.knots.toFixed(2)}</div>
                <div className="text-xs text-gray-500 mt-1">knots</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-800">{result.speedOfSound.toFixed(2)}</div>
                <div className="text-xs text-gray-500 mt-1">Speed of Sound (m/s)</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
