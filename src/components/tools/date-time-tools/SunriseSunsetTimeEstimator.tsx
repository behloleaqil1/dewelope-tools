'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SunriseSunsetTimeEstimator - Estimate sunrise/sunset times from lat/lng.
 */
export default function SunriseSunsetTimeEstimator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [result, setResult] = useState<{ sunrise: string; sunset: string; dayLength: string; solarNoon: string } | null>(null);
  const [error, setError] = useState('');

  function calculate() {
    setError('');
    setResult(null);
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    if (isNaN(lat) || lat < -90 || lat > 90) { setError('Latitude must be between -90 and 90'); return; }
    if (isNaN(lng) || lng < -180 || lng > 180) { setError('Longitude must be between -180 and 180'); return; }

    const d = new Date(date);
    const start = new Date(d.getFullYear(), 0, 1);
    const dayOfYear = Math.floor((d.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    // Solar declination
    const declination = 23.45 * Math.sin((Math.PI / 180) * (360 / 365) * (dayOfYear - 81));
    const decRad = declination * (Math.PI / 180);
    const latRad = lat * (Math.PI / 180);

    // Hour angle
    const cosHa = -Math.tan(latRad) * Math.tan(decRad);

    if (cosHa > 1) { setError('No sunrise (polar night)'); return; }
    if (cosHa < -1) { setError('No sunset (midnight sun)'); return; }

    const ha = Math.acos(cosHa) * (180 / Math.PI);
    const dayLengthHours = (2 * ha) / 15;

    // Equation of time
    const B = (360 / 365) * (dayOfYear - 81) * (Math.PI / 180);
    const eot = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);

    const solarNoonMin = 720 - (lng * 4) - eot;
    const sunriseMin = solarNoonMin - (dayLengthHours * 60) / 2;
    const sunsetMin = solarNoonMin + (dayLengthHours * 60) / 2;

    const formatTime = (min: number) => {
      const h = Math.floor(((min % 1440) + 1440) % 1440 / 60);
      const m = Math.round(((min % 1440) + 1440) % 1440 % 60);
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} UTC`;
    };

    const dlH = Math.floor(dayLengthHours);
    const dlM = Math.round((dayLengthHours - dlH) * 60);

    setResult({
      sunrise: formatTime(sunriseMin),
      sunset: formatTime(sunsetMin),
      dayLength: `${dlH}h ${dlM}m`,
      solarNoon: formatTime(solarNoonMin),
    });
  }

  const copyText = result ? `Sunrise: ${result.sunrise}\nSunset: ${result.sunset}\nDay Length: ${result.dayLength}\nSolar Noon: ${result.solarNoon}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label htmlFor={`${toolId}-lat`} className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
            <input id={`${toolId}-lat`} type="text" inputMode="decimal" value={latitude} onChange={(e) => setLatitude(e.target.value)} placeholder="e.g., 40.7128" aria-label={`Latitude for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-lng`} className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
            <input id={`${toolId}-lng`} type="text" inputMode="decimal" value={longitude} onChange={(e) => setLongitude(e.target.value)} placeholder="e.g., -74.006" aria-label="Longitude" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-date`} className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input id={`${toolId}-date`} type="date" value={date} onChange={(e) => setDate(e.target.value)} aria-label="Date" className="input-field" />
          </div>
        </div>
      </InputArea>

      <button onClick={calculate} aria-label="Estimate sunrise and sunset" className="btn-primary">Calculate</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 text-center">
                <div className="text-xl font-bold text-orange-600">{result.sunrise}</div>
                <div className="text-xs text-gray-500 mt-1">Sunrise</div>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200 text-center">
                <div className="text-xl font-bold text-indigo-600">{result.sunset}</div>
                <div className="text-xs text-gray-500 mt-1">Sunset</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-50 p-3 rounded border border-gray-200 text-center">
                <div className="font-bold text-gray-700">{result.dayLength}</div>
                <div className="text-xs text-gray-500">Day Length</div>
              </div>
              <div className="bg-gray-50 p-3 rounded border border-gray-200 text-center">
                <div className="font-bold text-gray-700">{result.solarNoon}</div>
                <div className="text-xs text-gray-500">Solar Noon</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
