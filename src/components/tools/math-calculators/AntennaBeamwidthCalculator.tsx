'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * AntennaBeamwidthCalculator - Calculate antenna 3dB beamwidth.
 * Uses the standard approximation: beamwidth ≈ k * λ / D (in degrees),
 * where k is a constant (~70 for typical antennas), λ is wavelength, D is aperture diameter.
 */
export default function AntennaBeamwidthCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [frequency, setFrequency] = useState('');
  const [diameter, setDiameter] = useState('');
  const [freqUnit, setFreqUnit] = useState<'MHz' | 'GHz'>('GHz');
  const [diamUnit, setDiamUnit] = useState<'m' | 'cm' | 'ft'>('m');
  const [kFactor, setKFactor] = useState('70');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const freq = parseFloat(frequency);
    const diam = parseFloat(diameter);
    const k = parseFloat(kFactor);

    if (isNaN(freq) || isNaN(diam) || isNaN(k) || freq <= 0 || diam <= 0 || k <= 0) {
      setOutput('Please enter valid positive values for all fields.');
      return;
    }

    // Convert frequency to Hz
    const freqHz = freqUnit === 'GHz' ? freq * 1e9 : freq * 1e6;

    // Convert diameter to meters
    let diamM = diam;
    if (diamUnit === 'cm') diamM = diam / 100;
    else if (diamUnit === 'ft') diamM = diam * 0.3048;

    // Wavelength in meters: c / f
    const c = 299792458;
    const wavelength = c / freqHz;

    // Beamwidth in degrees: k * λ / D
    const beamwidthDeg = (k * wavelength) / diamM;
    const beamwidthRad = (beamwidthDeg * Math.PI) / 180;

    const result = [
      `=== Antenna 3dB Beamwidth ===`,
      ``,
      `Frequency: ${freq} ${freqUnit}`,
      `Aperture Diameter: ${diam} ${diamUnit} (${diamM.toFixed(4)} m)`,
      `Wavelength (λ): ${(wavelength * 1000).toFixed(4)} mm (${wavelength.toFixed(6)} m)`,
      `k-factor: ${k}`,
      ``,
      `3dB Beamwidth: ${beamwidthDeg.toFixed(4)}°`,
      `Beamwidth (radians): ${beamwidthRad.toFixed(6)} rad`,
      ``,
      `Formula: θ = k × λ / D`,
      `       = ${k} × ${wavelength.toFixed(6)} / ${diamM.toFixed(4)}`,
      `       = ${beamwidthDeg.toFixed(4)}°`,
    ].join('\n');

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-freq`} className="block text-sm font-medium text-gray-700 mb-1">
              Frequency
            </label>
            <div className="flex gap-2">
              <input
                id={`${toolId}-freq`}
                type="number"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                placeholder="e.g. 10"
                className="input-field flex-1"
                aria-label={`Frequency input for ${toolName}`}
              />
              <select value={freqUnit} onChange={(e) => setFreqUnit(e.target.value as 'MHz' | 'GHz')} className="input-field w-24" aria-label="Frequency unit">
                <option value="GHz">GHz</option>
                <option value="MHz">MHz</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-diam`} className="block text-sm font-medium text-gray-700 mb-1">
              Aperture Diameter
            </label>
            <div className="flex gap-2">
              <input
                id={`${toolId}-diam`}
                type="number"
                value={diameter}
                onChange={(e) => setDiameter(e.target.value)}
                placeholder="e.g. 1.2"
                className="input-field flex-1"
                aria-label="Aperture diameter"
              />
              <select value={diamUnit} onChange={(e) => setDiamUnit(e.target.value as 'm' | 'cm' | 'ft')} className="input-field w-24" aria-label="Diameter unit">
                <option value="m">m</option>
                <option value="cm">cm</option>
                <option value="ft">ft</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-k`} className="block text-sm font-medium text-gray-700 mb-1">
              k-factor (typically 65-75)
            </label>
            <input
              id={`${toolId}-k`}
              type="number"
              value={kFactor}
              onChange={(e) => setKFactor(e.target.value)}
              className="input-field"
              aria-label="k-factor"
            />
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-4">
          Calculate Beamwidth
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
