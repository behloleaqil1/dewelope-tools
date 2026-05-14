'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const SPEED_OF_LIGHT = 299792458; // m/s

/**
 * WavelengthFrequencyCalculator - Converts between wavelength and frequency using c = λf.
 */
export default function WavelengthFrequencyCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [mode, setMode] = useState<'toFreq' | 'toWavelength'>('toFreq');
  const [value, setValue] = useState('');
  const [unit, setUnit] = useState('nm');
  const [error, setError] = useState<string | undefined>();
  const [result, setResult] = useState<{ wavelength: number; frequency: number; energy: number; wUnit: string; fUnit: string; spectrum: string } | null>(null);

  const calculate = () => {
    setError(undefined);
    setResult(null);
    const v = parseFloat(value);
    if (isNaN(v) || v <= 0) { setError('Enter a positive value'); return; }

    let wavelengthM: number;
    let frequency: number;

    if (mode === 'toFreq') {
      const unitFactors: Record<string, number> = { nm: 1e-9, um: 1e-6, mm: 1e-3, m: 1, cm: 1e-2 };
      wavelengthM = v * (unitFactors[unit] || 1e-9);
      frequency = SPEED_OF_LIGHT / wavelengthM;
    } else {
      const freqFactors: Record<string, number> = { Hz: 1, kHz: 1e3, MHz: 1e6, GHz: 1e9, THz: 1e12 };
      frequency = v * (freqFactors[unit] || 1);
      wavelengthM = SPEED_OF_LIGHT / frequency;
    }

    // Planck's constant for energy
    const h = 6.626e-34;
    const energy = h * frequency; // in Joules
    const energyEv = energy / 1.602e-19;

    // Determine spectrum region
    let spectrum: string;
    if (wavelengthM < 1e-11) spectrum = 'Gamma rays';
    else if (wavelengthM < 1e-8) spectrum = 'X-rays';
    else if (wavelengthM < 380e-9) spectrum = 'Ultraviolet';
    else if (wavelengthM < 700e-9) spectrum = 'Visible light';
    else if (wavelengthM < 1e-3) spectrum = 'Infrared';
    else if (wavelengthM < 1) spectrum = 'Microwave';
    else spectrum = 'Radio waves';

    // Format output
    let wUnit: string;
    let wValue: number;
    if (wavelengthM < 1e-6) { wValue = wavelengthM * 1e9; wUnit = 'nm'; }
    else if (wavelengthM < 1e-3) { wValue = wavelengthM * 1e6; wUnit = 'μm'; }
    else if (wavelengthM < 1) { wValue = wavelengthM * 100; wUnit = 'cm'; }
    else { wValue = wavelengthM; wUnit = 'm'; }

    let fUnit: string;
    let fValue: number;
    if (frequency >= 1e12) { fValue = frequency / 1e12; fUnit = 'THz'; }
    else if (frequency >= 1e9) { fValue = frequency / 1e9; fUnit = 'GHz'; }
    else if (frequency >= 1e6) { fValue = frequency / 1e6; fUnit = 'MHz'; }
    else if (frequency >= 1e3) { fValue = frequency / 1e3; fUnit = 'kHz'; }
    else { fValue = frequency; fUnit = 'Hz'; }

    setResult({ wavelength: wValue, frequency: fValue, energy: energyEv, wUnit, fUnit, spectrum });
  };

  const copyText = result ? `Wavelength: ${result.wavelength.toFixed(4)} ${result.wUnit}\nFrequency: ${result.frequency.toFixed(4)} ${result.fUnit}\nEnergy: ${result.energy.toExponential(4)} eV\nSpectrum: ${result.spectrum}\n\nFormula: c = λf (c = ${SPEED_OF_LIGHT.toLocaleString()} m/s)` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-mode`} className="block text-sm font-medium text-gray-700 mb-1">Convert</label>
            <select id={`${toolId}-mode`} value={mode} onChange={(e) => { setMode(e.target.value as typeof mode); setUnit(e.target.value === 'toFreq' ? 'nm' : 'GHz'); }} aria-label={`Conversion mode for ${toolName}`} className="input-field">
              <option value="toFreq">Wavelength → Frequency</option>
              <option value="toWavelength">Frequency → Wavelength</option>
            </select>
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">{mode === 'toFreq' ? 'Wavelength' : 'Frequency'}</label>
              <input id={`${toolId}-value`} type="number" value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && calculate()} placeholder="Enter value" aria-label={mode === 'toFreq' ? 'Wavelength value' : 'Frequency value'} className="input-field" />
            </div>
            <div className="w-24">
              <label htmlFor={`${toolId}-unit`} className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <select id={`${toolId}-unit`} value={unit} onChange={(e) => setUnit(e.target.value)} aria-label="Unit selection" className="input-field">
                {mode === 'toFreq' ? (
                  <>{['nm', 'um', 'mm', 'cm', 'm'].map(u => <option key={u} value={u}>{u}</option>)}</>
                ) : (
                  <>{['Hz', 'kHz', 'MHz', 'GHz', 'THz'].map(u => <option key={u} value={u}>{u}</option>)}</>
                )}
              </select>
            </div>
          </div>
        </div>
      </InputArea>
      <button onClick={calculate} aria-label="Calculate wavelength or frequency" className="btn-primary">Calculate</button>
      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200 text-center">
              <div className="text-xs text-gray-500 mb-1">c = λ × f</div>
              <div className="text-sm text-indigo-700 font-medium">{result.spectrum}</div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-800">{result.wavelength.toFixed(4)}</div>
                <div className="text-xs text-gray-500">λ ({result.wUnit})</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-800">{result.frequency.toFixed(4)}</div>
                <div className="text-xs text-gray-500">f ({result.fUnit})</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-800">{result.energy.toExponential(2)}</div>
                <div className="text-xs text-gray-500">E (eV)</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
