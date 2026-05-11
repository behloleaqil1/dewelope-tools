'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * InterestRateConverter - Convert between APR, monthly rate, daily rate, and effective annual rate.
 * Uses standard financial formulas for rate conversions.
 */

type RateType = 'apr' | 'monthly' | 'daily' | 'ear';

export default function InterestRateConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [inputType, setInputType] = useState<RateType>('apr');
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [result, setResult] = useState<{ apr: number; monthly: number; daily: number; ear: number } | null>(null);

  const calculate = () => {
    const num = parseFloat(value);
    if (isNaN(num) || num < 0) {
      setError('Please enter a valid positive number');
      setResult(null);
      return;
    }

    setError(undefined);
    const rate = num / 100; // Convert percentage to decimal

    let apr: number;
    let monthly: number;
    let daily: number;
    let ear: number;

    switch (inputType) {
      case 'apr':
        apr = rate;
        monthly = apr / 12;
        daily = apr / 365;
        ear = Math.pow(1 + monthly, 12) - 1;
        break;
      case 'monthly':
        monthly = rate;
        apr = monthly * 12;
        daily = apr / 365;
        ear = Math.pow(1 + monthly, 12) - 1;
        break;
      case 'daily':
        daily = rate;
        apr = daily * 365;
        monthly = apr / 12;
        ear = Math.pow(1 + daily, 365) - 1;
        break;
      case 'ear':
        ear = rate;
        monthly = Math.pow(1 + ear, 1 / 12) - 1;
        apr = monthly * 12;
        daily = apr / 365;
        break;
      default:
        return;
    }

    setResult({
      apr: apr * 100,
      monthly: monthly * 100,
      daily: daily * 100,
      ear: ear * 100,
    });
  };

  const copyText = result
    ? `APR (Nominal): ${result.apr.toFixed(4)}%\nMonthly Rate: ${result.monthly.toFixed(6)}%\nDaily Rate: ${result.daily.toFixed(6)}%\nEffective Annual Rate (EAR): ${result.ear.toFixed(4)}%`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">Input Rate Type</label>
            <select
              id={`${toolId}-type`}
              value={inputType}
              onChange={(e) => setInputType(e.target.value as RateType)}
              className="input-field text-sm"
              aria-label="Rate type selection"
            >
              <option value="apr">APR (Annual Percentage Rate)</option>
              <option value="monthly">Monthly Rate</option>
              <option value="daily">Daily Rate</option>
              <option value="ear">Effective Annual Rate (EAR)</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">Rate (%)</label>
            <input
              id={`${toolId}-value`}
              type="text"
              inputMode="decimal"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                if (error) setError(undefined);
              }}
              placeholder="e.g. 5.5"
              aria-label={`Rate value for ${toolName}`}
              className="input-field"
            />
          </div>
        </div>
      </InputArea>

      <button onClick={calculate} aria-label="Convert interest rate" className="btn-primary">
        Convert Rate
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600">{result.apr.toFixed(4)}%</div>
                <div className="text-xs text-gray-500 mt-1">APR (Nominal)</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600">{result.ear.toFixed(4)}%</div>
                <div className="text-xs text-gray-500 mt-1">Effective Annual Rate</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-gray-800">{result.monthly.toFixed(6)}%</div>
                <div className="text-xs text-gray-500 mt-1">Monthly Rate</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-gray-800">{result.daily.toFixed(6)}%</div>
                <div className="text-xs text-gray-500 mt-1">Daily Rate</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
