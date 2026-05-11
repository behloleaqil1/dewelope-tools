'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * RentVsBuyCalculator - Compares the total cost of renting vs buying a home over a given period.
 * Factors in mortgage, down payment, appreciation, rent increases, and investment returns.
 */
export default function RentVsBuyCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [homePrice, setHomePrice] = useState('');
  const [downPayment, setDownPayment] = useState('20');
  const [mortgageRate, setMortgageRate] = useState('6.5');
  const [loanTerm, setLoanTerm] = useState('30');
  const [monthlyRent, setMonthlyRent] = useState('');
  const [rentIncrease, setRentIncrease] = useState('3');
  const [appreciation, setAppreciation] = useState('3');
  const [years, setYears] = useState('10');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{
    totalBuyCost: number;
    totalRentCost: number;
    homeEquity: number;
    netBuyCost: number;
    recommendation: string;
    savings: number;
  } | null>(null);

  const calculate = () => {
    const newErrors: Record<string, string> = {};
    const price = parseFloat(homePrice);
    const dp = parseFloat(downPayment) / 100;
    const rate = parseFloat(mortgageRate) / 100 / 12;
    const term = parseInt(loanTerm) * 12;
    const rent = parseFloat(monthlyRent);
    const rentInc = parseFloat(rentIncrease) / 100;
    const appRate = parseFloat(appreciation) / 100;
    const period = parseInt(years);

    if (!homePrice.trim() || isNaN(price) || price <= 0) newErrors.homePrice = 'Enter a valid home price';
    if (!monthlyRent.trim() || isNaN(rent) || rent <= 0) newErrors.monthlyRent = 'Enter a valid monthly rent';
    if (isNaN(period) || period <= 0) newErrors.years = 'Enter a valid number of years';

    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); setResult(null); return; }
    setErrors({});

    // Buying costs
    const loanAmount = price * (1 - dp);
    const monthlyPayment = rate > 0
      ? (loanAmount * rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1)
      : loanAmount / term;
    const totalMortgagePayments = monthlyPayment * Math.min(period * 12, term);
    const downPaymentAmount = price * dp;
    const totalBuyCost = totalMortgagePayments + downPaymentAmount;
    const homeValue = price * Math.pow(1 + appRate, period);
    const homeEquity = homeValue - loanAmount * Math.max(0, 1 - (period * 12) / term);

    // Renting costs
    let totalRentCost = 0;
    let currentRent = rent;
    for (let y = 0; y < period; y++) {
      totalRentCost += currentRent * 12;
      currentRent *= (1 + rentInc);
    }

    const netBuyCost = totalBuyCost - homeEquity;
    const savings = Math.abs(totalRentCost - netBuyCost);
    const recommendation = netBuyCost < totalRentCost ? 'Buying is cheaper' : 'Renting is cheaper';

    setResult({ totalBuyCost, totalRentCost, homeEquity, netBuyCost, recommendation, savings });
  };

  const copyText = result
    ? `Rent vs Buy Analysis (${years} years)\nTotal Buy Cost: $${result.totalBuyCost.toFixed(0)}\nHome Equity: $${result.homeEquity.toFixed(0)}\nNet Buy Cost: $${result.netBuyCost.toFixed(0)}\nTotal Rent Cost: $${result.totalRentCost.toFixed(0)}\nResult: ${result.recommendation} (save $${result.savings.toFixed(0)})`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputArea error={errors.homePrice}>
          <label htmlFor={`${toolId}-price`} className="block text-sm font-medium text-gray-700 mb-1">Home Price ($)</label>
          <input id={`${toolId}-price`} type="text" inputMode="decimal" value={homePrice} onChange={(e) => { setHomePrice(e.target.value); if (errors.homePrice) setErrors((p) => ({ ...p, homePrice: '' })); }} placeholder="e.g. 400000" aria-label={`Home price for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea error={errors.monthlyRent}>
          <label htmlFor={`${toolId}-rent`} className="block text-sm font-medium text-gray-700 mb-1">Monthly Rent ($)</label>
          <input id={`${toolId}-rent`} type="text" inputMode="decimal" value={monthlyRent} onChange={(e) => { setMonthlyRent(e.target.value); if (errors.monthlyRent) setErrors((p) => ({ ...p, monthlyRent: '' })); }} placeholder="e.g. 2000" aria-label={`Monthly rent for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-dp`} className="block text-sm font-medium text-gray-700 mb-1">Down Payment (%)</label>
          <input id={`${toolId}-dp`} type="text" inputMode="decimal" value={downPayment} onChange={(e) => setDownPayment(e.target.value)} placeholder="20" aria-label={`Down payment for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-rate`} className="block text-sm font-medium text-gray-700 mb-1">Mortgage Rate (%)</label>
          <input id={`${toolId}-rate`} type="text" inputMode="decimal" value={mortgageRate} onChange={(e) => setMortgageRate(e.target.value)} placeholder="6.5" aria-label={`Mortgage rate for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-term`} className="block text-sm font-medium text-gray-700 mb-1">Loan Term (years)</label>
          <input id={`${toolId}-term`} type="text" inputMode="numeric" value={loanTerm} onChange={(e) => setLoanTerm(e.target.value)} placeholder="30" aria-label={`Loan term for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-rentinc`} className="block text-sm font-medium text-gray-700 mb-1">Annual Rent Increase (%)</label>
          <input id={`${toolId}-rentinc`} type="text" inputMode="decimal" value={rentIncrease} onChange={(e) => setRentIncrease(e.target.value)} placeholder="3" aria-label={`Rent increase for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-appr`} className="block text-sm font-medium text-gray-700 mb-1">Home Appreciation (%/yr)</label>
          <input id={`${toolId}-appr`} type="text" inputMode="decimal" value={appreciation} onChange={(e) => setAppreciation(e.target.value)} placeholder="3" aria-label={`Appreciation rate for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea error={errors.years}>
          <label htmlFor={`${toolId}-years`} className="block text-sm font-medium text-gray-700 mb-1">Time Period (years)</label>
          <input id={`${toolId}-years`} type="text" inputMode="numeric" value={years} onChange={(e) => { setYears(e.target.value); if (errors.years) setErrors((p) => ({ ...p, years: '' })); }} placeholder="10" aria-label={`Time period for ${toolName}`} className="input-field" />
        </InputArea>
      </div>

      <button onClick={calculate} aria-label="Compare rent vs buy" className="btn-primary">
        Compare
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className={`p-4 rounded-lg border text-center ${result.netBuyCost < result.totalRentCost ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}`}>
              <div className="text-lg font-bold text-gray-800">{result.recommendation}</div>
              <div className="text-sm text-gray-600">You save ~${result.savings.toLocaleString(undefined, { maximumFractionDigits: 0 })} over {years} years</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600">${result.netBuyCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                <div className="text-xs text-gray-500 mt-1">Net Buy Cost</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-orange-600">${result.totalRentCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                <div className="text-xs text-gray-500 mt-1">Total Rent Cost</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-green-600">${result.homeEquity.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                <div className="text-xs text-gray-500 mt-1">Home Equity</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-purple-600">${result.totalBuyCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                <div className="text-xs text-gray-500 mt-1">Total Buy Payments</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
