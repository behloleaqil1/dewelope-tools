'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TaxCalculator - Calculates tax amount and total from a price and tax rate.
 * Supports adding tax or extracting tax from a tax-inclusive price.
 */
export default function TaxCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [amount, setAmount] = useState('');
  const [taxRate, setTaxRate] = useState('');
  const [mode, setMode] = useState<'add' | 'extract'>('add');
  const [result, setResult] = useState<{ subtotal: number; tax: number; total: number } | null>(null);
  const [error, setError] = useState<string | undefined>();

  function calculate() {
    setError(undefined);
    setResult(null);

    const amt = parseFloat(amount);
    const rate = parseFloat(taxRate);

    if (isNaN(amt) || !amount.trim()) { setError('Please enter a valid amount'); return; }
    if (isNaN(rate) || !taxRate.trim() || rate < 0) { setError('Please enter a valid tax rate'); return; }

    if (mode === 'add') {
      const tax = amt * (rate / 100);
      setResult({ subtotal: amt, tax, total: amt + tax });
    } else {
      const subtotal = amt / (1 + rate / 100);
      const tax = amt - subtotal;
      setResult({ subtotal, tax, total: amt });
    }
  }

  const copyText = result ? `Subtotal: $${result.subtotal.toFixed(2)}\nTax (${taxRate}%): $${result.tax.toFixed(2)}\nTotal: $${result.total.toFixed(2)}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="flex gap-2 mb-2">
        <button onClick={() => setMode('add')} className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === 'add' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`} aria-label="Add tax mode">Add Tax</button>
        <button onClick={() => setMode('extract')} className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === 'extract' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`} aria-label="Extract tax mode">Extract Tax</button>
      </div>

      <InputArea error={error}>
        <label className="block text-sm font-medium text-gray-700 mb-3">{mode === 'add' ? 'Price before tax' : 'Price including tax'} for {toolName}</label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${toolId}-amt`} className="block text-xs text-gray-500 mb-1">Amount ($)</label>
            <input id={`${toolId}-amt`} type="text" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="100.00" aria-label="Amount" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-rate`} className="block text-xs text-gray-500 mb-1">Tax Rate (%)</label>
            <input id={`${toolId}-rate`} type="text" inputMode="decimal" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} placeholder="8.5" aria-label="Tax rate" className="input-field" />
          </div>
        </div>
      </InputArea>

      <button onClick={calculate} aria-label="Calculate tax" className="btn-primary">Calculate</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-gray-700">${result.subtotal.toFixed(2)}</div>
                <div className="text-xs text-gray-500">Subtotal</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-center">
                <div className="text-xl font-bold text-red-600">${result.tax.toFixed(2)}</div>
                <div className="text-xs text-gray-500">Tax ({taxRate}%)</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center">
                <div className="text-xl font-bold text-green-600">${result.total.toFixed(2)}</div>
                <div className="text-xs text-gray-500">Total</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
