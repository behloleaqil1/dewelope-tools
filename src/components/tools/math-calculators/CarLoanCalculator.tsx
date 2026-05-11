'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CarLoanCalculator - Calculates monthly car payment with down payment and trade-in value.
 */
export default function CarLoanCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [vehiclePrice, setVehiclePrice] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [tradeIn, setTradeIn] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('60');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{
    monthlyPayment: number;
    totalPayment: number;
    totalInterest: number;
    loanAmount: number;
  } | null>(null);

  const calculate = () => {
    const newErrors: Record<string, string> = {};
    const price = parseFloat(vehiclePrice);
    const down = parseFloat(downPayment) || 0;
    const trade = parseFloat(tradeIn) || 0;
    const rate = parseFloat(interestRate);
    const months = parseInt(loanTerm);

    if (!vehiclePrice.trim() || isNaN(price) || price <= 0) newErrors.vehiclePrice = 'Enter a valid vehicle price';
    if (isNaN(rate) || rate < 0) newErrors.interestRate = 'Enter a valid interest rate';
    if (!loanTerm.trim() || isNaN(months) || months <= 0) newErrors.loanTerm = 'Enter a valid loan term';

    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); setResult(null); return; }

    setErrors({});
    const loanAmount = price - down - trade;
    if (loanAmount <= 0) { setResult({ monthlyPayment: 0, totalPayment: 0, totalInterest: 0, loanAmount: 0 }); return; }

    let monthlyPayment: number;
    if (rate === 0) {
      monthlyPayment = loanAmount / months;
    } else {
      const monthlyRate = rate / 100 / 12;
      monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    }

    const totalPayment = monthlyPayment * months;
    const totalInterest = totalPayment - loanAmount;
    setResult({ monthlyPayment, totalPayment, totalInterest, loanAmount });
  };

  const copyText = result
    ? `Car Loan Summary\nVehicle Price: $${parseFloat(vehiclePrice).toFixed(2)}\nDown Payment: $${(parseFloat(downPayment) || 0).toFixed(2)}\nTrade-In: $${(parseFloat(tradeIn) || 0).toFixed(2)}\nLoan Amount: $${result.loanAmount.toFixed(2)}\nMonthly Payment: $${result.monthlyPayment.toFixed(2)}\nTotal Payment: $${result.totalPayment.toFixed(2)}\nTotal Interest: $${result.totalInterest.toFixed(2)}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputArea error={errors.vehiclePrice}>
          <label htmlFor={`${toolId}-price`} className="block text-sm font-medium text-gray-700 mb-1">Vehicle Price ($)</label>
          <input id={`${toolId}-price`} type="text" inputMode="decimal" value={vehiclePrice} onChange={(e) => { setVehiclePrice(e.target.value); if (errors.vehiclePrice) setErrors((p) => ({ ...p, vehiclePrice: '' })); }} placeholder="e.g. 35000" aria-label={`Vehicle price for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-down`} className="block text-sm font-medium text-gray-700 mb-1">Down Payment ($)</label>
          <input id={`${toolId}-down`} type="text" inputMode="decimal" value={downPayment} onChange={(e) => setDownPayment(e.target.value)} placeholder="e.g. 5000" aria-label={`Down payment for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-trade`} className="block text-sm font-medium text-gray-700 mb-1">Trade-In Value ($)</label>
          <input id={`${toolId}-trade`} type="text" inputMode="decimal" value={tradeIn} onChange={(e) => setTradeIn(e.target.value)} placeholder="e.g. 3000" aria-label={`Trade-in value for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea error={errors.interestRate}>
          <label htmlFor={`${toolId}-rate`} className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
          <input id={`${toolId}-rate`} type="text" inputMode="decimal" value={interestRate} onChange={(e) => { setInterestRate(e.target.value); if (errors.interestRate) setErrors((p) => ({ ...p, interestRate: '' })); }} placeholder="e.g. 5.9" aria-label={`Interest rate for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea error={errors.loanTerm}>
          <label htmlFor={`${toolId}-term`} className="block text-sm font-medium text-gray-700 mb-1">Loan Term (months)</label>
          <select id={`${toolId}-term`} value={loanTerm} onChange={(e) => setLoanTerm(e.target.value)} aria-label={`Loan term for ${toolName}`} className="input-field">
            <option value="24">24 months (2 years)</option>
            <option value="36">36 months (3 years)</option>
            <option value="48">48 months (4 years)</option>
            <option value="60">60 months (5 years)</option>
            <option value="72">72 months (6 years)</option>
            <option value="84">84 months (7 years)</option>
          </select>
        </InputArea>
      </div>

      <button onClick={calculate} aria-label="Calculate car loan payment" className="btn-primary">
        Calculate Payment
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-3xl font-bold text-blue-600">${result.monthlyPayment.toFixed(2)}</div>
              <div className="text-sm text-gray-500 mt-1">Monthly Payment</div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="font-bold text-gray-700">${result.loanAmount.toFixed(0)}</div>
                <div className="text-xs text-gray-500">Loan Amount</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="font-bold text-gray-700">${result.totalPayment.toFixed(0)}</div>
                <div className="text-xs text-gray-500">Total Payment</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="font-bold text-red-600">${result.totalInterest.toFixed(0)}</div>
                <div className="text-xs text-gray-500">Total Interest</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
