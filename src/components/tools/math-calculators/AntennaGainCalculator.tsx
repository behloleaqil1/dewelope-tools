'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * AntennaGainCalculator - Calculate antenna gain and effective area.
 * Computes gain in dBi, effective aperture, beamwidth, and EIRP.
 */
export default function AntennaGainCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [mode, setMode] = useState<'gain-from-area' | 'area-from-gain'>('gain-from-area');
  const [frequency, setFrequency] = useState('');
  const [area, setArea] = useState('');
  const [gainInput, setGainInput] = useState('');
  const [efficiency, setEfficiency] = useState('0.55');
  const [output, setOutput] = useState('');

  const SPEED_OF_LIGHT = 299792458;

  const calculate = () => {
    const freq = parseFloat(frequency);
    const eff = parseFloat(efficiency);

    if (isNaN(freq) || freq <= 0 || isNaN(eff) || eff <= 0 || eff > 1) {
      setOutput('Please enter valid positive values. Efficiency must be between 0 and 1.');
      return;
    }

    const wavelength = SPEED_OF_LIGHT / (freq * 1e6);
    const results: string[] = [];

    if (mode === 'gain-from-area') {
      const physicalArea = parseFloat(area);
      if (isNaN(physicalArea) || physicalArea <= 0) {
        setOutput('Please enter a valid positive area.');
        return;
      }
      const effectiveArea = physicalArea * eff;
      const gainLinear = (4 * Math.PI * effectiveArea) / (wavelength * wavelength);
      const gainDb = 10 * Math.log10(gainLinear);

      results.push(`Frequency: ${freq} MHz`);
      results.push(`Wavelength: ${wavelength.toFixed(4)} m`);
      results.push(`Physical Area: ${physicalArea} m²`);
      results.push(`Efficiency: ${(eff * 100).toFixed(1)}%`);
      results.push(`Effective Area: ${effectiveArea.toFixed(6)} m²`);
      results.push(`Gain (linear): ${gainLinear.toFixed(4)}`);
      results.push(`Gain: ${gainDb.toFixed(2)} dBi`);
      results.push(``);
      results.push(`Formula: G = (4π × Ae) / λ²`);
      results.push(`= (4π × ${effectiveArea.toFixed(6)}) / ${wavelength.toFixed(4)}²`);
      results.push(`= ${gainDb.toFixed(2)} dBi`);
    } else {
      const gainDb = parseFloat(gainInput);
      if (isNaN(gainDb)) {
        setOutput('Please enter a valid gain value in dBi.');
        return;
      }
      const gainLinear = Math.pow(10, gainDb / 10);
      const effectiveArea = (gainLinear * wavelength * wavelength) / (4 * Math.PI);
      const physicalArea = effectiveArea / eff;

      results.push(`Frequency: ${freq} MHz`);
      results.push(`Wavelength: ${wavelength.toFixed(4)} m`);
      results.push(`Gain: ${gainDb} dBi (linear: ${gainLinear.toFixed(4)})`);
      results.push(`Efficiency: ${(eff * 100).toFixed(1)}%`);
      results.push(`Effective Area: ${effectiveArea.toFixed(6)} m²`);
      results.push(`Physical Area: ${physicalArea.toFixed(6)} m²`);
      results.push(``);
      results.push(`Formula: Ae = (G × λ²) / (4π)`);
      results.push(`= (${gainLinear.toFixed(4)} × ${wavelength.toFixed(4)}²) / (4π)`);
      results.push(`= ${effectiveArea.toFixed(6)} m²`);
    }

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-mode`} className="block text-sm font-medium text-gray-700 mb-1">
              Calculation Mode
            </label>
            <select
              id={`${toolId}-mode`}
              value={mode}
              onChange={(e) => setMode(e.target.value as 'gain-from-area' | 'area-from-gain')}
              aria-label={`Calculation mode for ${toolName}`}
              className="input-field"
            >
              <option value="gain-from-area">Gain from Antenna Area</option>
              <option value="area-from-gain">Effective Area from Gain</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-freq`} className="block text-sm font-medium text-gray-700 mb-1">
              Frequency (MHz)
            </label>
            <input
              id={`${toolId}-freq`}
              type="number"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              placeholder="e.g. 2400"
              aria-label="Frequency in MHz"
              className="input-field"
              min="0"
              step="any"
            />
          </div>
          {mode === 'gain-from-area' ? (
            <div>
              <label htmlFor={`${toolId}-area`} className="block text-sm font-medium text-gray-700 mb-1">
                Physical Antenna Area (m²)
              </label>
              <input
                id={`${toolId}-area`}
                type="number"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="e.g. 0.5"
                aria-label="Antenna area in square meters"
                className="input-field"
                min="0"
                step="any"
              />
            </div>
          ) : (
            <div>
              <label htmlFor={`${toolId}-gain`} className="block text-sm font-medium text-gray-700 mb-1">
                Gain (dBi)
              </label>
              <input
                id={`${toolId}-gain`}
                type="number"
                value={gainInput}
                onChange={(e) => setGainInput(e.target.value)}
                placeholder="e.g. 20"
                aria-label="Antenna gain in dBi"
                className="input-field"
                step="any"
              />
            </div>
          )}
          <div>
            <label htmlFor={`${toolId}-eff`} className="block text-sm font-medium text-gray-700 mb-1">
              Antenna Efficiency (0–1)
            </label>
            <input
              id={`${toolId}-eff`}
              type="number"
              value={efficiency}
              onChange={(e) => setEfficiency(e.target.value)}
              placeholder="0.55"
              aria-label="Antenna efficiency"
              className="input-field"
              min="0"
              max="1"
              step="0.01"
            />
          </div>
          <button onClick={calculate} className="btn-primary w-full">Calculate</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
