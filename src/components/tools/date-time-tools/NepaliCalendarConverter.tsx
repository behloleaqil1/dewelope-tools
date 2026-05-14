'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * NepaliCalendarConverter - Convert Gregorian to Nepali Bikram Sambat calendar.
 */
export default function NepaliCalendarConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [result, setResult] = useState<{ bsDate: string; monthName: string; year: number } | null>(null);
  const [error, setError] = useState('');

  function gregorianToBS(gy: number, gm: number, gd: number): [number, number, number] {
    // Approximate conversion: BS year = Gregorian year + 56 or 57
    // The Nepali new year starts around April 14
    const d = new Date(gy, gm - 1, gd);
    const newYearApprox = new Date(gy, 3, 14); // April 14

    let bsYear: number;
    if (d >= newYearApprox) {
      bsYear = gy + 57;
    } else {
      bsYear = gy + 56;
    }

    // Approximate month/day calculation
    // BS months have varying days (29-32), simplified approximation
    const bsMonthDays = [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30];
    const bsNewYear = new Date(gy, 3, 14);
    let daysSinceNewYear: number;

    if (d >= bsNewYear) {
      daysSinceNewYear = Math.floor((d.getTime() - bsNewYear.getTime()) / (1000 * 60 * 60 * 24));
    } else {
      const prevBsNewYear = new Date(gy - 1, 3, 14);
      daysSinceNewYear = Math.floor((d.getTime() - prevBsNewYear.getTime()) / (1000 * 60 * 60 * 24));
    }

    let bsMonth = 1;
    let remaining = daysSinceNewYear;
    for (let i = 0; i < 12; i++) {
      if (remaining < bsMonthDays[i]) break;
      remaining -= bsMonthDays[i];
      bsMonth++;
    }
    const bsDay = remaining + 1;

    return [bsYear, bsMonth, bsDay];
  }

  function calculate() {
    setError('');
    setResult(null);
    const d = new Date(date);
    if (isNaN(d.getTime())) { setError('Please enter a valid date'); return; }

    const [bsY, bsM, bsD] = gregorianToBS(d.getFullYear(), d.getMonth() + 1, d.getDate());

    const months = ['Baisakh', 'Jestha', 'Ashadh', 'Shrawan', 'Bhadra', 'Ashwin', 'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra'];

    setResult({
      bsDate: `${bsY}/${bsM.toString().padStart(2, '0')}/${bsD.toString().padStart(2, '0')}`,
      monthName: months[bsM - 1] || 'Unknown',
      year: bsY,
    });
  }

  const copyText = result ? `Bikram Sambat: ${result.bsDate}\nMonth: ${result.monthName}\nYear: ${result.year} BS` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-date`} className="block text-sm font-medium text-gray-700 mb-1">Gregorian Date</label>
        <input id={`${toolId}-date`} type="date" value={date} onChange={(e) => setDate(e.target.value)} aria-label={`Gregorian date for ${toolName}`} className="input-field w-48" />
      </InputArea>

      <button onClick={calculate} aria-label="Convert to Nepali Bikram Sambat" className="btn-primary">Convert to BS</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-blue-600 font-mono">{result.bsDate}</div>
              <div className="text-sm text-gray-600 mt-1">{result.monthName}, {result.year} BS</div>
            </div>
            <p className="text-xs text-gray-500">Note: This is an approximation. Nepali calendar months vary in length each year.</p>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
