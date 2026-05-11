'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssUnitConverter - Converts between CSS units: px, rem, em, %, vw, vh, pt.
 */
export default function CssUnitConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('16');
  const [fromUnit, setFromUnit] = useState('px');
  const [baseFontSize, setBaseFontSize] = useState('16');
  const [viewportWidth, setViewportWidth] = useState('1920');
  const [results, setResults] = useState<{ unit: string; value: string }[]>([]);
  const [error, setError] = useState<string | undefined>();

  function convert() {
    setError(undefined);
    setResults([]);

    const num = parseFloat(value);
    const base = parseFloat(baseFontSize) || 16;
    const vw = parseFloat(viewportWidth) || 1920;

    if (isNaN(num)) { setError('Please enter a valid number'); return; }

    // Convert to px first
    let px: number;
    switch (fromUnit) {
      case 'px': px = num; break;
      case 'rem': px = num * base; break;
      case 'em': px = num * base; break;
      case 'pt': px = num * (96 / 72); break;
      case 'vw': px = (num / 100) * vw; break;
      case 'vh': px = (num / 100) * vw * 0.5625; break; // assume 16:9
      case '%': px = (num / 100) * base; break;
      default: px = num;
    }

    setResults([
      { unit: 'px', value: px.toFixed(3) },
      { unit: 'rem', value: (px / base).toFixed(4) },
      { unit: 'em', value: (px / base).toFixed(4) },
      { unit: 'pt', value: (px * (72 / 96)).toFixed(3) },
      { unit: 'vw', value: ((px / vw) * 100).toFixed(4) },
      { unit: '%', value: ((px / base) * 100).toFixed(2) },
    ]);
  }

  const UNITS = ['px', 'rem', 'em', 'pt', 'vw', 'vh', '%'];
  const copyText = results.map((r) => `${r.value}${r.unit}`).join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">CSS value for {toolName}</label>
        <div className="flex gap-2">
          <input id={`${toolId}-value`} type="text" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} placeholder="16" aria-label="CSS value" className="input-field flex-1 font-mono" />
          <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} aria-label="CSS unit" className="input-field w-20 text-sm">
            {UNITS.map((u) => (<option key={u} value={u}>{u}</option>))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <label htmlFor={`${toolId}-base`} className="block text-xs text-gray-500 mb-1">Base font size (px)</label>
            <input id={`${toolId}-base`} type="number" value={baseFontSize} onChange={(e) => setBaseFontSize(e.target.value)} aria-label="Base font size" className="input-field text-sm" />
          </div>
          <div>
            <label htmlFor={`${toolId}-vw`} className="block text-xs text-gray-500 mb-1">Viewport width (px)</label>
            <input id={`${toolId}-vw`} type="number" value={viewportWidth} onChange={(e) => setViewportWidth(e.target.value)} aria-label="Viewport width" className="input-field text-sm" />
          </div>
        </div>
      </InputArea>

      <button onClick={convert} aria-label="Convert CSS units" className="btn-primary">Convert</button>

      <OutputArea hasContent={results.length > 0}>
        {results.length > 0 && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {results.map((r) => (
                <div key={r.unit} className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                  <div className="text-lg font-bold text-blue-600 font-mono">{r.value}</div>
                  <div className="text-xs text-gray-500">{r.unit}</div>
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
