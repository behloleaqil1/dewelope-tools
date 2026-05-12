'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CopticCalendarConverter - Convert between Gregorian and Coptic calendar dates.
 * The Coptic calendar is based on the ancient Egyptian calendar, with year 1 starting at 284 AD.
 */
export default function CopticCalendarConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [direction, setDirection] = useState<'gregorian-to-coptic' | 'coptic-to-gregorian'>('gregorian-to-coptic');
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('1');
  const [day, setDay] = useState('');
  const [result, setResult] = useState<{ date: string; details: string } | null>(null);

  const copticMonths = [
    'Thout', 'Paopi', 'Hathor', 'Koiak', 'Tobi', 'Meshir',
    'Paremhat', 'Parmouti', 'Pashons', 'Paoni', 'Epip', 'Mesori', 'Pi Kogi Enavot',
  ];

  const gregorianMonths = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  // Julian Day Number from Gregorian date
  const gregorianToJDN = (y: number, m: number, d: number): number => {
    const a = Math.floor((14 - m) / 12);
    const yy = y + 4800 - a;
    const mm = m + 12 * a - 3;
    return d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;
  };

  // JDN to Gregorian date
  const jdnToGregorian = (jdn: number): { year: number; month: number; day: number } => {
    const a = jdn + 32044;
    const b = Math.floor((4 * a + 3) / 146097);
    const c = a - Math.floor(146097 * b / 4);
    const d2 = Math.floor((4 * c + 3) / 1461);
    const e = c - Math.floor(1461 * d2 / 4);
    const m = Math.floor((5 * e + 2) / 153);
    const day2 = e - Math.floor((153 * m + 2) / 5) + 1;
    const month2 = m + 3 - 12 * Math.floor(m / 10);
    const year2 = 100 * b + d2 - 4800 + Math.floor(m / 10);
    return { year: year2, month: month2, day: day2 };
  };

  // Coptic date to JDN
  const copticToJDN = (y: number, m: number, d: number): number => {
    // Coptic epoch: August 29, 284 AD (Julian) = JDN 1825030
    return 1824665 + 365 * (y - 1) + Math.floor(y / 4) + 30 * (m - 1) + d;
  };

  // JDN to Coptic date
  const jdnToCoptic = (jdn: number): { year: number; month: number; day: number } => {
    const y = Math.floor((4 * (jdn - 1824665) + 1463) / 1461);
    const m = Math.floor((jdn - copticToJDN(y, 1, 1)) / 30) + 1;
    const d = jdn - copticToJDN(y, m, 1) + 1;
    return { year: y, month: Math.min(m, 13), day: d };
  };

  const convert = () => {
    const y = parseInt(year);
    const m = parseInt(month);
    const d = parseInt(day);

    if (isNaN(y) || isNaN(m) || isNaN(d) || d < 1 || d > 30) {
      setResult(null);
      return;
    }

    if (direction === 'gregorian-to-coptic') {
      if (m < 1 || m > 12 || d > 31) {
        setResult(null);
        return;
      }
      const jdn = gregorianToJDN(y, m, d);
      const coptic = jdnToCoptic(jdn);
      const monthName = copticMonths[coptic.month - 1] || 'Unknown';
      setResult({
        date: `${coptic.day} ${monthName} ${coptic.year} AM`,
        details: `Gregorian: ${d} ${gregorianMonths[m - 1]} ${y} → Coptic: ${coptic.day} ${monthName} ${coptic.year} AM (Anno Martyrum)`,
      });
    } else {
      if (m < 1 || m > 13) {
        setResult(null);
        return;
      }
      const jdn = copticToJDN(y, m, d);
      const greg = jdnToGregorian(jdn);
      const monthName = copticMonths[m - 1] || 'Unknown';
      setResult({
        date: `${greg.day} ${gregorianMonths[greg.month - 1]} ${greg.year}`,
        details: `Coptic: ${d} ${monthName} ${y} AM → Gregorian: ${greg.day} ${gregorianMonths[greg.month - 1]} ${greg.year}`,
      });
    }
  };

  const copyText = result ? result.details : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="flex gap-4 mb-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name={`${toolId}-dir`}
            checked={direction === 'gregorian-to-coptic'}
            onChange={() => setDirection('gregorian-to-coptic')}
          />
          Gregorian → Coptic
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name={`${toolId}-dir`}
            checked={direction === 'coptic-to-gregorian'}
            onChange={() => setDirection('coptic-to-gregorian')}
          />
          Coptic → Gregorian
        </label>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <InputArea>
          <label htmlFor={`${toolId}-year`} className="block text-sm font-medium text-gray-700 mb-1">
            Year
          </label>
          <input
            id={`${toolId}-year`}
            type="text"
            inputMode="numeric"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder={direction === 'gregorian-to-coptic' ? 'e.g., 2024' : 'e.g., 1740'}
            aria-label={`Year for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-month`} className="block text-sm font-medium text-gray-700 mb-1">
            Month
          </label>
          <select
            id={`${toolId}-month`}
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            aria-label={`Month for ${toolName}`}
            className="input-field"
          >
            {direction === 'gregorian-to-coptic'
              ? gregorianMonths.map((m, i) => <option key={i} value={i + 1}>{m}</option>)
              : copticMonths.map((m, i) => <option key={i} value={i + 1}>{m}</option>)
            }
          </select>
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-day`} className="block text-sm font-medium text-gray-700 mb-1">
            Day
          </label>
          <input
            id={`${toolId}-day`}
            type="text"
            inputMode="numeric"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            placeholder="e.g., 15"
            aria-label={`Day for ${toolName}`}
            className="input-field"
          />
        </InputArea>
      </div>

      <button onClick={convert} aria-label="Convert date" className="btn-primary">
        Convert
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-xl font-bold text-blue-600">{result.date}</div>
              <div className="text-xs text-gray-500 mt-2">{result.details}</div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
