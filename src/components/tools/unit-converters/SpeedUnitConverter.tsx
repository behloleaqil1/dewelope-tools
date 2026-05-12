'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SpeedUnitConverter - Extended speed converter with c (light speed) and Mach.
 */
export default function SpeedUnitConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('mps');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>();

  // All in m/s
  const FACTORS: Record<string, number> = {
    mps: 1, kph: 1 / 3.6, mph: 0.44704, knot: 0.514444, fps: 0.3048,
    mach: 343, c: 299792458,
  };
  const LABELS: Record<string, string> = {
    mps: 'm/s', kph: 'km/h', mph: 'mph', knot: 'knots', fps: 'ft/s', mach: 'Mach', c: 'c (light)',
  };

  function convert() {
    setError(undefined);
    setResult(null);
    const num = parseFloat(value);
    if (!value.trim() || isNaN(num)) { setError('Enter a valid number'); return; }

    const mps = num * FACTORS[fromUnit];
    const lines = Object.entries(FACTORS).map(([key, factor]) => {
      const converted = mps / factor;
      const formatted = Math.abs(converted) < 0.001 || Math.abs(converted) > 1e9 ? converted.toExponential(6) : converted.toLocaleString(undefined, { maximumFractionDigits: 6 });
      return `${LABELS[key]}: ${formatted}`;
    });
    setResult(lines.join('\n'));
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">Speed for {toolName}</label>
        <input id={`${toolId}-value`} type="text" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Enter speed value" aria-label="Speed value" className="input-field" />
        <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} aria-label="Speed unit" className="input-field mt-2">
          {Object.entries(LABELS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
        </select>
      </InputArea>

      <button onClick={convert} aria-label="Convert speed" className="btn-primary">Convert</button>

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
