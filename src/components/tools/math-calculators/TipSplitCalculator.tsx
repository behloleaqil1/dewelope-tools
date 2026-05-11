'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TipSplitCalculator - Split a bill with tip among multiple people.
 */
export default function TipSplitCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [billAmount, setBillAmount] = useState('');
  const [tipPercent, setTipPercent] = useState('18');
  const [numPeople, setNumPeople] = useState('2');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const calculate = () => {
    const newErrors: Record<string, string> = {};
    const bill = parseFloat(billAmount);
    const tip = parseFloat(tipPercent);
    const people = parseInt(numPeople);

    if (!billAmount.trim() || isNaN(bill) || bill <= 0) newErrors.bill = 'Enter a valid bill amount';
    if (!tipPercent.trim() || isNaN(tip) || tip < 0) newErrors.tip = 'Enter a valid tip percentage';
    if (!numPeople.trim() || isNaN(people) || people < 1) newErrors.people = 'Enter at least 1 person';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return null;
    }
    setErrors({});

    const tipAmount = bill * (tip / 100);
    const total = bill + tipAmount;
    const perPerson = total / people;
    const tipPerPerson = tipAmount / people;

    return { bill, tipAmount, total, perPerson, tipPerPerson, people, tipPercent: tip };
  };

  const [result, setResult] = useState<ReturnType<typeof calculate>>(null);

  const handleCalculate = () => {
    setResult(calculate());
  };

  const copyText = result
    ? `Bill: $${result.bill.toFixed(2)}\nTip (${result.tipPercent}%): $${result.tipAmount.toFixed(2)}\nTotal: $${result.total.toFixed(2)}\nSplit ${result.people} ways: $${result.perPerson.toFixed(2)} per person\nTip per person: $${result.tipPerPerson.toFixed(2)}`
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
            onChange={(e) => { setBillAmount(e.target.value); if (errors.bill) setErrors(prev => ({ ...prev, bill: '' })); }}
            placeholder="e.g. 85.50"
            aria-label={`Bill amount for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea error={errors.tip}>
          <label htmlFor={`${toolId}-tip`} className="block text-sm font-medium text-gray-700 mb-1">
            Tip Percentage (%)
          </label>
          <input
            id={`${toolId}-tip`}
            type="text"
            inputMode="decimal"
            value={tipPercent}
            onChange={(e) => { setTipPercent(e.target.value); if (errors.tip) setErrors(prev => ({ ...prev, tip: '' })); }}
            placeholder="e.g. 18"
            aria-label={`Tip percentage for ${toolName}`}
            className="input-field"
          />
          <div className="flex gap-2 mt-2">
            {[10, 15, 18, 20, 25].map(p => (
              <button key={p} onClick={() => setTipPercent(p.toString())} className={`px-3 py-1 text-xs rounded border ${tipPercent === p.toString() ? 'bg-blue-100 border-blue-300 text-blue-700' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'}`}>
                {p}%
              </button>
            ))}
          </div>
        </InputArea>

        <InputArea error={errors.people}>
          <label htmlFor={`${toolId}-people`} className="block text-sm font-medium text-gray-700 mb-1">
            Number of People
          </label>
          <input
            id={`${toolId}-people`}
            type="text"
            inputMode="numeric"
            value={numPeople}
            onChange={(e) => { setNumPeople(e.target.value); if (errors.people) setErrors(prev => ({ ...prev, people: '' })); }}
            placeholder="e.g. 4"
            aria-label={`Number of people for ${toolName}`}
            className="input-field"
          />
        </InputArea>
      </div>

      <button onClick={handleCalculate} aria-label="Calculate tip split" className="btn-primary">
        Calculate Split
      </button>

      <OutputArea hasContent={result !== null && result !== undefined}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
                <div className="text-2xl font-bold text-blue-600">${result.perPerson.toFixed(2)}</div>
                <div className="text-xs text-gray-500 mt-1">Per Person</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center">
                <div className="text-2xl font-bold text-green-600">${result.total.toFixed(2)}</div>
                <div className="text-xs text-gray-500 mt-1">Total with Tip</div>
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-gray-600">Bill:</span><span className="font-mono">${result.bill.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Tip ({result.tipPercent}%):</span><span className="font-mono">${result.tipAmount.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Tip per person:</span><span className="font-mono">${result.tipPerPerson.toFixed(2)}</span></div>
              <div className="flex justify-between font-medium"><span className="text-gray-700">Each pays:</span><span className="font-mono">${result.perPerson.toFixed(2)}</span></div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
