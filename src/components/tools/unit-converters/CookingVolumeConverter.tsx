'use client';

import { useState } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CookingVolumeConverter - Convert between cups, tablespoons, teaspoons, and milliliters.
 */
export default function CookingVolumeConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('cups');

  const units: Record<string, number> = {
    cups: 236.588,
    tablespoons: 14.787,
    teaspoons: 4.929,
    ml: 1,
    liters: 1000,
    'fluid-oz': 29.574,
    pints: 473.176,
    quarts: 946.353,
    gallons: 3785.41,
  };

  const convert = (): string => {
    const num = parseFloat(value);
    if (isNaN(num) || num < 0) return '';
    const ml = num * units[fromUnit];
    const results = Object.entries(units)
      .filter(([u]) => u !== fromUnit)
      .map(([unit, factor]) => {
        const converted = ml / factor;
        const label = unit.replace('-', ' ');
        return `${label}: ${converted < 0.01 ? converted.toExponential(2) : converted.toFixed(3)}`;
      });
    return results.join('\n');
  };

  const result = convert();

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div>
        <label htmlFor={`${toolId}-val`} className="block text-sm font-medium text-gray-700 mb-1">Value</label>
        <input id={`${toolId}-val`} type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder="e.g. 2" aria-label={`Value for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label htmlFor={`${toolId}-unit`} className="block text-sm font-medium text-gray-700 mb-1">From Unit</label>
        <select id={`${toolId}-unit`} value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} aria-label={`Unit for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="cups">Cups</option>
          <option value="tablespoons">Tablespoons</option>
          <option value="teaspoons">Teaspoons</option>
          <option value="ml">Milliliters</option>
          <option value="liters">Liters</option>
          <option value="fluid-oz">Fluid Ounces</option>
          <option value="pints">Pints</option>
          <option value="quarts">Quarts</option>
          <option value="gallons">Gallons</option>
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
