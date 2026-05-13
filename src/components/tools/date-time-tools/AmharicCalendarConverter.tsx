'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * AmharicCalendarConverter - Convert Gregorian dates to Amharic/Ethiopian calendar variant.
 * The Ethiopian calendar is 7-8 years behind the Gregorian calendar and has 13 months.
 */
export default function AmharicCalendarConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString());
  const [day, setDay] = useState(new Date().getDate().toString());
  const [output, setOutput] = useState('');

  const amharicMonths = [
    'Meskerem', 'Tikimt', 'Hidar', 'Tahsas', 'Tir',
    'Yekatit', 'Megabit', 'Miazia', 'Ginbot', 'Sene',
    'Hamle', 'Nehase', 'Pagume'
  ];

  const amharicDays = ['Ehud', 'Segno', 'Maksegno', 'Rob', 'Hamus', 'Arb', 'Kidame'];

  const convert = () => {
    const y = parseInt(year);
    const m = parseInt(month);
    const d = parseInt(day);

    if (isNaN(y) || isNaN(m) || isNaN(d) || m < 1 || m > 12 || d < 1 || d > 31) {
      setOutput('Please enter a valid Gregorian date.');
      return;
    }

    // Calculate Julian Day Number
    const a = Math.floor((14 - m) / 12);
    const yy = y + 4800 - a;
    const mm = m + 12 * a - 3;
    const jdn = d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;

    // Convert JDN to Ethiopian calendar
    const ethEpoch = 1723856; // JDN of Ethiopian epoch (Aug 29, 8 AD Julian)
    const daysSinceEpoch = jdn - ethEpoch;
    const ethYear = Math.floor((4 * daysSinceEpoch + 1463) / 1461);
    const startOfYear = ethEpoch + 365 * (ethYear - 1) + Math.floor(ethYear / 4);
    const dayOfYear = jdn - startOfYear;
    const ethMonth = Math.floor(dayOfYear / 30) + 1;
    const ethDay = (dayOfYear % 30) + 1;

    // Day of week
    const date = new Date(y, m - 1, d);
    const dayOfWeek = date.getDay();
    const amharicDay = amharicDays[dayOfWeek];
    const ethMonthName = amharicMonths[Math.min(ethMonth - 1, 12)];

    const result = `Amharic/Ethiopian Calendar Conversion
════════════════════════════════════════

Gregorian Date:    ${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}

Ethiopian Date:
────────────────────────────────────────
  Year:   ${ethYear} (ዓ.ም.)
  Month:  ${ethMonthName} (Month ${ethMonth})
  Day:    ${ethDay}
  Day of Week: ${amharicDay}
────────────────────────────────────────

Full Date: ${ethDay} ${ethMonthName} ${ethYear}

Ethiopian Months:
  1. Meskerem (Sep 11 - Oct 10)
  2. Tikimt (Oct 11 - Nov 9)
  3. Hidar (Nov 10 - Dec 9)
  4. Tahsas (Dec 10 - Jan 8)
  5. Tir (Jan 9 - Feb 7)
  6. Yekatit (Feb 8 - Mar 9)
  7. Megabit (Mar 10 - Apr 8)
  8. Miazia (Apr 9 - May 8)
  9. Ginbot (May 9 - Jun 7)
  10. Sene (Jun 8 - Jul 7)
  11. Hamle (Jul 8 - Aug 6)
  12. Nehase (Aug 7 - Sep 5)
  13. Pagume (Sep 6 - Sep 10, 5-6 days)

Note: The Ethiopian calendar is ~7-8 years behind the Gregorian calendar.`;

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor={`${toolId}-year`} className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <input id={`${toolId}-year`} type="number" value={year} onChange={(e) => setYear(e.target.value)} className="input-field" aria-label={`Year for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-month`} className="block text-sm font-medium text-gray-700 mb-1">Month (1-12)</label>
            <input id={`${toolId}-month`} type="number" min={1} max={12} value={month} onChange={(e) => setMonth(e.target.value)} className="input-field" aria-label="Month" />
          </div>
          <div>
            <label htmlFor={`${toolId}-day`} className="block text-sm font-medium text-gray-700 mb-1">Day (1-31)</label>
            <input id={`${toolId}-day`} type="number" min={1} max={31} value={day} onChange={(e) => setDay(e.target.value)} className="input-field" aria-label="Day" />
          </div>
        </div>
        <button onClick={convert} className="btn-primary mt-4">Convert to Amharic Calendar</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Conversion Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
