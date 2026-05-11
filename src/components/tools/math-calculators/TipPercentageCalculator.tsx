'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TipPercentageCalculator - Calculate what tip percentage was given from bill and tip amount.
 * Reverse-calculates the tip percentage from the bill total and tip amount.
 */
export default function TipPercentageCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [billAmount, setBillAmount] = useState('');
  const [tipAmount, setTipAmount] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ percentage: number; total: number } | null>(null);

  const calculate = () => {
    const newErrors: Record<string, string> = {};

    const bill = parseFloat(billAmount);
    const tip = parseFloat(tipAmount);

    if (!billAmount.trim() || isNaN(bill) || bill <= 0) {
      newErrors.bill = 'Please enter a valid bill amount greater than zero';
    }

    if (!tipAmount.trim() || isNaN(tip) || tip < 0) {
      newErrors.tip = 'Please enter a valid tip amount';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});
    const percentage = (tip / bill) * 100;
    const total = bill + tip;
    setResult({ percentage, total });
  };

  const getRating = (pct: number): { label: string; color: string } => {
    if (pct >= 25) return { label: 'Excellent', color: 'text-green-600' };
    if (pct >= 20) return { label: 'Great', color: 'text-green-500' };
    if (pct >= 15) return { label: 'Good', color: 'text-blue-600' };
    if (pct >= 10) return { label: 'Fair', color: 'text-yellow-600' };
    return { label: 'Low', color: 'text-red-500' };
  };

  const copyText = result
    ? `Bill: $${parseFloat(billAmount).toFixed(2)}\nTip: $${parseFloat(tipAmount).toFixed(2)}\nTip Percentage: ${result.percentage.toFixed(2)}%\nTotal: $${result.total.toFixed(2)}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="space-y-4">
        <InputArea error={errors.bill}>
          <label htmlFor={`${toolId}-bill`} className="block text-sm font-medium text-gray-700 mb-1">
            Bill Amount ($)
          </label>
          <input
            id={`${toolId}-bill`}
            type="text"
            inputMode="decimal"
            value={billAmount}
            onChange={(e) => {
              setBillAmount(e.target.value);
              if (errors.bill) setErrors((prev) => ({ ...prev, bill: '' }));
            }}
            placeholder="e.g. 85.50"
            aria-label={`Bill amount for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea error={errors.tip}>
          <label htmlFor={`${toolId}-tip`} className="block text-sm font-medium text-gray-700 mb-1">
            Tip Amount ($)
          </label>
          <input
            id={`${toolId}-tip`}
            type="text"
            inputMode="decimal"
            value={tipAmount}
            onChange={(e) => {
              setTipAmount(e.target.value);
              if (errors.tip) setErrors((prev) => ({ ...prev, tip: '' }));
            }}
            placeholder="e.g. 15.00"
            aria-label={`Tip amount for ${toolName}`}
            className="input-field"
          />
        </InputArea>
      </div>

      <button onClick={calculate} aria-label="Calculate tip percentage" className="btn-primary">
        Calculate Tip Percentage
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.percentage.toFixed(1)}%</div>
                <div className="text-xs text-gray-500 mt-1">Tip Percentage</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-gray-800">${result.total.toFixed(2)}</div>
                <div className="text-xs text-gray-500 mt-1">Total Paid</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className={`text-2xl font-bold ${getRating(result.percentage).color}`}>
                  {getRating(result.percentage).label}
                </div>
                <div className="text-xs text-gray-500 mt-1">Rating</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
              Tip % = (Tip ÷ Bill) × 100 = (${parseFloat(tipAmount).toFixed(2)} ÷ ${parseFloat(billAmount).toFixed(2)}) × 100 = {result.percentage.toFixed(2)}%
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
