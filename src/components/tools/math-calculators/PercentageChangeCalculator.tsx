'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PercentageChangeCalculator - Calculates the percentage change between two values.
 * Shows increase/decrease with formula.
 */
export default function PercentageChangeCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [oldValue, setOldValue] = useState('');
  const [newValue, setNewValue] = useState('');
  const [result, setResult] = useState<{ change: number; difference: number; isIncrease: boolean } | null>(null);
  const [error, setError] = useState<string | undefined>();

  function calculate() {
    setError(undefined);
    setResult(null);

    const old = parseFloat(oldValue);
    const current = parseFloat(newValue);

    if (!oldValue.trim() || isNaN(old)) {
      setError('Please enter a valid original value');
      return;
    }
    if (!newValue.trim() || isNaN(current)) {
      setError('Please enter a valid new value');
      return;
    }
    if (old === 0) {
      setError('Original value cannot be zero (division by zero)');
      return;
    }

    const difference = current - old;
    const change = (difference / Math.abs(old)) * 100;

    setResult({ change, difference, isIncrease: difference >= 0 });
  }

  const copyText = result
    ? `Percentage Change: ${result.change >= 0 ? '+' : ''}${result.change.toFixed(2)}%\nDifference: ${result.difference >= 0 ? '+' : ''}${result.difference.toFixed(2)}\nFormula: ((${newValue} - ${oldValue}) / |${oldValue}|) × 100`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label className="block text-sm font-medium text-gray-700 mb-3" id={`${toolId}-label`}>
          Calculate percentage change for {toolName}
        </label>
        <div className="grid grid-cols-2 gap-3" aria-labelledby={`${toolId}-label`}>
          <div>
            <label htmlFor={`${toolId}-old`} className="block text-xs text-gray-500 mb-1">Original Value</label>
            <input
              id={`${toolId}-old`}
              type="text"
              inputMode="decimal"
              value={oldValue}
              onChange={(e) => setOldValue(e.target.value)}
              placeholder="e.g. 100"
              aria-label="Original value"
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-new`} className="block text-xs text-gray-500 mb-1">New Value</label>
            <input
              id={`${toolId}-new`}
              type="text"
              inputMode="decimal"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="e.g. 125"
              aria-label="New value"
              className="input-field"
            />
          </div>
        </div>
      </InputArea>

      <button onClick={calculate} aria-label="Calculate percentage change" className="btn-primary">
        Calculate Change
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className={`text-3xl font-bold ${result.isIncrease ? 'text-green-600' : 'text-red-600'}`}>
                  {result.change >= 0 ? '+' : ''}{result.change.toFixed(2)}%
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {result.isIncrease ? '↑ Increase' : '↓ Decrease'}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className={`text-2xl font-bold ${result.isIncrease ? 'text-green-600' : 'text-red-600'}`}>
                  {result.difference >= 0 ? '+' : ''}{result.difference.toFixed(2)}
                </div>
                <div className="text-xs text-gray-500 mt-1">Difference</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono text-center">
              (({newValue} - {oldValue}) / |{oldValue}|) × 100 = {result.change.toFixed(2)}%
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
