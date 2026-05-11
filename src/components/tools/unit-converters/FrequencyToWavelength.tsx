'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * FrequencyToWavelength - Convert between frequency and wavelength for electromagnetic waves.
 * Uses the formula: wavelength = speed of light / frequency (c = λf).
 */
export default function FrequencyToWavelength({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [mode, setMode] = useState<'freq-to-wave' | 'wave-to-freq'>('freq-to-wave');
  const [freqUnit, setFreqUnit] = useState('GHz');
  const [waveUnit, setWaveUnit] = useState('m');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ value: number; unit: string; formula: string } | null>(null);

  const SPEED_OF_LIGHT = 299792458; // m/s

  const freqMultipliers: Record<string, number> = {
    Hz: 1,
    kHz: 1e3,
    MHz: 1e6,
    GHz: 1e9,
    THz: 1e12,
  };

  const waveMultipliers: Record<string, number> = {
    m: 1,
    cm: 1e-2,
    mm: 1e-3,
    µm: 1e-6,
    nm: 1e-9,
  };

  const convert = () => {
    const num = parseFloat(value);
    if (!value.trim() || isNaN(num) || num <= 0) {
      setError('Please enter a valid positive number.');
      setResult(null);
      return;
    }

    setError('');

    if (mode === 'freq-to-wave') {
      const freqHz = num * freqMultipliers[freqUnit];
      const wavelengthM = SPEED_OF_LIGHT / freqHz;
      const wavelength = wavelengthM / waveMultipliers[waveUnit];
      setResult({
        value: wavelength,
        unit: waveUnit,
        formula: `λ = c / f = ${SPEED_OF_LIGHT.toExponential(4)} / ${freqHz.toExponential(4)} = ${wavelengthM.toExponential(4)} m`,
      });
    } else {
      const wavelengthM = num * waveMultipliers[waveUnit];
      const freqHz = SPEED_OF_LIGHT / wavelengthM;
      const freq = freqHz / freqMultipliers[freqUnit];
      setResult({
        value: freq,
        unit: freqUnit,
        formula: `f = c / λ = ${SPEED_OF_LIGHT.toExponential(4)} / ${wavelengthM.toExponential(4)} = ${freqHz.toExponential(4)} Hz`,
      });
    }
  };

  const copyText = result
    ? `${mode === 'freq-to-wave' ? 'Frequency' : 'Wavelength'}: ${value} ${mode === 'freq-to-wave' ? freqUnit : waveUnit}\n${mode === 'freq-to-wave' ? 'Wavelength' : 'Frequency'}: ${result.value.toPrecision(6)} ${result.unit}\n${result.formula}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-1">Conversion Mode</label>
        <div className="flex gap-2">
          <button
            onClick={() => setMode('freq-to-wave')}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border ${mode === 'freq-to-wave' ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-gray-300 text-gray-600'}`}
            aria-label="Frequency to wavelength mode"
          >
            Frequency → Wavelength
          </button>
          <button
            onClick={() => setMode('wave-to-freq')}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border ${mode === 'wave-to-freq' ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-gray-300 text-gray-600'}`}
            aria-label="Wavelength to frequency mode"
          >
            Wavelength → Frequency
          </button>
        </div>
      </InputArea>

      <InputArea error={error}>
        <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">
          {mode === 'freq-to-wave' ? 'Frequency' : 'Wavelength'}
        </label>
        <div className="flex gap-2">
          <input
            id={`${toolId}-value`}
            type="text"
            inputMode="decimal"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (error) setError('');
            }}
            placeholder={mode === 'freq-to-wave' ? 'e.g. 2.4' : 'e.g. 500'}
            aria-label={`${mode === 'freq-to-wave' ? 'Frequency' : 'Wavelength'} value for ${toolName}`}
            className="input-field flex-1"
          />
          <select
            value={mode === 'freq-to-wave' ? freqUnit : waveUnit}
            onChange={(e) => mode === 'freq-to-wave' ? setFreqUnit(e.target.value) : setWaveUnit(e.target.value)}
            className="input-field w-24"
            aria-label="Input unit"
          >
            {mode === 'freq-to-wave'
              ? Object.keys(freqMultipliers).map((u) => <option key={u} value={u}>{u}</option>)
              : Object.keys(waveMultipliers).map((u) => <option key={u} value={u}>{u}</option>)
            }
          </select>
        </div>
      </InputArea>

      <InputArea>
        <label htmlFor={`${toolId}-output-unit`} className="block text-sm font-medium text-gray-700 mb-1">
          Output Unit
        </label>
        <select
          id={`${toolId}-output-unit`}
          value={mode === 'freq-to-wave' ? waveUnit : freqUnit}
          onChange={(e) => mode === 'freq-to-wave' ? setWaveUnit(e.target.value) : setFreqUnit(e.target.value)}
          className="input-field"
          aria-label="Output unit"
        >
          {mode === 'freq-to-wave'
            ? Object.keys(waveMultipliers).map((u) => <option key={u} value={u}>{u}</option>)
            : Object.keys(freqMultipliers).map((u) => <option key={u} value={u}>{u}</option>)
          }
        </select>
      </InputArea>

      <button onClick={convert} aria-label="Convert" className="btn-primary">
        Convert
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-blue-600">{result.value.toPrecision(6)} {result.unit}</div>
              <div className="text-xs text-gray-500 mt-1">{mode === 'freq-to-wave' ? 'Wavelength' : 'Frequency'}</div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
              {result.formula}
            </div>
            <div className="text-xs text-gray-500">
              Speed of light (c) = 299,792,458 m/s
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
