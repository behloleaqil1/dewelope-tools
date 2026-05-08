'use client';

import { useState } from 'react';
import { ToolEngineProps } from '@/types';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';
import { validateNumeric, validateRange } from '@/lib/validation';
import { calculateTip } from '@/lib/calculators';

/**
 * TipCalculator - Calculates tip amount, total bill, and per-person split.
 * Displays the formula alongside results.
 * Validates numeric inputs with range checking and shows field-specific errors.
 */
export default function TipCalculator({ toolId, toolName }: ToolEngineProps) {
  const [billAmount, setBillAmount] = useState('');
  const [tipPercent, setTipPercent] = useState('');
  const [people, setPeople] = useState('1');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{
    tipAmount: number;
    totalAmount: number;
    perPerson: number;
    formula: string;
  } | null>(null);

  const calculate = () => {
    const newErrors: Record<string, string> = {};

    const billValidation = validateNumeric(billAmount, 'billAmount');
    if (!billValidation.valid) {
      newErrors.billAmount = billValidation.error!;
    }

    const tipValidation = validateNumeric(tipPercent, 'tipPercent');
    if (!tipValidation.valid) {
      newErrors.tipPercent = tipValidation.error!;
    }

    const peopleValidation = validateNumeric(people, 'people');
    if (!peopleValidation.valid) {
      newErrors.people = peopleValidation.error!;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    const numBill = Number(billAmount.trim());
    const numTip = Number(tipPercent.trim());
    const numPeople = Number(people.trim());

    const rangeBill = validateRange(numBill, 0, 999999999, 'billAmount');
    if (!rangeBill.valid) {
      newErrors.billAmount = rangeBill.error!;
    }

    const rangeTip = validateRange(numTip, 0, 100, 'tipPercent');
    if (!rangeTip.valid) {
      newErrors.tipPercent = rangeTip.error!;
    }

    const rangePeople = validateRange(numPeople, 1, 100, 'people');
    if (!rangePeople.valid) {
      newErrors.people = rangePeople.error!;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});
    setResult(calculateTip(numBill, numTip, numPeople));
  };

  const handleBillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBillAmount(e.target.value);
    if (errors.billAmount) {
      setErrors((prev) => ({ ...prev, billAmount: '' }));
    }
  };

  const handleTipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTipPercent(e.target.value);
    if (errors.tipPercent) {
      setErrors((prev) => ({ ...prev, tipPercent: '' }));
    }
  };

  const handlePeopleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPeople(e.target.value);
    if (errors.people) {
      setErrors((prev) => ({ ...prev, people: '' }));
    }
  };

  return (
    <div className="space-y-6" data-tool-id={toolId}>
      <div className="space-y-4">
        <InputArea error={errors.billAmount}>
          <label htmlFor="tip-bill" className="block text-sm font-medium text-gray-700">
            Bill Amount ($)
          </label>
          <input
            id="tip-bill"
            type="text"
            inputMode="decimal"
            value={billAmount}
            onChange={handleBillChange}
            placeholder="Enter bill amount"
            aria-label={`Bill amount for ${toolName}`}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
          />
        </InputArea>

        <InputArea error={errors.tipPercent}>
          <label htmlFor="tip-percent" className="block text-sm font-medium text-gray-700">
            Tip Percentage (%)
          </label>
          <input
            id="tip-percent"
            type="text"
            inputMode="decimal"
            value={tipPercent}
            onChange={handleTipChange}
            placeholder="Enter tip percentage"
            aria-label={`Tip percentage for ${toolName}`}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
          />
        </InputArea>

        <InputArea error={errors.people}>
          <label htmlFor="tip-people" className="block text-sm font-medium text-gray-700">
            Number of People
          </label>
          <input
            id="tip-people"
            type="text"
            inputMode="numeric"
            value={people}
            onChange={handlePeopleChange}
            placeholder="Enter number of people"
            aria-label={`Number of people for ${toolName}`}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
          />
        </InputArea>

        <button
          onClick={calculate}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-h-[44px] min-w-[44px]"
        >
          Calculate Tip
        </button>
      </div>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-3 rounded border border-gray-200">
                <div className="text-sm text-gray-500">Tip Amount</div>
                <div className="text-lg font-semibold text-gray-800">${result.tipAmount.toFixed(2)}</div>
              </div>
              <div className="bg-white p-3 rounded border border-gray-200">
                <div className="text-sm text-gray-500">Total</div>
                <div className="text-lg font-semibold text-gray-800">${result.totalAmount.toFixed(2)}</div>
              </div>
              <div className="bg-white p-3 rounded border border-gray-200">
                <div className="text-sm text-gray-500">Per Person</div>
                <div className="text-lg font-semibold text-gray-800">${result.perPerson.toFixed(2)}</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-white p-3 rounded border border-gray-200 font-mono break-all">
              {result.formula}
            </div>
            <CopyToClipboard
              text={`Tip: $${result.tipAmount.toFixed(2)} | Total: $${result.totalAmount.toFixed(2)} | Per person: $${result.perPerson.toFixed(2)}`}
            />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
