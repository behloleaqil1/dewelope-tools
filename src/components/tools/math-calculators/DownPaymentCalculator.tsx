'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * DownPaymentCalculator - Calculate down payment amount and remaining loan from percentage.
 * Shows the down payment, remaining balance, and common percentage breakdowns.
 */
export default function DownPaymentCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [price, setPrice] = useState('');
  const [percentage, setPercentage] = useState('20');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ downPayment: number; remainingLoan: number; percentage: number; price: number } | null>(null);

  const calculate = () => {
    const newErrors: Record<string, string> = {};
    const priceVal = parseFloat(price);
    const pctVal = parseFloat(percentage);

    if (!price.trim() || isNaN(priceVal) || priceVal <= 0) {
      newErrors.price = 'Please enter a valid price greater than 0';
    }
    if (!percentage.trim() || isNaN(pctVal) || pctVal < 0 || pctVal > 100) {
      newErrors.percentage = 'Please enter a percentage between 0 and 100';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});
    const downPayment = priceVal * (pctVal / 100);
    const remainingLoan = priceVal - downPayment;
    setResult({ downPayment, remainingLoan, percentage: pctVal, price: priceVal });
  };

  const commonPercentages = [5, 10, 15, 20, 25, 30];

  const copyText = result
    ? `Purchase Price: $${result.price.toLocaleString()}\nDown Payment (${result.percentage}%): $${result.downPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\nRemaining Loan: $${result.remainingLoan.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-price`} className="block text-sm font-medium text-gray-700 mb-1">
              Purchase Price ($)
            </label>
            <input
              id={`${toolId}-price`}
              type="text"
              inputMode="decimal"
              value={price}
              onChange={(e) => { setPrice(e.target.value); if (errors.price) setErrors((prev) => ({ ...prev, price: '' })); }}
              placeholder="e.g. 350000"
              aria-label={`Purchase price for ${toolName}`}
              className="input-field"
            />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
          </div>
          <div>
            <label htmlFor={`${toolId}-pct`} className="block text-sm font-medium text-gray-700 mb-1">
              Down Payment (%)
            </label>
            <input
              id={`${toolId}-pct`}
              type="text"
              inputMode="decimal"
              value={percentage}
              onChange={(e) => { setPercentage(e.target.value); if (errors.percentage) setErrors((prev) => ({ ...prev, percentage: '' })); }}
              placeholder="e.g. 20"
              aria-label={`Down payment percentage for ${toolName}`}
              className="input-field"
            />
            {errors.percentage && <p className="text-red-500 text-xs mt-1">{errors.percentage}</p>}
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {commonPercentages.map((pct) => (
            <button
              key={pct}
              onClick={() => setPercentage(String(pct))}
              className={`px-3 py-1 text-xs rounded border ${percentage === String(pct) ? 'bg-blue-100 border-blue-300 text-blue-700' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'}`}
              aria-label={`Set ${pct}% down payment`}
            >
              {pct}%
            </button>
          ))}
        </div>
      </InputArea>

      <button onClick={calculate} aria-label="Calculate down payment" className="btn-primary">
        Calculate
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  ${result.downPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-gray-500 mt-1">Down Payment ({result.percentage}%)</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-green-600">
                  ${result.remainingLoan.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-gray-500 mt-1">Remaining Loan</div>
              </div>
            </div>

            {price && !isNaN(parseFloat(price)) && parseFloat(price) > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Common Down Payment Amounts</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {commonPercentages.map((pct) => {
                    const dp = parseFloat(price) * (pct / 100);
                    return (
                      <div key={pct} className="bg-gray-50 p-2 rounded border border-gray-200 text-center text-sm">
                        <div className="font-medium text-gray-700">{pct}%</div>
                        <div className="text-gray-600">${dp.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
