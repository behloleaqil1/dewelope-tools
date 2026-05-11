'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CompoundInterestCalculator - Calculates compound interest with configurable
 * principal, rate, years, and compounding frequency.
 * Displays final amount, total interest earned, and the formula used.
 */
export default function CompoundInterestCalculator({ toolId, toolName: _toolName }: { toolId: string; toolName: string }) {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [years, setYears] = useState('');
  const [compounds, setCompounds] = useState('12');
  const [error, setError] = useState<string | undefined>();
  const [result, setResult] = useState<{
    finalAmount: number;
    totalInterest: number;
    formula: string;
  } | null>(null);

  function handleCalculate() {
    setError(undefined);
    setResult(null);

    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const t = parseFloat(years);
    const n = parseFloat(compounds);

    if (isNaN(p) || p <= 0) {
      setError('Please enter a valid principal amount greater than 0');
      return;
    }
    if (isNaN(r) || r < 0 || r > 100) {
      setError('Please enter an annual rate between 0 and 100');
      return;
    }
    if (isNaN(t) || t <= 0 || t > 100) {
      setError('Please enter years between 0 and 100');
      return;
    }
    if (isNaN(n) || n < 1 || n > 365 || !Number.isInteger(n)) {
      setError('Compounds per year must be a whole number between 1 and 365');
      return;
    }

    // A = P(1 + r/n)^(nt)
    const rateDecimal = r / 100;
    const finalAmount = p * Math.pow(1 + rateDecimal / n, n * t);
    const totalInterest = finalAmount - p;

    const formula = `A = ${p.toLocaleString()} × (1 + ${rateDecimal}/${n})^(${n} × ${t}) = ${finalAmount.toFixed(2)}`;

    setResult({ finalAmount, totalInterest, formula });
  }

  const copyText = result
    ? `Principal: $${parseFloat(principal).toLocaleString()}\nRate: ${rate}%\nYears: ${years}\nCompounds/Year: ${compounds}\nFinal Amount: $${result.finalAmount.toFixed(2)}\nTotal Interest: $${result.totalInterest.toFixed(2)}`
    : '';

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputArea error={error}>
          <label htmlFor={`${toolId}-principal`} className="block text-sm font-medium text-gray-700 mb-1">
            Principal ($)
          </label>
          <input
            id={`${toolId}-principal`}
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            placeholder="10000"
            aria-label="Principal amount"
            className="input-field"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-rate`} className="block text-sm font-medium text-gray-700 mb-1">
            Annual Rate (%)
          </label>
          <input
            id={`${toolId}-rate`}
            type="number"
            step="0.01"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            placeholder="5"
            aria-label="Annual interest rate percentage"
            className="input-field"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-years`} className="block text-sm font-medium text-gray-700 mb-1">
            Years
          </label>
          <input
            id={`${toolId}-years`}
            type="number"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            placeholder="10"
            aria-label="Number of years"
            className="input-field"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-compounds`} className="block text-sm font-medium text-gray-700 mb-1">
            Compounds per Year
          </label>
          <input
            id={`${toolId}-compounds`}
            type="number"
            value={compounds}
            onChange={(e) => setCompounds(e.target.value)}
            placeholder="12"
            aria-label="Number of times interest compounds per year"
            className="input-field"
          />
        </InputArea>
      </div>

      <button
        onClick={handleCalculate}
        aria-label="Calculate compound interest"
        className="btn-primary"
      >
        Calculate
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="text-sm text-gray-500">Final Amount</div>
                <div className="text-xl font-bold text-gray-800">${result.finalAmount.toFixed(2)}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="text-sm text-gray-500">Total Interest Earned</div>
                <div className="text-xl font-bold text-green-600">${result.totalInterest.toFixed(2)}</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100 font-mono break-all">
              <span className="text-gray-400">Formula: </span>A = P(1 + r/n)^(nt)
              <br />
              {result.formula}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
