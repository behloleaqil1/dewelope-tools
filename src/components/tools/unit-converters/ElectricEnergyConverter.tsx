'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ElectricEnergyConverter - Convert between Wh, kWh, MWh, J, MJ, GJ.
 */
export default function ElectricEnergyConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('kwh');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>();

  // All in Wh
  const FACTORS: Record<string, number> = {
    wh: 1, kwh: 1000, mwh: 1000000, j: 1 / 3600, mj: 1000000 / 3600, gj: 1000000000 / 3600,
  };
  const LABELS: Record<string, string> = {
    wh: 'Wh', kwh: 'kWh', mwh: 'MWh', j: 'Joules (J)', mj: 'Megajoules (MJ)', gj: 'Gigajoules (GJ)',
  };

  function convert() {
    setError(undefined);
    setResult(null);
    const num = parseFloat(value);
    if (!value.trim() || isNaN(num)) { setError('Enter a valid number'); return; }

    const wh = num * FACTORS[fromUnit];
    const lines = Object.entries(FACTORS).map(([key, factor]) => {
      const converted = wh / factor;
      const formatted = Math.abs(converted) < 0.001 || Math.abs(converted) > 1e9 ? converted.toExponential(6) : converted.toLocaleString(undefined, { maximumFractionDigits: 6 });
      return `${LABELS[key]}: ${formatted}`;
    });
    setResult(lines.join('\n'));
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">Energy for {toolName}</label>
        <input id={`${toolId}-value`} type="text" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Enter energy value" aria-label="Electric energy value" className="input-field" />
        <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} aria-label="Energy unit" className="input-field mt-2">
          {Object.entries(LABELS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
        </select>
      </InputArea>

      <button onClick={convert} aria-label="Convert electric energy" className="btn-primary">Convert</button>

      <OutputArea hasContent={result !== null}>
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
