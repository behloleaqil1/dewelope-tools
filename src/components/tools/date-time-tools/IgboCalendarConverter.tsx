'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * IgboCalendarConverter - Convert Gregorian dates to the Igbo calendar system.
 * The Igbo calendar (Iguaro Igbo) uses a 4-day week (Eke, Orie, Afo, Nkwo)
 * and 13 months of 7 weeks (28 days) each, plus extra days.
 */
export default function IgboCalendarConverter({ toolId, toolName: _toolName }: { toolId: string; toolName: string }) {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString());
  const [day, setDay] = useState(new Date().getDate().toString());
  const [output, setOutput] = useState('');

  const igboMarketDays = ['Eke', 'Orie', 'Afo', 'Nkwo'];
  const igboMonths = [
    'Onwa Mbu (First Month)',
    'Onwa Abuo (Second Month)',
    'Onwa Ife Eke (Moon of Eke)',
    'Onwa Ano (Fourth Month)',
    'Onwa Agwu (Month of Agwu)',
    'Onwa Ifejioku (Month of Yam)',
    'Onwa Alo Mmuo (Month of Spirits Return)',
    'Onwa Ilo Mmuo (Month of Spirits Departure)',
    'Onwa Ana (Month of Earth)',
    'Onwa Okike (Month of Creation)',
    'Onwa Ajana (Month of Ancestors)',
    'Onwa Ede Ajana (Small Month of Ancestors)',
    'Onwa Uzo Alusi (Month of First Shrine)',
  ];

  const convert = () => {
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

    // Calculate day of year
    const startOfYear = new Date(y, 0, 1);
    const dayOfYear = Math.floor((date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    // Igbo market day calculation (based on a known reference: Jan 1, 2000 was Eke)
    const refDate = new Date(2000, 0, 1);
    const daysDiff = Math.floor((date.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24));
    const marketDayIndex = ((daysDiff % 4) + 4) % 4;
    const marketDay = igboMarketDays[marketDayIndex];

    // Igbo month (28-day months)
    const igboMonthIndex = Math.min(Math.floor((dayOfYear - 1) / 28), 12);
    const igboDayInMonth = ((dayOfYear - 1) % 28) + 1;
    const igboWeek = Math.floor((igboDayInMonth - 1) / 4) + 1;

    const igboYear = y;

    const result = `Igbo Calendar Conversion
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Gregorian Date:    ${date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}

Igbo Market Day:   ${marketDay}
Igbo Month:        ${igboMonths[igboMonthIndex]}
Day in Month:      ${igboDayInMonth}
Igbo Week:         Week ${igboWeek} of 7
Igbo Year:         ${igboYear}

Market Day Cycle:
  Eke → Orie → Afo → Nkwo → (repeat)

About the Igbo Calendar:
  • 4-day market week (Izu)
  • 7 weeks = 1 month (28 days)
  • 13 months per year
  • Used traditionally in southeastern Nigeria`;

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label htmlFor={`${toolId}-year`} className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <input id={`${toolId}-year`} type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder="2024" aria-label="Year" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-month`} className="block text-sm font-medium text-gray-700 mb-1">Month</label>
            <input id={`${toolId}-month`} type="number" min="1" max="12" value={month} onChange={(e) => setMonth(e.target.value)} placeholder="1" aria-label="Month" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-day`} className="block text-sm font-medium text-gray-700 mb-1">Day</label>
            <input id={`${toolId}-day`} type="number" min="1" max="31" value={day} onChange={(e) => setDay(e.target.value)} placeholder="1" aria-label="Day" className="input-field" />
          </div>
        </div>
        <button onClick={convert} className="btn-primary mt-3" aria-label="Convert to Igbo calendar">
          Convert to Igbo Calendar
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Igbo Calendar Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
