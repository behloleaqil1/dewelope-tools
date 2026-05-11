'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * WageToSalaryConverter - Convert hourly wage to annual salary and vice versa.
 * Assumes configurable hours/week and weeks/year.
 */
export default function WageToSalaryConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [mode, setMode] = useState<'hourlyToAnnual' | 'annualToHourly'>('hourlyToAnnual');
  const [amount, setAmount] = useState('');
  const [hoursPerWeek, setHoursPerWeek] = useState('40');
  const [weeksPerYear, setWeeksPerYear] = useState('52');
  const [result, setResult] = useState<{ annual: number; monthly: number; biweekly: number; weekly: number; daily: number; hourly: number } | null>(null);
  const [error, setError] = useState<string | undefined>();

  function handleCalculate() {
    const value = parseFloat(amount);
    const hpw = parseFloat(hoursPerWeek);
    const wpy = parseFloat(weeksPerYear);

    if (isNaN(value) || value <= 0) { setError('Please enter a valid positive amount'); setResult(null); return; }
    if (isNaN(hpw) || hpw <= 0 || hpw > 168) { setError('Hours per week must be between 1 and 168'); setResult(null); return; }
    if (isNaN(wpy) || wpy <= 0 || wpy > 52) { setError('Weeks per year must be between 1 and 52'); setResult(null); return; }

    setError(undefined);

    let hourly: number;
    if (mode === 'hourlyToAnnual') {
      hourly = value;
    } else {
      hourly = value / (hpw * wpy);
    }

    const annual = hourly * hpw * wpy;
    const monthly = annual / 12;
    const biweekly = hourly * hpw * 2;
    const weekly = hourly * hpw;
    const daily = weekly / 5;

    setResult({ annual, monthly, biweekly, weekly, daily, hourly });
  }

  const copyText = result
    ? `Hourly: $${result.hourly.toFixed(2)}\nDaily: $${result.daily.toFixed(2)}\nWeekly: $${result.weekly.toFixed(2)}\nBi-weekly: $${result.biweekly.toFixed(2)}\nMonthly: $${result.monthly.toFixed(2)}\nAnnual: $${result.annual.toFixed(2)}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="flex gap-4 mb-3">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="radio" checked={mode === 'hourlyToAnnual'} onChange={() => setMode('hourlyToAnnual')} name="mode" />
            Hourly → Annual
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="radio" checked={mode === 'annualToHourly'} onChange={() => setMode('annualToHourly')} name="mode" />
            Annual → Hourly
          </label>
        </div>
        <label htmlFor={`${toolId}-amount`} className="block text-sm font-medium text-gray-700 mb-1">
          {mode === 'hourlyToAnnual' ? 'Hourly Wage ($)' : 'Annual Salary ($)'}
        </label>
        <input
          id={`${toolId}-amount`}
          type="text"
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={mode === 'hourlyToAnnual' ? 'e.g. 25.00' : 'e.g. 52000'}
          aria-label={`${mode === 'hourlyToAnnual' ? 'Hourly wage' : 'Annual salary'} for ${toolName}`}
          className="input-field"
        />
        <div className="flex gap-4 mt-3">
          <div className="flex-1">
            <label htmlFor={`${toolId}-hpw`} className="block text-xs text-gray-500 mb-1">Hours/Week</label>
            <input id={`${toolId}-hpw`} type="text" inputMode="decimal" value={hoursPerWeek} onChange={(e) => setHoursPerWeek(e.target.value)} className="input-field text-sm" aria-label="Hours per week" />
          </div>
          <div className="flex-1">
            <label htmlFor={`${toolId}-wpy`} className="block text-xs text-gray-500 mb-1">Weeks/Year</label>
            <input id={`${toolId}-wpy`} type="text" inputMode="decimal" value={weeksPerYear} onChange={(e) => setWeeksPerYear(e.target.value)} className="input-field text-sm" aria-label="Weeks per year" />
          </div>
        </div>
      </InputArea>

      <button onClick={handleCalculate} aria-label="Calculate salary conversion" className="btn-primary">
        Calculate
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'Hourly', value: result.hourly },
                { label: 'Daily', value: result.daily },
                { label: 'Weekly', value: result.weekly },
                { label: 'Bi-weekly', value: result.biweekly },
                { label: 'Monthly', value: result.monthly },
                { label: 'Annual', value: result.annual },
              ].map((item) => (
                <div key={item.label} className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                  <div className="text-lg font-bold text-green-600">${item.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  <div className="text-xs text-gray-500 mt-1">{item.label}</div>
                </div>
              ))}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
