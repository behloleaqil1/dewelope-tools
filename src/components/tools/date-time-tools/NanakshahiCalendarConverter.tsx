'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * NanakshahiCalendarConverter - Convert Gregorian to Sikh Nanakshahi calendar.
 */
export default function NanakshahiCalendarConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString());
  const [day, setDay] = useState(new Date().getDate().toString());
  const [direction, setDirection] = useState('toNanakshahi');
  const [output, setOutput] = useState('');

  const nanakshahiMonths = [
    { name: 'Chet', days: 31, gregStart: { month: 3, day: 14 } },
    { name: 'Vaisakh', days: 31, gregStart: { month: 4, day: 14 } },
    { name: 'Jeth', days: 31, gregStart: { month: 5, day: 15 } },
    { name: 'Harh', days: 31, gregStart: { month: 6, day: 15 } },
    { name: 'Sawan', days: 31, gregStart: { month: 7, day: 16 } },
    { name: 'Bhadon', days: 30, gregStart: { month: 8, day: 16 } },
    { name: 'Assu', days: 30, gregStart: { month: 9, day: 15 } },
    { name: 'Katak', days: 30, gregStart: { month: 10, day: 15 } },
    { name: 'Maghar', days: 30, gregStart: { month: 11, day: 14 } },
    { name: 'Poh', days: 30, gregStart: { month: 12, day: 14 } },
    { name: 'Magh', days: 30, gregStart: { month: 1, day: 13 } },
    { name: 'Phagan', days: 30, gregStart: { month: 2, day: 12 } },
  ];

  const convert = () => {
    const y = parseInt(year);
    const m = parseInt(month);
    const d = parseInt(day);

    if (isNaN(y) || isNaN(m) || isNaN(d) || m < 1 || m > 12 || d < 1 || d > 31) {
      setOutput('Please enter a valid date.');
      return;
    }

    if (direction === 'toNanakshahi') {
      // Nanakshahi epoch: 1 Chet 1 = March 14, 1469 CE
      // Nanakshahi year = Gregorian year - 1469 (after March 14)
      // Before March 14, it's still the previous Nanakshahi year
      const gregDate = new Date(y, m - 1, d);
      const marchEquinox = new Date(y, 2, 14); // March 14

      let nYear: number;
      if (gregDate >= marchEquinox) {
        nYear = y - 1468;
      } else {
        nYear = y - 1469;
      }

      // Find which Nanakshahi month this date falls in
      let nMonth = '';
      let nDay = 0;

      for (let i = 0; i < nanakshahiMonths.length; i++) {
        const nm = nanakshahiMonths[i];
        let startYear = y;
        if (nm.gregStart.month <= 2) {
          // Jan/Feb months belong to the next Nanakshahi year cycle
          startYear = y;
        }
        const startDate = new Date(startYear, nm.gregStart.month - 1, nm.gregStart.day);
        const endDate = new Date(startDate.getTime() + (nm.days - 1) * 86400000);

        if (gregDate >= startDate && gregDate <= endDate) {
          nMonth = nm.name;
          nDay = Math.floor((gregDate.getTime() - startDate.getTime()) / 86400000) + 1;
          break;
        }
      }

      if (!nMonth) {
        nMonth = 'Phagan';
        nDay = d;
      }

      const result = `Gregorian to Nanakshahi Conversion
=====================================

Input (Gregorian):
  Date: ${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}

Output (Nanakshahi):
  Date: ${nDay} ${nMonth} ${nYear} NS
  Year: ${nYear} Nanakshahi Samvat

Calendar Information:
  • The Nanakshahi calendar was formalized in 2003
  • Epoch: Birth of Guru Nanak Dev Ji (1469 CE)
  • New Year (1 Chet): March 14
  • Based on tropical solar year
  • Used by the Sikh community worldwide`;

      setOutput(result);
    } else {
      // Nanakshahi to Gregorian
      const gregYear = y + 1468;
      const monthIndex = m - 1;

      if (monthIndex < 0 || monthIndex >= 12) {
        setOutput('Please enter a valid Nanakshahi month (1-12).');
        return;
      }

      const nm = nanakshahiMonths[monthIndex];
      let startYear = gregYear;
      if (nm.gregStart.month <= 2) {
        startYear = gregYear + 1;
      }

      const startDate = new Date(startYear, nm.gregStart.month - 1, nm.gregStart.day);
      const targetDate = new Date(startDate.getTime() + (d - 1) * 86400000);

      const result = `Nanakshahi to Gregorian Conversion
=====================================

Input (Nanakshahi):
  Date: ${d} ${nm.name} ${y} NS

Output (Gregorian):
  Date: ${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}-${String(targetDate.getDate()).padStart(2, '0')}

Calendar Information:
  • Nanakshahi Month: ${nm.name} (${nm.days} days)
  • Gregorian Year: ${targetDate.getFullYear()} CE
  • The Nanakshahi calendar is a solar calendar
  • 5 months of 31 days, 7 months of 30 days`;

      setOutput(result);
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label htmlFor={`${toolId}-direction`} className="block text-sm font-medium text-gray-700 mb-1">Conversion Direction</label>
            <select id={`${toolId}-direction`} value={direction} onChange={(e) => setDirection(e.target.value)} className="input-field" aria-label={`Conversion direction for ${toolName}`}>
              <option value="toNanakshahi">Gregorian → Nanakshahi</option>
              <option value="toGregorian">Nanakshahi → Gregorian</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-year`} className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <input id={`${toolId}-year`} type="number" value={year} onChange={(e) => setYear(e.target.value)} className="input-field" aria-label="Year" />
          </div>
          <div>
            <label htmlFor={`${toolId}-month`} className="block text-sm font-medium text-gray-700 mb-1">Month (1-12)</label>
            <input id={`${toolId}-month`} type="number" min="1" max="12" value={month} onChange={(e) => setMonth(e.target.value)} className="input-field" aria-label="Month" />
          </div>
          <div>
            <label htmlFor={`${toolId}-day`} className="block text-sm font-medium text-gray-700 mb-1">Day</label>
            <input id={`${toolId}-day`} type="number" min="1" max="31" value={day} onChange={(e) => setDay(e.target.value)} className="input-field" aria-label="Day" />
          </div>
        </div>
        <button onClick={convert} className="btn-primary mt-4">Convert Date</button>
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
