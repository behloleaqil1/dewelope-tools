'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * LightTravelTimeCalculator - Calculate how long light takes to travel a distance.
 */
export default function LightTravelTimeCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [distance, setDistance] = useState('');
  const [unit, setUnit] = useState('km');
  const [output, setOutput] = useState('');

  const SPEED_OF_LIGHT = 299792.458; // km/s

  const calculate = () => {
    const val = parseFloat(distance);
    if (isNaN(val) || val < 0) {
      setOutput('Error: Please enter a valid non-negative distance.');
      return;
    }

    // Convert to km
    const conversions: Record<string, number> = {
      m: 0.001,
      km: 1,
      mi: 1.60934,
      au: 149597870.7,
      ly: 9.461e12,
      pc: 3.0857e13,
    };

    const distKm = val * (conversions[unit] || 1);
    const timeSeconds = distKm / SPEED_OF_LIGHT;

    // Format time
    let timeDisplay: string;
    const years = timeSeconds / (365.25 * 24 * 3600);
    const days = timeSeconds / 86400;
    const hours = timeSeconds / 3600;
    const minutes = timeSeconds / 60;

    if (timeSeconds < 0.000001) {
      timeDisplay = `${(timeSeconds * 1e9).toFixed(4)} nanoseconds`;
    } else if (timeSeconds < 0.001) {
      timeDisplay = `${(timeSeconds * 1e6).toFixed(4)} microseconds`;
    } else if (timeSeconds < 1) {
      timeDisplay = `${(timeSeconds * 1000).toFixed(4)} milliseconds`;
    } else if (timeSeconds < 60) {
      timeDisplay = `${timeSeconds.toFixed(4)} seconds`;
    } else if (timeSeconds < 3600) {
      timeDisplay = `${minutes.toFixed(4)} minutes (${timeSeconds.toFixed(2)} seconds)`;
    } else if (timeSeconds < 86400) {
      timeDisplay = `${hours.toFixed(4)} hours (${minutes.toFixed(2)} minutes)`;
    } else if (timeSeconds < 365.25 * 86400) {
      timeDisplay = `${days.toFixed(4)} days (${hours.toFixed(2)} hours)`;
    } else {
      timeDisplay = `${years.toFixed(6)} years (${days.toFixed(2)} days)`;
    }

    // Known distances for comparison
    const comparisons = [
      { name: 'Earth to Moon', km: 384400 },
      { name: 'Earth to Sun', km: 149597870.7 },
      { name: 'Earth to Mars (closest)', km: 54600000 },
      { name: 'Sun to Pluto', km: 5906376272 },
      { name: 'To nearest star (Proxima Centauri)', km: 4.0208e13 },
    ];

    const compStr = comparisons.map(c => {
      const t = c.km / SPEED_OF_LIGHT;
      if (t < 60) return `  ${c.name}: ${t.toFixed(2)} seconds`;
      if (t < 3600) return `  ${c.name}: ${(t / 60).toFixed(2)} minutes`;
      if (t < 86400) return `  ${c.name}: ${(t / 3600).toFixed(2)} hours`;
      return `  ${c.name}: ${(t / (365.25 * 86400)).toFixed(2)} years`;
    }).join('\n');

    const result = `Light Travel Time Calculator
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Distance: ${val} ${unit}
Distance in km: ${distKm.toExponential(6)}

Speed of Light: 299,792.458 km/s (in vacuum)

Travel Time: ${timeDisplay}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Reference Distances:
${compStr}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Note: Speed of light in vacuum (c) = 299,792,458 m/s
Light travels ~1 foot per nanosecond.`;

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-dist`} className="block text-sm font-medium text-gray-700 mb-1">Distance</label>
            <input id={`${toolId}-dist`} type="number" value={distance} onChange={(e) => setDistance(e.target.value)} placeholder="384400" step="any" aria-label={`Distance value for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-unit`} className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
            <select id={`${toolId}-unit`} value={unit} onChange={(e) => setUnit(e.target.value)} aria-label="Distance unit" className="input-field">
              <option value="m">Meters</option>
              <option value="km">Kilometers</option>
              <option value="mi">Miles</option>
              <option value="au">Astronomical Units (AU)</option>
              <option value="ly">Light Years</option>
              <option value="pc">Parsecs</option>
            </select>
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-4">Calculate Travel Time</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
