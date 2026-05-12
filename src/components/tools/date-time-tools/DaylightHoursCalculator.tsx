'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * DaylightHoursCalculator - Estimate daylight hours for a given date and latitude.
 * Uses the CBM model (sunrise equation) for approximation.
 */
export default function DaylightHoursCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [date, setDate] = useState('');
  const [latitude, setLatitude] = useState('');
  const [result, setResult] = useState<{ hours: number; minutes: number; sunrise: string; sunset: string; totalMinutes: number } | null>(null);
  const [error, setError] = useState('');

  const calculate = () => {
    setError('');
    setResult(null);

    if (!date) {
      setError('Please select a date.');
      return;
    }

    const lat = parseFloat(latitude);
    if (isNaN(lat) || lat < -90 || lat > 90) {
      setError('Please enter a valid latitude between -90 and 90.');
      return;
    }

    const dateObj = new Date(date);
    const start = new Date(dateObj.getFullYear(), 0, 1);
    const dayOfYear = Math.floor((dateObj.getTime() - start.getTime()) / 86400000) + 1;

    // Solar declination angle
    const declination = 23.45 * Math.sin((2 * Math.PI / 365) * (dayOfYear - 81));
    const decRad = declination * (Math.PI / 180);
    const latRad = lat * (Math.PI / 180);

    // Hour angle
    const cosHourAngle = -Math.tan(latRad) * Math.tan(decRad);

    let daylightMinutes: number;

    if (cosHourAngle < -1) {
      // Midnight sun (24h daylight)
      daylightMinutes = 1440;
    } else if (cosHourAngle > 1) {
      // Polar night (0h daylight)
      daylightMinutes = 0;
    } else {
      const hourAngle = Math.acos(cosHourAngle) * (180 / Math.PI);
      daylightMinutes = (2 * hourAngle / 15) * 60;
    }

    const hours = Math.floor(daylightMinutes / 60);
    const minutes = Math.round(daylightMinutes % 60);

    // Approximate sunrise/sunset times (centered around noon)
    const halfDaylight = daylightMinutes / 2;
    const sunriseMin = 720 - halfDaylight; // minutes from midnight
    const sunsetMin = 720 + halfDaylight;

    const formatTime = (mins: number) => {
      const h = Math.floor(Math.max(0, Math.min(1440, mins)) / 60);
      const m = Math.round(Math.max(0, Math.min(1440, mins)) % 60);
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    };

    setResult({
      hours,
      minutes,
      sunrise: formatTime(sunriseMin),
      sunset: formatTime(sunsetMin),
      totalMinutes: Math.round(daylightMinutes),
    });
  };

  const copyText = result
    ? `Date: ${date}\nLatitude: ${latitude}°\nDaylight: ${result.hours}h ${result.minutes}m (${result.totalMinutes} minutes)\nSunrise: ~${result.sunrise}\nSunset: ~${result.sunset}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-date`} className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input id={`${toolId}-date`} type="date" value={date} onChange={(e) => setDate(e.target.value)} aria-label={`Date for ${toolName}`} className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-lat`} className="block text-sm font-medium text-gray-700 mb-1">Latitude (-90 to 90)</label>
              <input id={`${toolId}-lat`} type="text" inputMode="decimal" value={latitude} onChange={(e) => setLatitude(e.target.value)} placeholder="e.g. 40.7128 (New York)" aria-label="Latitude" className="input-field" />
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Common latitudes: New York 40.7°, London 51.5°, Sydney -33.9°, Tokyo 35.7°, Reykjavik 64.1°
          </div>
        </div>
      </InputArea>

      <button onClick={calculate} className="btn-primary" aria-label="Calculate daylight hours">Calculate Daylight</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-3xl font-bold text-yellow-600">{result.hours}h {result.minutes}m</div>
              <div className="text-xs text-gray-500 mt-1">Total Daylight ({result.totalMinutes} minutes)</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-orange-500 font-mono">{result.sunrise}</div>
                <div className="text-xs text-gray-500 mt-1">Approximate Sunrise</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-indigo-500 font-mono">{result.sunset}</div>
                <div className="text-xs text-gray-500 mt-1">Approximate Sunset</div>
              </div>
            </div>
            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded border border-gray-200">
              Note: Times are approximate solar noon-centered estimates. Actual times vary by longitude and timezone.
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
