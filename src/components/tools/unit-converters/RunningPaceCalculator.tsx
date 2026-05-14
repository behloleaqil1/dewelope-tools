'use client';

import { useState } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * RunningPaceCalculator - Calculate running pace per km/mile from distance and time.
 */
export default function RunningPaceCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [distance, setDistance] = useState('');
  const [distanceUnit, setDistanceUnit] = useState('km');
  const [hours, setHours] = useState('0');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('0');

  const calculate = (): string => {
    const d = parseFloat(distance);
    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;
    const s = parseInt(seconds) || 0;
    if (isNaN(d) || d <= 0) return '';
    const totalSeconds = h * 3600 + m * 60 + s;
    if (totalSeconds <= 0) return '';

    const km = distanceUnit === 'miles' ? d * 1.60934 : d;
    const miles = distanceUnit === 'km' ? d / 1.60934 : d;

    const pacePerKm = totalSeconds / km;
    const pacePerMile = totalSeconds / miles;
    const speedKmh = (km / totalSeconds) * 3600;
    const speedMph = (miles / totalSeconds) * 3600;

    const formatPace = (sec: number) => {
      const min = Math.floor(sec / 60);
      const rem = Math.round(sec % 60);
      return `${min}:${rem.toString().padStart(2, '0')}`;
    };

    const formatTime = (sec: number) => {
      const hrs = Math.floor(sec / 3600);
      const mins = Math.floor((sec % 3600) / 60);
      const secs = Math.round(sec % 60);
      return hrs > 0 ? `${hrs}h ${mins}m ${secs}s` : `${mins}m ${secs}s`;
    };

    const predictions = [
      { name: '5K', dist: 5 },
      { name: '10K', dist: 10 },
      { name: 'Half Marathon', dist: 21.0975 },
      { name: 'Marathon', dist: 42.195 },
    ];

    const predLines = predictions.map(p => {
      const time = pacePerKm * p.dist;
      return `  ${p.name}: ${formatTime(time)}`;
    });

    return `Pace per km: ${formatPace(pacePerKm)} /km\nPace per mile: ${formatPace(pacePerMile)} /mi\nSpeed: ${speedKmh.toFixed(2)} km/h (${speedMph.toFixed(2)} mph)\n\nRace predictions at this pace:\n${predLines.join('\n')}`;
  };

  const result = calculate();

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor={`${toolId}-dist`} className="block text-sm font-medium text-gray-700 mb-1">Distance</label>
          <input id={`${toolId}-dist`} type="number" value={distance} onChange={(e) => setDistance(e.target.value)} placeholder="5" step="0.1" aria-label={`Distance for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label htmlFor={`${toolId}-du`} className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
          <select id={`${toolId}-du`} value={distanceUnit} onChange={(e) => setDistanceUnit(e.target.value)} aria-label={`Distance unit for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm">
            <option value="km">Kilometers</option>
            <option value="miles">Miles</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label htmlFor={`${toolId}-h`} className="block text-sm font-medium text-gray-700 mb-1">Hours</label>
          <input id={`${toolId}-h`} type="number" value={hours} onChange={(e) => setHours(e.target.value)} min="0" aria-label={`Hours for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label htmlFor={`${toolId}-m`} className="block text-sm font-medium text-gray-700 mb-1">Minutes</label>
          <input id={`${toolId}-m`} type="number" value={minutes} onChange={(e) => setMinutes(e.target.value)} min="0" max="59" aria-label={`Minutes for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label htmlFor={`${toolId}-s`} className="block text-sm font-medium text-gray-700 mb-1">Seconds</label>
          <input id={`${toolId}-s`} type="number" value={seconds} onChange={(e) => setSeconds(e.target.value)} min="0" max="59" aria-label={`Seconds for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
