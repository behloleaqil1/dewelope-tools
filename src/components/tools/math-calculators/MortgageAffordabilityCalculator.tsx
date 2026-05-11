'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

interface AffordabilityResult {
  maxMonthlyPayment: number;
  maxLoanAmount: number;
  maxHomePrice: number;
  monthlyPrincipalInterest: number;
  totalInterest: number;
}

/**
 * MortgageAffordabilityCalculator - Calculates maximum home price based on income and debts.
 * Uses the 28% rule (housing expenses should not exceed 28% of gross monthly income).
 */
export default function MortgageAffordabilityCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [annualIncome, setAnnualIncome] = useState('');
  const [monthlyDebts, setMonthlyDebts] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('30');
  const [result, setResult] = useState<AffordabilityResult | null>(null);
  const [error, setError] = useState<string | undefined>();

  const calculate = () => {
    const income = parseFloat(annualIncome);
    const debts = parseFloat(monthlyDebts) || 0;
    const down = parseFloat(downPayment) || 0;
    const rate = parseFloat(interestRate);
    const term = parseInt(loanTerm, 10);

    if (!annualIncome.trim() || isNaN(income) || income <= 0) {
      setError('Please enter a valid annual income');
      setResult(null);
      return;
    }

    if (isNaN(rate) || rate < 0 || rate > 30) {
      setError('Please enter a valid interest rate (0-30%)');
      setResult(null);
      return;
    }

    if (isNaN(term) || term < 1 || term > 50) {
      setError('Loan term must be between 1 and 50 years');
      setResult(null);
      return;
    }

    if (debts < 0 || down < 0) {
      setError('Debts and down payment must be non-negative');
      setResult(null);
      return;
    }

    setError(undefined);

    // 28% rule: max housing payment = 28% of gross monthly income
    const grossMonthlyIncome = income / 12;
    const maxMonthlyPayment = grossMonthlyIncome * 0.28;

    // Available for mortgage after existing debts (36% DTI rule)
    const maxTotalDebt = grossMonthlyIncome * 0.36;
    const availableForMortgage = Math.min(maxMonthlyPayment, maxTotalDebt - debts);

    if (availableForMortgage <= 0) {
      setError('Your existing debts exceed the affordable threshold');
      setResult(null);
      return;
    }

    // Calculate max loan amount using mortgage formula
    const monthlyRate = rate / 100 / 12;
    const numPayments = term * 12;
    let maxLoanAmount: number;

    if (monthlyRate === 0) {
      maxLoanAmount = availableForMortgage * numPayments;
    } else {
      maxLoanAmount =
        availableForMortgage * (Math.pow(1 + monthlyRate, numPayments) - 1) /
        (monthlyRate * Math.pow(1 + monthlyRate, numPayments));
    }

    const maxHomePrice = maxLoanAmount + down;
    const totalInterest = availableForMortgage * numPayments - maxLoanAmount;

    setResult({
      maxMonthlyPayment: availableForMortgage,
      maxLoanAmount,
      maxHomePrice,
      monthlyPrincipalInterest: availableForMortgage,
      totalInterest: Math.max(0, totalInterest),
    });
  };

  const formatCurrency = (num: number): string => {
    return '$' + num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const copyText = result
    ? `Mortgage Affordability Results\n` +
      `Max Home Price: ${formatCurrency(result.maxHomePrice)}\n` +
      `Max Loan Amount: ${formatCurrency(result.maxLoanAmount)}\n` +
      `Max Monthly Payment: ${formatCurrency(result.maxMonthlyPayment)}\n` +
      `Total Interest: ${formatCurrency(result.totalInterest)}\n` +
      `Loan Term: ${loanTerm} years`
    : '';

  return (
    <div className="space-y-6" data-tool-id={toolId}>
      <div className="space-y-4">
        <InputArea error={error}>
          <label htmlFor={`${toolId}-income`} className="block text-sm font-medium text-gray-700">
            Annual Gross Income ($)
          </label>
          <input
            id={`${toolId}-income`}
            type="text"
            inputMode="decimal"
            value={annualIncome}
            onChange={(e) => setAnnualIncome(e.target.value)}
            placeholder="85000"
            aria-label={`Annual income for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-debts`} className="block text-sm font-medium text-gray-700">
            Monthly Debts ($)
          </label>
          <input
            id={`${toolId}-debts`}
            type="text"
            inputMode="decimal"
            value={monthlyDebts}
            onChange={(e) => setMonthlyDebts(e.target.value)}
            placeholder="500"
            aria-label={`Monthly debts for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-down`} className="block text-sm font-medium text-gray-700">
            Down Payment ($)
          </label>
          <input
            id={`${toolId}-down`}
            type="text"
            inputMode="decimal"
            value={downPayment}
            onChange={(e) => setDownPayment(e.target.value)}
            placeholder="50000"
            aria-label={`Down payment for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-rate`} className="block text-sm font-medium text-gray-700">
            Interest Rate (%)
          </label>
          <input
            id={`${toolId}-rate`}
            type="text"
            inputMode="decimal"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            placeholder="6.5"
            aria-label={`Interest rate for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-term`} className="block text-sm font-medium text-gray-700">
            Loan Term (years)
          </label>
          <select
            id={`${toolId}-term`}
            value={loanTerm}
            onChange={(e) => setLoanTerm(e.target.value)}
            aria-label={`Loan term for ${toolName}`}
            className="input-field"
          >
            <option value="10">10 years</option>
            <option value="15">15 years</option>
            <option value="20">20 years</option>
            <option value="25">25 years</option>
            <option value="30">30 years</option>
          </select>
        </InputArea>

        <button onClick={calculate} className="btn-primary" aria-label="Calculate mortgage affordability">
          Calculate
        </button>
      </div>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700">Affordability Breakdown</h3>
            <div className="grid gap-3">
              <div className="py-3 px-4 bg-indigo-50 rounded-lg border border-indigo-100">
                <div className="text-xs text-indigo-600">Max Home Price</div>
                <div className="text-xl font-bold text-indigo-800">{formatCurrency(result.maxHomePrice)}</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="py-3 px-4 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500">Max Loan Amount</div>
                  <div className="text-lg font-semibold text-gray-800">{formatCurrency(result.maxLoanAmount)}</div>
                </div>
                <div className="py-3 px-4 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500">Max Monthly Payment</div>
                  <div className="text-lg font-semibold text-gray-800">{formatCurrency(result.maxMonthlyPayment)}</div>
                </div>
                <div className="py-3 px-4 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500">Total Interest</div>
                  <div className="text-lg font-semibold text-gray-800">{formatCurrency(result.totalInterest)}</div>
                </div>
                <div className="py-3 px-4 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500">Loan Term</div>
                  <div className="text-lg font-semibold text-gray-800">{loanTerm} years</div>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Based on the 28% rule: housing costs should not exceed 28% of gross monthly income.
            </p>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
