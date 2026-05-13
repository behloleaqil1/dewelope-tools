'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ZoroastrianCalendarConverter - Convert Gregorian dates to Zoroastrian calendar.
 * Supports Fasli (seasonal), Shenshai, and Kadmi reckonings.
 */
export default function ZoroastrianCalendarConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString());
  const [day, setDay] = useState(new Date().getDate().toString());
  const [output, setOutput] = useState('');

  const zoroastrianMonths = [
    'Fravardin', 'Ardibehesht', 'Khordad', 'Tir', 'Amardad', 'Shehrevar',
    'Meher', 'Avan', 'Adar', 'Dae', 'Bahman', 'Asfandarmad'
  ];

  const zoroastrianDays = [
    'Hormazd', 'Bahman', 'Ardibehesht', 'Shehrevar', 'Asfandarmad', 'Khordad',
    'Amardad', 'Dae-pa-Adar', 'Adar', 'Avan', 'Khorshed', 'Mohor',
    'Tir', 'Gosh', 'Dae-pa-Meher', 'Meher', 'Srosh', 'Rashne',
    'Fravardin', 'Behram', 'Ram', 'Govad', 'Dae-pa-Din', 'Din',
    'Ashishvangh', 'Ashtad', 'Asman', 'Zamyad', 'Marespand', 'Aneran'
  ];

  const gatasDays = ['Ahunavad', 'Ushtavad', 'Spentomad', 'Vohukhshathra', 'Vahishtoisht'];

  const calculate = () => {
    const y = parseInt(year);
    const m = parseInt(month);
    const d = parseInt(day);

    if (isNaN(y) || isNaN(m) || isNaN(d) || m < 1 || m > 12 || d < 1 || d > 31) {
      setOutput('Error: Please enter a valid date.');
      return;
    }

    const inputDate = new Date(y, m - 1, d);
    if (isNaN(inputDate.getTime())) {
      setOutput('Error: Invalid date.');
      return;
    }

    // Fasli calendar (seasonal, aligned with vernal equinox ~March 21)
    // Epoch: 1 Fravardin 1 YZ = March 21, 632 CE (approximate)
    const fasliEpoch = new Date(632, 2, 21); // March 21, 632
    const diffDays = Math.floor((inputDate.getTime() - fasliEpoch.getTime()) / (1000 * 60 * 60 * 24));

    const fasliYear = Math.floor(diffDays / 365.2422) + 1;
    const dayOfYear = diffDays - Math.floor((fasliYear - 1) * 365.2422);

    let fasliMonth: number;
    let fasliDay: number;
    let isGatha = false;
    let gathaDay = '';

    if (dayOfYear < 0) {
      setOutput('Error: Date is before Zoroastrian calendar epoch.');
      return;
    }

    if (dayOfYear >= 360) {
      // Gatha days (5 epagomenal days)
      isGatha = true;
      fasliMonth = 13;
      fasliDay = dayOfYear - 360 + 1;
      gathaDay = gatasDays[Math.min(fasliDay - 1, 4)] || 'Gatha';
    } else {
      fasliMonth = Math.floor(dayOfYear / 30) + 1;
      fasliDay = (dayOfYear % 30) + 1;
    }

    // Shenshai reckoning (30 days behind Fasli approximately)
    const shenshaiOffset = 30;
    const shenshaiDayOfYear = dayOfYear + shenshaiOffset;
    const shenshaiYear = fasliYear;
    let shenshaiMonth: number;
    let shenshaiDay: number;

    if (shenshaiDayOfYear >= 360) {
      shenshaiMonth = Math.min(Math.floor((shenshaiDayOfYear - 360) / 30) + 1, 12);
      shenshaiDay = ((shenshaiDayOfYear - 360) % 30) + 1;
    } else {
      shenshaiMonth = Math.floor(shenshaiDayOfYear / 30) + 1;
      shenshaiDay = (shenshaiDayOfYear % 30) + 1;
    }

    // Kadmi reckoning (one month ahead of Shenshai)
    const kadmiOffset = 60;
    const kadmiDayOfYear = dayOfYear + kadmiOffset;
    const kadmiYear = fasliYear;
    let kadmiMonth: number;
    let kadmiDay: number;

    if (kadmiDayOfYear >= 360) {
      kadmiMonth = Math.min(Math.floor((kadmiDayOfYear - 360) / 30) + 1, 12);
      kadmiDay = ((kadmiDayOfYear - 360) % 30) + 1;
    } else {
      kadmiMonth = Math.floor(kadmiDayOfYear / 30) + 1;
      kadmiDay = (kadmiDayOfYear % 30) + 1;
    }

    const dayName = fasliDay <= 30 ? zoroastrianDays[Math.min(fasliDay - 1, 29)] : '';

    let results = `=== Zoroastrian Calendar Conversion ===\n\n`;
    results += `Gregorian Date: ${inputDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\n\n`;

    results += `--- Fasli (Seasonal) Reckoning ---\n`;
    results += `  Year: ${fasliYear} YZ (Yazdegerdi)\n`;
    if (isGatha) {
      results += `  Gatha Day: ${gathaDay} (Epagomenal day ${fasliDay})\n`;
    } else {
      results += `  Month: ${zoroastrianMonths[Math.min(fasliMonth - 1, 11)]} (month ${fasliMonth})\n`;
      results += `  Day: ${fasliDay} - Roj ${dayName}\n`;
    }
    results += `\n`;

    results += `--- Shenshai Reckoning ---\n`;
    results += `  Year: ${shenshaiYear} YZ\n`;
    results += `  Month: ${zoroastrianMonths[Math.min(shenshaiMonth - 1, 11)]} (month ${shenshaiMonth})\n`;
    results += `  Day: ${shenshaiDay}\n\n`;

    results += `--- Kadmi Reckoning ---\n`;
    results += `  Year: ${kadmiYear} YZ\n`;
    results += `  Month: ${zoroastrianMonths[Math.min(kadmiMonth - 1, 11)]} (month ${kadmiMonth})\n`;
    results += `  Day: ${kadmiDay}\n\n`;

    results += `Calendar Info:\n`;
    results += `  • 12 months of 30 days + 5 Gatha (epagomenal) days\n`;
    results += `  • Fasli: Aligned with seasons (equinox-based)\n`;
    results += `  • Shenshai: Traditional Parsi reckoning\n`;
    results += `  • Kadmi: One month ahead of Shenshai\n`;
    results += `  • YZ = Yazdegerdi Era (from 632 CE)\n`;

    setOutput(results);
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
        <button onClick={calculate} className="mt-4 btn-primary">Convert to Zoroastrian Calendar</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Zoroastrian Calendar Date</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
