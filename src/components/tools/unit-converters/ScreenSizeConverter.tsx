'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const ASPECT_RATIOS = [
  { label: '16:9 (Widescreen)', w: 16, h: 9 },
  { label: '16:10 (Laptop)', w: 16, h: 10 },
  { label: '4:3 (Standard)', w: 4, h: 3 },
  { label: '21:9 (Ultrawide)', w: 21, h: 9 },
  { label: '32:9 (Super Ultrawide)', w: 32, h: 9 },
  { label: '3:2 (Surface)', w: 3, h: 2 },
  { label: '1:1 (Square)', w: 1, h: 1 },
];

/**
 * ScreenSizeConverter - Convert between screen diagonal, width, height for different aspect ratios.
 */
export default function ScreenSizeConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [diagonal, setDiagonal] = useState('');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [unit, setUnit] = useState<'inches' | 'cm'>('inches');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ width: number; height: number; diagonal: number; area: number; widthCm: number; heightCm: number } | null>(null);

  const calculate = () => {
    setError('');
    setResult(null);

    const diag = parseFloat(diagonal);
    if (!diagonal.trim() || isNaN(diag) || diag <= 0) {
      setError('Enter a valid positive diagonal size');
      return;
    }

    const selected = ASPECT_RATIOS.find((r) => `${r.w}:${r.h}` === aspectRatio);
    if (!selected) return;

    const { w, h } = selected;
    const diagRatio = Math.sqrt(w * w + h * h);
    const pixelPerUnit = diag / diagRatio;
    const width = pixelPerUnit * w;
    const height = pixelPerUnit * h;
    const area = width * height;

    const inchesToCm = 2.54;
    const widthInches = unit === 'cm' ? width / inchesToCm : width;
    const heightInches = unit === 'cm' ? height / inchesToCm : height;

    setResult({
      width,
      height,
      diagonal: diag,
      area,
      widthCm: widthInches * inchesToCm,
      heightCm: heightInches * inchesToCm,
    });
  };

  const copyText = result
    ? `Diagonal: ${result.diagonal} ${unit}\nWidth: ${result.width.toFixed(2)} ${unit} (${result.widthCm.toFixed(2)} cm)\nHeight: ${result.height.toFixed(2)} ${unit} (${result.heightCm.toFixed(2)} cm)\nArea: ${result.area.toFixed(2)} sq ${unit}\nAspect Ratio: ${aspectRatio}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InputArea error={error}>
          <label htmlFor={`${toolId}-diagonal`} className="block text-sm font-medium text-gray-700 mb-1">
            Screen Diagonal
          </label>
          <input
            id={`${toolId}-diagonal`}
            type="text"
            inputMode="decimal"
            value={diagonal}
            onChange={(e) => { setDiagonal(e.target.value); setError(''); }}
            placeholder="e.g. 27"
            aria-label={`Screen diagonal for ${toolName}`}
            className="input-field"
          />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-ratio`} className="block text-sm font-medium text-gray-700 mb-1">
            Aspect Ratio
          </label>
          <select
            id={`${toolId}-ratio`}
            value={aspectRatio}
            onChange={(e) => setAspectRatio(e.target.value)}
            aria-label={`Aspect ratio for ${toolName}`}
            className="input-field"
          >
            {ASPECT_RATIOS.map((r) => (
              <option key={`${r.w}:${r.h}`} value={`${r.w}:${r.h}`}>{r.label}</option>
            ))}
          </select>
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-unit`} className="block text-sm font-medium text-gray-700 mb-1">
            Unit
          </label>
          <select
            id={`${toolId}-unit`}
            value={unit}
            onChange={(e) => setUnit(e.target.value as 'inches' | 'cm')}
            aria-label={`Unit for ${toolName}`}
            className="input-field"
          >
            <option value="inches">Inches</option>
            <option value="cm">Centimeters</option>
          </select>
        </InputArea>
      </div>

      <button onClick={calculate} aria-label="Calculate screen dimensions" className="btn-primary">
        Calculate Dimensions
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600">{result.width.toFixed(2)}</div>
                <div className="text-xs text-gray-500 mt-1">Width ({unit})</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-green-600">{result.height.toFixed(2)}</div>
                <div className="text-xs text-gray-500 mt-1">Height ({unit})</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-purple-600">{result.diagonal.toFixed(2)}</div>
                <div className="text-xs text-gray-500 mt-1">Diagonal ({unit})</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-orange-600">{result.area.toFixed(1)}</div>
                <div className="text-xs text-gray-500 mt-1">Area (sq {unit})</div>
              </div>
            </div>
            {unit === 'inches' && (
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
                <span className="font-medium">In centimeters:</span> {result.widthCm.toFixed(2)} × {result.heightCm.toFixed(2)} cm
              </div>
            )}
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
