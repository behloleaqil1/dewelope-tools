'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CompoundGrowthCalculator - Calculate compound growth with periodic additions.
 * Computes future value with initial principal, periodic contributions, rate, and time.
 */
export default function CompoundGrowthCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [principal, setPrincipal] = useState('');
  const [addition, setAddition] = useState('');
  const [rate, setRate] = useState('');
  const [periods, setPeriods] = useState('');
  const [compounding, setCompounding] = useState('12');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{
    futureValue: number;
    totalContributions: number;
    totalInterest: number;
    effectiveRate: number;
  } | null>(null);

  function calculate() {
    const newErrors: Record<string, string> = {};
    const P = parseFloat(principal);
    const A = parseFloat(addition) || 0;
    const r = parseFloat(rate);
    const t = parseFloat(periods);
    const n = parseInt(compounding);

    if (!principal.trim() || isNaN(P) || P < 0) {
      newErrors.principal = 'Enter a valid initial amount';
    }
    if (!rate.trim() || isNaN(r)) {
      newErrors.rate = 'Enter a valid growth rate';
    }
    if (!periods.trim() || isNaN(t) || t <= 0) {
      newErrors.periods = 'Enter a positive number of years';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});

    const rateDecimal = r / 100;
    const ratePerPeriod = rateDecimal / n;
    const totalPeriods = n * t;

    // FV = P(1 + r/n)^(nt) + A × [((1 + r/n)^(nt) - 1) / (r/n)]
    const compoundFactor = Math.pow(1 + ratePerPeriod, totalPeriods);
    const principalFV = P * compoundFactor;
    let additionFV = 0;
    if (ratePerPeriod !== 0) {
      additionFV = A * ((compoundFactor - 1) / ratePerPeriod);
    } else {
      additionFV = A * totalPeriods;
    }

    const futureValue = principalFV + additionFV;
    const totalContributions = P + A * totalPeriods;
    const totalInterest = futureValue - totalContributions;
    const effectiveRate = (Math.pow(1 + rateDecimal / n, n) - 1) * 100;

    setResult({ futureValue, totalContributions, totalInterest, effectiveRate });
  }

  const copyText = result
    ? `Future Value: $${result.futureValue.toFixed(2)}\nTotal Contributions: $${result.totalContributions.toFixed(2)}\nTotal Interest Earned: $${result.totalInterest.toFixed(2)}\nEffective Annual Rate: ${result.effectiveRate.toFixed(4)}%`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="space-y-4">
        <InputArea error={errors.principal}>
          <label htmlFor={`${toolId}-principal`} className="block text-sm font-medium text-gray-700 mb-1">
            Initial Amount ($)
          </label>
          <input
            id={`${toolId}-principal`}
            type="text"
            inputMode="decimal"
            value={principal}
            onChange={(e) => { setPrincipal(e.target.value); if (errors.principal) setErrors((prev) => ({ ...prev, principal: '' })); }}
            placeholder="e.g. 10000"
            aria-label={`Initial amount for ${toolName}`}
            className="input-field w-48"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-addition`} className="block text-sm font-medium text-gray-700 mb-1">
            Periodic Addition ($) — per compounding period
          </label>
          <input
            id={`${toolId}-addition`}
            type="text"
            inputMode="decimal"
            value={addition}
            onChange={(e) => setAddition(e.target.value)}
            placeholder="e.g. 500"
            aria-label={`Periodic addition for ${toolName}`}
            className="input-field w-48"
          />
        </InputArea>

        <InputArea error={errors.rate}>
          <label htmlFor={`${toolId}-rate`} className="block text-sm font-medium text-gray-700 mb-1">
            Annual Growth Rate (%)
          </label>
          <input
            id={`${toolId}-rate`}
            type="text"
            inputMode="decimal"
            value={rate}
            onChange={(e) => { setRate(e.target.value); if (errors.rate) setErrors((prev) => ({ ...prev, rate: '' })); }}
            placeholder="e.g. 7"
            aria-label={`Annual growth rate for ${toolName}`}
            className="input-field w-40"
          />
        </InputArea>

        <InputArea error={errors.periods}>
          <label htmlFor={`${toolId}-periods`} className="block text-sm font-medium text-gray-700 mb-1">
            Number of Years
          </label>
          <input
            id={`${toolId}-periods`}
            type="text"
            inputMode="decimal"
            value={periods}
            onChange={(e) => { setPeriods(e.target.value); if (errors.periods) setErrors((prev) => ({ ...prev, periods: '' })); }}
            placeholder="e.g. 10"
            aria-label={`Number of years for ${toolName}`}
            className="input-field w-40"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-compounding`} className="block text-sm font-medium text-gray-700 mb-1">
            Compounding Frequency
          </label>
          <select
            id={`${toolId}-compounding`}
            value={compounding}
            onChange={(e) => setCompounding(e.target.value)}
            aria-label={`Compounding frequency for ${toolName}`}
            className="input-field w-48"
          >
            <option value="1">Annually</option>
            <option value="2">Semi-Annually</option>
            <option value="4">Quarterly</option>
            <option value="12">Monthly</option>
            <option value="52">Weekly</option>
            <option value="365">Daily</option>
          </select>
        </InputArea>
      </div>

      <button onClick={calculate} aria-label="Calculate compound growth" className="btn-primary">
        Calculate Growth
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-green-600">${result.futureValue.toFixed(2)}</div>
                <div className="text-xs text-gray-500 mt-1">Future Value</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">${result.totalInterest.toFixed(2)}</div>
                <div className="text-xs text-gray-500 mt-1">Total Interest Earned</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-sm font-semibold text-gray-700">${result.totalContributions.toFixed(2)}</div>
                <div className="text-xs text-gray-500">Total Contributions</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-sm font-semibold text-gray-700">{result.effectiveRate.toFixed(4)}%</div>
                <div className="text-xs text-gray-500">Effective Annual Rate</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
