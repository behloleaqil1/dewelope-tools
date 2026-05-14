'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TimeZoneOverlapFinder - Find overlapping business hours between two time zones
 */
export default function TimeZoneOverlapFinder({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [zone1, setZone1] = useState('America/New_York');
  const [zone2, setZone2] = useState('Europe/London');
  const [workStart, setWorkStart] = useState('9');
  const [workEnd, setWorkEnd] = useState('17');
  const [result, setResult] = useState<Array<{ hour1: string; hour2: string }>>([]);
  const [error, setError] = useState<string | undefined>();

  function findOverlap() {
    setError(undefined);
    setResult([]);

    const start = parseInt(workStart);
    const end = parseInt(workEnd);
    if (isNaN(start) || isNaN(end) || start >= end) { setError('Invalid work hours'); return; }

    const now = new Date();
    const overlaps: Array<{ hour1: string; hour2: string }> = [];

    for (let utcHour = 0; utcHour < 24; utcHour++) {
      const testDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), utcHour, 0, 0));
      try {
        const h1Fmt = new Intl.DateTimeFormat('en-US', { timeZone: zone1, hour: 'numeric', hour12: false });
        const h2Fmt = new Intl.DateTimeFormat('en-US', { timeZone: zone2, hour: 'numeric', hour12: false });
        const h1 = parseInt(h1Fmt.format(testDate));
        const h2 = parseInt(h2Fmt.format(testDate));

        if (h1 >= start && h1 < end && h2 >= start && h2 < end) {
          const t1Fmt = new Intl.DateTimeFormat('en-US', { timeZone: zone1, hour: 'numeric', minute: '2-digit', hour12: true });
          const t2Fmt = new Intl.DateTimeFormat('en-US', { timeZone: zone2, hour: 'numeric', minute: '2-digit', hour12: true });
          overlaps.push({ hour1: t1Fmt.format(testDate), hour2: t2Fmt.format(testDate) });
        }
      } catch {
        setError('Invalid time zone name');
        return;
      }
    }

    setResult(overlaps);
  }

  const copyText = result.map(r => `${zone1.split('/').pop()}: ${r.hour1} | ${zone2.split('/').pop()}: ${r.hour2}`).join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-z1`} className="block text-sm font-medium text-gray-700 mb-1">Time Zone 1</label>
        <input id={`${toolId}-z1`} type="text" value={zone1} onChange={(e) => setZone1(e.target.value)} placeholder="e.g., America/New_York" aria-label={`Time zone 1 for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <label htmlFor={`${toolId}-z2`} className="block text-sm font-medium text-gray-700 mb-1 mt-3">Time Zone 2</label>
        <input id={`${toolId}-z2`} type="text" value={zone2} onChange={(e) => setZone2(e.target.value)} placeholder="e.g., Europe/London" aria-label={`Time zone 2 for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <div className="flex gap-3 mt-3">
          <div className="flex-1"><label htmlFor={`${toolId}-ws`} className="block text-sm font-medium text-gray-700 mb-1">Work Start</label><input id={`${toolId}-ws`} type="number" min="0" max="23" value={workStart} onChange={(e) => setWorkStart(e.target.value)} aria-label={`Work start hour for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
          <div className="flex-1"><label htmlFor={`${toolId}-we`} className="block text-sm font-medium text-gray-700 mb-1">Work End</label><input id={`${toolId}-we`} type="number" min="0" max="23" value={workEnd} onChange={(e) => setWorkEnd(e.target.value)} aria-label={`Work end hour for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
        </div>
      </InputArea>

      <button onClick={findOverlap} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Find Overlap</button>

      <OutputArea hasContent={result.length > 0}>
        {result.length > 0 && (
          <div className="space-y-3">
            <div className="text-sm text-gray-600">{result.length} overlapping hour{result.length !== 1 ? 's' : ''}:</div>
            <div className="space-y-2">
              {result.map((r, i) => (
                <div key={i} className="flex justify-between bg-green-50 p-2 rounded border border-green-200 text-sm">
                  <span>{zone1.split('/').pop()}: {r.hour1}</span>
                  <span>{zone2.split('/').pop()}: {r.hour2}</span>
                </div>
              ))}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
