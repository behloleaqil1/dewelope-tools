'use client';

import { useState } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CookingWeightUnitConverter - Convert between grams, ounces, pounds for cooking.
 */
export default function CookingWeightUnitConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('grams');

  const units: Record<string, number> = {
    grams: 1,
    ounces: 28.3495,
    pounds: 453.592,
    kilograms: 1000,
    milligrams: 0.001,
    sticks_butter: 113.4,
  };

  const convert = (): string => {
    const num = parseFloat(value);
    if (isNaN(num) || num < 0) return '';
    const grams = num * units[fromUnit];
    const results = Object.entries(units)
      .filter(([u]) => u !== fromUnit)
      .map(([unit, factor]) => {
        const converted = grams / factor;
        const label = unit.replace(/_/g, ' ');
        return `${label}: ${converted.toFixed(3)}`;
      });
    return results.join('\n');
  };

  const result = convert();

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div>
        <label htmlFor={`${toolId}-val`} className="block text-sm font-medium text-gray-700 mb-1">Value</label>
        <input id={`${toolId}-val`} type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder="e.g. 250" aria-label={`Value for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label htmlFor={`${toolId}-unit`} className="block text-sm font-medium text-gray-700 mb-1">From Unit</label>
        <select id={`${toolId}-unit`} value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} aria-label={`Unit for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="grams">Grams</option>
          <option value="ounces">Ounces</option>
          <option value="pounds">Pounds</option>
          <option value="kilograms">Kilograms</option>
          <option value="milligrams">Milligrams</option>
          <option value="sticks_butter">Sticks of Butter</option>
        </select>
      </div>
      <OutputArea hasContent={!!result}>
        {result && (
          <div className="space-y-2">
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded-lg">{result}</pre>
            <CopyToClipboard text={result} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
