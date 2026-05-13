'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * EgyptianCalendarConverter - Convert Gregorian dates to the ancient Egyptian civil calendar.
 * The Egyptian civil calendar had 12 months of 30 days plus 5 epagomenal days.
 */
export default function EgyptianCalendarConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [year, setYear] = useState('2024');
  const [month, setMonth] = useState('1');
  const [day, setDay] = useState('1');
  const [output, setOutput] = useState('');

  const months = [
    'Thoth', 'Phaophi', 'Athyr', 'Choiak', 'Tybi', 'Mechir',
    'Phamenoth', 'Pharmuthi', 'Pachons', 'Payni', 'Epiphi', 'Mesore',
  ];

  const seasons = [
    { name: 'Akhet (Inundation)', months: [0, 1, 2, 3] },
    { name: 'Peret (Growth)', months: [4, 5, 6, 7] },
    { name: 'Shemu (Harvest)', months: [8, 9, 10, 11] },
  ];

  const calculate = () => {
    const y = parseInt(year);
    const m = parseInt(month);
    const d = parseInt(day);

    if (isNaN(y) || isNaN(m) || isNaN(d) || m < 1 || m > 12 || d < 1 || d > 31) {
      setOutput('Please enter a valid date.');
      return;
    }

    // Calculate Julian Day Number from Gregorian
    const a = Math.floor((14 - m) / 12);
    const yAdj = y + 4800 - a;
    const mAdj = m + 12 * a - 3;
    const jdn = d + Math.floor((153 * mAdj + 2) / 5) + 365 * yAdj +
      Math.floor(yAdj / 4) - Math.floor(yAdj / 100) + Math.floor(yAdj / 400) - 32045;

    // Egyptian calendar epoch: Thoth 1, Year 1 = Feb 18, 747 BCE (JDN 1448638)
    // The Nabonassar era epoch
    const egyptEpoch = 1448638;
    const daysSinceEpoch = jdn - egyptEpoch;

    if (daysSinceEpoch < 0) {
      setOutput('Date is before the Egyptian calendar epoch (747 BCE).');
      return;
    }

    // Egyptian year = 365 days (no leap year in civil calendar)
    const egyptYear = Math.floor(daysSinceEpoch / 365) + 1;
    const dayInYear = daysSinceEpoch % 365;

    let egyptMonth: number;
    let egyptDay: number;
    let isEpagomenal = false;

    if (dayInYear < 360) {
      egyptMonth = Math.floor(dayInYear / 30);
      egyptDay = (dayInYear % 30) + 1;
    } else {
      isEpagomenal = true;
      egyptMonth = -1;
      egyptDay = dayInYear - 360 + 1;
    }

    const seasonIdx = egyptMonth >= 0 ? Math.floor(egyptMonth / 4) : -1;
    const seasonName = seasonIdx >= 0 ? seasons[seasonIdx].name : 'Epagomenal Days';
    const monthInSeason = egyptMonth >= 0 ? (egyptMonth % 4) + 1 : 0;

    const lines = [
      `=== Egyptian Civil Calendar Conversion ===`,
      ``,
      `Gregorian Date: ${y}-${m.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`,
      `Julian Day Number: ${jdn}`,
      ``,
      `--- Egyptian Date ---`,
      `Year: ${egyptYear} (Nabonassar Era)`,
      isEpagomenal
        ? `Epagomenal Day: ${egyptDay} of 5`
        : `Month: ${months[egyptMonth]} (Month ${egyptMonth + 1})`,
      isEpagomenal ? '' : `Day: ${egyptDay}`,
      `Season: ${seasonName}${monthInSeason > 0 ? ` (Month ${monthInSeason} of season)` : ''}`,
      ``,
      `--- Calendar Structure ---`,
      `• 3 seasons of 4 months each (120 days per season)`,
      `• Each month has exactly 30 days`,
      `• 5 epagomenal days at year end (birthdays of the gods)`,
      `• Total: 365 days (no leap year correction)`,
      ``,
      `--- Seasons ---`,
      `  Akhet (Inundation): Thoth, Phaophi, Athyr, Choiak`,
      `  Peret (Growth): Tybi, Mechir, Phamenoth, Pharmuthi`,
      `  Shemu (Harvest): Pachons, Payni, Epiphi, Mesore`,
      ``,
      `Days since epoch: ${daysSinceEpoch}`,
      `Day of Egyptian year: ${dayInYear + 1} / 365`,
    ];

    setOutput(lines.filter(l => l !== '').join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label htmlFor={`${toolId}-year`} className="block text-sm font-medium text-gray-700 mb-1">
              Year
            </label>
            <input
              id={`${toolId}-year`}
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="input-field"
              aria-label={`Year for ${toolName}`}
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-month`} className="block text-sm font-medium text-gray-700 mb-1">
              Month
            </label>
            <select
              id={`${toolId}-month`}
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="input-field"
              aria-label="Month"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(2024, i, 1).toLocaleString('en', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-day`} className="block text-sm font-medium text-gray-700 mb-1">
              Day
            </label>
            <input
              id={`${toolId}-day`}
              type="number"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              min="1"
              max="31"
              className="input-field"
              aria-label="Day"
            />
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-3">
          Convert to Egyptian Calendar
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Egyptian Calendar Date</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
