'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ParetoChartCalculator - Calculate Pareto chart data (80/20 rule analysis).
 * Sorts categories by frequency/value, calculates cumulative percentages,
 * and identifies the vital few vs trivial many.
 */
export default function ParetoChartCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{
    items: { category: string; value: number; percentage: number; cumulative: number }[];
    total: number;
    vitalFewCount: number;
  } | null>(null);

  const calculate = () => {
    const newErrors: Record<string, string> = {};

    if (!input.trim()) {
      newErrors.input = 'Please enter data (one item per line: category, value)';
      setErrors(newErrors);
      setResult(null);
      return;
    }

    const lines = input.trim().split('\n').filter((l) => l.trim());
    const items: { category: string; value: number }[] = [];

    for (const line of lines) {
      const parts = line.split(/[,\t]+/);
      if (parts.length < 2) {
        newErrors.input = `Invalid format on line: "${line}". Use: category, value`;
        setErrors(newErrors);
        setResult(null);
        return;
      }
      const category = parts[0].trim();
      const value = parseFloat(parts[1].trim());
      if (!category || isNaN(value) || value < 0) {
        newErrors.input = `Invalid data on line: "${line}". Value must be a non-negative number.`;
        setErrors(newErrors);
        setResult(null);
        return;
      }
      items.push({ category, value });
    }

    if (items.length < 2) {
      newErrors.input = 'Please enter at least 2 items for Pareto analysis';
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});

    // Sort descending by value
    items.sort((a, b) => b.value - a.value);
    const total = items.reduce((sum, item) => sum + item.value, 0);

    let cumulative = 0;
    let vitalFewCount = 0;
    const analyzed = items.map((item) => {
      const percentage = (item.value / total) * 100;
      cumulative += percentage;
      if (cumulative <= 80 || vitalFewCount === 0) {
        vitalFewCount++;
      }
      return {
        category: item.category,
        value: item.value,
        percentage,
        cumulative,
      };
    });

    setResult({ items: analyzed, total, vitalFewCount });
  };

  const copyText = result
    ? `Pareto Analysis (80/20 Rule)\nTotal: ${result.total}\nVital Few: ${result.vitalFewCount} of ${result.items.length} categories\n\n${result.items.map((item, i) => `${i + 1}. ${item.category}: ${item.value} (${item.percentage.toFixed(1)}%, cumulative: ${item.cumulative.toFixed(1)}%)`).join('\n')}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={errors.input}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter Data (one per line: category, value)
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => { setInput(e.target.value); if (errors.input) setErrors((prev) => ({ ...prev, input: '' })); }}
          placeholder={"Defects, 45\nDelays, 30\nCost overrun, 15\nMissing parts, 8\nOther, 2"}
          aria-label={`Data input for ${toolName}`}
          className="input-field h-40 resize-y font-mono"
        />
      </InputArea>

      <button onClick={calculate} aria-label="Calculate Pareto chart" className="btn-primary">
        Analyze
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600">{result.total}</div>
                <div className="text-xs text-gray-500">Total Value</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-green-600">{result.vitalFewCount} of {result.items.length}</div>
                <div className="text-xs text-gray-500">Vital Few (≈80%)</div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left p-2 border border-gray-200">#</th>
                    <th className="text-left p-2 border border-gray-200">Category</th>
                    <th className="text-right p-2 border border-gray-200">Value</th>
                    <th className="text-right p-2 border border-gray-200">%</th>
                    <th className="text-right p-2 border border-gray-200">Cumulative %</th>
                  </tr>
                </thead>
                <tbody>
                  {result.items.map((item, i) => (
                    <tr key={i} className={i < result.vitalFewCount ? 'bg-green-50' : ''}>
                      <td className="p-2 border border-gray-200">{i + 1}</td>
                      <td className="p-2 border border-gray-200">{item.category}</td>
                      <td className="p-2 border border-gray-200 text-right">{item.value}</td>
                      <td className="p-2 border border-gray-200 text-right">{item.percentage.toFixed(1)}%</td>
                      <td className="p-2 border border-gray-200 text-right">{item.cumulative.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap gap-2">
              {result.items.map((item, i) => (
                <div key={i} className="flex-1 min-w-0" style={{ minWidth: '40px' }}>
                  <div
                    className={`rounded-t ${i < result.vitalFewCount ? 'bg-blue-500' : 'bg-gray-300'}`}
                    style={{ height: `${Math.max(4, (item.percentage / result.items[0].percentage) * 80)}px` }}
                    title={`${item.category}: ${item.percentage.toFixed(1)}%`}
                  />
                  <div className="text-xs text-center text-gray-500 truncate mt-1">{item.category}</div>
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
