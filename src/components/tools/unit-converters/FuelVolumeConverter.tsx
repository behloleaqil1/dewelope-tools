'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const UNITS: Record<string, number> = { barrel: 158.987, gallon_us: 3.78541, gallon_uk: 4.54609, liter: 1, milliliter: 0.001 };
const LABELS: Record<string, string> = { barrel: 'Barrel (bbl)', gallon_us: 'US Gallon', gallon_uk: 'UK Gallon', liter: 'Liter', milliliter: 'Milliliter' };

export default function FuelVolumeConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('barrel');
  const [result, setResult] = useState('');

  const convert = () => {
    const num = parseFloat(value);
    if (isNaN(num)) return;
    const liters = num * UNITS[fromUnit];
    const lines = Object.entries(UNITS).map(([unit, factor]) => `${LABELS[unit]}: ${(liters / factor).toFixed(4)}`);
    setResult(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-val`} className="block text-sm font-medium text-gray-700 mb-1">Value</label>
        <input id={`${toolId}-val`} type="text" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} placeholder="e.g. 1" aria-label={`Value for ${toolName}`} className="input-field" />
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-unit`} className="block text-sm font-medium text-gray-700 mb-1">From Unit</label>
        <select id={`${toolId}-unit`} value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} aria-label={`Unit for ${toolName}`} className="input-field">
          {Object.entries(LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </InputArea>
      <button onClick={convert} className="btn-primary" aria-label="Convert">Convert</button>
      <OutputArea hasContent={!!result}>
        {result && (
          <div className="space-y-2">
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{result}</pre>
            <CopyToClipboard text={result} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
