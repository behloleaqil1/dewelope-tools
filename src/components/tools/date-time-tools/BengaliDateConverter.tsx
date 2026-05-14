'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * BengaliDateConverter - Convert Gregorian to Bengali calendar (Bangla calendar).
 */
export default function BengaliDateConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [result, setResult] = useState<{ bengaliDate: string; monthName: string; season: string; year: number } | null>(null);
  const [error, setError] = useState('');

  function gregorianToBengali(gy: number, gm: number, gd: number): [number, number, number] {
    // Bengali New Year starts April 14 (or 15 in leap years)
    // Bengali year = Gregorian year - 593 (if after April 14) or - 594
    const d = new Date(gy, gm - 1, gd);
    const newYear = new Date(gy, 3, 14); // April 14

    let bYear: number;
    let daysSinceNewYear: number;

    if (d >= newYear) {
      bYear = gy - 593;
      daysSinceNewYear = Math.floor((d.getTime() - newYear.getTime()) / (1000 * 60 * 60 * 24));
    } else {
      bYear = gy - 594;
      const prevNewYear = new Date(gy - 1, 3, 14);
      daysSinceNewYear = Math.floor((d.getTime() - prevNewYear.getTime()) / (1000 * 60 * 60 * 24));
    }

    // Bengali months: first 5 have 31 days, last 7 have 30 days
    const monthDays = [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30];
    let bMonth = 1;
    let remaining = daysSinceNewYear;

    for (let i = 0; i < 12; i++) {
      if (remaining < monthDays[i]) break;
      remaining -= monthDays[i];
      bMonth++;
    }
    const bDay = remaining + 1;

    return [bYear, bMonth, bDay];
  }

  function calculate() {
    setError('');
    setResult(null);
    const d = new Date(date);
    if (isNaN(d.getTime())) { setError('Please enter a valid date'); return; }

    const [bY, bM, bD] = gregorianToBengali(d.getFullYear(), d.getMonth() + 1, d.getDate());

    const months = ['Boishakh', 'Jyoishtho', 'Asharh', 'Shrabon', 'Bhadro', 'Ashwin', 'Kartik', 'Ogrohayon', 'Poush', 'Magh', 'Falgun', 'Choitro'];
    const seasons = ['Grishmo (Summer)', 'Grishmo (Summer)', 'Borsha (Monsoon)', 'Borsha (Monsoon)', 'Shorot (Autumn)', 'Shorot (Autumn)', 'Hemonto (Late Autumn)', 'Hemonto (Late Autumn)', 'Sheet (Winter)', 'Sheet (Winter)', 'Boshonto (Spring)', 'Boshonto (Spring)'];

    setResult({
      bengaliDate: `${bD} ${months[bM - 1]} ${bY}`,
      monthName: months[bM - 1] || 'Unknown',
      season: seasons[bM - 1] || 'Unknown',
      year: bY,
    });
  }

  const copyText = result ? `Bengali: ${result.bengaliDate}\nMonth: ${result.monthName}\nSeason: ${result.season}\nYear: ${result.year} BS` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-date`} className="block text-sm font-medium text-gray-700 mb-1">Gregorian Date</label>
        <input id={`${toolId}-date`} type="date" value={date} onChange={(e) => setDate(e.target.value)} aria-label={`Gregorian date for ${toolName}`} className="input-field w-48" />
      </InputArea>

      <button onClick={calculate} aria-label="Convert to Bengali calendar" className="btn-primary">Convert to Bengali</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-blue-600">{result.bengaliDate}</div>
              <div className="text-sm text-gray-600 mt-1">{result.season}</div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-50 p-3 rounded border border-gray-200">
                <div className="text-xs text-gray-500">Month</div>
                <div className="font-medium">{result.monthName}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded border border-gray-200">
                <div className="text-xs text-gray-500">Bengali Year</div>
                <div className="font-medium">{result.year} BS</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
