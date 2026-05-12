'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * WorldCalendarConverter - Convert between multiple world calendar systems at once.
 * Converts a Gregorian date to Hebrew, Islamic, Persian, Chinese, Julian, and more.
 */
export default function WorldCalendarConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [dateInput, setDateInput] = useState('');
  const [output, setOutput] = useState('');

  const gregorianToJulianDay = (year: number, month: number, day: number): number => {
    const a = Math.floor((14 - month) / 12);
    const y = year + 4800 - a;
    const m = month + 12 * a - 3;
    return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  };

  const julianDayToJulianCalendar = (jd: number): string => {
    const b = 0;
    const c = jd + 32082 + b;
    const d = Math.floor((4 * c + 3) / 1461);
    const e = c - Math.floor(1461 * d / 4);
    const m = Math.floor((5 * e + 2) / 153);
    const day = e - Math.floor((153 * m + 2) / 5) + 1;
    const month = m + 3 - 12 * Math.floor(m / 10);
    const year = d - 4800 + Math.floor(m / 10);
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const julianDayToIslamic = (jd: number): string => {
    const l = jd - 1948440 + 10632;
    const n = Math.floor((l - 1) / 10631);
    const lRem = l - 10631 * n + 354;
    const j = Math.floor((10985 - lRem) / 5316) * Math.floor((50 * lRem) / 17719) + Math.floor(lRem / 5670) * Math.floor((43 * lRem) / 15238);
    const lFinal = lRem - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
    const month = Math.floor((24 * lFinal) / 709);
    const day = lFinal - Math.floor((709 * month) / 24);
    const year = 30 * n + j - 30;
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} AH`;
  };

  const julianDayToHebrew = (jd: number): string => {
    const jdEpoch = 347995.5;
    const d = jd - jdEpoch;
    const approxYear = Math.floor((98496.0 * d) / 35975351.0) + 1;
    const hebrewMonths = ['Tishrei', 'Cheshvan', 'Kislev', 'Tevet', 'Shevat', 'Adar', 'Nisan', 'Iyar', 'Sivan', 'Tammuz', 'Av', 'Elul'];
    const year = approxYear;
    const monthNum = 1 + (Math.floor(d / 30) % 12);
    const day = 1 + (Math.floor(d) % 30);
    return `${day} ${hebrewMonths[(monthNum - 1) % 12]} ${year}`;
  };

  const julianDayToPersian = (jd: number): string => {
    const jdEpoch = 1948320.5;
    const depoch = jd - jdEpoch;
    const cycle = Math.floor(depoch / 1029983);
    const cyear = depoch - 1029983 * cycle;
    let ycycle: number;
    if (cyear === 1029982) {
      ycycle = 2820;
    } else {
      const aux1 = Math.floor(cyear / 366);
      const aux2 = cyear % 366;
      ycycle = Math.floor((2134 * aux1 + 2816 * aux2 + 2815) / 1028522) + aux1 + 1;
    }
    const year = ycycle + 2820 * cycle + 474;
    const yday = jd - gregorianToJulianDay(year > 0 ? year : year - 1, 3, year > 0 ? 20 : 21) + 1;
    const month = yday <= 186 ? Math.ceil(yday / 31) : Math.ceil((yday - 6) / 30);
    const day = jd - gregorianToJulianDay(year > 0 ? year : year - 1, 3, 20) - (month <= 6 ? (month - 1) * 31 : (month - 1) * 30 + 6) + 1;
    const persianMonths = ['Farvardin', 'Ordibehesht', 'Khordad', 'Tir', 'Mordad', 'Shahrivar', 'Mehr', 'Aban', 'Azar', 'Dey', 'Bahman', 'Esfand'];
    return `${Math.max(1, Math.floor(day))} ${persianMonths[Math.min(11, Math.max(0, Math.floor(month) - 1))]} ${year}`;
  };

  const getChineseYear = (year: number): string => {
    const stems = ['Jia', 'Yi', 'Bing', 'Ding', 'Wu', 'Ji', 'Geng', 'Xin', 'Ren', 'Gui'];
    const branches = ['Zi (Rat)', 'Chou (Ox)', 'Yin (Tiger)', 'Mao (Rabbit)', 'Chen (Dragon)', 'Si (Snake)', 'Wu (Horse)', 'Wei (Goat)', 'Shen (Monkey)', 'You (Rooster)', 'Xu (Dog)', 'Hai (Pig)'];
    const stemIdx = (year - 4) % 10;
    const branchIdx = (year - 4) % 12;
    return `${stems[stemIdx >= 0 ? stemIdx : stemIdx + 10]}-${branches[branchIdx >= 0 ? branchIdx : branchIdx + 12]} (${year + 2697} in cycle)`;
  };

  const convert = () => {
    if (!dateInput) {
      setOutput('Please select a date.');
      return;
    }

    const parts = dateInput.split('-');
    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]);
    const day = parseInt(parts[2]);

    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      setOutput('Invalid date format.');
      return;
    }

    const jd = gregorianToJulianDay(year, month, day);

    const results: string[] = [];
    results.push('=== World Calendar Conversion ===');
    results.push('');
    results.push(`Gregorian: ${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
    results.push(`Julian Day Number: ${jd}`);
    results.push('');
    results.push('--- Calendar Systems ---');
    results.push('');
    results.push(`Julian Calendar: ${julianDayToJulianCalendar(jd)}`);
    results.push(`Islamic (Hijri): ${julianDayToIslamic(jd)}`);
    results.push(`Hebrew: ${julianDayToHebrew(jd)}`);
    results.push(`Persian (Solar Hijri): ${julianDayToPersian(jd)}`);
    results.push(`Chinese Year: ${getChineseYear(year)}`);
    results.push('');
    results.push('--- Additional Info ---');
    const dayOfYear = Math.floor((Date.UTC(year, month - 1, day) - Date.UTC(year, 0, 0)) / 86400000);
    results.push(`Day of Year: ${dayOfYear}`);
    const weekDay = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    results.push(`Day of Week: ${weekDay[new Date(year, month - 1, day).getDay()]}`);
    const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    results.push(`Leap Year (Gregorian): ${isLeap ? 'Yes' : 'No'}`);

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-4">
          <div>
            <label htmlFor={`${toolId}-date`} className="block text-sm font-medium text-gray-700 mb-1">
              Select Gregorian Date
            </label>
            <input
              id={`${toolId}-date`}
              type="date"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="input-field"
              aria-label={`Date input for ${toolName}`}
            />
          </div>
        </div>

        <button
          onClick={convert}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Convert to All Calendars
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Calendar Conversions</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
