'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * IslamicCalendarConverter - Convert between Gregorian and Islamic/Hijri calendar.
 * Uses the Tabular Islamic calendar algorithm for date conversion.
 */
export default function IslamicCalendarConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString());
  const [day, setDay] = useState(new Date().getDate().toString());
  const [direction, setDirection] = useState<'toHijri' | 'toGregorian'>('toHijri');
  const [output, setOutput] = useState('');

  const hijriMonths = [
    'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
    'Jumada al-Ula', 'Jumada al-Thani', 'Rajab', 'Shaban',
    'Ramadan', 'Shawwal', 'Dhul Qadah', 'Dhul Hijjah',
  ];

  const gregorianToJdn = (y: number, m: number, d: number): number => {
    const a = Math.floor((14 - m) / 12);
    const yAdj = y + 4800 - a;
    const mAdj = m + 12 * a - 3;
    return d + Math.floor((153 * mAdj + 2) / 5) + 365 * yAdj + Math.floor(yAdj / 4) - Math.floor(yAdj / 100) + Math.floor(yAdj / 400) - 32045;
  };

  const jdnToGregorian = (jdn: number): { y: number; m: number; d: number } => {
    const a = jdn + 32044;
    const b = Math.floor((4 * a + 3) / 146097);
    const c = a - Math.floor(146097 * b / 4);
    const d2 = Math.floor((4 * c + 3) / 1461);
    const e = c - Math.floor(1461 * d2 / 4);
    const m = Math.floor((5 * e + 2) / 153);
    const day = e - Math.floor((153 * m + 2) / 5) + 1;
    const month = m + 3 - 12 * Math.floor(m / 10);
    const year = 100 * b + d2 - 4800 + Math.floor(m / 10);
    return { y: year, m: month, d: day };
  };

  const hijriToJdn = (y: number, m: number, d: number): number => {
    return Math.floor((11 * y + 3) / 30) + 354 * y + 30 * m - Math.floor((m - 1) / 2) + d + 1948440 - 385;
  };

  const jdnToHijri = (jdn: number): { y: number; m: number; d: number } => {
    const l = jdn - 1948440 + 10632;
    const n = Math.floor((l - 1) / 10631);
    const lAdj = l - 10631 * n + 354;
    const j = Math.floor((10985 - lAdj) / 5316) * Math.floor((50 * lAdj) / 17719) + Math.floor(lAdj / 5670) * Math.floor((43 * lAdj) / 15238);
    const lFinal = lAdj - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
    const m = Math.floor((24 * lFinal) / 709);
    const d = lFinal - Math.floor((709 * m) / 24);
    const y = 30 * n + j - 30;
    return { y, m, d };
  };

  const isHijriLeapYear = (y: number): boolean => {
    return ((11 * y + 14) % 30) < 11;
  };

  const convert = () => {
    const y = parseInt(year);
    const m = parseInt(month);
    const d = parseInt(day);

    if (isNaN(y) || isNaN(m) || isNaN(d) || m < 1 || m > 12 || d < 1 || d > 31) {
      setOutput('Please enter a valid date.');
      return;
    }

    if (direction === 'toHijri') {
      const jdn = gregorianToJdn(y, m, d);
      const hijri = jdnToHijri(jdn);
      const leap = isHijriLeapYear(hijri.y);

      const result = [
        `Gregorian Date: ${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
        '',
        `Islamic (Hijri) Date:`,
        `  Day: ${hijri.d}`,
        `  Month: ${hijriMonths[hijri.m - 1]} (${hijri.m})`,
        `  Year: ${hijri.y} AH`,
        `  Full: ${hijri.d} ${hijriMonths[hijri.m - 1]} ${hijri.y} AH`,
        '',
        `Year Info:`,
        `  Leap Year: ${leap ? 'Yes (30 days in Dhul Hijjah)' : 'No (29 days in Dhul Hijjah)'}`,
        `  Year Length: ${leap ? '355' : '354'} days`,
        '',
        `Note: This uses the Tabular Islamic calendar (arithmetic).`,
        `Actual dates may vary by 1-2 days based on moon sighting.`,
      ].join('\n');

      setOutput(result);
    } else {
      if (m > 12 || d > 30) {
        setOutput('Hijri months have at most 30 days.');
        return;
      }

      const jdn = hijriToJdn(y, m, d);
      const greg = jdnToGregorian(jdn);
      const leap = isHijriLeapYear(y);

      const result = [
        `Islamic (Hijri) Date: ${d} ${hijriMonths[m - 1]} ${y} AH`,
        '',
        `Gregorian Date:`,
        `  Day: ${greg.d}`,
        `  Month: ${greg.m}`,
        `  Year: ${greg.y}`,
        `  Full: ${greg.y}-${String(greg.m).padStart(2, '0')}-${String(greg.d).padStart(2, '0')}`,
        '',
        `Hijri Year Info:`,
        `  Leap Year: ${leap ? 'Yes (30 days in Dhul Hijjah)' : 'No (29 days in Dhul Hijjah)'}`,
        `  Year Length: ${leap ? '355' : '354'} days`,
        '',
        `Note: This uses the Tabular Islamic calendar (arithmetic).`,
        `Actual dates may vary by 1-2 days based on moon sighting.`,
      ].join('\n');

      setOutput(result);
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-1">Conversion Direction</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" checked={direction === 'toHijri'} onChange={() => setDirection('toHijri')} className="text-blue-600" />
            <span className="text-sm">Gregorian → Hijri</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" checked={direction === 'toGregorian'} onChange={() => setDirection('toGregorian')} className="text-blue-600" />
            <span className="text-sm">Hijri → Gregorian</span>
          </label>
        </div>
      </InputArea>

      <div className="grid grid-cols-3 gap-3">
        <InputArea>
          <label htmlFor={`${toolId}-year`} className="block text-sm font-medium text-gray-700 mb-1">Year</label>
          <input
            id={`${toolId}-year`}
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder={direction === 'toHijri' ? '2024' : '1446'}
            aria-label={`Year for ${toolName}`}
            className="input-field"
          />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-month`} className="block text-sm font-medium text-gray-700 mb-1">Month</label>
          <input
            id={`${toolId}-month`}
            type="number"
            min="1"
            max="12"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            placeholder="1"
            aria-label={`Month for ${toolName}`}
            className="input-field"
          />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-day`} className="block text-sm font-medium text-gray-700 mb-1">Day</label>
          <input
            id={`${toolId}-day`}
            type="number"
            min="1"
            max="31"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            placeholder="1"
            aria-label={`Day for ${toolName}`}
            className="input-field"
          />
        </InputArea>
      </div>

      {direction === 'toHijri' && (
        <button onClick={() => { const now = new Date(); setYear(now.getFullYear().toString()); setMonth((now.getMonth() + 1).toString()); setDay(now.getDate().toString()); }} className="text-sm text-blue-600 hover:text-blue-800">
          Use Today
        </button>
      )}

      <button onClick={convert} aria-label="Convert calendar date" className="btn-primary">
        Convert
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Conversion Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
