'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SchoolYearProgress - Calculate progress through the school year.
 */
export default function SchoolYearProgress({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [result, setResult] = useState<{
    percentage: number;
    daysElapsed: number;
    daysRemaining: number;
    totalDays: number;
    weeksElapsed: number;
    weeksRemaining: number;
    status: string;
  } | null>(null);
  const [error, setError] = useState('');

  const calculate = () => {
    setError('');
    setResult(null);

    if (!startDate || !endDate) {
      setError('Please select both start and end dates.');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    if (end <= start) {
      setError('End date must be after start date.');
      return;
    }

    const totalMs = end.getTime() - start.getTime();
    const totalDays = Math.ceil(totalMs / 86400000);
    const elapsedMs = today.getTime() - start.getTime();
    const daysElapsed = Math.ceil(elapsedMs / 86400000);

    let percentage: number;
    let status: string;

    if (today < start) {
      percentage = 0;
      status = 'Not started yet';
    } else if (today >= end) {
      percentage = 100;
      status = 'Completed!';
    } else {
      percentage = Math.min(100, Math.max(0, (daysElapsed / totalDays) * 100));
      status = 'In progress';
    }

    const daysRemaining = Math.max(0, Math.ceil((end.getTime() - today.getTime()) / 86400000));
    const weeksElapsed = Math.floor(Math.max(0, daysElapsed) / 7);
    const weeksRemaining = Math.floor(daysRemaining / 7);

    setResult({
      percentage,
      daysElapsed: Math.max(0, daysElapsed),
      daysRemaining,
      totalDays,
      weeksElapsed,
      weeksRemaining,
      status,
    });
  };

  const copyText = result
    ? `School Year Progress: ${result.percentage.toFixed(1)}%\nStatus: ${result.status}\nDays Elapsed: ${result.daysElapsed} / ${result.totalDays}\nDays Remaining: ${result.daysRemaining}\nWeeks Elapsed: ${result.weeksElapsed}\nWeeks Remaining: ${result.weeksRemaining}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-start`} className="block text-sm font-medium text-gray-700 mb-1">School Year Start</label>
              <input id={`${toolId}-start`} type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} aria-label={`Start date for ${toolName}`} className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-end`} className="block text-sm font-medium text-gray-700 mb-1">School Year End</label>
              <input id={`${toolId}-end`} type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} aria-label="End date" className="input-field" />
            </div>
          </div>
          <p className="text-xs text-gray-500">Typical US school year: late August to early June. UK: September to July.</p>
        </div>
      </InputArea>

      <button onClick={calculate} className="btn-primary" aria-label="Calculate school year progress">Calculate Progress</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="text-center mb-3">
                <div className="text-3xl font-bold text-blue-600">{result.percentage.toFixed(1)}%</div>
                <div className="text-sm text-gray-500 mt-1">{result.status}</div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500"
                  style={{ width: `${result.percentage}%` }}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-green-600">{result.daysElapsed}</div>
                <div className="text-xs text-gray-500 mt-1">Days Elapsed</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-orange-600">{result.daysRemaining}</div>
                <div className="text-xs text-gray-500 mt-1">Days Remaining</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-700">{result.totalDays}</div>
                <div className="text-xs text-gray-500 mt-1">Total Days</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-green-600">{result.weeksElapsed}</div>
                <div className="text-xs text-gray-500 mt-1">Weeks Elapsed</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-orange-600">{result.weeksRemaining}</div>
                <div className="text-xs text-gray-500 mt-1">Weeks Remaining</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
