'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * FresnelZoneCalculator - Calculate Fresnel zone radius for RF links.
 * Uses the formula: r_n = sqrt(n * λ * d1 * d2 / (d1 + d2))
 * where n is the Fresnel zone number, λ is wavelength, d1 and d2 are distances from each end.
 */
export default function FresnelZoneCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [frequency, setFrequency] = useState('');
  const [distance, setDistance] = useState('');
  const [freqUnit, setFreqUnit] = useState<'MHz' | 'GHz'>('GHz');
  const [distUnit, setDistUnit] = useState<'km' | 'mi' | 'm'>('km');
  const [obstaclePosition, setObstaclePosition] = useState('50');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const freq = parseFloat(frequency);
    const dist = parseFloat(distance);
    const obsPos = parseFloat(obstaclePosition);

    if (isNaN(freq) || isNaN(dist) || isNaN(obsPos) || freq <= 0 || dist <= 0 || obsPos <= 0 || obsPos >= 100) {
      setOutput('Please enter valid values. Obstacle position must be between 0 and 100%.');
      return;
    }

    // Convert frequency to Hz
    const freqHz = freqUnit === 'GHz' ? freq * 1e9 : freq * 1e6;

    // Convert distance to meters
    let distM = dist;
    if (distUnit === 'km') distM = dist * 1000;
    else if (distUnit === 'mi') distM = dist * 1609.344;

    // Wavelength
    const c = 299792458;
    const wavelength = c / freqHz;

    // d1 and d2 based on obstacle position
    const d1 = distM * (obsPos / 100);
    const d2 = distM * (1 - obsPos / 100);

    // Fresnel zone radii for zones 1-3
    const zones = [1, 2, 3].map((n) => {
      const radius = Math.sqrt((n * wavelength * d1 * d2) / (d1 + d2));
      return { zone: n, radius };
    });

    // 60% of first Fresnel zone (minimum clearance)
    const minClearance = zones[0].radius * 0.6;

    const result = [
      `=== Fresnel Zone Calculator ===`,
      ``,
      `Frequency: ${freq} ${freqUnit}`,
      `Link Distance: ${dist} ${distUnit} (${distM.toFixed(1)} m)`,
      `Obstacle Position: ${obsPos}% from transmitter`,
      `Wavelength: ${(wavelength * 1000).toFixed(4)} mm`,
      ``,
      `--- Fresnel Zone Radii ---`,
      ...zones.map((z) => `Zone ${z.zone}: ${z.radius.toFixed(3)} m (${(z.radius * 3.28084).toFixed(3)} ft)`),
      ``,
      `Minimum Clearance (60% of F1): ${minClearance.toFixed(3)} m (${(minClearance * 3.28084).toFixed(3)} ft)`,
      ``,
      `Formula: r_n = √(n × λ × d1 × d2 / (d1 + d2))`,
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
                placeholder="e.g. 5.8"
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
            <label htmlFor={`${toolId}-dist`} className="block text-sm font-medium text-gray-700 mb-1">
              Link Distance
            </label>
            <div className="flex gap-2">
              <input
                id={`${toolId}-dist`}
                type="number"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                placeholder="e.g. 10"
                className="input-field flex-1"
                aria-label="Link distance"
              />
              <select value={distUnit} onChange={(e) => setDistUnit(e.target.value as 'km' | 'mi' | 'm')} className="input-field w-24" aria-label="Distance unit">
                <option value="km">km</option>
                <option value="mi">mi</option>
                <option value="m">m</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-obs`} className="block text-sm font-medium text-gray-700 mb-1">
              Obstacle Position (% from transmitter)
            </label>
            <input
              id={`${toolId}-obs`}
              type="number"
              value={obstaclePosition}
              onChange={(e) => setObstaclePosition(e.target.value)}
              placeholder="50"
              min="1"
              max="99"
              className="input-field"
              aria-label="Obstacle position percentage"
            />
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-4">
          Calculate Fresnel Zone
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
