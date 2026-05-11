'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * AgeInDaysCalculator - Calculates your age in days, hours, minutes, and seconds from your birth date.
 */
export default function AgeInDaysCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [birthDate, setBirthDate] = useState('');
  const [result, setResult] = useState<{ days: number; hours: number; minutes: number; seconds: number; weeks: number; months: number; nextBirthday: number } | null>(null);
  const [error, setError] = useState<string | undefined>();

  function calculate() {
    setError(undefined);
    setResult(null);

    if (!birthDate) { setError('Please select your birth date'); return; }

    const birth = new Date(birthDate);
    const now = new Date();

    if (birth > now) { setError('Birth date cannot be in the future'); return; }

    const diffMs = now.getTime() - birth.getTime();
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor(diffMs / (1000 * 60));
    const seconds = Math.floor(diffMs / 1000);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30.44);

    // Next birthday
    const nextBday = new Date(birth);
    nextBday.setFullYear(now.getFullYear());
    if (nextBday <= now) nextBday.setFullYear(now.getFullYear() + 1);
    const daysUntilBday = Math.ceil((nextBday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    setResult({ days, hours, minutes, seconds, weeks, months, nextBirthday: daysUntilBday });
  }

  const copyText = result ? `Age in days: ${result.days.toLocaleString()}\nAge in hours: ${result.hours.toLocaleString()}\nAge in minutes: ${result.minutes.toLocaleString()}\nAge in seconds: ${result.seconds.toLocaleString()}\nWeeks alive: ${result.weeks.toLocaleString()}\nMonths alive: ${result.months.toLocaleString()}\nDays until next birthday: ${result.nextBirthday}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-date`} className="block text-sm font-medium text-gray-700 mb-1">Your birth date for {toolName}</label>
        <input id={`${toolId}-date`} type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} aria-label="Birth date" className="input-field" />
      </InputArea>

      <button onClick={calculate} aria-label="Calculate age in days" className="btn-primary">Calculate</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-center">
                <div className="text-xl font-bold text-blue-600">{result.days.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Days</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200 text-center">
                <div className="text-xl font-bold text-green-600">{result.hours.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Hours</div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200 text-center">
                <div className="text-xl font-bold text-purple-600">{result.minutes.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Minutes</div>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 text-center">
                <div className="text-xl font-bold text-orange-600">{result.seconds.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Seconds</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-700">{result.weeks.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Weeks</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-700">{result.months.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Months</div>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 text-center">
                <div className="text-lg font-bold text-yellow-600">{result.nextBirthday}</div>
                <div className="text-xs text-gray-500">Days to Birthday</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
