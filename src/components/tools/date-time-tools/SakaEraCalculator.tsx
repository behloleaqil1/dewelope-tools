'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SakaEraCalculator - Convert Gregorian dates to Indian National Calendar (Saka Era).
 * The Saka Era calendar is the official civil calendar of India.
 */
export default function SakaEraCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('1');
  const [day, setDay] = useState('');
  const [output, setOutput] = useState('');

  const sakaMonths = [
    { name: 'Chaitra', days: 30, daysLeap: 31 },
    { name: 'Vaishakha', days: 31, daysLeap: 31 },
    { name: 'Jyeshtha', days: 31, daysLeap: 31 },
    { name: 'Ashadha', days: 31, daysLeap: 31 },
    { name: 'Shravana', days: 31, daysLeap: 31 },
    { name: 'Bhadrapada', days: 31, daysLeap: 31 },
    { name: 'Ashvina', days: 30, daysLeap: 30 },
    { name: 'Kartika', days: 30, daysLeap: 30 },
    { name: 'Agrahayana', days: 30, daysLeap: 30 },
    { name: 'Pausha', days: 30, daysLeap: 30 },
    { name: 'Magha', days: 30, daysLeap: 30 },
    { name: 'Phalguna', days: 30, daysLeap: 30 },
  ];

  const isLeapYear = (y: number): boolean => {
    return (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0);
  };

  const gregorianToSaka = (gYear: number, gMonth: number, gDay: number) => {
    const leap = isLeapYear(gYear);
    const chaitraStart = leap ? 80 : 79; // Day of year when Chaitra 1 starts (March 21/22)

    // Calculate day of year
    const daysInMonth = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let dayOfYear = gDay;
    for (let i = 0; i < gMonth - 1; i++) {
      dayOfYear += daysInMonth[i];
    }

    let sakaYear: number = 0;
    let sakaMonth: number = 0;
    let sakaDay: number = 1;

    if (dayOfYear >= chaitraStart + 1) {
      // After Chaitra 1 of current year
      sakaYear = gYear - 78;
      let remaining = dayOfYear - chaitraStart - 1;

      sakaMonth = 0;
      for (let i = 0; i < 12; i++) {
        const mDays = leap ? sakaMonths[i].daysLeap : sakaMonths[i].days;
        if (remaining < mDays) {
          sakaMonth = i;
          sakaDay = remaining + 1;
          break;
        }
        remaining -= mDays;
      }
      sakaDay = sakaDay || 1;
    } else {
      // Before Chaitra 1, belongs to previous Saka year
      sakaYear = gYear - 79;
      const prevLeap = isLeapYear(gYear - 1);
      const totalDaysPrevYear = prevLeap ? 366 : 365;
      const prevChaitraStart = prevLeap ? 80 : 79;
      let remaining = totalDaysPrevYear - prevChaitraStart - 1 + dayOfYear;

      sakaMonth = 0;
      sakaDay = 1;
      for (let i = 0; i < 12; i++) {
        const mDays = prevLeap ? sakaMonths[i].daysLeap : sakaMonths[i].days;
        if (remaining < mDays) {
          sakaMonth = i;
          sakaDay = remaining + 1;
          break;
        }
        remaining -= mDays;
      }
    }

    return { sakaYear, sakaMonth, sakaDay };
  };

  const calculate = () => {
    const gYear = parseInt(year);
    const gMonth = parseInt(month);
    const gDay = parseInt(day);

    if (isNaN(gYear) || isNaN(gMonth) || isNaN(gDay)) {
      setOutput('Please enter a valid date.');
      return;
    }

    if (gYear < 79) {
      setOutput('Saka Era starts from 78 CE. Please enter a year after 78.');
      return;
    }

    const { sakaYear, sakaMonth, sakaDay } = gregorianToSaka(gYear, gMonth, gDay);
    const monthName = sakaMonths[sakaMonth].name;

    const gregorianMonths = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];

    let result = '=== Saka Era (Indian National Calendar) ===\n\n';
    result += `Gregorian Date:    ${gDay} ${gregorianMonths[gMonth - 1]} ${gYear}\n\n`;
    result += `--- Saka Era Date ---\n`;
    result += `Saka Year:         ${sakaYear} SE\n`;
    result += `Saka Month:        ${monthName} (Month ${sakaMonth + 1})\n`;
    result += `Saka Day:          ${sakaDay}\n`;
    result += `Full Date:         ${sakaDay} ${monthName} ${sakaYear} SE\n\n`;
    result += `--- About the Saka Calendar ---\n`;
    result += `• Official civil calendar of India (adopted 1957)\n`;
    result += `• Epoch: Spring equinox of 78 CE\n`;
    result += `• Year starts on Chaitra 1 (March 22, or March 21 in leap years)\n`;
    result += `• 12 months, first month has 30 days (31 in leap years)\n`;
    result += `• Months 2-6 have 31 days, months 7-12 have 30 days\n`;
    result += `• Leap year rules same as Gregorian calendar\n`;
    result += `• Current Saka year = Gregorian year - 78 (after March 22)\n`;

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor={`${toolId}-year`} className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <input id={`${toolId}-year`} type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder="2024" className="input-field" aria-label={`Year input for ${toolName}`} />
            </div>
            <div>
              <label htmlFor={`${toolId}-month`} className="block text-sm font-medium text-gray-700 mb-1">Month</label>
              <select id={`${toolId}-month`} value={month} onChange={(e) => setMonth(e.target.value)} className="input-field">
                <option value="1">January</option>
                <option value="2">February</option>
                <option value="3">March</option>
                <option value="4">April</option>
                <option value="5">May</option>
                <option value="6">June</option>
                <option value="7">July</option>
                <option value="8">August</option>
                <option value="9">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>
            </div>
            <div>
              <label htmlFor={`${toolId}-day`} className="block text-sm font-medium text-gray-700 mb-1">Day</label>
              <input id={`${toolId}-day`} type="number" min="1" max="31" value={day} onChange={(e) => setDay(e.target.value)} placeholder="15" className="input-field" />
            </div>
          </div>
          <button onClick={calculate} className="btn-primary">Convert to Saka Era</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Saka Era Conversion</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-3 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
