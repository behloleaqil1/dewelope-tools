'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PunjabiCalendarConverter - Convert Gregorian to Punjabi/Nanakshahi variant.
 */
export default function PunjabiCalendarConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString());
  const [day, setDay] = useState(new Date().getDate().toString());
  const [output, setOutput] = useState('');

  const nanakshahiMonths = [
    { name: 'Chet', gurmukhi: 'ਚੇਤ', start: [3, 14] },
    { name: 'Vaisakh', gurmukhi: 'ਵੈਸਾਖ', start: [4, 14] },
    { name: 'Jeth', gurmukhi: 'ਜੇਠ', start: [5, 15] },
    { name: 'Harh', gurmukhi: 'ਹਾੜ', start: [6, 15] },
    { name: 'Sawan', gurmukhi: 'ਸਾਵਣ', start: [7, 16] },
    { name: 'Bhadon', gurmukhi: 'ਭਾਦੋਂ', start: [8, 16] },
    { name: 'Assu', gurmukhi: 'ਅੱਸੂ', start: [9, 15] },
    { name: 'Katak', gurmukhi: 'ਕੱਤਕ', start: [10, 15] },
    { name: 'Maghar', gurmukhi: 'ਮੱਘਰ', start: [11, 14] },
    { name: 'Poh', gurmukhi: 'ਪੋਹ', start: [12, 14] },
    { name: 'Magh', gurmukhi: 'ਮਾਘ', start: [1, 13] },
    { name: 'Phagan', gurmukhi: 'ਫੱਗਣ', start: [2, 12] },
  ];

  const convert = () => {
    const y = parseInt(year);
    const m = parseInt(month);
    const d = parseInt(day);

    if (isNaN(y) || isNaN(m) || isNaN(d) || m < 1 || m > 12 || d < 1 || d > 31) {
      setOutput('Please enter a valid date.');
      return;
    }

    // Nanakshahi epoch: 1469 CE (birth of Guru Nanak)
    const nanakshahiYear = y - 1469 + (m >= 3 && (m > 3 || d >= 14) ? 1 : 0);

    // Find current Nanakshahi month
    let currentMonth = nanakshahiMonths[11]; // default Phagan
    let dayInMonth = d;

    for (let i = 0; i < nanakshahiMonths.length; i++) {
      const [startMonth, startDay] = nanakshahiMonths[i].start;
      const nextIdx = (i + 1) % nanakshahiMonths.length;
      const [nextMonth, nextDay] = nanakshahiMonths[nextIdx].start;

      if (m === startMonth && d >= startDay) {
        if (nextMonth === startMonth) {
          if (d < nextDay) {
            currentMonth = nanakshahiMonths[i];
            dayInMonth = d - startDay + 1;
            break;
          }
        } else {
          currentMonth = nanakshahiMonths[i];
          dayInMonth = d - startDay + 1;
          break;
        }
      } else if (m === startMonth + 1 && nextMonth === m && d < nextDay) {
        currentMonth = nanakshahiMonths[i];
        const daysInPrevMonth = new Date(y, startMonth, 0).getDate();
        dayInMonth = (daysInPrevMonth - startDay) + d + 1;
        break;
      }
    }

    const lines: string[] = [
      `=== Punjabi (Nanakshahi) Calendar ===`,
      ``,
      `Gregorian Date: ${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      ``,
      `Nanakshahi Date:`,
      `  Year: ${nanakshahiYear} NS`,
      `  Month: ${currentMonth.name} (${currentMonth.gurmukhi})`,
      `  Day: ${dayInMonth}`,
      ``,
      `Full Date: ${dayInMonth} ${currentMonth.name} ${nanakshahiYear} NS`,
      `Gurmukhi: ${dayInMonth} ${currentMonth.gurmukhi} ${nanakshahiYear}`,
      ``,
      `About Nanakshahi Calendar:`,
      `  • Epoch: 1469 CE (birth of Guru Nanak Dev Ji)`,
      `  • Solar calendar with fixed month lengths`,
      `  • First month: Chet (starts March 14)`,
      `  • Used by Sikh community worldwide`,
    ];
    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor={`${toolId}-year`} className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <input id={`${toolId}-year`} type="number" value={year} onChange={(e) => setYear(e.target.value)} aria-label={`Year for ${toolName}`} className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-month`} className="block text-sm font-medium text-gray-700 mb-1">Month</label>
              <input id={`${toolId}-month`} type="number" min="1" max="12" value={month} onChange={(e) => setMonth(e.target.value)} aria-label="Month" className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-day`} className="block text-sm font-medium text-gray-700 mb-1">Day</label>
              <input id={`${toolId}-day`} type="number" min="1" max="31" value={day} onChange={(e) => setDay(e.target.value)} aria-label="Day" className="input-field" />
            </div>
          </div>
          <button onClick={convert} className="btn-primary">Convert to Nanakshahi</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Nanakshahi Calendar Date</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
