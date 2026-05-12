'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

interface RatioResult {
  ratio: string;
  width: number;
  height: number;
}

const COMMON_RATIOS = [
  { label: '16:9 (Widescreen)', w: 16, h: 9 },
  { label: '4:3 (Standard)', w: 4, h: 3 },
  { label: '21:9 (Ultrawide)', w: 21, h: 9 },
  { label: '1:1 (Square)', w: 1, h: 1 },
  { label: '3:2 (Photo)', w: 3, h: 2 },
  { label: '5:4 (Monitor)', w: 5, h: 4 },
  { label: '9:16 (Vertical)', w: 9, h: 16 },
  { label: '2.35:1 (Cinema)', w: 2.35, h: 1 },
  { label: '32:9 (Super Ultrawide)', w: 32, h: 9 },
];

/**
 * AspectRatioConverter - Convert between common aspect ratios.
 * Given a width or height, calculates dimensions for all common ratios.
 */
export default function AspectRatioConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [dimension, setDimension] = useState('');
  const [mode, setMode] = useState<'width' | 'height'>('width');
  const [error, setError] = useState('');
  const [results, setResults] = useState<RatioResult[]>([]);

  const calculate = () => {
    setError('');
    setResults([]);

    const val = parseFloat(dimension);
    if (!dimension.trim() || isNaN(val) || val <= 0) {
      setError('Enter a positive number');
      return;
    }

    const calculated: RatioResult[] = COMMON_RATIOS.map(r => {
      let width: number, height: number;
      if (mode === 'width') {
        width = val;
        height = Math.round((val / r.w) * r.h * 100) / 100;
      } else {
        height = val;
        width = Math.round((val / r.h) * r.w * 100) / 100;
      }
      return { ratio: r.label, width, height };
    });

    setResults(calculated);
  };

  const copyText = results.map(r => `${r.ratio}: ${r.width} × ${r.height}`).join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="space-y-3">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label htmlFor={`${toolId}-dim`} className="block text-sm font-medium text-gray-700 mb-1">
                {mode === 'width' ? 'Width' : 'Height'} (pixels)
              </label>
              <input id={`${toolId}-dim`} type="text" inputMode="decimal" value={dimension} onChange={(e) => setDimension(e.target.value)} placeholder="e.g. 1920" aria-label={`${mode} value for ${toolName}`} className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-mode`} className="block text-sm font-medium text-gray-700 mb-1">Based on</label>
              <select id={`${toolId}-mode`} value={mode} onChange={(e) => setMode(e.target.value as 'width' | 'height')} className="input-field" aria-label="Dimension mode">
                <option value="width">Width</option>
                <option value="height">Height</option>
              </select>
            </div>
          </div>
        </div>
      </InputArea>

      <button onClick={calculate} aria-label="Calculate aspect ratios" className="btn-primary">Calculate Ratios</button>

      <OutputArea hasContent={results.length > 0}>
        {results.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">Dimensions for Each Aspect Ratio</h3>
              <CopyToClipboard text={copyText} />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-left text-gray-500 border-b border-gray-200"><th className="pb-2 pr-4">Aspect Ratio</th><th className="pb-2 pr-4">Width</th><th className="pb-2">Height</th></tr></thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="py-2 pr-4 font-medium text-gray-700">{r.ratio}</td>
                      <td className="py-2 pr-4 font-mono">{r.width}px</td>
                      <td className="py-2 font-mono">{r.height}px</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
