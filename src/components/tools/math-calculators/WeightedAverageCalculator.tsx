'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * WeightedAverageCalculator - Calculate weighted average from values and weights.
 * Formula: Σ(value × weight) / Σ(weight)
 */
export default function WeightedAverageCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [entries, setEntries] = useState<{ value: string; weight: string }[]>([
    { value: '', weight: '' },
    { value: '', weight: '' },
    { value: '', weight: '' },
  ]);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ weightedAvg: number; totalWeight: number; sumProducts: number } | null>(null);

  const updateEntry = (index: number, field: 'value' | 'weight', val: string) => {
    const updated = [...entries];
    updated[index] = { ...updated[index], [field]: val };
    setEntries(updated);
  };

  const addRow = () => {
    setEntries([...entries, { value: '', weight: '' }]);
  };

  const removeRow = (index: number) => {
    if (entries.length <= 2) return;
    setEntries(entries.filter((_, i) => i !== index));
  };

  const calculate = () => {
    setError('');

    const parsed = entries
      .filter((e) => e.value.trim() !== '' || e.weight.trim() !== '')
      .map((e, i) => {
        const v = parseFloat(e.value);
        const w = parseFloat(e.weight);
        if (isNaN(v) || isNaN(w)) return null;
        if (w < 0) return null;
        return { value: v, weight: w, index: i };
      });

    const valid = parsed.filter((p) => p !== null) as { value: number; weight: number; index: number }[];

    if (valid.length < 2) {
      setError('Enter at least 2 valid value-weight pairs');
      setResult(null);
      return;
    }

    const totalWeight = valid.reduce((sum, p) => sum + p.weight, 0);
    if (totalWeight === 0) {
      setError('Total weight cannot be zero');
      setResult(null);
      return;
    }

    const sumProducts = valid.reduce((sum, p) => sum + p.value * p.weight, 0);
    const weightedAvg = sumProducts / totalWeight;

    setResult({ weightedAvg, totalWeight, sumProducts });
  };

  const copyText = result
    ? `Weighted Average: ${result.weightedAvg.toFixed(4)}\nSum of Products: ${result.sumProducts.toFixed(4)}\nTotal Weight: ${result.totalWeight.toFixed(4)}\nFormula: Σ(value × weight) / Σ(weight)`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label className="block text-sm font-medium text-gray-700 mb-2">Values and Weights</label>
        <div className="space-y-2">
          <div className="grid grid-cols-[1fr_1fr_auto] gap-2 text-xs font-medium text-gray-500">
            <span>Value</span>
            <span>Weight</span>
            <span className="w-8"></span>
          </div>
          {entries.map((entry, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2">
              <input
                type="text"
                inputMode="decimal"
                value={entry.value}
                onChange={(e) => updateEntry(i, 'value', e.target.value)}
                placeholder="Value"
                aria-label={`Value ${i + 1} for ${toolName}`}
                className="input-field text-sm"
              />
              <input
                type="text"
                inputMode="decimal"
                value={entry.weight}
                onChange={(e) => updateEntry(i, 'weight', e.target.value)}
                placeholder="Weight"
                aria-label={`Weight ${i + 1} for ${toolName}`}
                className="input-field text-sm"
              />
              <button
                onClick={() => removeRow(i)}
                disabled={entries.length <= 2}
                aria-label={`Remove row ${i + 1}`}
                className="w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-50 rounded disabled:opacity-30"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <button onClick={addRow} className="mt-2 text-sm text-blue-600 hover:text-blue-800">
          + Add Row
        </button>
      </InputArea>

      <button onClick={calculate} aria-label="Calculate weighted average" className="btn-primary">
        Calculate
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600">{result.weightedAvg.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">Weighted Average</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-gray-800">{result.sumProducts.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">Sum of Products</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-gray-800">{result.totalWeight.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">Total Weight</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
              Weighted Avg = Σ(value × weight) / Σ(weight) = {result.sumProducts.toFixed(2)} / {result.totalWeight.toFixed(2)} = {result.weightedAvg.toFixed(4)}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
