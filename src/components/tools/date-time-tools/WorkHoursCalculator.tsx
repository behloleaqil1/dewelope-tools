'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * WorkHoursCalculator - Calculates total work hours between start and end times,
 * with optional break deduction.
 */
export default function WorkHoursCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:30');
  const [breakMinutes, setBreakMinutes] = useState('30');
  const [hourlyRate, setHourlyRate] = useState('');
  const [result, setResult] = useState<{
    totalMinutes: number; netMinutes: number; hours: string; earnings: number | null;
  } | null>(null);
  const [error, setError] = useState<string | undefined>();

  function calculate() {
    setError(undefined);
    setResult(null);

    if (!startTime || !endTime) {
      setError('Please enter both start and end times');
      return;
    }

    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);

    let totalMinutes = (endH * 60 + endM) - (startH * 60 + startM);
    if (totalMinutes < 0) totalMinutes += 24 * 60; // Handle overnight shifts

    const breakMins = parseInt(breakMinutes) || 0;
    const netMinutes = Math.max(0, totalMinutes - breakMins);

    const hours = Math.floor(netMinutes / 60);
    const mins = netMinutes % 60;
    const hoursStr = `${hours}h ${mins}m`;

    const rate = parseFloat(hourlyRate);
    const earnings = !isNaN(rate) && rate > 0 ? (netMinutes / 60) * rate : null;

    setResult({ totalMinutes, netMinutes, hours: hoursStr, earnings });
  }

  const copyText = result
    ? `Work Hours: ${result.hours}\nTotal: ${result.totalMinutes} min\nNet (after break): ${result.netMinutes} min\nDecimal: ${(result.netMinutes / 60).toFixed(2)} hours${result.earnings !== null ? `\nEarnings: $${result.earnings.toFixed(2)}` : ''}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label className="block text-sm font-medium text-gray-700 mb-3" id={`${toolId}-label`}>
          Calculate work hours for {toolName}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" aria-labelledby={`${toolId}-label`}>
          <div>
            <label htmlFor={`${toolId}-start`} className="block text-xs text-gray-500 mb-1">Start Time</label>
            <input id={`${toolId}-start`} type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} aria-label="Start time" className="input-field text-sm" />
          </div>
          <div>
            <label htmlFor={`${toolId}-end`} className="block text-xs text-gray-500 mb-1">End Time</label>
            <input id={`${toolId}-end`} type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} aria-label="End time" className="input-field text-sm" />
          </div>
          <div>
            <label htmlFor={`${toolId}-break`} className="block text-xs text-gray-500 mb-1">Break (min)</label>
            <input id={`${toolId}-break`} type="number" min="0" value={breakMinutes} onChange={(e) => setBreakMinutes(e.target.value)} aria-label="Break duration in minutes" className="input-field text-sm" />
          </div>
          <div>
            <label htmlFor={`${toolId}-rate`} className="block text-xs text-gray-500 mb-1">Hourly Rate ($)</label>
            <input id={`${toolId}-rate`} type="text" inputMode="decimal" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} placeholder="Optional" aria-label="Hourly rate" className="input-field text-sm" />
          </div>
        </div>
      </InputArea>

      <button onClick={calculate} aria-label="Calculate work hours" className="btn-primary">Calculate</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className={`grid ${result.earnings !== null ? 'grid-cols-3' : 'grid-cols-2'} gap-4`}>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.hours}</div>
                <div className="text-xs text-gray-500 mt-1">Net Work Time</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-green-600">{(result.netMinutes / 60).toFixed(2)}</div>
                <div className="text-xs text-gray-500 mt-1">Decimal Hours</div>
              </div>
              {result.earnings !== null && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                  <div className="text-2xl font-bold text-purple-600">${result.earnings.toFixed(2)}</div>
                  <div className="text-xs text-gray-500 mt-1">Earnings</div>
                </div>
              )}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
