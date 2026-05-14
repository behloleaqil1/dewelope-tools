'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ProfitMarginCalculator - Calculates gross and net profit margins from revenue and costs.
 */
export default function ProfitMarginCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [revenue, setRevenue] = useState('');
  const [cogs, setCogs] = useState('');
  const [expenses, setExpenses] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [result, setResult] = useState<{ grossProfit: number; netProfit: number; grossMargin: number; netMargin: number; markup: number } | null>(null);

  const calculate = () => {
    setError(undefined);
    setResult(null);
    const rev = parseFloat(revenue);
    const cost = parseFloat(cogs);
    const exp = parseFloat(expenses) || 0;

    if (isNaN(rev) || rev <= 0) { setError('Enter a valid revenue amount greater than 0'); return; }
    if (isNaN(cost) || cost < 0) { setError('Enter a valid cost of goods sold'); return; }

    const grossProfit = rev - cost;
    const netProfit = grossProfit - exp;
    const grossMargin = (grossProfit / rev) * 100;
    const netMargin = (netProfit / rev) * 100;
    const markup = cost > 0 ? (grossProfit / cost) * 100 : 0;

    setResult({ grossProfit, netProfit, grossMargin, netMargin, markup });
  };

  const copyText = result ? `Revenue: $${parseFloat(revenue).toFixed(2)}\nCOGS: $${parseFloat(cogs).toFixed(2)}\nGross Profit: $${result.grossProfit.toFixed(2)}\nGross Margin: ${result.grossMargin.toFixed(2)}%\nNet Profit: $${result.netProfit.toFixed(2)}\nNet Margin: ${result.netMargin.toFixed(2)}%\nMarkup: ${result.markup.toFixed(2)}%` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label htmlFor={`${toolId}-revenue`} className="block text-sm font-medium text-gray-700 mb-1">Revenue ($)</label>
            <input id={`${toolId}-revenue`} type="number" value={revenue} onChange={(e) => setRevenue(e.target.value)} placeholder="10000" aria-label={`Revenue input for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-cogs`} className="block text-sm font-medium text-gray-700 mb-1">Cost of Goods ($)</label>
            <input id={`${toolId}-cogs`} type="number" value={cogs} onChange={(e) => setCogs(e.target.value)} placeholder="6000" aria-label="Cost of goods sold" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-expenses`} className="block text-sm font-medium text-gray-700 mb-1">Other Expenses ($)</label>
            <input id={`${toolId}-expenses`} type="number" value={expenses} onChange={(e) => setExpenses(e.target.value)} placeholder="1000" aria-label="Other operating expenses" className="input-field" />
          </div>
        </div>
      </InputArea>
      <button onClick={calculate} aria-label="Calculate profit margins" className="btn-primary">Calculate</button>
      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'Gross Profit', value: `$${result.grossProfit.toFixed(2)}`, color: result.grossProfit >= 0 ? 'text-green-600' : 'text-red-600' },
                { label: 'Gross Margin', value: `${result.grossMargin.toFixed(2)}%`, color: result.grossMargin >= 0 ? 'text-green-600' : 'text-red-600' },
                { label: 'Markup', value: `${result.markup.toFixed(2)}%`, color: 'text-blue-600' },
                { label: 'Net Profit', value: `$${result.netProfit.toFixed(2)}`, color: result.netProfit >= 0 ? 'text-green-600' : 'text-red-600' },
                { label: 'Net Margin', value: `${result.netMargin.toFixed(2)}%`, color: result.netMargin >= 0 ? 'text-green-600' : 'text-red-600' },
              ].map(item => (
                <div key={item.label} className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                  <div className={`text-lg font-bold ${item.color}`}>{item.value}</div>
                  <div className="text-xs text-gray-500">{item.label}</div>
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
