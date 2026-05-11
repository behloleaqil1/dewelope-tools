'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * DebtPayoffCalculator - Calculate time to pay off debt with minimum or extra payments.
 */
export default function DebtPayoffCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [balance, setBalance] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [minPayment, setMinPayment] = useState('');
  const [extraPayment, setExtraPayment] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{
    monthsMin: number;
    monthsExtra: number;
    totalInterestMin: number;
    totalInterestExtra: number;
    totalPaidMin: number;
    totalPaidExtra: number;
    savings: number;
  } | null>(null);

  const calculate = () => {
    const newErrors: Record<string, string> = {};
    const bal = parseFloat(balance);
    const rate = parseFloat(interestRate);
    const minPay = parseFloat(minPayment);
    const extra = parseFloat(extraPayment) || 0;

    if (!balance.trim() || isNaN(bal) || bal <= 0) newErrors.balance = 'Enter a positive balance';
    if (!interestRate.trim() || isNaN(rate) || rate < 0) newErrors.interestRate = 'Enter a valid interest rate';
    if (!minPayment.trim() || isNaN(minPay) || minPay <= 0) newErrors.minPayment = 'Enter a positive payment';

    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); setResult(null); return; }

    const monthlyRate = rate / 100 / 12;

    // Check if payment covers interest
    const firstMonthInterest = bal * monthlyRate;
    if (minPay <= firstMonthInterest) {
      setErrors({ minPayment: `Payment must exceed monthly interest ($${firstMonthInterest.toFixed(2)})` });
      setResult(null);
      return;
    }

    setErrors({});

    function simulatePayoff(payment: number): { months: number; totalInterest: number; totalPaid: number } {
      let remaining = bal;
      let months = 0;
      let totalInterest = 0;
      const maxMonths = 600; // 50 years cap

      while (remaining > 0.01 && months < maxMonths) {
        const interest = remaining * monthlyRate;
        totalInterest += interest;
        remaining += interest;
        const actualPayment = Math.min(payment, remaining);
        remaining -= actualPayment;
        months++;
      }

      return { months, totalInterest, totalPaid: bal + totalInterest };
    }

    const minResult = simulatePayoff(minPay);
    const extraResult = simulatePayoff(minPay + extra);

    setResult({
      monthsMin: minResult.months,
      monthsExtra: extraResult.months,
      totalInterestMin: minResult.totalInterest,
      totalInterestExtra: extraResult.totalInterest,
      totalPaidMin: minResult.totalPaid,
      totalPaidExtra: extraResult.totalPaid,
      savings: minResult.totalInterest - extraResult.totalInterest,
    });
  };

  const formatMonths = (m: number) => {
    const years = Math.floor(m / 12);
    const months = m % 12;
    if (years === 0) return `${months} month${months !== 1 ? 's' : ''}`;
    if (months === 0) return `${years} year${years !== 1 ? 's' : ''}`;
    return `${years}y ${months}m`;
  };

  const copyText = result
    ? `Debt Payoff Calculator\nBalance: $${balance}\nInterest Rate: ${interestRate}%\nMinimum Payment: $${minPayment}\nExtra Payment: $${extraPayment || '0'}\n\nMinimum Only: ${formatMonths(result.monthsMin)} | Interest: $${result.totalInterestMin.toFixed(2)}\nWith Extra: ${formatMonths(result.monthsExtra)} | Interest: $${result.totalInterestExtra.toFixed(2)}\nInterest Saved: $${result.savings.toFixed(2)}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-2 gap-4">
        <InputArea error={errors.balance}>
          <label htmlFor={`${toolId}-balance`} className="block text-sm font-medium text-gray-700 mb-1">Debt Balance ($)</label>
          <input id={`${toolId}-balance`} type="text" inputMode="decimal" value={balance} onChange={(e) => { setBalance(e.target.value); if (errors.balance) setErrors(prev => ({ ...prev, balance: '' })); }} placeholder="e.g. 5000" aria-label={`Debt balance for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea error={errors.interestRate}>
          <label htmlFor={`${toolId}-rate`} className="block text-sm font-medium text-gray-700 mb-1">Annual Interest Rate (%)</label>
          <input id={`${toolId}-rate`} type="text" inputMode="decimal" value={interestRate} onChange={(e) => { setInterestRate(e.target.value); if (errors.interestRate) setErrors(prev => ({ ...prev, interestRate: '' })); }} placeholder="e.g. 18.9" aria-label={`Interest rate for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea error={errors.minPayment}>
          <label htmlFor={`${toolId}-min`} className="block text-sm font-medium text-gray-700 mb-1">Minimum Payment ($)</label>
          <input id={`${toolId}-min`} type="text" inputMode="decimal" value={minPayment} onChange={(e) => { setMinPayment(e.target.value); if (errors.minPayment) setErrors(prev => ({ ...prev, minPayment: '' })); }} placeholder="e.g. 150" aria-label={`Minimum payment for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-extra`} className="block text-sm font-medium text-gray-700 mb-1">Extra Payment ($/month)</label>
          <input id={`${toolId}-extra`} type="text" inputMode="decimal" value={extraPayment} onChange={(e) => setExtraPayment(e.target.value)} placeholder="e.g. 50 (optional)" aria-label={`Extra payment for ${toolName}`} className="input-field" />
        </InputArea>
      </div>

      <button onClick={calculate} aria-label="Calculate debt payoff" className="btn-primary">
        Calculate Payoff
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="text-sm font-medium text-gray-600 mb-1">Minimum Payment Only</div>
                <div className="text-xl font-bold text-gray-800">{formatMonths(result.monthsMin)}</div>
                <div className="text-sm text-red-600 mt-1">Interest: ${result.totalInterestMin.toFixed(2)}</div>
                <div className="text-xs text-gray-500">Total paid: ${result.totalPaidMin.toFixed(2)}</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="text-sm font-medium text-green-700 mb-1">With Extra Payment</div>
                <div className="text-xl font-bold text-green-800">{formatMonths(result.monthsExtra)}</div>
                <div className="text-sm text-green-600 mt-1">Interest: ${result.totalInterestExtra.toFixed(2)}</div>
                <div className="text-xs text-gray-500">Total paid: ${result.totalPaidExtra.toFixed(2)}</div>
              </div>
            </div>
            {result.savings > 0 && (
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-center">
                <div className="text-sm text-blue-700">You save <span className="font-bold">${result.savings.toFixed(2)}</span> in interest and pay off <span className="font-bold">{result.monthsMin - result.monthsExtra} months</span> sooner!</div>
              </div>
            )}
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
