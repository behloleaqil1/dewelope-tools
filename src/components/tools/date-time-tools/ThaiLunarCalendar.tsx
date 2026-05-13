'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ThaiLunarCalendar - Convert Gregorian dates to Thai lunar calendar dates.
 */
export default function ThaiLunarCalendar({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString());
  const [day, setDay] = useState(new Date().getDate().toString());
  const [output, setOutput] = useState('');

  const thaiMonths = [
    'เดือนอ้าย (1)', 'เดือนยี่ (2)', 'เดือนสาม (3)', 'เดือนสี่ (4)',
    'เดือนห้า (5)', 'เดือนหก (6)', 'เดือนเจ็ด (7)', 'เดือนแปด (8)',
    'เดือนเก้า (9)', 'เดือนสิบ (10)', 'เดือนสิบเอ็ด (11)', 'เดือนสิบสอง (12)',
  ];

  const thaiDays = ['วันอาทิตย์', 'วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์'];
  const thaiDaysEn = ['Wan Athit', 'Wan Chan', 'Wan Angkhan', 'Wan Phut', 'Wan Pharuhat', 'Wan Suk', 'Wan Sao'];

  const calculate = () => {
    const y = parseInt(year);
    const m = parseInt(month);
    const d = parseInt(day);

    if (isNaN(y) || isNaN(m) || isNaN(d) || m < 1 || m > 12 || d < 1 || d > 31) {
      setOutput('Please enter a valid date.');
      return;
    }

    const date = new Date(y, m - 1, d);
    if (date.getMonth() !== m - 1) {
      setOutput('Invalid date for the given month.');
      return;
    }

    // Thai Buddhist Era year
    const beYear = y + 543;

    // Approximate lunar day (synodic month = 29.53 days)
    const synodicMonth = 29.53059;
    // Reference new moon: Jan 6, 2000
    const refNewMoon = new Date(2000, 0, 6).getTime();
    const daysSinceRef = (date.getTime() - refNewMoon) / 86400000;
    const lunarAge = ((daysSinceRef % synodicMonth) + synodicMonth) % synodicMonth;
    const lunarDay = Math.floor(lunarAge) + 1;

    // Waxing (ข้างขึ้น) or Waning (ข้างแรม)
    const isWaxing = lunarDay <= 15;
    const thaiLunarDay = isWaxing ? lunarDay : lunarDay - 15;
    const phase = isWaxing ? 'ข้างขึ้น (Waxing)' : 'ข้างแรม (Waning)';

    // Approximate Thai lunar month
    // Thai months are offset: month 1 starts around December
    const lunarMonthIndex = Math.floor(((daysSinceRef / synodicMonth) + 2) % 12);

    const dayOfWeek = date.getDay();

    const results = [
      '=== Thai Lunar Calendar Conversion ===',
      '',
      `Gregorian Date: ${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      `Buddhist Era (พ.ศ.): ${beYear}`,
      '',
      '--- Thai Lunar Date ---',
      '',
      `Thai Lunar Month: ${thaiMonths[lunarMonthIndex]}`,
      `Lunar Day: ${thaiLunarDay} ค่ำ ${phase}`,
      `Day of Week: ${thaiDays[dayOfWeek]} (${thaiDaysEn[dayOfWeek]})`,
      '',
      '--- Moon Phase ---',
      '',
      `Lunar Age: ${lunarAge.toFixed(1)} days`,
      `Phase: ${lunarDay <= 1 ? '🌑 New Moon' : lunarDay <= 7 ? '🌒 Waxing Crescent' : lunarDay <= 8 ? '🌓 First Quarter' : lunarDay <= 14 ? '🌔 Waxing Gibbous' : lunarDay <= 16 ? '🌕 Full Moon' : lunarDay <= 22 ? '🌖 Waning Gibbous' : lunarDay <= 23 ? '🌗 Last Quarter' : '🌘 Waning Crescent'}`,
      '',
      '--- Buddhist Observance Days (Wan Phra) ---',
      '',
      `${lunarDay === 8 || lunarDay === 15 ? '⭐ Today is a Wan Phra (Buddhist holy day)' : 'Not a Wan Phra today'}`,
      `Next Wan Phra: ${isWaxing ? (thaiLunarDay <= 8 ? `${8 - thaiLunarDay} days` : `${15 - thaiLunarDay} days`) : (thaiLunarDay <= 8 ? `${8 - thaiLunarDay} days` : `${15 - thaiLunarDay} days`)} (approx.)`,
      '',
      '--- Notes ---',
      '• Thai lunar calendar is based on Buddhist traditions',
      '• Wan Phra occurs on the 8th and 15th of each lunar fortnight',
      '• This is an approximation; official dates may vary',
    ];

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <input type="number" value={year} onChange={e => setYear(e.target.value)} className="input-field" aria-label="Year" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
              <input type="number" min={1} max={12} value={month} onChange={e => setMonth(e.target.value)} className="input-field" aria-label="Month" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
              <input type="number" min={1} max={31} value={day} onChange={e => setDay(e.target.value)} className="input-field" aria-label="Day" />
            </div>
          </div>

          <button onClick={calculate} className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium" aria-label={`Calculate ${toolName}`}>
            Convert to Thai Lunar Calendar
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Thai Lunar Calendar Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded border">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
