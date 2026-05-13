'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * RadioHorizonCalculator - Calculate radio horizon distance from antenna height.
 */
export default function RadioHorizonCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [height, setHeight] = useState('');
  const [unit, setUnit] = useState('meters');
  const [output, setOutput] = useState('');

  const calculate = () => {
    let h = parseFloat(height);
    if (isNaN(h) || h < 0) return;

    // Convert to meters if needed
    if (unit === 'feet') h = h * 0.3048;

    // Radio horizon formula: d = sqrt(2 * k * R * h)
    // k = 4/3 (standard refraction factor)
    // R = 6371 km (Earth radius)
    // d in km = sqrt(2 * (4/3) * 6371 * h/1000)
    // Simplified: d (km) = 4.12 * sqrt(h in meters)
    const distanceKm = 4.12 * Math.sqrt(h);
    const distanceMi = distanceKm * 0.621371;
    const distanceNm = distanceKm * 0.539957;

    // Optical horizon for comparison (k=1)
    const opticalKm = 3.57 * Math.sqrt(h);

    const results = [
      `Antenna Height: ${h.toFixed(2)} m (${(h / 0.3048).toFixed(2)} ft)`,
      ``,
      `Radio Horizon (k=4/3 standard refraction):`,
      `  Distance: ${distanceKm.toFixed(2)} km`,
      `  Distance: ${distanceMi.toFixed(2)} miles`,
      `  Distance: ${distanceNm.toFixed(2)} nautical miles`,
      ``,
      `Optical Horizon (k=1, no refraction):`,
      `  Distance: ${opticalKm.toFixed(2)} km`,
      ``,
      `Formula: d = 4.12 × √h (h in meters, d in km)`,
      `Refraction factor (k): 4/3 (standard atmosphere)`,
      `Earth radius: 6,371 km`,
    ];

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-height`} className="block text-sm font-medium text-gray-700 mb-1">Antenna Height</label>
            <input id={`${toolId}-height`} type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="30" aria-label={`Antenna height for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-unit`} className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
            <select id={`${toolId}-unit`} value={unit} onChange={(e) => setUnit(e.target.value)} aria-label="Height unit" className="input-field">
              <option value="meters">Meters</option>
              <option value="feet">Feet</option>
            </select>
          </div>
        </div>
        <button onClick={calculate} className="mt-4 btn-primary">Calculate Radio Horizon</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Radio Horizon Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
