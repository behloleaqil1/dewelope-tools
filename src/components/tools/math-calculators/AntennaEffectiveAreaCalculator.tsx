'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * AntennaEffectiveAreaCalculator - Calculate antenna effective aperture.
 * Uses Ae = (G × λ²) / (4π) where G is gain and λ is wavelength.
 */
export default function AntennaEffectiveAreaCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [frequency, setFrequency] = useState('');
  const [freqUnit, setFreqUnit] = useState<'MHz' | 'GHz'>('GHz');
  const [gainDb, setGainDb] = useState('');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const freq = parseFloat(frequency);
    const gain = parseFloat(gainDb);

    if (isNaN(freq) || freq <= 0 || isNaN(gain)) {
      setOutput('Please enter valid frequency and gain values.');
      return;
    }

    const freqHz = freqUnit === 'GHz' ? freq * 1e9 : freq * 1e6;
    const c = 299792458; // speed of light m/s
    const wavelength = c / freqHz;
    const gainLinear = Math.pow(10, gain / 10);
    const effectiveArea = (gainLinear * wavelength * wavelength) / (4 * Math.PI);

    const results = [
      `═══ Antenna Effective Area ═══`,
      ``,
      `Input Parameters:`,
      `  Frequency: ${freq} ${freqUnit} (${freqHz.toExponential(3)} Hz)`,
      `  Gain: ${gain} dBi (linear: ${gainLinear.toFixed(4)})`,
      ``,
      `Calculated Values:`,
      `  Wavelength (λ): ${wavelength.toFixed(6)} m (${(wavelength * 100).toFixed(4)} cm)`,
      `  Effective Area (Ae): ${effectiveArea.toFixed(6)} m²`,
      `  Effective Area: ${(effectiveArea * 1e4).toFixed(4)} cm²`,
      ``,
      `Formula:`,
      `  Ae = (G × λ²) / (4π)`,
      `  Ae = (${gainLinear.toFixed(4)} × ${wavelength.toFixed(6)}²) / (4π)`,
      `  Ae = ${effectiveArea.toFixed(6)} m²`,
      ``,
      `Physical Aperture (assuming 55% efficiency):`,
      `  Ap = Ae / η = ${(effectiveArea / 0.55).toFixed(6)} m²`,
      `  Diameter ≈ ${(2 * Math.sqrt((effectiveArea / 0.55) / Math.PI)).toFixed(4)} m`,
    ];

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-freq`} className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
              <input id={`${toolId}-freq`} type="number" value={frequency} onChange={(e) => setFrequency(e.target.value)} placeholder="e.g. 2.4" className="input-field" aria-label={`Frequency input for ${toolName}`} />
            </div>
            <div>
              <label htmlFor={`${toolId}-unit`} className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <select id={`${toolId}-unit`} value={freqUnit} onChange={(e) => setFreqUnit(e.target.value as 'MHz' | 'GHz')} className="input-field" aria-label="Frequency unit">
                <option value="GHz">GHz</option>
                <option value="MHz">MHz</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-gain`} className="block text-sm font-medium text-gray-700 mb-1">Antenna Gain (dBi)</label>
            <input id={`${toolId}-gain`} type="number" value={gainDb} onChange={(e) => setGainDb(e.target.value)} placeholder="e.g. 20" className="input-field" aria-label="Antenna gain in dBi" />
          </div>
          <button onClick={calculate} className="btn-primary">Calculate Effective Area</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
