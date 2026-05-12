'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * FreeSpacePathLoss - Calculate free-space path loss (FSPL) for RF signals.
 */
export default function FreeSpacePathLoss({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [distance, setDistance] = useState('');
  const [distanceUnit, setDistanceUnit] = useState<'km' | 'm' | 'mi'>('km');
  const [frequency, setFrequency] = useState('');
  const [frequencyUnit, setFrequencyUnit] = useState<'MHz' | 'GHz'>('GHz');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const d = parseFloat(distance);
    const f = parseFloat(frequency);

    if (isNaN(d) || isNaN(f) || d <= 0 || f <= 0) {
      setOutput('Please enter valid positive values for distance and frequency.');
      return;
    }

    // Convert distance to km
    let dKm = d;
    if (distanceUnit === 'm') dKm = d / 1000;
    if (distanceUnit === 'mi') dKm = d * 1.60934;

    // Convert frequency to MHz
    let fMHz = f;
    if (frequencyUnit === 'GHz') fMHz = f * 1000;

    // FSPL (dB) = 20*log10(d) + 20*log10(f) + 32.44
    // where d in km, f in MHz
    const fspl = 20 * Math.log10(dKm) + 20 * Math.log10(fMHz) + 32.44;

    const wavelengthM = 299.792458 / fMHz; // c=299792458 m/s, f in MHz = f*1e6 Hz => lambda = 299.792458/fMHz meters

    let result = `Free-Space Path Loss (FSPL)\n`;
    result += `══════════════════════════════\n\n`;
    result += `Distance: ${d} ${distanceUnit} (${dKm.toFixed(4)} km)\n`;
    result += `Frequency: ${f} ${frequencyUnit} (${fMHz.toFixed(2)} MHz)\n`;
    result += `Wavelength: ${wavelengthM.toFixed(4)} m\n\n`;
    result += `FSPL = ${fspl.toFixed(2)} dB\n\n`;
    result += `Formula: FSPL(dB) = 20·log₁₀(d) + 20·log₁₀(f) + 32.44\n`;
    result += `  where d = distance in km, f = frequency in MHz\n\n`;
    result += `Breakdown:\n`;
    result += `  20·log₁₀(${dKm.toFixed(4)}) = ${(20 * Math.log10(dKm)).toFixed(2)} dB\n`;
    result += `  20·log₁₀(${fMHz.toFixed(2)}) = ${(20 * Math.log10(fMHz)).toFixed(2)} dB\n`;
    result += `  Constant = 32.44 dB\n`;

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-distance`} className="block text-sm font-medium text-gray-700 mb-1">
                Distance
              </label>
              <input
                id={`${toolId}-distance`}
                type="number"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                placeholder="e.g. 10"
                aria-label={`Distance for ${toolName}`}
                className="input-field"
                min="0"
                step="any"
              />
            </div>
            <div>
              <label htmlFor={`${toolId}-dunit`} className="block text-sm font-medium text-gray-700 mb-1">
                Distance Unit
              </label>
              <select
                id={`${toolId}-dunit`}
                value={distanceUnit}
                onChange={(e) => setDistanceUnit(e.target.value as 'km' | 'm' | 'mi')}
                aria-label="Distance unit"
                className="input-field"
              >
                <option value="km">Kilometers</option>
                <option value="m">Meters</option>
                <option value="mi">Miles</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-freq`} className="block text-sm font-medium text-gray-700 mb-1">
                Frequency
              </label>
              <input
                id={`${toolId}-freq`}
                type="number"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                placeholder="e.g. 2.4"
                aria-label="Frequency"
                className="input-field"
                min="0"
                step="any"
              />
            </div>
            <div>
              <label htmlFor={`${toolId}-funit`} className="block text-sm font-medium text-gray-700 mb-1">
                Frequency Unit
              </label>
              <select
                id={`${toolId}-funit`}
                value={frequencyUnit}
                onChange={(e) => setFrequencyUnit(e.target.value as 'MHz' | 'GHz')}
                aria-label="Frequency unit"
                className="input-field"
              >
                <option value="GHz">GHz</option>
                <option value="MHz">MHz</option>
              </select>
            </div>
          </div>
          <button onClick={calculate} className="btn-primary w-full">
            Calculate FSPL
          </button>
        </div>
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
