'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SiderealTimeCalculator - Calculate Greenwich and local sidereal time.
 */
export default function SiderealTimeCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [longitude, setLongitude] = useState('0');
  const [dateTime, setDateTime] = useState(new Date().toISOString().slice(0, 16));
  const [result, setResult] = useState<{ gst: string; lst: string; julianDate: string } | null>(null);
  const [error, setError] = useState('');

  function calculate() {
    setError('');
    setResult(null);
    const lng = parseFloat(longitude);
    if (isNaN(lng) || lng < -180 || lng > 180) { setError('Longitude must be between -180 and 180'); return; }

    const d = new Date(dateTime);
    if (isNaN(d.getTime())) { setError('Please enter a valid date/time'); return; }

    // Julian Date
    const y = d.getUTCFullYear();
    const m = d.getUTCMonth() + 1;
    const day = d.getUTCDate() + d.getUTCHours() / 24 + d.getUTCMinutes() / 1440;
    const a = Math.floor((14 - m) / 12);
    const yy = y + 4800 - a;
    const mm = m + 12 * a - 3;
    const jd = day + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;

    // Greenwich Mean Sidereal Time
    const T = (jd - 2451545.0) / 36525.0;
    let gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T;
    gmst = ((gmst % 360) + 360) % 360;

    // Local Sidereal Time
    let lst = gmst + lng;
    lst = ((lst % 360) + 360) % 360;

    const degreesToHMS = (deg: number): string => {
      const hours = deg / 15;
      const h = Math.floor(hours);
      const m = Math.floor((hours - h) * 60);
      const s = Math.round(((hours - h) * 60 - m) * 60);
      return `${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
    };

    setResult({
      gst: degreesToHMS(gmst),
      lst: degreesToHMS(lst),
      julianDate: jd.toFixed(5),
    });
  }

  const copyText = result ? `GST: ${result.gst}\nLST: ${result.lst}\nJulian Date: ${result.julianDate}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${toolId}-dt`} className="block text-sm font-medium text-gray-700 mb-1">Date & Time (UTC)</label>
            <input id={`${toolId}-dt`} type="datetime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)} aria-label={`Date and time for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-lng`} className="block text-sm font-medium text-gray-700 mb-1">Longitude (°)</label>
            <input id={`${toolId}-lng`} type="text" inputMode="decimal" value={longitude} onChange={(e) => setLongitude(e.target.value)} placeholder="0" aria-label="Observer longitude" className="input-field" />
          </div>
        </div>
      </InputArea>

      <button onClick={calculate} aria-label="Calculate sidereal time" className="btn-primary">Calculate</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-blue-600 font-mono">{result.gst}</div>
                <div className="text-xs text-gray-500 mt-1">Greenwich Sidereal Time</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-blue-600 font-mono">{result.lst}</div>
                <div className="text-xs text-gray-500 mt-1">Local Sidereal Time</div>
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded border border-gray-200 text-sm text-center">
              <span className="text-gray-500">Julian Date:</span> <span className="font-mono font-medium">{result.julianDate}</span>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
