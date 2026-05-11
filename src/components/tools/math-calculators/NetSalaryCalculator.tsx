'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * NetSalaryCalculator - Calculate net salary after income tax deductions.
 * Uses simplified progressive tax brackets for estimation.
 */
export default function NetSalaryCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [grossSalary, setGrossSalary] = useState('');
  const [period, setPeriod] = useState<'annual' | 'monthly'>('annual');
  const [taxRate, setTaxRate] = useState('25');
  const [deductions, setDeductions] = useState('0');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ gross: number; tax: number; deductionsAmt: number; net: number; effectiveRate: number } | null>(null);

  const calculate = () => {
    const newErrors: Record<string, string> = {};
    const gross = parseFloat(grossSalary);
    const rate = parseFloat(taxRate);
    const deductAmt = parseFloat(deductions) || 0;

    if (!grossSalary.trim() || isNaN(gross) || gross <= 0) {
      newErrors.grossSalary = 'Please enter a valid positive salary';
    }
    if (isNaN(rate) || rate < 0 || rate > 100) {
      newErrors.taxRate = 'Tax rate must be between 0 and 100';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});
    const annualGross = period === 'monthly' ? gross * 12 : gross;
    const taxableIncome = Math.max(0, annualGross - deductAmt);
    const tax = taxableIncome * (rate / 100);
    const net = annualGross - tax;
    const effectiveRate = annualGross > 0 ? (tax / annualGross) * 100 : 0;

    setResult({
      gross: annualGross,
      tax,
      deductionsAmt: deductAmt,
      net,
      effectiveRate,
    });
  };

  const formatCurrency = (val: number) => `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const copyText = result
    ? `Gross Salary: ${formatCurrency(result.gross)}\nTax Deductions: ${formatCurrency(result.tax)}\nNet Salary: ${formatCurrency(result.net)}\nEffective Tax Rate: ${result.effectiveRate.toFixed(2)}%\nMonthly Net: ${formatCurrency(result.net / 12)}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="space-y-4">
        <InputArea error={errors.grossSalary}>
          <label htmlFor={`${toolId}-gross`} className="block text-sm font-medium text-gray-700 mb-1">
            Gross Salary
          </label>
          <div className="flex gap-2">
            <input
              id={`${toolId}-gross`}
              type="text"
              inputMode="decimal"
              value={grossSalary}
              onChange={(e) => { setGrossSalary(e.target.value); if (errors.grossSalary) setErrors((prev) => ({ ...prev, grossSalary: '' })); }}
              placeholder="e.g. 75000"
              aria-label={`Gross salary for ${toolName}`}
              className="input-field flex-1"
            />
            <select value={period} onChange={(e) => setPeriod(e.target.value as 'annual' | 'monthly')} className="input-field w-32" aria-label="Salary period">
              <option value="annual">Annual</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </InputArea>

        <InputArea error={errors.taxRate}>
          <label htmlFor={`${toolId}-rate`} className="block text-sm font-medium text-gray-700 mb-1">
            Tax Rate (%)
          </label>
          <input
            id={`${toolId}-rate`}
            type="text"
            inputMode="decimal"
            value={taxRate}
            onChange={(e) => { setTaxRate(e.target.value); if (errors.taxRate) setErrors((prev) => ({ ...prev, taxRate: '' })); }}
            placeholder="e.g. 25"
            aria-label="Tax rate percentage"
            className="input-field"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-deductions`} className="block text-sm font-medium text-gray-700 mb-1">
            Pre-tax Deductions (annual)
          </label>
          <input
            id={`${toolId}-deductions`}
            type="text"
            inputMode="decimal"
            value={deductions}
            onChange={(e) => setDeductions(e.target.value)}
            placeholder="e.g. 5000"
            aria-label="Pre-tax deductions"
            className="input-field"
          />
        </InputArea>
      </div>

      <button onClick={calculate} aria-label="Calculate net salary" className="btn-primary">
        Calculate Net Salary
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-green-600">{formatCurrency(result.net)}</div>
                <div className="text-xs text-gray-500 mt-1">Annual Net</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-green-600">{formatCurrency(result.net / 12)}</div>
                <div className="text-xs text-gray-500 mt-1">Monthly Net</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-red-600">{formatCurrency(result.tax)}</div>
                <div className="text-xs text-gray-500 mt-1">Total Tax</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-gray-700">{result.effectiveRate.toFixed(2)}%</div>
                <div className="text-xs text-gray-500 mt-1">Effective Rate</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
