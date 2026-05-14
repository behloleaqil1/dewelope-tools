'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const BRACKETS = [
  { min: 0, max: 11000, rate: 10 },
  { min: 11001, max: 44725, rate: 12 },
  { min: 44726, max: 95375, rate: 22 },
  { min: 95376, max: 182100, rate: 24 },
  { min: 182101, max: 231250, rate: 32 },
  { min: 231251, max: 578125, rate: 35 },
  { min: 578126, max: Infinity, rate: 37 },
];

/**
 * TaxBracketCalculator - Calculates tax per bracket and effective tax rate (US federal single filer).
 */
export default function TaxBracketCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [income, setIncome] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [result, setResult] = useState<{ brackets: { range: string; rate: number; taxable: number; tax: number }[]; totalTax: number; effectiveRate: number; marginalRate: number } | null>(null);

  const calculate = () => {
    setError(undefined);
    setResult(null);
    const inc = parseFloat(income);
    if (isNaN(inc) || inc < 0) { setError('Enter a valid income amount'); return; }

    let remaining = inc;
    let totalTax = 0;
    let marginalRate = 10;
    const bracketResults: { range: string; rate: number; taxable: number; tax: number }[] = [];

    for (const bracket of BRACKETS) {
      if (remaining <= 0) break;
      const bracketSize = bracket.max === Infinity ? remaining : bracket.max - bracket.min + 1;
      const taxable = Math.min(remaining, bracketSize);
      const tax = taxable * (bracket.rate / 100);
      bracketResults.push({
        range: bracket.max === Infinity ? `$${bracket.min.toLocaleString()}+` : `$${bracket.min.toLocaleString()} - $${bracket.max.toLocaleString()}`,
        rate: bracket.rate,
        taxable,
        tax,
      });
      totalTax += tax;
      marginalRate = bracket.rate;
      remaining -= taxable;
    }

    const effectiveRate = inc > 0 ? (totalTax / inc) * 100 : 0;
    setResult({ brackets: bracketResults, totalTax, effectiveRate, marginalRate });
  };

  const copyText = result ? `Income: $${parseFloat(income).toLocaleString()}\nTotal Tax: $${result.totalTax.toFixed(2)}\nEffective Rate: ${result.effectiveRate.toFixed(2)}%\nMarginal Rate: ${result.marginalRate}%\n\n${result.brackets.map(b => `${b.range} @ ${b.rate}%: $${b.tax.toFixed(2)}`).join('\n')}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-income`} className="block text-sm font-medium text-gray-700 mb-1">Taxable Income ($)</label>
        <input id={`${toolId}-income`} type="number" value={income} onChange={(e) => setIncome(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && calculate()} placeholder="75000" aria-label={`Taxable income for ${toolName}`} className="input-field" />
        <p className="text-xs text-gray-500 mt-1">Based on US federal tax brackets (single filer, 2024)</p>
      </InputArea>
      <button onClick={calculate} aria-label="Calculate tax brackets" className="btn-primary">Calculate</button>
      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-center">
                <div className="text-lg font-bold text-blue-700">${result.totalTax.toFixed(2)}</div>
                <div className="text-xs text-gray-500">Total Tax</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200 text-center">
                <div className="text-lg font-bold text-green-700">{result.effectiveRate.toFixed(2)}%</div>
                <div className="text-xs text-gray-500">Effective Rate</div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200 text-center">
                <div className="text-lg font-bold text-purple-700">{result.marginalRate}%</div>
                <div className="text-xs text-gray-500">Marginal Rate</div>
              </div>
            </div>
            <div className="space-y-1">
              {result.brackets.map((b, i) => (
                <div key={i} className="flex items-center justify-between bg-gray-50 p-2 rounded border border-gray-200 text-sm">
                  <span className="text-gray-600">{b.range}</span>
                  <span className="text-gray-500">{b.rate}%</span>
                  <span className="font-mono font-semibold text-gray-800">${b.tax.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
