'use client';

import { useState } from 'react';
import { ToolEngineProps } from '@/types';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';
import { validateNumeric, validateRange } from '@/lib/validation';
import { calculateLoan } from '@/lib/calculators';

/**
 * LoanMortgageCalculator - Calculates monthly payment, total payment, and total interest.
 * Displays the amortization formula alongside results.
 * Validates numeric inputs with range checking and shows field-specific errors.
 */
export default function LoanMortgageCalculator({ toolId, toolName }: ToolEngineProps) {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [term, setTerm] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{
    monthlyPayment: number;
    totalPayment: number;
    totalInterest: number;
    formula: string;
  } | null>(null);

  const calculate = () => {
    const newErrors: Record<string, string> = {};

    const principalValidation = validateNumeric(principal, 'principal');
    if (!principalValidation.valid) {
      newErrors.principal = principalValidation.error!;
    }

    const rateValidation = validateNumeric(rate, 'rate');
    if (!rateValidation.valid) {
      newErrors.rate = rateValidation.error!;
    }

    const termValidation = validateNumeric(term, 'term');
    if (!termValidation.valid) {
      newErrors.term = termValidation.error!;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    const numPrincipal = Number(principal.trim());
    const numRate = Number(rate.trim());
    const numTerm = Number(term.trim());

    const rangePrincipal = validateRange(numPrincipal, 1, 999999999, 'principal');
    if (!rangePrincipal.valid) {
      newErrors.principal = rangePrincipal.error!;
    }

    const rangeRate = validateRange(numRate, 0, 100, 'rate');
    if (!rangeRate.valid) {
      newErrors.rate = rangeRate.error!;
    }

    const rangeTerm = validateRange(numTerm, 1, 50, 'term');
    if (!rangeTerm.valid) {
      newErrors.term = rangeTerm.error!;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});
    setResult(calculateLoan(numPrincipal, numRate, numTerm));
  };

  const handlePrincipalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrincipal(e.target.value);
    if (errors.principal) {
      setErrors((prev) => ({ ...prev, principal: '' }));
    }
  };

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRate(e.target.value);
    if (errors.rate) {
      setErrors((prev) => ({ ...prev, rate: '' }));
    }
  };

  const handleTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTerm(e.target.value);
    if (errors.term) {
      setErrors((prev) => ({ ...prev, term: '' }));
    }
  };

  return (
    <div className="space-y-6" data-tool-id={toolId}>
      <div className="space-y-4">
        <InputArea error={errors.principal}>
          <label htmlFor="loan-principal" className="block text-sm font-medium text-gray-700">
            Loan Amount ($)
          </label>
          <input
            id="loan-principal"
            type="text"
            inputMode="decimal"
            value={principal}
            onChange={handlePrincipalChange}
            placeholder="Enter loan amount"
            aria-label={`Loan amount for ${toolName}`}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
          />
        </InputArea>

        <InputArea error={errors.rate}>
          <label htmlFor="loan-rate" className="block text-sm font-medium text-gray-700">
            Annual Interest Rate (%)
          </label>
          <input
            id="loan-rate"
            type="text"
            inputMode="decimal"
            value={rate}
            onChange={handleRateChange}
            placeholder="Enter annual interest rate"
            aria-label={`Annual interest rate for ${toolName}`}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
          />
        </InputArea>

        <InputArea error={errors.term}>
          <label htmlFor="loan-term" className="block text-sm font-medium text-gray-700">
            Loan Term (years)
          </label>
          <input
            id="loan-term"
            type="text"
            inputMode="decimal"
            value={term}
            onChange={handleTermChange}
            placeholder="Enter loan term in years"
            aria-label={`Loan term in years for ${toolName}`}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
          />
        </InputArea>

        <button
          onClick={calculate}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-h-[44px] min-w-[44px]"
        >
          Calculate
        </button>
      </div>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-3 rounded border border-gray-200">
                <div className="text-sm text-gray-500">Monthly Payment</div>
                <div className="text-lg font-semibold text-gray-800">${result.monthlyPayment.toLocaleString()}</div>
              </div>
              <div className="bg-white p-3 rounded border border-gray-200">
                <div className="text-sm text-gray-500">Total Payment</div>
                <div className="text-lg font-semibold text-gray-800">${result.totalPayment.toLocaleString()}</div>
              </div>
              <div className="bg-white p-3 rounded border border-gray-200">
                <div className="text-sm text-gray-500">Total Interest</div>
                <div className="text-lg font-semibold text-gray-800">${result.totalInterest.toLocaleString()}</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-white p-3 rounded border border-gray-200 font-mono break-all">
              {result.formula}
            </div>
            <CopyToClipboard
              text={`Monthly: $${result.monthlyPayment} | Total: $${result.totalPayment} | Interest: $${result.totalInterest}`}
            />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
