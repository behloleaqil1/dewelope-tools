'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * WavelengthFrequencyConverter - Convert between wavelength and frequency for any medium.
 * Uses the relationship: c = f × λ (or v = f × λ for other media).
 */
export default function WavelengthFrequencyConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [mode, setMode] = useState<'freqToWave' | 'waveToFreq'>('freqToWave');
  const [value, setValue] = useState('');
  const [freqUnit, setFreqUnit] = useState('MHz');
  const [waveUnit, setWaveUnit] = useState('m');
  const [medium, setMedium] = useState('vacuum');
  const [customSpeed, setCustomSpeed] = useState('');
  const [output, setOutput] = useState('');

  const speeds: Record<string, number> = {
    vacuum: 299792458,
    air: 299702547,
    water: 225000000,
    glass: 200000000,
    sound_air: 343,
    sound_water: 1480,
  };

  const freqMultipliers: Record<string, number> = {
    Hz: 1, kHz: 1e3, MHz: 1e6, GHz: 1e9, THz: 1e12,
  };

  const waveMultipliers: Record<string, number> = {
    m: 1, cm: 0.01, mm: 0.001, µm: 1e-6, nm: 1e-9, km: 1000,
  };

  const calculate = () => {
    const v = parseFloat(value);
    if (isNaN(v) || v <= 0) {
      setOutput('Please enter a valid positive number.');
      return;
    }

    let speed = speeds[medium] || 299792458;
    if (medium === 'custom') {
      speed = parseFloat(customSpeed);
      if (isNaN(speed) || speed <= 0) {
        setOutput('Please enter a valid custom speed.');
        return;
      }
    }

    let result: string;
    if (mode === 'freqToWave') {
      const freqHz = v * freqMultipliers[freqUnit];
      const wavelengthM = speed / freqHz;
      const wavelengthDisplay = wavelengthM / waveMultipliers[waveUnit];
      result = [
        `=== Frequency → Wavelength ===`,
        ``,
        `Input: ${v} ${freqUnit}`,
        `Medium: ${medium} (v = ${speed.toLocaleString()} m/s)`,
        ``,
        `Wavelength: ${wavelengthDisplay.toPrecision(8)} ${waveUnit}`,
        `Wavelength: ${wavelengthM.toExponential(6)} m`,
        ``,
        `--- All Units ---`,
        `${(wavelengthM * 1000).toPrecision(6)} mm`,
        `${(wavelengthM * 100).toPrecision(6)} cm`,
        `${wavelengthM.toPrecision(6)} m`,
        `${(wavelengthM / 1000).toPrecision(6)} km`,
        ``,
        `Formula: λ = v / f = ${speed.toLocaleString()} / ${freqHz.toExponential(4)} = ${wavelengthM.toExponential(6)} m`,
      ].join('\n');
    } else {
      const wavelengthM = v * waveMultipliers[waveUnit];
      const freqHz = speed / wavelengthM;
      const freqDisplay = freqHz / freqMultipliers[freqUnit];
      result = [
        `=== Wavelength → Frequency ===`,
        ``,
        `Input: ${v} ${waveUnit}`,
        `Medium: ${medium} (v = ${speed.toLocaleString()} m/s)`,
        ``,
        `Frequency: ${freqDisplay.toPrecision(8)} ${freqUnit}`,
        `Frequency: ${freqHz.toExponential(6)} Hz`,
        ``,
        `--- All Units ---`,
        `${(freqHz).toPrecision(6)} Hz`,
        `${(freqHz / 1e3).toPrecision(6)} kHz`,
        `${(freqHz / 1e6).toPrecision(6)} MHz`,
        `${(freqHz / 1e9).toPrecision(6)} GHz`,
        ``,
        `Formula: f = v / λ = ${speed.toLocaleString()} / ${wavelengthM.toExponential(4)} = ${freqHz.toExponential(6)} Hz`,
      ].join('\n');
    }

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="flex gap-4 mb-3">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <input type="radio" name={`${toolId}-mode`} checked={mode === 'freqToWave'} onChange={() => setMode('freqToWave')} />
            Frequency → Wavelength
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <input type="radio" name={`${toolId}-mode`} checked={mode === 'waveToFreq'} onChange={() => setMode('waveToFreq')} />
            Wavelength → Frequency
          </label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">
              {mode === 'freqToWave' ? 'Frequency' : 'Wavelength'}
            </label>
            <div className="flex gap-2">
              <input id={`${toolId}-value`} type="number" value={value} onChange={(e) => setValue(e.target.value)} className="input-field flex-1" aria-label={`${mode === 'freqToWave' ? 'Frequency' : 'Wavelength'} value for ${toolName}`} />
              {mode === 'freqToWave' ? (
                <select value={freqUnit} onChange={(e) => setFreqUnit(e.target.value)} className="input-field w-24" aria-label="Frequency unit">
                  <option value="Hz">Hz</option>
                  <option value="kHz">kHz</option>
                  <option value="MHz">MHz</option>
                  <option value="GHz">GHz</option>
                  <option value="THz">THz</option>
                </select>
              ) : (
                <select value={waveUnit} onChange={(e) => setWaveUnit(e.target.value)} className="input-field w-24" aria-label="Wavelength unit">
                  <option value="nm">nm</option>
                  <option value="µm">µm</option>
                  <option value="mm">mm</option>
                  <option value="cm">cm</option>
                  <option value="m">m</option>
                  <option value="km">km</option>
                </select>
              )}
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-medium`} className="block text-sm font-medium text-gray-700 mb-1">Medium</label>
            <select id={`${toolId}-medium`} value={medium} onChange={(e) => setMedium(e.target.value)} className="input-field" aria-label="Propagation medium">
              <option value="vacuum">Vacuum (c = 299,792,458 m/s)</option>
              <option value="air">Air (≈299,702,547 m/s)</option>
              <option value="water">Water (≈225,000,000 m/s)</option>
              <option value="glass">Glass (≈200,000,000 m/s)</option>
              <option value="sound_air">Sound in Air (343 m/s)</option>
              <option value="sound_water">Sound in Water (1,480 m/s)</option>
              <option value="custom">Custom Speed</option>
            </select>
          </div>
        </div>
        {medium === 'custom' && (
          <div className="mt-3">
            <label htmlFor={`${toolId}-custom-speed`} className="block text-sm font-medium text-gray-700 mb-1">Custom Speed (m/s)</label>
            <input id={`${toolId}-custom-speed`} type="number" value={customSpeed} onChange={(e) => setCustomSpeed(e.target.value)} className="input-field" aria-label="Custom propagation speed" />
          </div>
        )}
        {mode === 'freqToWave' && (
          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Output Wavelength Unit</label>
            <select value={waveUnit} onChange={(e) => setWaveUnit(e.target.value)} className="input-field w-32" aria-label="Output wavelength unit">
              <option value="nm">nm</option>
              <option value="µm">µm</option>
              <option value="mm">mm</option>
              <option value="cm">cm</option>
              <option value="m">m</option>
              <option value="km">km</option>
            </select>
          </div>
        )}
        {mode === 'waveToFreq' && (
          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Output Frequency Unit</label>
            <select value={freqUnit} onChange={(e) => setFreqUnit(e.target.value)} className="input-field w-32" aria-label="Output frequency unit">
              <option value="Hz">Hz</option>
              <option value="kHz">kHz</option>
              <option value="MHz">MHz</option>
              <option value="GHz">GHz</option>
              <option value="THz">THz</option>
            </select>
          </div>
        )}
        <button onClick={calculate} className="btn-primary mt-4">Convert</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Conversion Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
