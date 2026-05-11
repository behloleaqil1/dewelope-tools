'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * UnitRateCalculator - Calculates unit rate (price per unit, speed per hour, etc.).
 * Formula: Unit Rate = Total Amount / Number of Units
 */
export default function UnitRateCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [totalAmount, setTotalAmount] = useState('');
  const [numberOfUnits, setNumberOfUnits] = useState('');
  const [amountLabel, setAmountLabel] = useState('dollars');
  const [unitLabel, setUnitLabel] = useState('items');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ rate: number; inverse: number } | null>(null);

  const calculate = () => {
    const newErrors: Record<string, string> = {};
    const amount = parseFloat(totalAmount);
    const units = parseFloat(numberOfUnits);

    if (!totalAmount.trim() || isNaN(amount)) {
      newErrors.totalAmount = 'Please enter a valid number';
    }
    if (!numberOfUnits.trim() || isNaN(units)) {
      newErrors.numberOfUnits = 'Please enter a valid number';
    } else if (units === 0) {
      newErrors.numberOfUnits = 'Number of units cannot be zero';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});
    const rate = amount / units;
    const inverse = units / amount;
    setResult({ rate, inverse });
  };

  const copyText = result
    ? `Unit Rate: ${result.rate.toFixed(4)} ${amountLabel} per ${unitLabel}\nInverse: ${result.inverse.toFixed(4)} ${unitLabel} per ${amountLabel}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="space-y-4">
        <InputArea error={errors.totalAmount}>
          <label htmlFor={`${toolId}-amount`} className="block text-sm font-medium text-gray-700 mb-1">
            Total Amount
          </label>
          <div className="flex gap-2">
            <input
              id={`${toolId}-amount`}
              type="text"
              inputMode="decimal"
              value={totalAmount}
              onChange={(e) => { setTotalAmount(e.target.value); if (errors.totalAmount) setErrors((prev) => ({ ...prev, totalAmount: '' })); }}
              placeholder="e.g. 24.99"
              aria-label={`Total amount for ${toolName}`}
              className="input-field flex-1"
            />
            <input
              type="text"
              value={amountLabel}
              onChange={(e) => setAmountLabel(e.target.value)}
              placeholder="unit"
              aria-label="Amount unit label"
              className="input-field w-28"
            />
          </div>
        </InputArea>

        <InputArea error={errors.numberOfUnits}>
          <label htmlFor={`${toolId}-units`} className="block text-sm font-medium text-gray-700 mb-1">
            Number of Units
          </label>
          <div className="flex gap-2">
            <input
              id={`${toolId}-units`}
              type="text"
              inputMode="decimal"
              value={numberOfUnits}
              onChange={(e) => { setNumberOfUnits(e.target.value); if (errors.numberOfUnits) setErrors((prev) => ({ ...prev, numberOfUnits: '' })); }}
              placeholder="e.g. 6"
              aria-label={`Number of units for ${toolName}`}
              className="input-field flex-1"
            />
            <input
              type="text"
              value={unitLabel}
              onChange={(e) => setUnitLabel(e.target.value)}
              placeholder="unit"
              aria-label="Unit label"
              className="input-field w-28"
            />
          </div>
        </InputArea>
      </div>

      <button onClick={calculate} aria-label="Calculate unit rate" className="btn-primary">
        Calculate Unit Rate
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.rate.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">{amountLabel} per {unitLabel}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-indigo-600">{result.inverse.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">{unitLabel} per {amountLabel}</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
              {totalAmount} {amountLabel} ÷ {numberOfUnits} {unitLabel} = {result.rate.toFixed(4)} {amountLabel}/{unitLabel}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
