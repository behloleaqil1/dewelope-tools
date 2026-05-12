'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

// Mercury retrograde periods (approximate dates for 2023-2026)
const RETROGRADE_PERIODS = [
  { start: '2023-12-13', end: '2024-01-01' },
  { start: '2024-04-01', end: '2024-04-25' },
  { start: '2024-08-05', end: '2024-08-28' },
  { start: '2024-11-25', end: '2024-12-15' },
  { start: '2025-03-14', end: '2025-04-07' },
  { start: '2025-07-18', end: '2025-08-11' },
  { start: '2025-11-09', end: '2025-11-29' },
  { start: '2026-03-01', end: '2026-03-20' },
  { start: '2026-06-29', end: '2026-07-23' },
  { start: '2026-10-24', end: '2026-11-13' },
];

/**
 * MercuryRetrogradeChecker - Check if Mercury is in retrograde for a given date.
 * Shows current status, next retrograde period, and all upcoming periods.
 */
export default function MercuryRetrogradeChecker({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [dateInput, setDateInput] = useState(new Date().toISOString().split('T')[0]);
  const [result, setResult] = useState<{
    isRetrograde: boolean;
    currentPeriod: { start: string; end: string } | null;
    nextPeriod: { start: string; end: string } | null;
    daysUntilNext: number | null;
    daysRemaining: number | null;
  } | null>(null);

  function check() {
    const checkDate = new Date(dateInput + 'T12:00:00');

    let isRetrograde = false;
    let currentPeriod: { start: string; end: string } | null = null;
    let nextPeriod: { start: string; end: string } | null = null;
    let daysUntilNext: number | null = null;
    let daysRemaining: number | null = null;

    for (const period of RETROGRADE_PERIODS) {
      const start = new Date(period.start + 'T00:00:00');
      const end = new Date(period.end + 'T23:59:59');

      if (checkDate >= start && checkDate <= end) {
        isRetrograde = true;
        currentPeriod = period;
        daysRemaining = Math.ceil((end.getTime() - checkDate.getTime()) / (1000 * 60 * 60 * 24));
        break;
      }
    }

    if (!isRetrograde) {
      for (const period of RETROGRADE_PERIODS) {
        const start = new Date(period.start + 'T00:00:00');
        if (start > checkDate) {
          nextPeriod = period;
          daysUntilNext = Math.ceil((start.getTime() - checkDate.getTime()) / (1000 * 60 * 60 * 24));
          break;
        }
      }
    }

    setResult({ isRetrograde, currentPeriod, nextPeriod, daysUntilNext, daysRemaining });
  }

  function formatDate(dateStr: string): string {
    const d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }

  const copyText = result
    ? result.isRetrograde
      ? `Mercury Retrograde Status: IN RETROGRADE\nDate: ${dateInput}\nPeriod: ${result.currentPeriod?.start} to ${result.currentPeriod?.end}\nDays remaining: ${result.daysRemaining}`
      : `Mercury Retrograde Status: NOT in retrograde\nDate: ${dateInput}\nNext retrograde: ${result.nextPeriod?.start || 'N/A'}\nDays until next: ${result.daysUntilNext || 'N/A'}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-date`} className="block text-sm font-medium text-gray-700 mb-1">
          Select Date
        </label>
        <input
          id={`${toolId}-date`}
          type="date"
          value={dateInput}
          onChange={(e) => setDateInput(e.target.value)}
          aria-label={`Date to check for ${toolName}`}
          className="input-field w-48"
        />
      </InputArea>

      <button onClick={check} aria-label="Check Mercury retrograde" className="btn-primary">
        Check Retrograde
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-4">
            <div className={`p-6 rounded-lg border-2 text-center ${result.isRetrograde ? 'bg-red-50 border-red-300' : 'bg-green-50 border-green-300'}`}>
              <div className="text-4xl mb-2">{result.isRetrograde ? '☿ ℞' : '☿'}</div>
              <div className={`text-xl font-bold ${result.isRetrograde ? 'text-red-700' : 'text-green-700'}`}>
                {result.isRetrograde ? 'Mercury IS in Retrograde' : 'Mercury is NOT in Retrograde'}
              </div>
              {result.isRetrograde && result.currentPeriod && (
                <div className="text-sm text-red-600 mt-2">
                  {formatDate(result.currentPeriod.start)} — {formatDate(result.currentPeriod.end)}
                  <br />
                  <span className="font-medium">{result.daysRemaining} days remaining</span>
                </div>
              )}
              {!result.isRetrograde && result.nextPeriod && (
                <div className="text-sm text-green-600 mt-2">
                  Next retrograde: {formatDate(result.nextPeriod.start)}
                  <br />
                  <span className="font-medium">{result.daysUntilNext} days away</span>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Upcoming Retrograde Periods</h3>
              <div className="space-y-1">
                {RETROGRADE_PERIODS.filter((p) => new Date(p.end + 'T23:59:59') >= new Date(dateInput + 'T00:00:00')).slice(0, 5).map((period, idx) => (
                  <div key={idx} className="flex justify-between text-sm bg-gray-50 p-2 rounded border border-gray-200">
                    <span className="text-gray-700">{formatDate(period.start)}</span>
                    <span className="text-gray-400">→</span>
                    <span className="text-gray-700">{formatDate(period.end)}</span>
                  </div>
                ))}
              </div>
            </div>

            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
