'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ThaiCalendarConverter - Convert between Gregorian and Thai Buddhist calendar.
 * Thai Buddhist Era (BE) is 543 years ahead of the Common Era (CE).
 */
export default function ThaiCalendarConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [direction, setDirection] = useState<'gregorian-to-thai' | 'thai-to-gregorian'>('gregorian-to-thai');
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('1');
  const [day, setDay] = useState('');
  const [result, setResult] = useState<{
    gregorianDate: string;
    thaiDate: string;
    thaiYear: number;
    gregorianYear: number;
    dayOfWeek: string;
    thaiMonthName: string;
  } | null>(null);
  const [error, setError] = useState('');

  const thaiMonths = [
    'มกราคม (Mokarakhom)', 'กุมภาพันธ์ (Kumphaphan)',
    'มีนาคม (Minakhom)', 'เมษายน (Mesayon)',
    'พฤษภาคม (Phruetsaphakhom)', 'มิถุนายน (Mithunayon)',
    'กรกฎาคม (Karakadakhom)', 'สิงหาคม (Singhakhom)',
    'กันยายน (Kanyayon)', 'ตุลาคม (Tulakhom)',
    'พฤศจิกายน (Phruetsachikayon)', 'ธันวาคม (Thanwakhom)',
  ];

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const convert = () => {
    setError('');
    const yearNum = parseInt(year);
    const monthNum = parseInt(month);
    const dayNum = parseInt(day);

    if (!year.trim() || isNaN(yearNum)) {
      setError('Please enter a valid year');
      setResult(null);
      return;
    }
    if (!day.trim() || isNaN(dayNum) || dayNum < 1 || dayNum > 31) {
      setError('Please enter a valid day (1-31)');
      setResult(null);
      return;
    }

    let gregorianYear: number;
    let thaiYear: number;

    if (direction === 'gregorian-to-thai') {
      gregorianYear = yearNum;
      thaiYear = yearNum + 543;
    } else {
      thaiYear = yearNum;
      gregorianYear = yearNum - 543;
    }

    // Validate the date
    const testDate = new Date(gregorianYear, monthNum - 1, dayNum);
    if (testDate.getDate() !== dayNum || testDate.getMonth() !== monthNum - 1) {
      setError('Invalid date for the given month/year');
      setResult(null);
      return;
    }

    const dayOfWeek = daysOfWeek[testDate.getDay()];
    const thaiMonthName = thaiMonths[monthNum - 1];

    setResult({
      gregorianDate: `${gregorianYear}-${String(monthNum).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`,
      thaiDate: `${dayNum} ${thaiMonthName} ${thaiYear}`,
      thaiYear,
      gregorianYear,
      dayOfWeek,
      thaiMonthName,
    });
  };

  const copyText = result
    ? `Gregorian: ${result.gregorianDate}\nThai Buddhist: ${result.thaiDate}\nBE Year: ${result.thaiYear}\nCE Year: ${result.gregorianYear}\nDay: ${result.dayOfWeek}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-1">Conversion Direction</label>
        <div className="flex gap-2">
          <button
            onClick={() => setDirection('gregorian-to-thai')}
            className={`px-4 py-2 rounded text-sm font-medium ${direction === 'gregorian-to-thai' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            aria-label="Gregorian to Thai"
          >
            Gregorian → Thai
          </button>
          <button
            onClick={() => setDirection('thai-to-gregorian')}
            className={`px-4 py-2 rounded text-sm font-medium ${direction === 'thai-to-gregorian' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            aria-label="Thai to Gregorian"
          >
            Thai → Gregorian
          </button>
        </div>
      </InputArea>

      <div className="grid grid-cols-3 gap-3">
        <InputArea error={error && !year.trim() ? error : ''}>
          <label htmlFor={`${toolId}-year`} className="block text-sm font-medium text-gray-700 mb-1">
            {direction === 'gregorian-to-thai' ? 'Year (CE)' : 'Year (BE)'}
          </label>
          <input
            id={`${toolId}-year`}
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder={direction === 'gregorian-to-thai' ? 'e.g. 2024' : 'e.g. 2567'}
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
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1} - {thaiMonths[i].split(' ')[0]}</option>
            ))}
          </select>
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-day`} className="block text-sm font-medium text-gray-700 mb-1">
            Day
          </label>
          <input
            id={`${toolId}-day`}
            type="number"
            min={1}
            max={31}
            value={day}
            onChange={(e) => setDay(e.target.value)}
            placeholder="1-31"
            aria-label={`Day for ${toolName}`}
            className="input-field"
          />
        </InputArea>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button onClick={convert} aria-label="Convert date" className="btn-primary">
        Convert
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-blue-600">{result.gregorianDate}</div>
                <div className="text-xs text-gray-500">Gregorian (CE {result.gregorianYear})</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-purple-600">BE {result.thaiYear}</div>
                <div className="text-xs text-gray-500">Thai Buddhist Era</div>
              </div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 space-y-1">
              <p className="text-sm text-blue-800"><strong>Thai Date:</strong> {result.thaiDate}</p>
              <p className="text-sm text-blue-800"><strong>Day of Week:</strong> {result.dayOfWeek}</p>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>

      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-1">About Thai Buddhist Calendar</h3>
        <p className="text-xs text-gray-600">
          The Thai Buddhist calendar (พุทธศักราช) is 543 years ahead of the Gregorian calendar. For example, 2024 CE = 2567 BE. It is the official calendar used in Thailand for civil purposes alongside the Gregorian calendar.
        </p>
      </div>
    </div>
  );
}
