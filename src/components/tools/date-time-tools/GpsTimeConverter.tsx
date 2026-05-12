'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * GpsTimeConverter - Convert between GPS time and UTC.
 * GPS epoch: January 6, 1980 00:00:00 UTC. GPS time does not include leap seconds.
 */
export default function GpsTimeConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [direction, setDirection] = useState<'gpsToUtc' | 'utcToGps'>('utcToGps');
  const [gpsWeek, setGpsWeek] = useState('');
  const [gpsSeconds, setGpsSeconds] = useState('');
  const [utcDate, setUtcDate] = useState('');
  const [utcTime, setUtcTime] = useState('');
  const [results, setResults] = useState<{ gpsWeek: string; gpsSeconds: string; gpsTotalSeconds: string; utcDateTime: string; leapSeconds: string } | null>(null);
  const [error, setError] = useState('');

  // GPS epoch: Jan 6, 1980 00:00:00 UTC
  const GPS_EPOCH = Date.UTC(1980, 0, 6, 0, 0, 0);
  const SECONDS_PER_WEEK = 604800;

  // Leap seconds table (UTC dates when leap seconds were added)
  const leapSecondsTable = [
    { date: Date.UTC(1981, 6, 1), total: 1 }, { date: Date.UTC(1982, 6, 1), total: 2 },
    { date: Date.UTC(1983, 6, 1), total: 3 }, { date: Date.UTC(1985, 6, 1), total: 4 },
    { date: Date.UTC(1988, 0, 1), total: 5 }, { date: Date.UTC(1990, 0, 1), total: 6 },
    { date: Date.UTC(1991, 0, 1), total: 7 }, { date: Date.UTC(1992, 6, 1), total: 8 },
    { date: Date.UTC(1993, 6, 1), total: 9 }, { date: Date.UTC(1994, 6, 1), total: 10 },
    { date: Date.UTC(1996, 0, 1), total: 11 }, { date: Date.UTC(1997, 6, 1), total: 12 },
    { date: Date.UTC(1999, 0, 1), total: 13 }, { date: Date.UTC(2006, 0, 1), total: 14 },
    { date: Date.UTC(2009, 0, 1), total: 15 }, { date: Date.UTC(2012, 6, 1), total: 16 },
    { date: Date.UTC(2015, 6, 1), total: 17 }, { date: Date.UTC(2017, 0, 1), total: 18 },
  ];

  const getLeapSeconds = (utcMs: number): number => {
    let ls = 0;
    for (const entry of leapSecondsTable) {
      if (utcMs >= entry.date) ls = entry.total;
    }
    return ls;
  };

  const convert = () => {
    setError('');
    setResults(null);

    if (direction === 'utcToGps') {
      if (!utcDate || !utcTime) {
        setError('Please enter both date and time.');
        return;
      }
      const utcMs = Date.parse(`${utcDate}T${utcTime}:00.000Z`);
      if (isNaN(utcMs)) {
        setError('Invalid date/time format.');
        return;
      }

      const leapSecs = getLeapSeconds(utcMs);
      const gpsTotalSeconds = Math.floor((utcMs - GPS_EPOCH) / 1000) + leapSecs;
      const week = Math.floor(gpsTotalSeconds / SECONDS_PER_WEEK);
      const sow = gpsTotalSeconds % SECONDS_PER_WEEK;

      setResults({
        gpsWeek: week.toString(),
        gpsSeconds: sow.toFixed(3),
        gpsTotalSeconds: gpsTotalSeconds.toString(),
        utcDateTime: new Date(utcMs).toISOString(),
        leapSeconds: leapSecs.toString(),
      });
    } else {
      const week = parseInt(gpsWeek);
      const sow = parseFloat(gpsSeconds);
      if (isNaN(week) || isNaN(sow) || week < 0 || sow < 0 || sow >= SECONDS_PER_WEEK) {
        setError('Invalid GPS week or seconds of week (0-604799).');
        return;
      }

      const gpsTotalSecs = week * SECONDS_PER_WEEK + sow;
      const approxUtcMs = GPS_EPOCH + gpsTotalSecs * 1000;
      const leapSecs = getLeapSeconds(approxUtcMs);
      const utcMs = GPS_EPOCH + (gpsTotalSecs - leapSecs) * 1000;

      setResults({
        gpsWeek: week.toString(),
        gpsSeconds: sow.toFixed(3),
        gpsTotalSeconds: gpsTotalSecs.toString(),
        utcDateTime: new Date(utcMs).toISOString(),
        leapSeconds: leapSecs.toString(),
      });
    }
  };

  const resultText = results ? `GPS Week: ${results.gpsWeek}\nGPS Seconds of Week: ${results.gpsSeconds}\nGPS Total Seconds: ${results.gpsTotalSeconds}\nUTC: ${results.utcDateTime}\nLeap Seconds: ${results.leapSeconds}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-dir`} className="block text-sm font-medium text-gray-700 mb-1">Direction</label>
            <select id={`${toolId}-dir`} value={direction} onChange={(e) => setDirection(e.target.value as 'gpsToUtc' | 'utcToGps')} className="input-field" aria-label={`Conversion direction for ${toolName}`}>
              <option value="utcToGps">UTC → GPS Time</option>
              <option value="gpsToUtc">GPS Time → UTC</option>
            </select>
          </div>
          {direction === 'gpsToUtc' ? (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor={`${toolId}-week`} className="block text-sm font-medium text-gray-700 mb-1">GPS Week</label>
                <input id={`${toolId}-week`} type="number" value={gpsWeek} onChange={(e) => setGpsWeek(e.target.value)} placeholder="e.g. 2345" className="input-field" aria-label="GPS week number" />
              </div>
              <div>
                <label htmlFor={`${toolId}-sow`} className="block text-sm font-medium text-gray-700 mb-1">Seconds of Week</label>
                <input id={`${toolId}-sow`} type="number" value={gpsSeconds} onChange={(e) => setGpsSeconds(e.target.value)} placeholder="0-604799" className="input-field" aria-label="GPS seconds of week" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor={`${toolId}-date`} className="block text-sm font-medium text-gray-700 mb-1">UTC Date</label>
                <input id={`${toolId}-date`} type="date" value={utcDate} onChange={(e) => setUtcDate(e.target.value)} className="input-field" aria-label="UTC date" />
              </div>
              <div>
                <label htmlFor={`${toolId}-time`} className="block text-sm font-medium text-gray-700 mb-1">UTC Time</label>
                <input id={`${toolId}-time`} type="time" value={utcTime} onChange={(e) => setUtcTime(e.target.value)} className="input-field" aria-label="UTC time" />
              </div>
            </div>
          )}
          <button onClick={convert} className="btn-primary w-full">Convert</button>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      </InputArea>

      <OutputArea hasContent={!!results}>
        {results && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Conversion Results</label>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500">GPS Week</div>
                <div className="text-sm font-semibold text-blue-700">{results.gpsWeek}</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500">Seconds of Week</div>
                <div className="text-sm font-semibold text-green-700">{results.gpsSeconds}</div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500">UTC Date/Time</div>
                <div className="text-sm font-semibold text-purple-700">{results.utcDateTime}</div>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500">Leap Seconds (GPS-UTC)</div>
                <div className="text-sm font-semibold text-yellow-700">{results.leapSeconds} s</div>
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-xs text-gray-500">GPS Total Seconds since Epoch</div>
              <div className="text-sm font-mono text-gray-700">{results.gpsTotalSeconds}</div>
            </div>
            <CopyToClipboard text={resultText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
