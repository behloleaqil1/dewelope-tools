'use client';

import { useState } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CalorieConverter - Convert between calories, kilojoules, and BTU.
 */
export default function CalorieConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('calories');

  const convert = (): string => {
    const num = parseFloat(value);
    if (isNaN(num)) return '';
    // Convert to calories first
    let cal: number;
    switch (fromUnit) {
      case 'calories': cal = num; break;
      case 'kilocalories': cal = num * 1000; break;
      case 'kilojoules': cal = num * 239.006; break;
      case 'btu': cal = num * 252.164; break;
      case 'joules': cal = num * 0.239006; break;
      default: cal = num;
    }

    const results = [
      `Calories (cal): ${cal.toFixed(2)}`,
      `Kilocalories (kcal): ${(cal / 1000).toFixed(4)}`,
      `Kilojoules (kJ): ${(cal / 239.006).toFixed(4)}`,
      `Joules (J): ${(cal / 0.239006).toFixed(2)}`,
      `BTU: ${(cal / 252.164).toFixed(4)}`,
    ];
    return results.join('\n');
  };

  const result = convert();

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div>
        <label htmlFor={`${toolId}-val`} className="block text-sm font-medium text-gray-700 mb-1">Value</label>
        <input id={`${toolId}-val`} type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder="e.g. 2000" aria-label={`Value for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label htmlFor={`${toolId}-unit`} className="block text-sm font-medium text-gray-700 mb-1">From Unit</label>
        <select id={`${toolId}-unit`} value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} aria-label={`Unit for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="calories">Calories (cal)</option>
          <option value="kilocalories">Kilocalories (kcal)</option>
          <option value="kilojoules">Kilojoules (kJ)</option>
          <option value="joules">Joules (J)</option>
          <option value="btu">BTU</option>
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
