'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * JulianDayCalculator - Calculate Julian Day Number for astronomical use.
 * Converts calendar dates to Julian Day Number (JDN) and Modified Julian Date (MJD).
 */
export default function JulianDayCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [hour, setHour] = useState('12');
  const [minute, setMinute] = useState('0');
  const [output, setOutput] = useState('');

  const calculateJD = () => {
    const Y = parseInt(year);
    const M = parseInt(month);
    const D = parseInt(day);
    const H = parseInt(hour) || 0;
    const Min = parseInt(minute) || 0;

    if (isNaN(Y) || isNaN(M) || isNaN(D) || M < 1 || M > 12 || D < 1 || D > 31) {
      setOutput('Please enter a valid date (year, month 1-12, day 1-31).');
      return;
    }

    // Julian Day Number algorithm
    const a = Math.floor((14 - M) / 12);
    const y = Y + 4800 - a;
    const m = M + 12 * a - 3;

    // Gregorian calendar JDN
    const JDN = D + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;

    // Add fractional day
    const dayFraction = (H - 12) / 24 + Min / 1440;
    const JD = JDN + dayFraction;

    // Modified Julian Date
    const MJD = JD - 2400000.5;

    // Reduced Julian Date
    const RJD = JD - 2400000;

    // Dublin Julian Date (from J1900.0)
    const DJD = JD - 2415020;

    const results: string[] = [];
    results.push(`Date: ${Y}-${String(M).padStart(2, '0')}-${String(D).padStart(2, '0')} ${String(H).padStart(2, '0')}:${String(Min).padStart(2, '0')} UT`);
    results.push('');
    results.push(`Julian Day Number (JDN): ${JDN}`);
    results.push(`Julian Date (JD): ${JD.toFixed(6)}`);
    results.push(`Modified Julian Date (MJD): ${MJD.toFixed(6)}`);
    results.push(`Reduced Julian Date (RJD): ${RJD.toFixed(6)}`);
    results.push(`Dublin Julian Date (DJD): ${DJD.toFixed(6)}`);
    results.push('');
    results.push(`Day of Week: ${['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][(JDN % 7)]}`);

    // J2000.0 epoch difference
    const j2000 = JD - 2451545.0;
    results.push(`Days from J2000.0: ${j2000.toFixed(6)}`);
    results.push(`Julian Centuries from J2000.0: ${(j2000 / 36525).toFixed(8)}`);

    setOutput(results.join('\n'));
  };

  const setToday = () => {
    const now = new Date();
    setYear(String(now.getFullYear()));
    setMonth(String(now.getMonth() + 1));
    setDay(String(now.getDate()));
    setHour(String(now.getHours()));
    setMinute(String(now.getMinutes()));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <label htmlFor={`${toolId}-year`} className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
            <input id={`${toolId}-year`} type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder="2024" aria-label={`Year for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-month`} className="block text-sm font-medium text-gray-700 mb-1">Month *</label>
            <input id={`${toolId}-month`} type="number" value={month} onChange={(e) => setMonth(e.target.value)} placeholder="1-12" aria-label="Month" className="input-field" min="1" max="12" />
          </div>
          <div>
            <label htmlFor={`${toolId}-day`} className="block text-sm font-medium text-gray-700 mb-1">Day *</label>
            <input id={`${toolId}-day`} type="number" value={day} onChange={(e) => setDay(e.target.value)} placeholder="1-31" aria-label="Day" className="input-field" min="1" max="31" />
          </div>
          <div>
            <label htmlFor={`${toolId}-hour`} className="block text-sm font-medium text-gray-700 mb-1">Hour (UT)</label>
            <input id={`${toolId}-hour`} type="number" value={hour} onChange={(e) => setHour(e.target.value)} placeholder="0-23" aria-label="Hour" className="input-field" min="0" max="23" />
          </div>
          <div>
            <label htmlFor={`${toolId}-minute`} className="block text-sm font-medium text-gray-700 mb-1">Minute</label>
            <input id={`${toolId}-minute`} type="number" value={minute} onChange={(e) => setMinute(e.target.value)} placeholder="0-59" aria-label="Minute" className="input-field" min="0" max="59" />
          </div>
        </div>
        <div className="mt-4 flex gap-3">
          <button onClick={calculateJD} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Calculate</button>
          <button onClick={setToday} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">Use Now</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Julian Day Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
