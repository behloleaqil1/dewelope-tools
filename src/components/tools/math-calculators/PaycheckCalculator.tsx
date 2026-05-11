'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PaycheckCalculator - Calculate net pay from gross salary with US federal tax brackets.
 * Estimates federal income tax, Social Security, and Medicare deductions.
 */
export default function PaycheckCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [grossSalary, setGrossSalary] = useState('');
  const [payFrequency, setPayFrequency] = useState('biweekly');
  const [filingStatus, setFilingStatus] = useState('single');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{
    grossPay: number;
    federalTax: number;
    socialSecurity: number;
    medicare: number;
    totalDeductions: number;
    netPay: number;
  } | null>(null);

  const calculate = () => {
    const annual = parseFloat(grossSalary);

    if (!grossSalary.trim() || isNaN(annual) || annual <= 0) {
      setError('Please enter a valid gross annual salary.');
      setResult(null);
      return;
    }

    setError('');

    // Pay periods per year
    const periods: Record<string, number> = {
      weekly: 52,
      biweekly: 26,
      semimonthly: 24,
      monthly: 12,
    };

    const periodsPerYear = periods[payFrequency];
    const grossPay = annual / periodsPerYear;

    // 2024 US Federal Tax Brackets (simplified)
    const brackets = filingStatus === 'single'
      ? [
          { limit: 11600, rate: 0.10 },
          { limit: 47150, rate: 0.12 },
          { limit: 100525, rate: 0.22 },
          { limit: 191950, rate: 0.24 },
          { limit: 243725, rate: 0.32 },
          { limit: 609350, rate: 0.35 },
          { limit: Infinity, rate: 0.37 },
        ]
      : [
          { limit: 23200, rate: 0.10 },
          { limit: 94300, rate: 0.12 },
          { limit: 201050, rate: 0.22 },
          { limit: 383900, rate: 0.24 },
          { limit: 487450, rate: 0.32 },
          { limit: 731200, rate: 0.35 },
          { limit: Infinity, rate: 0.37 },
        ];

    // Standard deduction
    const standardDeduction = filingStatus === 'single' ? 14600 : 29200;
    const taxableIncome = Math.max(0, annual - standardDeduction);

    let federalTaxAnnual = 0;
    let prevLimit = 0;
    for (const bracket of brackets) {
      if (taxableIncome <= prevLimit) break;
      const taxable = Math.min(taxableIncome, bracket.limit) - prevLimit;
      federalTaxAnnual += taxable * bracket.rate;
      prevLimit = bracket.limit;
    }

    const federalTax = federalTaxAnnual / periodsPerYear;

    // Social Security: 6.2% up to $168,600 (2024)
    const ssAnnual = Math.min(annual, 168600) * 0.062;
    const socialSecurity = ssAnnual / periodsPerYear;

    // Medicare: 1.45%
    const medicareAnnual = annual * 0.0145;
    const medicare = medicareAnnual / periodsPerYear;

    const totalDeductions = federalTax + socialSecurity + medicare;
    const netPay = grossPay - totalDeductions;

    setResult({ grossPay, federalTax, socialSecurity, medicare, totalDeductions, netPay });
  };

  const copyText = result
    ? `Paycheck Estimate (${payFrequency})\nGross Pay: $${result.grossPay.toFixed(2)}\nFederal Tax: -$${result.federalTax.toFixed(2)}\nSocial Security: -$${result.socialSecurity.toFixed(2)}\nMedicare: -$${result.medicare.toFixed(2)}\nTotal Deductions: -$${result.totalDeductions.toFixed(2)}\nNet Pay: $${result.netPay.toFixed(2)}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-salary`} className="block text-sm font-medium text-gray-700 mb-1">
          Annual Gross Salary ($)
        </label>
        <input
          id={`${toolId}-salary`}
          type="text"
          inputMode="decimal"
          value={grossSalary}
          onChange={(e) => {
            setGrossSalary(e.target.value);
            if (error) setError('');
          }}
          placeholder="e.g. 75000"
          aria-label={`Annual salary for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <InputArea>
        <label htmlFor={`${toolId}-frequency`} className="block text-sm font-medium text-gray-700 mb-1">
          Pay Frequency
        </label>
        <select
          id={`${toolId}-frequency`}
          value={payFrequency}
          onChange={(e) => setPayFrequency(e.target.value)}
          aria-label={`Pay frequency for ${toolName}`}
          className="input-field"
        >
          <option value="weekly">Weekly (52/year)</option>
          <option value="biweekly">Bi-weekly (26/year)</option>
          <option value="semimonthly">Semi-monthly (24/year)</option>
          <option value="monthly">Monthly (12/year)</option>
        </select>
      </InputArea>

      <InputArea>
        <label htmlFor={`${toolId}-filing`} className="block text-sm font-medium text-gray-700 mb-1">
          Filing Status
        </label>
        <select
          id={`${toolId}-filing`}
          value={filingStatus}
          onChange={(e) => setFilingStatus(e.target.value)}
          aria-label={`Filing status for ${toolName}`}
          className="input-field"
        >
          <option value="single">Single</option>
          <option value="married">Married Filing Jointly</option>
        </select>
      </InputArea>

      <button onClick={calculate} aria-label="Calculate paycheck" className="btn-primary">
        Calculate Paycheck
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-gray-800">${result.grossPay.toFixed(2)}</div>
                <div className="text-xs text-gray-500 mt-1">Gross Pay</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-green-600">${result.netPay.toFixed(2)}</div>
                <div className="text-xs text-gray-500 mt-1">Net Pay</div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Federal Tax</span>
                <span className="text-red-600 font-mono">-${result.federalTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Social Security (6.2%)</span>
                <span className="text-red-600 font-mono">-${result.socialSecurity.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Medicare (1.45%)</span>
                <span className="text-red-600 font-mono">-${result.medicare.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between text-sm font-bold">
                <span className="text-gray-700">Total Deductions</span>
                <span className="text-red-600 font-mono">-${result.totalDeductions.toFixed(2)}</span>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              Estimate based on 2024 US federal tax brackets. Does not include state/local taxes or other deductions.
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
