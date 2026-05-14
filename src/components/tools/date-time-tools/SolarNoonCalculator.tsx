'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SolarNoonCalculator - Calculate solar noon from longitude and date.
 */
export default function SolarNoonCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [longitude, setLongitude] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [result, setResult] = useState<{ solarNoon: string; eot: string; offset: string } | null>(null);
  const [error, setError] = useState('');

  function calculate() {
    setError('');
    setResult(null);
    const lng = parseFloat(longitude);
    if (isNaN(lng) || lng < -180 || lng > 180) { setError('Please enter a valid longitude (-180 to 180)'); return; }

    const d = new Date(date);
    if (isNaN(d.getTime())) { setError('Please enter a valid date'); return; }

    // Day of year
    const start = new Date(d.getFullYear(), 0, 0);
    const diff = d.getTime() - start.getTime();
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

    // Equation of Time (approximation in minutes)
    const B = (360 / 365) * (dayOfYear - 81) * (Math.PI / 180);
    const eot = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);

    // Solar noon in UTC
    const solarNoonMinutes = 720 - (lng * 4) - eot;
    const hours = Math.floor(solarNoonMinutes / 60);
    const minutes = Math.round(solarNoonMinutes % 60);

    const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} UTC`;
    const offsetMinutes = -(lng * 4) - eot;

    setResult({
      solarNoon: timeStr,
      eot: `${eot > 0 ? '+' : ''}${eot.toFixed(2)} minutes`,
      offset: `${offsetMinutes > 0 ? '+' : ''}${offsetMinutes.toFixed(1)} min from 12:00 UTC`,
    });
  }

  const copyText = result ? `Solar Noon: ${result.solarNoon}\nEquation of Time: ${result.eot}\nOffset: ${result.offset}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${toolId}-lng`} className="block text-sm font-medium text-gray-700 mb-1">Longitude (°)</label>
            <input id={`${toolId}-lng`} type="text" inputMode="decimal" value={longitude} onChange={(e) => setLongitude(e.target.value)} placeholder="e.g., -73.9857 (NYC)" aria-label={`Longitude for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-date`} className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input id={`${toolId}-date`} type="date" value={date} onChange={(e) => setDate(e.target.value)} aria-label="Date for solar noon" className="input-field" />
          </div>
        </div>
      </InputArea>

      <button onClick={calculate} aria-label="Calculate solar noon" className="btn-primary">Calculate Solar Noon</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-blue-600">{result.solarNoon}</div>
              <div className="text-sm text-gray-500 mt-1">Solar Noon</div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-50 p-3 rounded border border-gray-200">
                <div className="text-xs text-gray-500">Equation of Time</div>
                <div className="font-mono font-medium">{result.eot}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded border border-gray-200">
                <div className="text-xs text-gray-500">Offset</div>
                <div className="font-mono font-medium">{result.offset}</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
