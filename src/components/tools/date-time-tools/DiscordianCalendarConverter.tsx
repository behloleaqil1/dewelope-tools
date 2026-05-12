'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const SEASONS = ['Chaos', 'Discord', 'Confusion', 'Bureaucracy', 'The Aftermath'];
const WEEKDAYS = ['Sweetmorn', 'Boomtime', 'Pungenday', 'Prickle-Prickle', 'Setting Orange'];
const APOSTLES = ['Mungday', 'Mojoday', 'Syaday', 'Zaraday', 'Maladay'];
const HOLIDAYS = ['Chaoflux', 'Discoflux', 'Confuflux', 'Bureflux', 'Afflux'];

/**
 * DiscordianCalendarConverter - Convert Gregorian to Discordian calendar.
 * The Discordian calendar has 5 seasons of 73 days each, with St. Tib's Day
 * inserted on leap years (Feb 29).
 */
export default function DiscordianCalendarConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [dateInput, setDateInput] = useState(new Date().toISOString().split('T')[0]);
  const [output, setOutput] = useState('');

  const isLeapYear = (year: number): boolean => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  };

  const convert = () => {
    const date = new Date(dateInput + 'T00:00:00');
    if (isNaN(date.getTime())) {
      setOutput('Error: Please enter a valid date.');
      return;
    }

    const year = date.getFullYear();
    const discordianYear = year + 1166; // YOLD (Year of Our Lady of Discord)

    // Day of year (1-indexed)
    const startOfYear = new Date(year, 0, 1);
    const dayOfYear = Math.floor((date.getTime() - startOfYear.getTime()) / 86400000) + 1;

    const leap = isLeapYear(year);
    const results: string[] = [];

    // Check for St. Tib's Day (Feb 29 in leap years)
    if (leap && date.getMonth() === 1 && date.getDate() === 29) {
      results.push(`Discordian Date: St. Tib's Day, YOLD ${discordianYear}`);
      results.push('');
      results.push(`St. Tib's Day occurs once every 4 years.`);
      results.push(`It is not part of any season or week.`);
      results.push('');
      results.push(`Gregorian: ${date.toDateString()}`);
      results.push(`Year of Our Lady of Discord: ${discordianYear}`);
      setOutput(results.join('\n'));
      return;
    }

    // Adjust day for leap year (skip St. Tib's Day)
    let adjustedDay = dayOfYear;
    if (leap && dayOfYear > 60) {
      adjustedDay = dayOfYear - 1;
    }

    const seasonIndex = Math.floor((adjustedDay - 1) / 73);
    const dayInSeason = ((adjustedDay - 1) % 73) + 1;
    const weekdayIndex = (adjustedDay - 1) % 5;

    const season = SEASONS[seasonIndex];
    const weekday = WEEKDAYS[weekdayIndex];

    results.push(`Discordian Date: ${weekday}, ${season} ${dayInSeason}, YOLD ${discordianYear}`);
    results.push('');
    results.push(`Season: ${season} (${seasonIndex + 1} of 5)`);
    results.push(`Day in Season: ${dayInSeason} of 73`);
    results.push(`Weekday: ${weekday}`);
    results.push(`Year: ${discordianYear} YOLD`);
    results.push('');

    // Check for Apostle holidays (5th day of each season)
    if (dayInSeason === 5) {
      results.push(`🎉 Holiday: ${APOSTLES[seasonIndex]} (Apostle celebration)`);
    }
    // Check for Season holidays (50th day of each season)
    if (dayInSeason === 50) {
      results.push(`🎉 Holiday: ${HOLIDAYS[seasonIndex]} (Season celebration)`);
    }

    results.push('');
    results.push(`Gregorian: ${date.toDateString()}`);
    results.push(`Day of Year: ${dayOfYear}`);

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-date`} className="block text-sm font-medium text-gray-700 mb-1">
              Gregorian Date
            </label>
            <input
              id={`${toolId}-date`}
              type="date"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              aria-label={`Date input for ${toolName}`}
              className="input-field w-full"
            />
          </div>
          <button onClick={convert} className="btn-primary text-sm">
            Convert to Discordian
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Discordian Date</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
