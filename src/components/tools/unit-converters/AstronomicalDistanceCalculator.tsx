'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const DISTANCES: Record<string, number> = { 'Moon': 384400, 'Mars (closest)': 54600000, 'Mars (average)': 225000000, 'Venus (closest)': 38000000, 'Jupiter': 628730000, 'Saturn': 1275000000, 'Neptune': 4351000000, 'Pluto': 5900000000 };
const LIGHT_SPEED = 299792.458; // km/s

export default function AstronomicalDistanceCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [planet, setPlanet] = useState('Mars (average)');
  const [result, setResult] = useState('');

  const calculate = () => {
    const km = DISTANCES[planet];
    const seconds = km / LIGHT_SPEED;
    const minutes = seconds / 60;
    const hours = minutes / 60;
    const days = hours / 24;
    setResult(`Distance to ${planet}: ${km.toLocaleString()} km\n\nTravel time at light speed:\n${seconds.toFixed(2)} seconds\n${minutes.toFixed(2)} minutes\n${hours.toFixed(4)} hours\n${days.toFixed(4)} days`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-planet`} className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
        <select id={`${toolId}-planet`} value={planet} onChange={(e) => setPlanet(e.target.value)} aria-label={`Destination for ${toolName}`} className="input-field">
          {Object.keys(DISTANCES).map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </InputArea>
      <button onClick={calculate} className="btn-primary" aria-label="Calculate travel time">Calculate</button>
      <OutputArea hasContent={!!result}>
        {result && (
          <div className="space-y-2">
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{result}</pre>
            <CopyToClipboard text={result} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
