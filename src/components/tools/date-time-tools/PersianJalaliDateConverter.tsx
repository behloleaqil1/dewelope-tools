'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PersianJalaliDateConverter - Convert Gregorian to Persian/Jalali calendar.
 */
export default function PersianJalaliDateConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [result, setResult] = useState<{ jalali: string; dayName: string; monthName: string } | null>(null);
  const [error, setError] = useState('');

  function gregorianToJalali(gy: number, gm: number, gd: number): [number, number, number] {
    const gDaysInMonth = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    const gy2 = gm > 2 ? gy + 1 : gy;
    let days = 355666 + (365 * gy) + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) + Math.floor((gy2 + 399) / 400) + gd + gDaysInMonth[gm - 1];
    let jy = -1595 + (33 * Math.floor(days / 12053));
    days %= 12053;
    jy += 4 * Math.floor(days / 1461);
    days %= 1461;
    if (days > 365) {
      jy += Math.floor((days - 1) / 365);
      days = (days - 1) % 365;
    }
    let jm: number, jd: number;
    if (days < 186) {
      jm = 1 + Math.floor(days / 31);
      jd = 1 + (days % 31);
    } else {
      jm = 7 + Math.floor((days - 186) / 30);
      jd = 1 + ((days - 186) % 30);
    }
    return [jy, jm, jd];
  }

  function calculate() {
    setError('');
    setResult(null);
    const d = new Date(date);
    if (isNaN(d.getTime())) { setError('Please enter a valid date'); return; }

    const [jy, jm, jd] = gregorianToJalali(d.getFullYear(), d.getMonth() + 1, d.getDate());

    const months = ['Farvardin', 'Ordibehesht', 'Khordad', 'Tir', 'Mordad', 'Shahrivar', 'Mehr', 'Aban', 'Azar', 'Dey', 'Bahman', 'Esfand'];
    const days = ['Yekshanbeh', 'Doshanbeh', 'Seshanbeh', 'Chaharshanbeh', 'Panjshanbeh', 'Jomeh', 'Shanbeh'];
    const dayIndex = d.getDay();

    setResult({
      jalali: `${jy}/${jm.toString().padStart(2, '0')}/${jd.toString().padStart(2, '0')}`,
      dayName: days[dayIndex],
      monthName: months[jm - 1],
    });
  }

  const copyText = result ? `Jalali: ${result.jalali}\nMonth: ${result.monthName}\nDay: ${result.dayName}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-date`} className="block text-sm font-medium text-gray-700 mb-1">Gregorian Date</label>
        <input id={`${toolId}-date`} type="date" value={date} onChange={(e) => setDate(e.target.value)} aria-label={`Gregorian date for ${toolName}`} className="input-field w-48" />
      </InputArea>

      <button onClick={calculate} aria-label="Convert to Persian Jalali" className="btn-primary">Convert to Jalali</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-blue-600 font-mono">{result.jalali}</div>
              <div className="text-sm text-gray-600 mt-1">{result.dayName}, {result.monthName}</div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
