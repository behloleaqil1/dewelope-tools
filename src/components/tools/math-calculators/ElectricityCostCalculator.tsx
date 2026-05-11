'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ElectricityCostCalculator - Calculates daily, monthly, and yearly electricity costs
 * based on device wattage, usage hours per day, and cost per kWh.
 */
export default function ElectricityCostCalculator({ toolId, toolName: _toolName }: { toolId: string; toolName: string }) {
  const [watts, setWatts] = useState('');
  const [hoursPerDay, setHoursPerDay] = useState('');
  const [costPerKwh, setCostPerKwh] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [result, setResult] = useState<{
    dailyCost: number;
    monthlyCost: number;
    yearlyCost: number;
    dailyKwh: number;
  } | null>(null);

  function handleCalculate() {
    setError(undefined);
    setResult(null);

    const w = parseFloat(watts);
    const h = parseFloat(hoursPerDay);
    const c = parseFloat(costPerKwh);

    if (isNaN(w) || w <= 0) {
      setError('Please enter a valid wattage greater than 0');
      return;
    }
    if (isNaN(h) || h <= 0 || h > 24) {
      setError('Hours per day must be between 0 and 24');
      return;
    }
    if (isNaN(c) || c <= 0) {
      setError('Please enter a valid cost per kWh greater than 0');
      return;
    }

    const dailyKwh = (w * h) / 1000;
    const dailyCost = dailyKwh * c;
    const monthlyCost = dailyCost * 30;
    const yearlyCost = dailyCost * 365;

    setResult({ dailyCost, monthlyCost, yearlyCost, dailyKwh });
  }

  const copyText = result
    ? `Watts: ${watts}W | Hours/Day: ${hoursPerDay}h | Cost/kWh: $${costPerKwh}\nDaily Usage: ${result.dailyKwh.toFixed(3)} kWh\nDaily Cost: $${result.dailyCost.toFixed(2)}\nMonthly Cost: $${result.monthlyCost.toFixed(2)}\nYearly Cost: $${result.yearlyCost.toFixed(2)}`
    : '';

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InputArea error={error}>
          <label htmlFor={`${toolId}-watts`} className="block text-sm font-medium text-gray-700 mb-1">
            Power (Watts)
          </label>
          <input
            id={`${toolId}-watts`}
            type="number"
            value={watts}
            onChange={(e) => setWatts(e.target.value)}
            placeholder="100"
            aria-label="Device power consumption in watts"
            className="input-field"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-hours`} className="block text-sm font-medium text-gray-700 mb-1">
            Hours per Day
          </label>
          <input
            id={`${toolId}-hours`}
            type="number"
            step="0.5"
            value={hoursPerDay}
            onChange={(e) => setHoursPerDay(e.target.value)}
            placeholder="8"
            aria-label="Hours of usage per day"
            className="input-field"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-cost`} className="block text-sm font-medium text-gray-700 mb-1">
            Cost per kWh ($)
          </label>
          <input
            id={`${toolId}-cost`}
            type="number"
            step="0.01"
            value={costPerKwh}
            onChange={(e) => setCostPerKwh(e.target.value)}
            placeholder="0.12"
            aria-label="Electricity cost per kilowatt hour"
            className="input-field"
          />
        </InputArea>
      </div>

      <button
        onClick={handleCalculate}
        aria-label="Calculate electricity cost"
        className="btn-primary"
      >
        Calculate
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="text-sm text-gray-500">Daily Cost</div>
                <div className="text-xl font-bold text-gray-800">${result.dailyCost.toFixed(2)}</div>
                <div className="text-xs text-gray-400">{result.dailyKwh.toFixed(3)} kWh/day</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="text-sm text-gray-500">Monthly Cost</div>
                <div className="text-xl font-bold text-gray-800">${result.monthlyCost.toFixed(2)}</div>
                <div className="text-xs text-gray-400">~30 days</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="text-sm text-gray-500">Yearly Cost</div>
                <div className="text-xl font-bold text-gray-800">${result.yearlyCost.toFixed(2)}</div>
                <div className="text-xs text-gray-400">365 days</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
