'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * LoanPayoffCalculator - Calculate extra payment impact on loan payoff time.
 */
export default function LoanPayoffCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [balance, setBalance] = useState('');
  const [rate, setRate] = useState('');
  const [payment, setPayment] = useState('');
  const [extraPayment, setExtraPayment] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{
    originalMonths: number;
    newMonths: number;
    savedMonths: number;
    originalInterest: number;
    newInterest: number;
    savedInterest: number;
  } | null>(null);

  const calculate = () => {
    const newErrors: Record<string, string> = {};
    const bal = parseFloat(balance);
    const annualRate = parseFloat(rate);
    const pmt = parseFloat(payment);
    const extra = parseFloat(extraPayment) || 0;

    if (!balance.trim() || isNaN(bal) || bal <= 0) newErrors.balance = 'Enter a valid positive balance';
    if (!rate.trim() || isNaN(annualRate) || annualRate <= 0) newErrors.rate = 'Enter a valid interest rate';
    if (!payment.trim() || isNaN(pmt) || pmt <= 0) newErrors.payment = 'Enter a valid monthly payment';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    const monthlyRate = annualRate / 100 / 12;

    // Calculate original payoff
    let remaining = bal;
    let originalMonths = 0;
    let originalInterest = 0;
    while (remaining > 0 && originalMonths < 600) {
      const interest = remaining * monthlyRate;
      originalInterest += interest;
      remaining = remaining + interest - pmt;
      originalMonths++;
      if (remaining < 0) remaining = 0;
    }

    // Calculate with extra payment
    remaining = bal;
    let newMonths = 0;
    let newInterest = 0;
    const totalPmt = pmt + extra;
    while (remaining > 0 && newMonths < 600) {
      const interest = remaining * monthlyRate;
      newInterest += interest;
      remaining = remaining + interest - totalPmt;
      newMonths++;
      if (remaining < 0) remaining = 0;
    }

    setErrors({});
    setResult({
      originalMonths,
      newMonths,
      savedMonths: originalMonths - newMonths,
      originalInterest,
      newInterest,
      savedInterest: originalInterest - newInterest,
    });
  };

  const copyText = result
    ? `Original Payoff: ${result.originalMonths} months\nWith Extra Payment: ${result.newMonths} months\nTime Saved: ${result.savedMonths} months\nInterest Saved: $${result.savedInterest.toFixed(2)}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputArea error={errors.balance}>
          <label htmlFor={`${toolId}-balance`} className="block text-sm font-medium text-gray-700 mb-1">Loan Balance ($)</label>
          <input id={`${toolId}-balance`} type="text" inputMode="decimal" value={balance} onChange={(e) => { setBalance(e.target.value); if (errors.balance) setErrors((p) => ({ ...p, balance: '' })); }} placeholder="e.g. 200000" aria-label={`Loan balance for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea error={errors.rate}>
          <label htmlFor={`${toolId}-rate`} className="block text-sm font-medium text-gray-700 mb-1">Annual Interest Rate (%)</label>
          <input id={`${toolId}-rate`} type="text" inputMode="decimal" value={rate} onChange={(e) => { setRate(e.target.value); if (errors.rate) setErrors((p) => ({ ...p, rate: '' })); }} placeholder="e.g. 6.5" aria-label={`Interest rate for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea error={errors.payment}>
          <label htmlFor={`${toolId}-payment`} className="block text-sm font-medium text-gray-700 mb-1">Monthly Payment ($)</label>
          <input id={`${toolId}-payment`} type="text" inputMode="decimal" value={payment} onChange={(e) => { setPayment(e.target.value); if (errors.payment) setErrors((p) => ({ ...p, payment: '' })); }} placeholder="e.g. 1264" aria-label={`Monthly payment for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-extra`} className="block text-sm font-medium text-gray-700 mb-1">Extra Monthly Payment ($)</label>
          <input id={`${toolId}-extra`} type="text" inputMode="decimal" value={extraPayment} onChange={(e) => setExtraPayment(e.target.value)} placeholder="e.g. 200" aria-label={`Extra payment for ${toolName}`} className="input-field" />
        </InputArea>
      </div>

      <button onClick={calculate} aria-label="Calculate loan payoff" className="btn-primary">
        Calculate Payoff
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.originalMonths} mo</div>
                <div className="text-xs text-gray-500 mt-1">Original Payoff</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-green-600">{result.newMonths} mo</div>
                <div className="text-xs text-gray-500 mt-1">With Extra Payment</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-green-600">{result.savedMonths} mo</div>
                <div className="text-xs text-gray-500 mt-1">Time Saved</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-green-600">${result.savedInterest.toFixed(2)}</div>
                <div className="text-xs text-gray-500 mt-1">Interest Saved</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
