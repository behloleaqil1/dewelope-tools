'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SavingsGoalCalculator - Calculates months to reach a savings goal with compound interest.
 * Inputs: target amount, current savings, monthly contribution, annual interest rate.
 */
export default function SavingsGoalCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [targetAmount, setTargetAmount] = useState('');
  const [currentSavings, setCurrentSavings] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState('');
  const [annualRate, setAnnualRate] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ months: number; totalInterest: number } | null>(null);

  const calculate = () => {
    const newErrors: Record<string, string> = {};

    const target = parseFloat(targetAmount);
    const current = parseFloat(currentSavings);
    const monthly = parseFloat(monthlyContribution);
    const rate = parseFloat(annualRate);

    if (!targetAmount.trim() || isNaN(target) || target <= 0) {
      newErrors.targetAmount = 'Please enter a valid positive target amount';
    }
    if (!currentSavings.trim() || isNaN(current) || current < 0) {
      newErrors.currentSavings = 'Please enter a valid amount (0 or more)';
    }
    if (!monthlyContribution.trim() || isNaN(monthly) || monthly <= 0) {
      newErrors.monthlyContribution = 'Please enter a valid positive monthly contribution';
    }
    if (!annualRate.trim() || isNaN(rate) || rate < 0) {
      newErrors.annualRate = 'Please enter a valid interest rate (0 or more)';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    if (current >= target) {
      setErrors({});
      setResult({ months: 0, totalInterest: 0 });
      return;
    }

    setErrors({});

    const monthlyRate = rate / 100 / 12;
    let balance = current;
    let months = 0;
    const maxMonths = 12000; // Safety limit: 1000 years

    if (monthlyRate === 0) {
      // No interest: simple calculation
      months = Math.ceil((target - current) / monthly);
      setResult({ months, totalInterest: 0 });
      return;
    }

    while (balance < target && months < maxMonths) {
      balance = balance * (1 + monthlyRate) + monthly;
      months++;
    }

    const totalDeposited = current + monthly * months;
    const totalInterest = balance - totalDeposited;

    setResult({ months, totalInterest: Math.max(0, totalInterest) });
  };

  const copyText = result
    ? `Months to reach goal: ${result.months}\nYears: ${(result.months / 12).toFixed(1)}\nTotal interest earned: $${result.totalInterest.toFixed(2)}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputArea error={errors.targetAmount}>
          <label htmlFor={`${toolId}-target`} className="block text-sm font-medium text-gray-700 mb-1">
            Target Amount ($)
          </label>
          <input
            id={`${toolId}-target`}
            type="text"
            inputMode="decimal"
            value={targetAmount}
            onChange={(e) => {
              setTargetAmount(e.target.value);
              if (errors.targetAmount) setErrors((prev) => ({ ...prev, targetAmount: '' }));
            }}
            placeholder="e.g. 50000"
            aria-label={`Target amount for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea error={errors.currentSavings}>
          <label htmlFor={`${toolId}-current`} className="block text-sm font-medium text-gray-700 mb-1">
            Current Savings ($)
          </label>
          <input
            id={`${toolId}-current`}
            type="text"
            inputMode="decimal"
            value={currentSavings}
            onChange={(e) => {
              setCurrentSavings(e.target.value);
              if (errors.currentSavings) setErrors((prev) => ({ ...prev, currentSavings: '' }));
            }}
            placeholder="e.g. 5000"
            aria-label={`Current savings for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea error={errors.monthlyContribution}>
          <label htmlFor={`${toolId}-monthly`} className="block text-sm font-medium text-gray-700 mb-1">
            Monthly Contribution ($)
          </label>
          <input
            id={`${toolId}-monthly`}
            type="text"
            inputMode="decimal"
            value={monthlyContribution}
            onChange={(e) => {
              setMonthlyContribution(e.target.value);
              if (errors.monthlyContribution) setErrors((prev) => ({ ...prev, monthlyContribution: '' }));
            }}
            placeholder="e.g. 500"
            aria-label={`Monthly contribution for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea error={errors.annualRate}>
          <label htmlFor={`${toolId}-rate`} className="block text-sm font-medium text-gray-700 mb-1">
            Annual Interest Rate (%)
          </label>
          <input
            id={`${toolId}-rate`}
            type="text"
            inputMode="decimal"
            value={annualRate}
            onChange={(e) => {
              setAnnualRate(e.target.value);
              if (errors.annualRate) setErrors((prev) => ({ ...prev, annualRate: '' }));
            }}
            placeholder="e.g. 5"
            aria-label={`Annual interest rate for ${toolName}`}
            className="input-field"
          />
        </InputArea>
      </div>

      <button onClick={calculate} aria-label="Calculate savings goal" className="btn-primary">
        Calculate
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-indigo-600">{result.months}</div>
                <div className="text-xs text-gray-500 mt-1">Months</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-indigo-600">
                  {(result.months / 12).toFixed(1)}
                </div>
                <div className="text-xs text-gray-500 mt-1">Years</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-green-600">
                  ${result.totalInterest.toFixed(2)}
                </div>
                <div className="text-xs text-gray-500 mt-1">Interest Earned</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
