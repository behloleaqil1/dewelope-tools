'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SalaryCalculator - Converts between hourly, daily, weekly, biweekly, monthly, and annual salary.
 * Supports optional tax rate deduction to show net equivalents.
 */
export default function SalaryCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [inputType, setInputType] = useState<'annual' | 'hourly'>('annual');
  const [amount, setAmount] = useState('');
  const [taxRate, setTaxRate] = useState('');
  const [hoursPerWeek, setHoursPerWeek] = useState('40');
  const [result, setResult] = useState<Record<string, string> | null>(null);
  const [error, setError] = useState<string | undefined>();

  const calculate = () => {
    const num = parseFloat(amount);
    if (!amount.trim() || isNaN(num) || num < 0) {
      setError('Please enter a valid positive number');
      setResult(null);
      return;
    }

    const hours = parseFloat(hoursPerWeek) || 40;
    if (hours <= 0 || hours > 168) {
      setError('Hours per week must be between 1 and 168');
      setResult(null);
      return;
    }

    const tax = parseFloat(taxRate) || 0;
    if (tax < 0 || tax > 100) {
      setError('Tax rate must be between 0 and 100');
      setResult(null);
      return;
    }

    setError(undefined);

    let annual: number;
    if (inputType === 'annual') {
      annual = num;
    } else {
      annual = num * hours * 52;
    }

    const taxMultiplier = 1 - tax / 100;
    const grossValues = {
      hourly: annual / (hours * 52),
      daily: annual / 260,
      weekly: annual / 52,
      biweekly: annual / 26,
      monthly: annual / 12,
      annual: annual,
    };

    const entries: Record<string, string> = {};
    const labels: Record<string, string> = {
      hourly: 'Hourly',
      daily: 'Daily',
      weekly: 'Weekly',
      biweekly: 'Biweekly',
      monthly: 'Monthly',
      annual: 'Annual',
    };

    for (const [key, value] of Object.entries(grossValues)) {
      const gross = value.toFixed(2);
      if (tax > 0) {
        const net = (value * taxMultiplier).toFixed(2);
        entries[labels[key]] = `$${formatNumber(gross)} (net: $${formatNumber(net)})`;
      } else {
        entries[labels[key]] = `$${formatNumber(gross)}`;
      }
    }

    setResult(entries);
  };

  const formatNumber = (num: string): string => {
    const parts = num.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  const copyText = result
    ? Object.entries(result)
        .map(([key, val]) => `${key}: ${val}`)
        .join('\n')
    : '';

  return (
    <div className="space-y-6" data-tool-id={toolId}>
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={() => setInputType('annual')}
            aria-label="Input annual salary"
            className={`px-4 py-2 text-sm font-medium rounded-lg min-h-[44px] transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              inputType === 'annual'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Annual Salary
          </button>
          <button
            onClick={() => setInputType('hourly')}
            aria-label="Input hourly rate"
            className={`px-4 py-2 text-sm font-medium rounded-lg min-h-[44px] transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              inputType === 'hourly'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Hourly Rate
          </button>
        </div>

        <InputArea error={error}>
          <label htmlFor={`${toolId}-amount`} className="block text-sm font-medium text-gray-700">
            {inputType === 'annual' ? 'Annual Salary ($)' : 'Hourly Rate ($)'}
          </label>
          <input
            id={`${toolId}-amount`}
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={inputType === 'annual' ? '75000' : '36.50'}
            aria-label={`${inputType === 'annual' ? 'Annual salary' : 'Hourly rate'} for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-hours`} className="block text-sm font-medium text-gray-700">
            Hours per Week
          </label>
          <input
            id={`${toolId}-hours`}
            type="text"
            inputMode="decimal"
            value={hoursPerWeek}
            onChange={(e) => setHoursPerWeek(e.target.value)}
            placeholder="40"
            aria-label={`Hours per week for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-tax`} className="block text-sm font-medium text-gray-700">
            Tax Rate (%) — optional
          </label>
          <input
            id={`${toolId}-tax`}
            type="text"
            inputMode="decimal"
            value={taxRate}
            onChange={(e) => setTaxRate(e.target.value)}
            placeholder="25"
            aria-label={`Tax rate for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <button onClick={calculate} className="btn-primary" aria-label="Calculate salary breakdown">
          Calculate
        </button>
      </div>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700">Salary Breakdown</h3>
            <div className="grid gap-2">
              {Object.entries(result).map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-sm font-medium text-gray-600">{label}</span>
                  <span className="text-sm font-semibold text-gray-800">{value}</span>
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
