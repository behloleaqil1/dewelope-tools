'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PressureAltitudeConverter - Convert between pressure altitude and atmospheric pressure.
 * Uses the International Standard Atmosphere (ISA) model for conversions.
 */
export default function PressureAltitudeConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [mode, setMode] = useState<'altToPressure' | 'pressureToAlt'>('altToPressure');
  const [altitude, setAltitude] = useState('');
  const [altUnit, setAltUnit] = useState<'feet' | 'meters'>('feet');
  const [pressure, setPressure] = useState('');
  const [pressureUnit, setPressureUnit] = useState<'hPa' | 'inHg' | 'psi' | 'atm'>('hPa');
  const [result, setResult] = useState<{ value: number; unit: string; details: string } | null>(null);
  const [error, setError] = useState('');

  // ISA constants
  const P0 = 101325; // Pa at sea level
  const T0 = 288.15; // K at sea level
  const L = 0.0065; // K/m lapse rate
  const g = 9.80665; // m/s²
  const M = 0.0289644; // kg/mol
  const R = 8.31447; // J/(mol·K)

  const altitudeToMeters = (val: number, unit: string): number => {
    return unit === 'feet' ? val * 0.3048 : val;
  };

  const metersToAltUnit = (meters: number, unit: string): number => {
    return unit === 'feet' ? meters / 0.3048 : meters;
  };

  const pressureToPa = (val: number, unit: string): number => {
    switch (unit) {
      case 'hPa': return val * 100;
      case 'inHg': return val * 3386.389;
      case 'psi': return val * 6894.757;
      case 'atm': return val * 101325;
      default: return val;
    }
  };

  const paToUnit = (pa: number, unit: string): number => {
    switch (unit) {
      case 'hPa': return pa / 100;
      case 'inHg': return pa / 3386.389;
      case 'psi': return pa / 6894.757;
      case 'atm': return pa / 101325;
      default: return pa;
    }
  };

  const calculate = () => {
    setError('');
    setResult(null);

    if (mode === 'altToPressure') {
      const altVal = parseFloat(altitude);
      if (isNaN(altVal)) { setError('Please enter a valid altitude'); return; }
      const h = altitudeToMeters(altVal, altUnit);
      if (h > 11000) { setError('This calculator supports altitudes up to 11,000m (36,089 ft) in the troposphere'); return; }

      // Barometric formula for troposphere
      const pressurePa = P0 * Math.pow((T0 - L * h) / T0, (g * M) / (R * L));
      const converted = paToUnit(pressurePa, pressureUnit);

      setResult({
        value: converted,
        unit: pressureUnit,
        details: `Altitude: ${altVal} ${altUnit} → Pressure: ${converted.toFixed(4)} ${pressureUnit}`,
      });
    } else {
      const presVal = parseFloat(pressure);
      if (isNaN(presVal) || presVal <= 0) { setError('Please enter a valid pressure'); return; }
      const pressurePa = pressureToPa(presVal, pressureUnit);

      // Inverse barometric formula
      const h = (T0 / L) * (1 - Math.pow(pressurePa / P0, (R * L) / (g * M)));
      const converted = metersToAltUnit(h, altUnit);

      setResult({
        value: converted,
        unit: altUnit,
        details: `Pressure: ${presVal} ${pressureUnit} → Altitude: ${converted.toFixed(2)} ${altUnit}`,
      });
    }
  };

  const copyText = result ? result.details : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="space-y-4">
          <div>
            <label htmlFor={`${toolId}-mode`} className="block text-sm font-medium text-gray-700 mb-1">
              Conversion Mode
            </label>
            <select
              id={`${toolId}-mode`}
              value={mode}
              onChange={(e) => { setMode(e.target.value as typeof mode); setResult(null); setError(''); }}
              aria-label={`Conversion mode for ${toolName}`}
              className="input-field"
            >
              <option value="altToPressure">Altitude → Pressure</option>
              <option value="pressureToAlt">Pressure → Altitude</option>
            </select>
          </div>

          {mode === 'altToPressure' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor={`${toolId}-alt`} className="block text-sm font-medium text-gray-700 mb-1">Altitude</label>
                <input id={`${toolId}-alt`} type="text" inputMode="decimal" value={altitude} onChange={(e) => setAltitude(e.target.value)} placeholder="e.g. 5000" aria-label="Altitude value" className="input-field" />
              </div>
              <div>
                <label htmlFor={`${toolId}-alt-unit`} className="block text-sm font-medium text-gray-700 mb-1">Altitude Unit</label>
                <select id={`${toolId}-alt-unit`} value={altUnit} onChange={(e) => setAltUnit(e.target.value as typeof altUnit)} aria-label="Altitude unit" className="input-field">
                  <option value="feet">Feet</option>
                  <option value="meters">Meters</option>
                </select>
              </div>
              <div>
                <label htmlFor={`${toolId}-pres-unit-out`} className="block text-sm font-medium text-gray-700 mb-1">Output Pressure Unit</label>
                <select id={`${toolId}-pres-unit-out`} value={pressureUnit} onChange={(e) => setPressureUnit(e.target.value as typeof pressureUnit)} aria-label="Pressure unit" className="input-field">
                  <option value="hPa">hPa (mbar)</option>
                  <option value="inHg">inHg</option>
                  <option value="psi">PSI</option>
                  <option value="atm">atm</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor={`${toolId}-pres`} className="block text-sm font-medium text-gray-700 mb-1">Pressure</label>
                <input id={`${toolId}-pres`} type="text" inputMode="decimal" value={pressure} onChange={(e) => setPressure(e.target.value)} placeholder="e.g. 1013.25" aria-label="Pressure value" className="input-field" />
              </div>
              <div>
                <label htmlFor={`${toolId}-pres-unit`} className="block text-sm font-medium text-gray-700 mb-1">Pressure Unit</label>
                <select id={`${toolId}-pres-unit`} value={pressureUnit} onChange={(e) => setPressureUnit(e.target.value as typeof pressureUnit)} aria-label="Pressure unit" className="input-field">
                  <option value="hPa">hPa (mbar)</option>
                  <option value="inHg">inHg</option>
                  <option value="psi">PSI</option>
                  <option value="atm">atm</option>
                </select>
              </div>
              <div>
                <label htmlFor={`${toolId}-alt-unit-out`} className="block text-sm font-medium text-gray-700 mb-1">Output Altitude Unit</label>
                <select id={`${toolId}-alt-unit-out`} value={altUnit} onChange={(e) => setAltUnit(e.target.value as typeof altUnit)} aria-label="Altitude unit" className="input-field">
                  <option value="feet">Feet</option>
                  <option value="meters">Meters</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </InputArea>

      <button onClick={calculate} aria-label="Convert" className="btn-primary">
        Convert
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-3xl font-bold text-blue-600">{result.value.toFixed(4)}</div>
              <div className="text-sm text-gray-500 mt-1">{result.unit}</div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <p className="font-medium mb-1">Based on International Standard Atmosphere (ISA):</p>
              <ul className="text-xs space-y-1 text-gray-500">
                <li>• Sea level pressure: 1013.25 hPa (29.92 inHg)</li>
                <li>• Sea level temperature: 15°C (288.15 K)</li>
                <li>• Lapse rate: 6.5°C per 1000m</li>
                <li>• Valid for troposphere (0–11,000m)</li>
              </ul>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
