'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * InflationCalculator - Calculate purchasing power change over time with inflation rate.
 */
export default function InflationCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [amount, setAmount] = useState('');
  const [inflationRate, setInflationRate] = useState('');
  const [years, setYears] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{
    futureValue: number;
    purchasingPower: number;
    totalInflation: number;
    lostValue: number;
  } | null>(null);

  const calculate = () => {
    const newErrors: Record<string, string> = {};
    const amt = parseFloat(amount);
    const rate = parseFloat(inflationRate);
    const yrs = parseInt(years, 10);

    if (!amount.trim() || isNaN(amt) || amt <= 0) newErrors.amount = 'Enter a valid positive amount';
    if (!inflationRate.trim() || isNaN(rate) || rate <= 0) newErrors.inflationRate = 'Enter a valid inflation rate';
    if (!years.trim() || isNaN(yrs) || yrs <= 0 || yrs > 100) newErrors.years = 'Enter years (1-100)';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});
    const totalInflation = Math.pow(1 + rate / 100, yrs);
    const futureValue = amt * totalInflation;
    const purchasingPower = amt / totalInflation;
    const lostValue = amt - purchasingPower;

    setResult({ futureValue, purchasingPower, totalInflation: (totalInflation - 1) * 100, lostValue });
  };

  const copyText = result
    ? `Original Amount: $${parseFloat(amount).toFixed(2)}\nEquivalent Cost in ${years} years: $${result.futureValue.toFixed(2)}\nPurchasing Power Today: $${result.purchasingPower.toFixed(2)}\nTotal Inflation: ${result.totalInflation.toFixed(2)}%\nValue Lost: $${result.lostValue.toFixed(2)}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InputArea error={errors.amount}>
          <label htmlFor={`${toolId}-amount`} className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
          <input id={`${toolId}-amount`} type="text" inputMode="decimal" value={amount} onChange={(e) => { setAmount(e.target.value); if (errors.amount) setErrors((p) => ({ ...p, amount: '' })); }} placeholder="e.g. 1000" aria-label={`Amount for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea error={errors.inflationRate}>
          <label htmlFor={`${toolId}-rate`} className="block text-sm font-medium text-gray-700 mb-1">Annual Inflation Rate (%)</label>
          <input id={`${toolId}-rate`} type="text" inputMode="decimal" value={inflationRate} onChange={(e) => { setInflationRate(e.target.value); if (errors.inflationRate) setErrors((p) => ({ ...p, inflationRate: '' })); }} placeholder="e.g. 3" aria-label={`Inflation rate for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea error={errors.years}>
          <label htmlFor={`${toolId}-years`} className="block text-sm font-medium text-gray-700 mb-1">Number of Years</label>
          <input id={`${toolId}-years`} type="text" inputMode="numeric" value={years} onChange={(e) => { setYears(e.target.value); if (errors.years) setErrors((p) => ({ ...p, years: '' })); }} placeholder="e.g. 10" aria-label={`Years for ${toolName}`} className="input-field" />
        </InputArea>
      </div>

      <button onClick={calculate} aria-label="Calculate inflation impact" className="btn-primary">
        Calculate
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-red-600">${result.futureValue.toFixed(2)}</div>
                <div className="text-xs text-gray-500 mt-1">Equivalent Cost in {years} yrs</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">${result.purchasingPower.toFixed(2)}</div>
                <div className="text-xs text-gray-500 mt-1">Purchasing Power Today</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-orange-600">{result.totalInflation.toFixed(2)}%</div>
                <div className="text-xs text-gray-500 mt-1">Total Inflation</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-red-600">${result.lostValue.toFixed(2)}</div>
                <div className="text-xs text-gray-500 mt-1">Value Lost</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
