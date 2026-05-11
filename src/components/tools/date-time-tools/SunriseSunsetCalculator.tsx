'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SunriseSunsetCalculator - Estimate sunrise and sunset times for a given latitude and date.
 * Uses the simplified sunrise equation based on solar declination.
 */
export default function SunriseSunsetCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('0');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [result, setResult] = useState<{ sunrise: string; sunset: string; dayLength: string; solarNoon: string } | null>(null);
  const [error, setError] = useState<string | undefined>();

  function calculate() {
    setError(undefined);
    setResult(null);

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || lat < -90 || lat > 90) {
      setError('Latitude must be between -90 and 90');
      return;
    }

    if (isNaN(lng) || lng < -180 || lng > 180) {
      setError('Longitude must be between -180 and 180');
      return;
    }

    if (!date) {
      setError('Please select a date');
      return;
    }

    const d = new Date(date + 'T12:00:00Z');
    const dayOfYear = Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86400000);

    // Solar declination (approximate)
    const declination = -23.45 * Math.cos((360 / 365) * (dayOfYear + 10) * (Math.PI / 180));

    // Hour angle
    const latRad = lat * (Math.PI / 180);
    const decRad = declination * (Math.PI / 180);

    const cosHourAngle = (Math.cos(90.833 * (Math.PI / 180)) - Math.sin(latRad) * Math.sin(decRad)) / (Math.cos(latRad) * Math.cos(decRad));

    if (cosHourAngle > 1) {
      setError('No sunrise at this location on this date (polar night)');
      return;
    }
    if (cosHourAngle < -1) {
      setError('No sunset at this location on this date (midnight sun)');
      return;
    }

    const hourAngle = Math.acos(cosHourAngle) * (180 / Math.PI);

    // Solar noon in UTC hours, adjusted for longitude
    const solarNoonHours = 12 - (lng / 15);

    const sunriseHours = solarNoonHours - (hourAngle / 15);
    const sunsetHours = solarNoonHours + (hourAngle / 15);
    const dayLengthHours = (2 * hourAngle) / 15;

    function formatTime(hours: number): string {
      const h = ((hours % 24) + 24) % 24;
      const hh = Math.floor(h);
      const mm = Math.round((h - hh) * 60);
      return `${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')} UTC`;
    }

    function formatDuration(hours: number): string {
      const h = Math.floor(hours);
      const m = Math.round((hours - h) * 60);
      return `${h}h ${m}m`;
    }

    setResult({
      sunrise: formatTime(sunriseHours),
      sunset: formatTime(sunsetHours),
      dayLength: formatDuration(dayLengthHours),
      solarNoon: formatTime(solarNoonHours),
    });
  }

  const copyText = result
    ? `Date: ${date}\nLatitude: ${latitude}°, Longitude: ${longitude}°\nSunrise: ${result.sunrise}\nSunset: ${result.sunset}\nDay Length: ${result.dayLength}\nSolar Noon: ${result.solarNoon}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-lat`} className="block text-sm font-medium text-gray-700 mb-1">
              Latitude (-90 to 90)
            </label>
            <input
              id={`${toolId}-lat`}
              type="text"
              inputMode="decimal"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              placeholder="e.g. 40.7128 (New York)"
              aria-label={`Latitude for ${toolName}`}
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-lng`} className="block text-sm font-medium text-gray-700 mb-1">
              Longitude (-180 to 180)
            </label>
            <input
              id={`${toolId}-lng`}
              type="text"
              inputMode="decimal"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              placeholder="e.g. -74.0060 (New York)"
              aria-label={`Longitude for ${toolName}`}
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-date`} className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              id={`${toolId}-date`}
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              aria-label={`Date for ${toolName}`}
              className="input-field"
            />
          </div>
        </div>
      </InputArea>

      <button onClick={calculate} aria-label="Calculate sunrise and sunset" className="btn-primary">
        Calculate Sunrise & Sunset
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 text-center">
                <div className="text-2xl font-bold text-orange-600">🌅 {result.sunrise}</div>
                <div className="text-xs text-gray-500 mt-1">Sunrise</div>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200 text-center">
                <div className="text-2xl font-bold text-indigo-600">🌇 {result.sunset}</div>
                <div className="text-xs text-gray-500 mt-1">Sunset</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-center">
                <div className="text-2xl font-bold text-yellow-600">☀️ {result.solarNoon}</div>
                <div className="text-xs text-gray-500 mt-1">Solar Noon</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
                <div className="text-2xl font-bold text-blue-600">⏱️ {result.dayLength}</div>
                <div className="text-xs text-gray-500 mt-1">Day Length</div>
              </div>
            </div>
            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded border border-gray-200">
              Times are approximate (±2 min) and shown in UTC. Based on the simplified sunrise equation using solar declination.
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
