'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * BurmeseCalendarConverter - Convert Gregorian to Burmese calendar.
 * Calculates Burmese year, month, and day from a Gregorian date.
 */
export default function BurmeseCalendarConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString());
  const [day, setDay] = useState(new Date().getDate().toString());
  const [output, setOutput] = useState('');

  const burmeseMonths = [
    'Tagu', 'Kason', 'Nayon', 'Waso', 'Wagaung',
    'Tawthalin', 'Thadingyut', 'Tazaungmon', 'Nadaw',
    'Pyatho', 'Tabodwe', 'Tabaung'
  ];

  const burmeseDays = ['Taninganwe', 'Taninla', 'Inga', 'Buddahu', 'Kyasabade', 'Thaukkya', 'Sanay'];

  const calculate = () => {
    const y = parseInt(year);
    const m = parseInt(month);
    const d = parseInt(day);

    if (isNaN(y) || isNaN(m) || isNaN(d) || m < 1 || m > 12 || d < 1 || d > 31) {
      setOutput('Please enter a valid date.');
      return;
    }

    // Julian Day Number calculation
    const a = Math.floor((14 - m) / 12);
    const yAdj = y + 4800 - a;
    const mAdj = m + 12 * a - 3;
    const jdn = d + Math.floor((153 * mAdj + 2) / 5) + 365 * yAdj + Math.floor(yAdj / 4) - Math.floor(yAdj / 100) + Math.floor(yAdj / 400) - 32045;

    // Burmese calendar epoch: 22 March 638 CE (JDN 1954168)
    const burmeseEpoch = 1954168;
    const solarYear = 365.2587565; // Burmese solar year in days
    const lunarMonth = 29.53058795; // Synodic month

    // Burmese year
    const daysSinceEpoch = jdn - burmeseEpoch;
    const burmeseYear = Math.floor(daysSinceEpoch / solarYear);

    // Approximate month within the Burmese year
    const yearStart = burmeseEpoch + Math.floor(burmeseYear * solarYear);
    const daysIntoYear = jdn - yearStart;
    const monthIndex = Math.floor(daysIntoYear / lunarMonth) % 12;
    const _dayInMonth = Math.floor(daysIntoYear % lunarMonth) + 1;

    // Waxing/Waning
    const moonPhaseDay = daysIntoYear % lunarMonth;
    const isWaxing = moonPhaseDay < 15;
    const phaseDay = isWaxing ? Math.floor(moonPhaseDay) + 1 : Math.floor(moonPhaseDay - 14.77) + 1;

    // Day of week
    const dayOfWeek = jdn % 7;

    // Sabbath days (Uposatha) - 8th and 15th of waxing, 8th and 15th of waning
    const isSabbath = phaseDay === 8 || phaseDay === 15;

    const lines: string[] = [];
    lines.push('=== Burmese Calendar Conversion ===');
    lines.push('');
    lines.push(`Gregorian Date: ${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
    lines.push('');
    lines.push('--- Burmese Date ---');
    lines.push(`Burmese Year (ME): ${burmeseYear}`);
    lines.push(`Month: ${burmeseMonths[monthIndex]} (${monthIndex + 1}/12)`);
    lines.push(`Day: ${isWaxing ? 'Waxing' : 'Waning'} ${phaseDay}`);
    lines.push(`Day of Week: ${burmeseDays[dayOfWeek]}`);
    lines.push('');
    lines.push('--- Additional Info ---');
    lines.push(`Moon Phase: ${isWaxing ? '🌒 Waxing' : '🌘 Waning'}`);
    lines.push(`Sabbath (Uposatha): ${isSabbath ? 'Yes ☸' : 'No'}`);
    lines.push(`Days since epoch: ${daysSinceEpoch}`);
    lines.push(`Julian Day Number: ${jdn}`);
    lines.push('');
    lines.push('Note: This is an approximation. The traditional Burmese');
    lines.push('calendar uses complex astronomical calculations with');
    lines.push('intercalary months (Waso) for synchronization.');

    setOutput(lines.join('\n'));
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
            <label htmlFor={`${toolId}-month`} className="block text-sm font-medium text-gray-700 mb-1">Month</label>
            <input id={`${toolId}-month`} type="number" min="1" max="12" value={month} onChange={(e) => setMonth(e.target.value)} className="input-field" aria-label="Month" />
          </div>
          <div>
            <label htmlFor={`${toolId}-day`} className="block text-sm font-medium text-gray-700 mb-1">Day</label>
            <input id={`${toolId}-day`} type="number" min="1" max="31" value={day} onChange={(e) => setDay(e.target.value)} className="input-field" aria-label="Day" />
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-4">Convert to Burmese Calendar</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Burmese Calendar Date</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
