'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * MarginCalculator - Calculates profit margin, markup, and profit from cost and revenue.
 */
export default function MarginCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [cost, setCost] = useState('');
  const [revenue, setRevenue] = useState('');
  const [result, setResult] = useState<{ profit: number; margin: number; markup: number } | null>(null);
  const [error, setError] = useState<string | undefined>();

  function calculate() {
    setError(undefined);
    setResult(null);

    const c = parseFloat(cost);
    const r = parseFloat(revenue);

    if (isNaN(c) || !cost.trim()) { setError('Please enter a valid cost'); return; }
    if (isNaN(r) || !revenue.trim()) { setError('Please enter a valid revenue/selling price'); return; }
    if (r === 0) { setError('Revenue cannot be zero'); return; }
    if (c === 0) { setError('Cost cannot be zero for markup calculation'); return; }

    const profit = r - c;
    const margin = (profit / r) * 100;
    const markup = (profit / c) * 100;

    setResult({ profit, margin, markup });
  }

  const copyText = result ? `Profit: $${result.profit.toFixed(2)}\nMargin: ${result.margin.toFixed(2)}%\nMarkup: ${result.markup.toFixed(2)}%` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label className="block text-sm font-medium text-gray-700 mb-3">Enter cost and revenue for {toolName}</label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${toolId}-cost`} className="block text-xs text-gray-500 mb-1">Cost ($)</label>
            <input id={`${toolId}-cost`} type="text" inputMode="decimal" value={cost} onChange={(e) => setCost(e.target.value)} placeholder="50.00" aria-label="Cost" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-rev`} className="block text-xs text-gray-500 mb-1">Selling Price ($)</label>
            <input id={`${toolId}-rev`} type="text" inputMode="decimal" value={revenue} onChange={(e) => setRevenue(e.target.value)} placeholder="80.00" aria-label="Revenue" className="input-field" />
          </div>
        </div>
      </InputArea>

      <button onClick={calculate} aria-label="Calculate margin" className="btn-primary">Calculate</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className={`text-xl font-bold ${result.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>${result.profit.toFixed(2)}</div>
                <div className="text-xs text-gray-500">Profit</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className={`text-xl font-bold ${result.margin >= 0 ? 'text-blue-600' : 'text-red-600'}`}>{result.margin.toFixed(2)}%</div>
                <div className="text-xs text-gray-500">Margin</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className={`text-xl font-bold ${result.markup >= 0 ? 'text-purple-600' : 'text-red-600'}`}>{result.markup.toFixed(2)}%</div>
                <div className="text-xs text-gray-500">Markup</div>
              </div>
            </div>
            <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <p><strong>Margin</strong> = (Revenue - Cost) / Revenue × 100</p>
              <p><strong>Markup</strong> = (Revenue - Cost) / Cost × 100</p>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
