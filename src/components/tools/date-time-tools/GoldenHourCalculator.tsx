'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * GoldenHourCalculator - Calculate golden hour times for photography.
 * Uses solar position approximation based on latitude, longitude, and date.
 */
export default function GoldenHourCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{
    sunrise: string; sunset: string;
    morningGoldenStart: string; morningGoldenEnd: string;
    eveningGoldenStart: string; eveningGoldenEnd: string;
    morningBlueStart: string; morningBlueEnd: string;
    eveningBlueStart: string; eveningBlueEnd: string;
  } | null>(null);

  function toTimeString(hours: number): string {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }

  function calculateSunTimes(lat: number, lng: number, dateStr: string) {
    const d = new Date(dateStr);
    const dayOfYear = Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86400000);

    // Solar declination
    const declination = 23.45 * Math.sin((2 * Math.PI / 365) * (dayOfYear - 81));
    const decRad = declination * (Math.PI / 180);
    const latRad = lat * (Math.PI / 180);

    // Hour angle for sunrise/sunset (solar elevation = -0.833°)
    const cosHa = (Math.sin(-0.833 * Math.PI / 180) - Math.sin(latRad) * Math.sin(decRad)) /
      (Math.cos(latRad) * Math.cos(decRad));

    if (cosHa > 1 || cosHa < -1) return null; // No sunrise/sunset (polar)

    const ha = Math.acos(cosHa) * (180 / Math.PI);

    // Solar noon in hours (UTC)
    const eqTime = 229.18 * (0.000075 + 0.001868 * Math.cos(2 * Math.PI * dayOfYear / 365)
      - 0.032077 * Math.sin(2 * Math.PI * dayOfYear / 365)
      - 0.014615 * Math.cos(4 * Math.PI * dayOfYear / 365)
      - 0.04089 * Math.sin(4 * Math.PI * dayOfYear / 365));

    const solarNoon = 12 - lng / 15 - eqTime / 60;
    const sunriseHours = solarNoon - ha / 15;
    const sunsetHours = solarNoon + ha / 15;

    return { sunriseHours, sunsetHours };
  }

  function calculate() {
    setError('');
    setResult(null);

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (!latitude.trim() || isNaN(lat) || lat < -90 || lat > 90) {
      setError('Enter a valid latitude (-90 to 90)');
      return;
    }
    if (!longitude.trim() || isNaN(lng) || lng < -180 || lng > 180) {
      setError('Enter a valid longitude (-180 to 180)');
      return;
    }
    if (!date) {
      setError('Please select a date');
      return;
    }

    const times = calculateSunTimes(lat, lng, date);
    if (!times) {
      setError('No sunrise/sunset at this location on this date (polar region)');
      return;
    }

    const { sunriseHours, sunsetHours } = times;

    // Golden hour: ~1 hour after sunrise and ~1 hour before sunset
    // Blue hour: ~30 min before sunrise and ~30 min after sunset
    const goldenDuration = 1; // hours
    const blueDuration = 0.5; // hours

    setResult({
      sunrise: toTimeString(sunriseHours),
      sunset: toTimeString(sunsetHours),
      morningGoldenStart: toTimeString(sunriseHours),
      morningGoldenEnd: toTimeString(sunriseHours + goldenDuration),
      eveningGoldenStart: toTimeString(sunsetHours - goldenDuration),
      eveningGoldenEnd: toTimeString(sunsetHours),
      morningBlueStart: toTimeString(sunriseHours - blueDuration),
      morningBlueEnd: toTimeString(sunriseHours),
      eveningBlueStart: toTimeString(sunsetHours),
      eveningBlueEnd: toTimeString(sunsetHours + blueDuration),
    });
  }

  function useMyLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(pos.coords.latitude.toFixed(4));
          setLongitude(pos.coords.longitude.toFixed(4));
        },
        () => setError('Unable to get location. Please enter coordinates manually.')
      );
    } else {
      setError('Geolocation not supported by your browser');
    }
  }

  const copyText = result
    ? `Golden Hour Times (UTC) - ${date}\nSunrise: ${result.sunrise}\nSunset: ${result.sunset}\n\nMorning Golden Hour: ${result.morningGoldenStart} - ${result.morningGoldenEnd}\nEvening Golden Hour: ${result.eveningGoldenStart} - ${result.eveningGoldenEnd}\nMorning Blue Hour: ${result.morningBlueStart} - ${result.morningBlueEnd}\nEvening Blue Hour: ${result.eveningBlueStart} - ${result.eveningBlueEnd}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label htmlFor={`${toolId}-lat`} className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
            <input id={`${toolId}-lat`} type="text" inputMode="decimal" value={latitude} onChange={(e) => setLatitude(e.target.value)} placeholder="e.g. 40.7128" aria-label={`Latitude for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-lng`} className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
            <input id={`${toolId}-lng`} type="text" inputMode="decimal" value={longitude} onChange={(e) => setLongitude(e.target.value)} placeholder="e.g. -74.0060" aria-label={`Longitude for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-date`} className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input id={`${toolId}-date`} type="date" value={date} onChange={(e) => setDate(e.target.value)} aria-label={`Date for ${toolName}`} className="input-field" />
          </div>
        </div>
        <button type="button" onClick={useMyLocation} className="text-sm text-blue-600 hover:text-blue-800 mt-2">
          📍 Use My Location
        </button>
      </InputArea>

      <button onClick={calculate} aria-label="Calculate golden hour" className="btn-primary">
        Calculate Golden Hour
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-orange-500">{result.sunrise}</div>
                <div className="text-xs text-gray-500 mt-1">Sunrise (UTC)</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-orange-600">{result.sunset}</div>
                <div className="text-xs text-gray-500 mt-1">Sunset (UTC)</div>
              </div>
            </div>
            <h4 className="text-sm font-semibold text-amber-700">🌅 Golden Hour</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-center">
                <div className="text-md font-bold text-amber-700">{result.morningGoldenStart} – {result.morningGoldenEnd}</div>
                <div className="text-xs text-gray-500 mt-1">Morning Golden Hour</div>
              </div>
              <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-center">
                <div className="text-md font-bold text-amber-700">{result.eveningGoldenStart} – {result.eveningGoldenEnd}</div>
                <div className="text-xs text-gray-500 mt-1">Evening Golden Hour</div>
              </div>
            </div>
            <h4 className="text-sm font-semibold text-blue-700">🌌 Blue Hour</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-center">
                <div className="text-md font-bold text-blue-700">{result.morningBlueStart} – {result.morningBlueEnd}</div>
                <div className="text-xs text-gray-500 mt-1">Morning Blue Hour</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-center">
                <div className="text-md font-bold text-blue-700">{result.eveningBlueStart} – {result.eveningBlueEnd}</div>
                <div className="text-xs text-gray-500 mt-1">Evening Blue Hour</div>
              </div>
            </div>
            <p className="text-xs text-gray-500">All times are in UTC. Adjust for your local timezone.</p>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
