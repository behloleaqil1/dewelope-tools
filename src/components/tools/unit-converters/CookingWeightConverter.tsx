'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CookingWeightConverter - Converts between grams, ounces, pounds, kilograms for cooking.
 */
export default function CookingWeightConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('grams');
  const [result, setResult] = useState<Record<string, number> | null>(null);
  const [error, setError] = useState('');

  const units: Record<string, number> = {
    grams: 1,
    ounces: 28.3495,
    pounds: 453.592,
    kilograms: 1000,
    milligrams: 0.001,
  };

  const unitLabels: Record<string, string> = {
    grams: 'Grams (g)',
    ounces: 'Ounces (oz)',
    pounds: 'Pounds (lb)',
    kilograms: 'Kilograms (kg)',
    milligrams: 'Milligrams (mg)',
  };

  const convert = () => {
    setError('');
    setResult(null);

    const num = parseFloat(value);
    if (!value.trim() || isNaN(num)) {
      setError('Please enter a valid number');
      return;
    }

    const inGrams = num * units[fromUnit];
    const conversions: Record<string, number> = {};
    Object.keys(units).forEach((unit) => {
      conversions[unit] = inGrams / units[unit];
    });
    setResult(conversions);
  };

  const copyText = result
    ? Object.entries(result).map(([unit, val]) => `${unitLabels[unit]}: ${val.toFixed(4)}`).join('\n')
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">
          Weight Value
        </label>
        <input
          id={`${toolId}-value`}
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="e.g. 250"
          aria-label={`Weight value for ${toolName}`}
          className="input-field"
        />
        <label htmlFor={`${toolId}-from`} className="block text-sm font-medium text-gray-700 mb-1 mt-3">
          From Unit
        </label>
        <select
          id={`${toolId}-from`}
          value={fromUnit}
          onChange={(e) => setFromUnit(e.target.value)}
          aria-label="Source weight unit"
          className="input-field"
        >
          {Object.entries(unitLabels).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </InputArea>

      <button onClick={convert} aria-label="Convert cooking weight" className="btn-primary">
        Convert
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(result).map(([unit, val]) => (
                <div key={unit} className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                  <div className="text-lg font-bold text-gray-800">{val.toFixed(4)}</div>
                  <div className="text-xs text-gray-500">{unitLabels[unit]}</div>
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
