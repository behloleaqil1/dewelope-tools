'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * FontSizeConverter - Converts between px, pt, em, rem, %, vw for font sizes.
 */
export default function FontSizeConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('px');
  const [basePx, setBasePx] = useState('16');
  const [viewportWidth, setViewportWidth] = useState('1920');
  const [error, setError] = useState<string | undefined>();
  const [result, setResult] = useState<Record<string, string> | null>(null);

  const UNITS = [
    { value: 'px', label: 'Pixels (px)' },
    { value: 'pt', label: 'Points (pt)' },
    { value: 'em', label: 'Em' },
    { value: 'rem', label: 'Rem' },
    { value: 'percent', label: 'Percent (%)' },
    { value: 'vw', label: 'Viewport Width (vw)' },
  ];

  function convert() {
    setError(undefined);
    setResult(null);

    const num = parseFloat(value);
    const base = parseFloat(basePx);
    const vw = parseFloat(viewportWidth);

    if (!value.trim() || isNaN(num)) {
      setError('Please enter a valid number');
      return;
    }
    if (isNaN(base) || base <= 0) {
      setError('Base font size must be a positive number');
      return;
    }
    if (isNaN(vw) || vw <= 0) {
      setError('Viewport width must be a positive number');
      return;
    }

    // Convert to px first
    let px: number;
    switch (fromUnit) {
      case 'px': px = num; break;
      case 'pt': px = num * (96 / 72); break;
      case 'em': px = num * base; break;
      case 'rem': px = num * base; break;
      case 'percent': px = (num / 100) * base; break;
      case 'vw': px = (num / 100) * vw; break;
      default: px = num;
    }

    // Convert from px to all units
    const results: Record<string, string> = {
      px: px.toFixed(4).replace(/\.?0+$/, ''),
      pt: (px * (72 / 96)).toFixed(4).replace(/\.?0+$/, ''),
      em: (px / base).toFixed(4).replace(/\.?0+$/, ''),
      rem: (px / base).toFixed(4).replace(/\.?0+$/, ''),
      percent: ((px / base) * 100).toFixed(4).replace(/\.?0+$/, ''),
      vw: ((px / vw) * 100).toFixed(4).replace(/\.?0+$/, ''),
    };

    setResult(results);
  }

  const copyText = result
    ? Object.entries(result).map(([unit, val]) => {
        const suffix = unit === 'percent' ? '%' : unit;
        return `${val}${suffix}`;
      }).join('\n')
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">
          Font Size Value for {toolName}
        </label>
        <div className="flex gap-2">
          <input
            id={`${toolId}-value`}
            type="text"
            inputMode="decimal"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="e.g. 16"
            aria-label="Font size value to convert"
            className="input-field flex-1"
          />
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            aria-label="Source font size unit"
            className="input-field w-32 text-sm"
          >
            {UNITS.map((u) => (
              <option key={u.value} value={u.value}>{u.label}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <label htmlFor={`${toolId}-base`} className="block text-xs text-gray-500 mb-1">Base Font Size (px)</label>
            <input
              id={`${toolId}-base`}
              type="text"
              inputMode="decimal"
              value={basePx}
              onChange={(e) => setBasePx(e.target.value)}
              aria-label="Base font size in pixels"
              className="input-field text-sm"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-vw`} className="block text-xs text-gray-500 mb-1">Viewport Width (px)</label>
            <input
              id={`${toolId}-vw`}
              type="text"
              inputMode="decimal"
              value={viewportWidth}
              onChange={(e) => setViewportWidth(e.target.value)}
              aria-label="Viewport width in pixels"
              className="input-field text-sm"
            />
          </div>
        </div>
      </InputArea>

      <button onClick={convert} aria-label="Convert font size" className="btn-primary">
        Convert
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {UNITS.map((u) => (
                <div key={u.value} className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                  <div className="text-lg font-bold text-blue-600 font-mono">
                    {result[u.value]}{u.value === 'percent' ? '%' : u.value}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{u.label}</div>
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
