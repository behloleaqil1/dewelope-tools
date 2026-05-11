'use client';

import { useState } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TypographyScaleGenerator - Generates a modular type scale from base size and ratio.
 * Supports common ratios from 1.067 (Minor Second) to 1.618 (Golden Ratio).
 */
export default function TypographyScaleGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [baseSize, setBaseSize] = useState('16');
  const [ratio, setRatio] = useState('1.25');
  const [steps, setSteps] = useState('6');
  const [unit, setUnit] = useState<'px' | 'rem'>('px');
  const [result, setResult] = useState<{ sizes: { step: number; label: string; px: number; rem: number }[] } | null>(null);

  const ratioPresets = [
    { value: '1.067', label: '1.067 — Minor Second' },
    { value: '1.125', label: '1.125 — Major Second' },
    { value: '1.2', label: '1.200 — Minor Third' },
    { value: '1.25', label: '1.250 — Major Third' },
    { value: '1.333', label: '1.333 — Perfect Fourth' },
    { value: '1.414', label: '1.414 — Augmented Fourth' },
    { value: '1.5', label: '1.500 — Perfect Fifth' },
    { value: '1.618', label: '1.618 — Golden Ratio' },
  ];

  const stepLabels = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl'];

  const generate = () => {
    const base = parseFloat(baseSize);
    const r = parseFloat(ratio);
    const numSteps = parseInt(steps);

    if (isNaN(base) || base <= 0 || isNaN(r) || r <= 1 || isNaN(numSteps) || numSteps < 1) {
      return;
    }

    const sizes: { step: number; label: string; px: number; rem: number }[] = [];

    // Generate steps below base
    const belowSteps = Math.min(2, numSteps);
    for (let i = -belowSteps; i < 0; i++) {
      const px = base * Math.pow(r, i);
      sizes.push({
        step: i,
        label: stepLabels[i + 2] || `step-${i}`,
        px: Math.round(px * 100) / 100,
        rem: Math.round((px / 16) * 1000) / 1000,
      });
    }

    // Base and above
    for (let i = 0; i <= numSteps; i++) {
      const px = base * Math.pow(r, i);
      sizes.push({
        step: i,
        label: stepLabels[i + 2] || `step-${i}`,
        px: Math.round(px * 100) / 100,
        rem: Math.round((px / 16) * 1000) / 1000,
      });
    }

    setResult({ sizes });
  };

  const copyText = result
    ? `/* Typography Scale — Base: ${baseSize}px, Ratio: ${ratio} */\n${result.sizes.map((s) => `--font-${s.label}: ${unit === 'px' ? s.px + 'px' : s.rem + 'rem'}; /* step ${s.step} */`).join('\n')}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <label htmlFor={`${toolId}-base`} className="block text-sm font-medium text-gray-700 mb-1">
            Base Size (px)
          </label>
          <input
            id={`${toolId}-base`}
            type="text"
            inputMode="decimal"
            value={baseSize}
            onChange={(e) => setBaseSize(e.target.value)}
            placeholder="16"
            aria-label={`Base font size for ${toolName}`}
            className="input-field"
          />
        </div>

        <div>
          <label htmlFor={`${toolId}-ratio`} className="block text-sm font-medium text-gray-700 mb-1">
            Scale Ratio
          </label>
          <select
            id={`${toolId}-ratio`}
            value={ratio}
            onChange={(e) => setRatio(e.target.value)}
            aria-label="Type scale ratio"
            className="input-field"
          >
            {ratioPresets.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor={`${toolId}-steps`} className="block text-sm font-medium text-gray-700 mb-1">
            Steps Up
          </label>
          <input
            id={`${toolId}-steps`}
            type="number"
            min={1}
            max={10}
            value={steps}
            onChange={(e) => setSteps(e.target.value)}
            aria-label="Number of scale steps"
            className="input-field"
          />
        </div>

        <div>
          <label htmlFor={`${toolId}-unit`} className="block text-sm font-medium text-gray-700 mb-1">
            Unit
          </label>
          <select
            id={`${toolId}-unit`}
            value={unit}
            onChange={(e) => setUnit(e.target.value as 'px' | 'rem')}
            aria-label="Output unit"
            className="input-field"
          >
            <option value="px">px</option>
            <option value="rem">rem</option>
          </select>
        </div>
      </div>

      <button onClick={generate} aria-label="Generate type scale" className="btn-primary">
        Generate Scale
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="space-y-2">
              {result.sizes.map((s, i) => (
                <div key={i} className="flex items-center gap-3 bg-gray-50 p-2 rounded border border-gray-200">
                  <span className="text-xs font-mono text-gray-500 w-12">{s.label}</span>
                  <span className="text-sm font-mono text-gray-700 w-20">
                    {unit === 'px' ? `${s.px}px` : `${s.rem}rem`}
                  </span>
                  <span
                    className="text-gray-800 truncate flex-1"
                    style={{ fontSize: `${Math.min(s.px, 48)}px`, lineHeight: 1.2 }}
                  >
                    Aa
                  </span>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-1">CSS Custom Properties</label>
              <pre className="text-xs font-mono text-gray-800 whitespace-pre-wrap">{copyText}</pre>
            </div>

            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
