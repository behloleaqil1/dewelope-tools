'use client';

import { useState } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * StepsToDistanceConverter - Convert steps to distance based on stride length.
 */
export default function StepsToDistanceConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [steps, setSteps] = useState('');
  const [height, setHeight] = useState('170');
  const [gender, setGender] = useState('male');

  const calculate = (): string => {
    const s = parseInt(steps);
    const h = parseFloat(height);
    if (isNaN(s) || s <= 0 || isNaN(h)) return '';

    // Estimate stride length from height (cm)
    const strideCm = gender === 'male' ? h * 0.415 : h * 0.413;
    const strideM = strideCm / 100;

    const distanceM = s * strideM;
    const distanceKm = distanceM / 1000;
    const distanceMiles = distanceKm / 1.60934;
    const caloriesBurned = Math.round(s * 0.04); // Rough estimate
    const timeMinutes = Math.round(s / 100); // ~100 steps/min average

    return `Distance: ${distanceKm.toFixed(2)} km (${distanceMiles.toFixed(2)} miles)\nDistance: ${distanceM.toFixed(0)} meters\n\nEstimated stride length: ${strideCm.toFixed(1)} cm\nEstimated calories burned: ~${caloriesBurned} kcal\nEstimated walking time: ~${timeMinutes} minutes\n\nDaily goal progress: ${Math.min(100, Math.round(s / 100)).toFixed(0)}% of 10,000 steps`;
  };

  const result = calculate();

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div>
        <label htmlFor={`${toolId}-steps`} className="block text-sm font-medium text-gray-700 mb-1">Number of Steps</label>
        <input id={`${toolId}-steps`} type="number" value={steps} onChange={(e) => setSteps(e.target.value)} placeholder="10000" aria-label={`Steps for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor={`${toolId}-height`} className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
          <input id={`${toolId}-height`} type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="170" aria-label={`Height for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label htmlFor={`${toolId}-gender`} className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
          <select id={`${toolId}-gender`} value={gender} onChange={(e) => setGender(e.target.value)} aria-label={`Gender for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm">
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
      </div>
      <OutputArea hasContent={!!result}>
        {result && (
          <div className="space-y-2">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 bg-gray-50 p-3 rounded-lg">{result}</pre>
            <CopyToClipboard text={result} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
