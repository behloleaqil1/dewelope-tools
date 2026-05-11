'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CookingConverter - Converts between cooking measurement units: cups, tablespoons, teaspoons, ml, liters, fluid oz.
 */
export default function CookingConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('cup');
  const [toUnit, setToUnit] = useState('ml');
  const [results, setResults] = useState<{ unit: string; value: string }[]>([]);
  const [error, setError] = useState<string | undefined>();

  // All in ml
  const TO_ML: Record<string, number> = {
    ml: 1,
    liter: 1000,
    cup: 236.588,
    tablespoon: 14.787,
    teaspoon: 4.929,
    'fluid-oz': 29.574,
    pint: 473.176,
    quart: 946.353,
    gallon: 3785.41,
    'dessert-spoon': 9.858,
  };

  const UNITS = [
    { value: 'ml', label: 'Milliliters (mL)' },
    { value: 'liter', label: 'Liters (L)' },
    { value: 'cup', label: 'Cups' },
    { value: 'tablespoon', label: 'Tablespoons (tbsp)' },
    { value: 'teaspoon', label: 'Teaspoons (tsp)' },
    { value: 'fluid-oz', label: 'Fluid Ounces (fl oz)' },
    { value: 'pint', label: 'Pints' },
    { value: 'quart', label: 'Quarts' },
    { value: 'gallon', label: 'Gallons' },
    { value: 'dessert-spoon', label: 'Dessert Spoons' },
  ];

  function convert() {
    setError(undefined);
    setResults([]);

    const num = parseFloat(value);
    if (!value.trim() || isNaN(num)) { setError('Please enter a valid number'); return; }

    const ml = num * TO_ML[fromUnit];
    const all = UNITS.map((u) => ({
      unit: u.label,
      value: (ml / TO_ML[u.value]).toLocaleString(undefined, { maximumFractionDigits: 4 }),
    }));
    setResults(all);
  }

  const toLabel = UNITS.find((u) => u.value === toUnit)?.label || toUnit;
  const mainResult = results.find((r) => r.unit === toLabel);
  const copyText = results.map((r) => `${r.unit}: ${r.value}`).join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">Cooking measurement for {toolName}</label>
        <input id={`${toolId}-value`} type="text" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Enter value" aria-label="Cooking value" className="input-field" />
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <label htmlFor={`${toolId}-from`} className="block text-xs text-gray-500 mb-1">From</label>
            <select id={`${toolId}-from`} value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} aria-label="Source unit" className="input-field text-sm">
              {UNITS.map((u) => (<option key={u.value} value={u.value}>{u.label}</option>))}
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-to`} className="block text-xs text-gray-500 mb-1">To</label>
            <select id={`${toolId}-to`} value={toUnit} onChange={(e) => setToUnit(e.target.value)} aria-label="Target unit" className="input-field text-sm">
              {UNITS.map((u) => (<option key={u.value} value={u.value}>{u.label}</option>))}
            </select>
          </div>
        </div>
      </InputArea>

      <button onClick={convert} aria-label="Convert cooking measurement" className="btn-primary">Convert</button>

      <OutputArea hasContent={results.length > 0}>
        {results.length > 0 && (
          <div className="space-y-3">
            {mainResult && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600 font-mono">{mainResult.value}</div>
                <div className="text-sm text-gray-500 mt-1">{mainResult.unit}</div>
              </div>
            )}
            <details className="bg-gray-50 rounded-lg border border-gray-200">
              <summary className="px-4 py-2 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 rounded-lg">All conversions</summary>
              <div className="px-4 pb-3 grid grid-cols-2 gap-2">
                {results.map((r) => (
                  <div key={r.unit} className="text-sm"><span className="text-gray-500">{r.unit}:</span> <span className="font-mono font-medium">{r.value}</span></div>
                ))}
              </div>
            </details>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
