'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function HourlyToAnnualCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [hourlyRate, setHourlyRate] = useState('');
  const [hoursPerWeek, setHoursPerWeek] = useState('40');
  const [weeksPerYear, setWeeksPerYear] = useState('52');
  const [result, setResult] = useState('');

  const calculate = () => {
    const rate = parseFloat(hourlyRate);
    const hpw = parseFloat(hoursPerWeek);
    const wpy = parseFloat(weeksPerYear);
    if (isNaN(rate) || isNaN(hpw) || isNaN(wpy)) return;
    const annual = rate * hpw * wpy;
    const monthly = annual / 12;
    const weekly = rate * hpw;
    setResult(`Hourly: $${rate.toFixed(2)}\nWeekly: $${weekly.toFixed(2)}\nMonthly: $${monthly.toFixed(2)}\nAnnual: $${annual.toFixed(2)}\n\n(${hpw} hrs/week × ${wpy} weeks/year)`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-rate`} className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate ($)</label>
        <input id={`${toolId}-rate`} type="text" inputMode="decimal" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} placeholder="e.g. 25" aria-label={`Hourly rate for ${toolName}`} className="input-field" />
      </InputArea>
      <div className="grid grid-cols-2 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-hpw`} className="block text-sm font-medium text-gray-700 mb-1">Hours/Week</label>
          <input id={`${toolId}-hpw`} type="text" inputMode="decimal" value={hoursPerWeek} onChange={(e) => setHoursPerWeek(e.target.value)} aria-label={`Hours per week for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-wpy`} className="block text-sm font-medium text-gray-700 mb-1">Weeks/Year</label>
          <input id={`${toolId}-wpy`} type="text" inputMode="decimal" value={weeksPerYear} onChange={(e) => setWeeksPerYear(e.target.value)} aria-label={`Weeks per year for ${toolName}`} className="input-field" />
        </InputArea>
      </div>
      <button onClick={calculate} className="btn-primary" aria-label="Calculate annual salary">Calculate</button>
      <OutputArea hasContent={!!result}>
        {result && (
          <div className="space-y-2">
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{result}</pre>
            <CopyToClipboard text={result} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
