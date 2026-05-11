'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * MarkupToSellingPrice - Calculates selling price from cost and markup percentage.
 * Shows selling price, profit amount, and profit margin percentage.
 */
export default function MarkupToSellingPrice({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [cost, setCost] = useState('');
  const [markup, setMarkup] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ sellingPrice: number; profit: number; margin: number } | null>(null);

  const calculate = () => {
    const newErrors: Record<string, string> = {};
    const costVal = parseFloat(cost);
    const markupVal = parseFloat(markup);

    if (!cost.trim() || isNaN(costVal)) {
      newErrors.cost = 'Please enter a valid cost';
    } else if (costVal < 0) {
      newErrors.cost = 'Cost cannot be negative';
    }

    if (!markup.trim() || isNaN(markupVal)) {
      newErrors.markup = 'Please enter a valid markup percentage';
    } else if (markupVal < 0) {
      newErrors.markup = 'Markup cannot be negative';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});
    const profit = costVal * (markupVal / 100);
    const sellingPrice = costVal + profit;
    const margin = sellingPrice > 0 ? (profit / sellingPrice) * 100 : 0;

    setResult({ sellingPrice, profit, margin });
  };

  const copyText = result
    ? `Cost: $${parseFloat(cost).toFixed(2)}\nMarkup: ${markup}%\nSelling Price: $${result.sellingPrice.toFixed(2)}\nProfit: $${result.profit.toFixed(2)}\nProfit Margin: ${result.margin.toFixed(2)}%`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputArea error={errors.cost}>
          <label htmlFor={`${toolId}-cost`} className="block text-sm font-medium text-gray-700 mb-1">
            Cost Price ($)
          </label>
          <input
            id={`${toolId}-cost`}
            type="text"
            inputMode="decimal"
            value={cost}
            onChange={(e) => { setCost(e.target.value); if (errors.cost) setErrors((prev) => ({ ...prev, cost: '' })); }}
            placeholder="e.g. 50"
            aria-label={`Cost price for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea error={errors.markup}>
          <label htmlFor={`${toolId}-markup`} className="block text-sm font-medium text-gray-700 mb-1">
            Markup Percentage (%)
          </label>
          <input
            id={`${toolId}-markup`}
            type="text"
            inputMode="decimal"
            value={markup}
            onChange={(e) => { setMarkup(e.target.value); if (errors.markup) setErrors((prev) => ({ ...prev, markup: '' })); }}
            placeholder="e.g. 40"
            aria-label={`Markup percentage for ${toolName}`}
            className="input-field"
          />
        </InputArea>
      </div>

      <button onClick={calculate} aria-label="Calculate selling price" className="btn-primary">
        Calculate Selling Price
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-green-600">${result.sellingPrice.toFixed(2)}</div>
                <div className="text-xs text-gray-500 mt-1">Selling Price</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">${result.profit.toFixed(2)}</div>
                <div className="text-xs text-gray-500 mt-1">Profit</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-purple-600">{result.margin.toFixed(2)}%</div>
                <div className="text-xs text-gray-500 mt-1">Profit Margin</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
              Selling Price = Cost × (1 + Markup/100) = ${parseFloat(cost).toFixed(2)} × {(1 + parseFloat(markup) / 100).toFixed(4)} = ${result.sellingPrice.toFixed(2)}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
