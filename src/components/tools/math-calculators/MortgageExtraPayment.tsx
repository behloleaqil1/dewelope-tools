'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * MortgageExtraPayment - Calculate impact of extra mortgage payments on payoff time and interest saved.
 */
export default function MortgageExtraPayment({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [extraPayment, setExtraPayment] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [result, setResult] = useState<{
    originalMonthlyPayment: number;
    originalTotalInterest: number;
    originalTotalPaid: number;
    originalMonths: number;
    newMonths: number;
    newTotalInterest: number;
    newTotalPaid: number;
    interestSaved: number;
    timeSavedMonths: number;
  } | null>(null);

  function handleCalculate() {
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate);
    const years = parseFloat(loanTerm);
    const extra = parseFloat(extraPayment);

    if (isNaN(principal) || principal <= 0) { setError('Enter a valid loan amount'); setResult(null); return; }
    if (isNaN(rate) || rate <= 0 || rate > 50) { setError('Enter a valid interest rate (0-50%)'); setResult(null); return; }
    if (isNaN(years) || years <= 0 || years > 50) { setError('Enter a valid loan term (1-50 years)'); setResult(null); return; }
    if (isNaN(extra) || extra < 0) { setError('Enter a valid extra payment amount'); setResult(null); return; }

    setError(undefined);

    const monthlyRate = rate / 100 / 12;
    const totalMonths = years * 12;

    // Standard monthly payment
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    const originalTotalPaid = monthlyPayment * totalMonths;
    const originalTotalInterest = originalTotalPaid - principal;

    // With extra payments
    let balance = principal;
    let months = 0;
    let totalInterestWithExtra = 0;

    while (balance > 0 && months < totalMonths * 2) {
      const interestCharge = balance * monthlyRate;
      totalInterestWithExtra += interestCharge;
      const principalPayment = monthlyPayment + extra - interestCharge;

      if (principalPayment <= 0) { setError('Extra payment does not cover interest'); setResult(null); return; }

      balance -= principalPayment;
      months++;

      if (balance <= 0) {
        totalInterestWithExtra += balance * monthlyRate; // adjust for overpayment
        break;
      }
    }

    setResult({
      originalMonthlyPayment: monthlyPayment,
      originalTotalInterest: originalTotalInterest,
      originalTotalPaid: originalTotalPaid,
      originalMonths: totalMonths,
      newMonths: months,
      newTotalInterest: totalInterestWithExtra,
      newTotalPaid: principal + totalInterestWithExtra,
      interestSaved: originalTotalInterest - totalInterestWithExtra,
      timeSavedMonths: totalMonths - months,
    });
  }

  function formatMonths(m: number): string {
    const yrs = Math.floor(m / 12);
    const mos = m % 12;
    if (yrs === 0) return `${mos} month${mos !== 1 ? 's' : ''}`;
    return `${yrs} year${yrs !== 1 ? 's' : ''} ${mos} month${mos !== 1 ? 's' : ''}`;
  }

  const copyText = result
    ? `Monthly Payment: $${result.originalMonthlyPayment.toFixed(2)}\nOriginal Payoff: ${formatMonths(result.originalMonths)}\nNew Payoff: ${formatMonths(result.newMonths)}\nTime Saved: ${formatMonths(result.timeSavedMonths)}\nInterest Saved: $${result.interestSaved.toFixed(2)}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${toolId}-loan`} className="block text-sm font-medium text-gray-700 mb-1">Loan Amount ($)</label>
            <input id={`${toolId}-loan`} type="text" inputMode="decimal" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} placeholder="e.g. 300000" aria-label={`Loan amount for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-rate`} className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
            <input id={`${toolId}-rate`} type="text" inputMode="decimal" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} placeholder="e.g. 6.5" aria-label="Annual interest rate" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-term`} className="block text-sm font-medium text-gray-700 mb-1">Loan Term (years)</label>
            <input id={`${toolId}-term`} type="text" inputMode="decimal" value={loanTerm} onChange={(e) => setLoanTerm(e.target.value)} placeholder="e.g. 30" aria-label="Loan term in years" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-extra`} className="block text-sm font-medium text-gray-700 mb-1">Extra Monthly Payment ($)</label>
            <input id={`${toolId}-extra`} type="text" inputMode="decimal" value={extraPayment} onChange={(e) => setExtraPayment(e.target.value)} placeholder="e.g. 200" aria-label="Extra monthly payment" className="input-field" />
          </div>
        </div>
      </InputArea>

      <button onClick={handleCalculate} aria-label="Calculate extra payment impact" className="btn-primary">
        Calculate Impact
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="text-xs text-gray-500 mb-1">Monthly Payment</div>
                <div className="text-lg font-bold text-gray-800">${result.originalMonthlyPayment.toFixed(2)}</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="text-xs text-green-600 mb-1">Interest Saved</div>
                <div className="text-lg font-bold text-green-700">${result.interestSaved.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="text-xs text-blue-600 mb-1">Time Saved</div>
                <div className="text-lg font-bold text-blue-700">{formatMonths(result.timeSavedMonths)}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="text-xs text-gray-500 mb-1">New Payoff Time</div>
                <div className="text-lg font-bold text-gray-800">{formatMonths(result.newMonths)}</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div>Original: {formatMonths(result.originalMonths)} | Total interest: ${result.originalTotalInterest.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
              <div>With extra: {formatMonths(result.newMonths)} | Total interest: ${result.newTotalInterest.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
