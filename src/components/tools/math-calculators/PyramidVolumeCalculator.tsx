'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PyramidVolumeCalculator - Calculate pyramid volume from base dimensions and height.
 */
export default function PyramidVolumeCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [baseType, setBaseType] = useState<'square' | 'rectangular' | 'triangular'>('square');
  const [side, setSide] = useState('');
  const [width, setWidth] = useState('');
  const [triBase, setTriBase] = useState('');
  const [triHeight, setTriHeight] = useState('');
  const [height, setHeight] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ volume: number; baseArea: number; formula: string } | null>(null);

  const calculate = () => {
    setError('');
    setResult(null);
    const h = parseFloat(height);
    if (isNaN(h) || h <= 0) { setError('Please enter a valid positive height.'); return; }

    let baseArea = 0;
    let formula = '';

    if (baseType === 'square') {
      const s = parseFloat(side);
      if (isNaN(s) || s <= 0) { setError('Please enter a valid positive side length.'); return; }
      baseArea = s * s;
      formula = `Base Area = ${s}² = ${baseArea}`;
    } else if (baseType === 'rectangular') {
      const l = parseFloat(side);
      const w = parseFloat(width);
      if (isNaN(l) || isNaN(w) || l <= 0 || w <= 0) { setError('Please enter valid positive length and width.'); return; }
      baseArea = l * w;
      formula = `Base Area = ${l} × ${w} = ${baseArea}`;
    } else {
      const b = parseFloat(triBase);
      const th = parseFloat(triHeight);
      if (isNaN(b) || isNaN(th) || b <= 0 || th <= 0) { setError('Please enter valid positive base and height for triangle.'); return; }
      baseArea = 0.5 * b * th;
      formula = `Base Area = ½ × ${b} × ${th} = ${baseArea}`;
    }

    const volume = (1 / 3) * baseArea * h;
    formula += `\nV = (1/3) × Base Area × Height = (1/3) × ${baseArea.toFixed(4)} × ${h} = ${volume.toFixed(6)}`;
    setResult({ volume, baseArea, formula });
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="flex gap-2 mb-2">
        {(['square', 'rectangular', 'triangular'] as const).map((t) => (
          <button key={t} onClick={() => { setBaseType(t); setResult(null); setError(''); }} className={`px-4 py-2 rounded text-sm font-medium capitalize ${baseType === t ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`} aria-label={`${t} base type`}>{t}</button>
        ))}
      </div>

      <InputArea error={error}>
        {baseType === 'square' && (
          <div>
            <label htmlFor={`${toolId}-side`} className="block text-sm font-medium text-gray-700 mb-1">Side Length</label>
            <input id={`${toolId}-side`} type="text" inputMode="decimal" value={side} onChange={(e) => setSide(e.target.value)} placeholder="e.g. 5" aria-label={`Side length for ${toolName}`} className="input-field" />
          </div>
        )}
        {baseType === 'rectangular' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor={`${toolId}-length`} className="block text-sm font-medium text-gray-700 mb-1">Length</label>
              <input id={`${toolId}-length`} type="text" inputMode="decimal" value={side} onChange={(e) => setSide(e.target.value)} placeholder="e.g. 6" aria-label={`Length for ${toolName}`} className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-width`} className="block text-sm font-medium text-gray-700 mb-1">Width</label>
              <input id={`${toolId}-width`} type="text" inputMode="decimal" value={width} onChange={(e) => setWidth(e.target.value)} placeholder="e.g. 4" aria-label={`Width for ${toolName}`} className="input-field" />
            </div>
          </div>
        )}
        {baseType === 'triangular' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor={`${toolId}-triBase`} className="block text-sm font-medium text-gray-700 mb-1">Triangle Base</label>
              <input id={`${toolId}-triBase`} type="text" inputMode="decimal" value={triBase} onChange={(e) => setTriBase(e.target.value)} placeholder="e.g. 6" aria-label={`Triangle base for ${toolName}`} className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-triHeight`} className="block text-sm font-medium text-gray-700 mb-1">Triangle Height</label>
              <input id={`${toolId}-triHeight`} type="text" inputMode="decimal" value={triHeight} onChange={(e) => setTriHeight(e.target.value)} placeholder="e.g. 4" aria-label={`Triangle height for ${toolName}`} className="input-field" />
            </div>
          </div>
        )}
        <div className="mt-4">
          <label htmlFor={`${toolId}-height`} className="block text-sm font-medium text-gray-700 mb-1">Pyramid Height</label>
          <input id={`${toolId}-height`} type="text" inputMode="decimal" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="e.g. 10" aria-label={`Pyramid height for ${toolName}`} className="input-field" />
        </div>
      </InputArea>

      <button onClick={calculate} className="btn-primary" aria-label="Calculate pyramid volume">Calculate</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-sm text-gray-500">Volume</div>
                <div className="text-xl font-bold text-blue-600">{result.volume.toFixed(6)}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-sm text-gray-500">Base Area</div>
                <div className="text-xl font-bold text-blue-600">{result.baseArea.toFixed(6)}</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono whitespace-pre-wrap">{result.formula}</div>
            <CopyToClipboard text={`Volume: ${result.volume.toFixed(6)}\nBase Area: ${result.baseArea.toFixed(6)}\n${result.formula}`} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
