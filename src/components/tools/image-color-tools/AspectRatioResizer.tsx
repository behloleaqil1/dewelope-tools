'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * AspectRatioResizer - Calculate new dimensions maintaining aspect ratio.
 * Enter original width/height and a new width or height to get the other dimension.
 */
export default function AspectRatioResizer({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [origWidth, setOrigWidth] = useState('');
  const [origHeight, setOrigHeight] = useState('');
  const [newWidth, setNewWidth] = useState('');
  const [newHeight, setNewHeight] = useState('');
  const [lockBy, setLockBy] = useState<'width' | 'height'>('width');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ width: number; height: number; ratio: string; scale: number } | null>(null);

  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

  const calculate = () => {
    const newErrors: Record<string, string> = {};
    const ow = parseFloat(origWidth);
    const oh = parseFloat(origHeight);

    if (!origWidth.trim() || isNaN(ow) || ow <= 0) newErrors.origWidth = 'Enter a valid width';
    if (!origHeight.trim() || isNaN(oh) || oh <= 0) newErrors.origHeight = 'Enter a valid height';

    if (lockBy === 'width') {
      const nw = parseFloat(newWidth);
      if (!newWidth.trim() || isNaN(nw) || nw <= 0) newErrors.newWidth = 'Enter a valid new width';
    } else {
      const nh = parseFloat(newHeight);
      if (!newHeight.trim() || isNaN(nh) || nh <= 0) newErrors.newHeight = 'Enter a valid new height';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});
    const aspectRatio = ow / oh;
    const divisor = gcd(Math.round(ow), Math.round(oh));
    const ratioStr = `${Math.round(ow) / divisor}:${Math.round(oh) / divisor}`;

    let finalWidth: number;
    let finalHeight: number;

    if (lockBy === 'width') {
      finalWidth = parseFloat(newWidth);
      finalHeight = finalWidth / aspectRatio;
    } else {
      finalHeight = parseFloat(newHeight);
      finalWidth = finalHeight * aspectRatio;
    }

    const scale = finalWidth / ow;

    setResult({ width: Math.round(finalWidth), height: Math.round(finalHeight), ratio: ratioStr, scale });
  };

  const copyText = result
    ? `New Dimensions: ${result.width} × ${result.height}px\nAspect Ratio: ${result.ratio}\nScale: ${(result.scale * 100).toFixed(1)}%`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="space-y-4">
        <InputArea error={errors.origWidth || errors.origHeight}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Original Dimensions</label>
          <div className="flex gap-2 items-center">
            <input
              id={`${toolId}-ow`}
              type="text"
              inputMode="decimal"
              value={origWidth}
              onChange={(e) => { setOrigWidth(e.target.value); if (errors.origWidth) setErrors((prev) => ({ ...prev, origWidth: '' })); }}
              placeholder="Width"
              aria-label={`Original width for ${toolName}`}
              className="input-field flex-1"
            />
            <span className="text-gray-500">×</span>
            <input
              id={`${toolId}-oh`}
              type="text"
              inputMode="decimal"
              value={origHeight}
              onChange={(e) => { setOrigHeight(e.target.value); if (errors.origHeight) setErrors((prev) => ({ ...prev, origHeight: '' })); }}
              placeholder="Height"
              aria-label="Original height"
              className="input-field flex-1"
            />
            <span className="text-xs text-gray-500">px</span>
          </div>
        </InputArea>

        <InputArea>
          <label className="block text-sm font-medium text-gray-700 mb-1">Resize by</label>
          <div className="flex gap-4 mb-2">
            <label className="flex items-center gap-2">
              <input type="radio" name={`${toolId}-lock`} checked={lockBy === 'width'} onChange={() => setLockBy('width')} className="text-blue-600" />
              <span className="text-sm text-gray-700">New Width</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name={`${toolId}-lock`} checked={lockBy === 'height'} onChange={() => setLockBy('height')} className="text-blue-600" />
              <span className="text-sm text-gray-700">New Height</span>
            </label>
          </div>
        </InputArea>

        {lockBy === 'width' ? (
          <InputArea error={errors.newWidth}>
            <label htmlFor={`${toolId}-nw`} className="block text-sm font-medium text-gray-700 mb-1">New Width (px)</label>
            <input id={`${toolId}-nw`} type="text" inputMode="decimal" value={newWidth} onChange={(e) => { setNewWidth(e.target.value); if (errors.newWidth) setErrors((prev) => ({ ...prev, newWidth: '' })); }} placeholder="e.g. 800" aria-label="New width" className="input-field" />
          </InputArea>
        ) : (
          <InputArea error={errors.newHeight}>
            <label htmlFor={`${toolId}-nh`} className="block text-sm font-medium text-gray-700 mb-1">New Height (px)</label>
            <input id={`${toolId}-nh`} type="text" inputMode="decimal" value={newHeight} onChange={(e) => { setNewHeight(e.target.value); if (errors.newHeight) setErrors((prev) => ({ ...prev, newHeight: '' })); }} placeholder="e.g. 600" aria-label="New height" className="input-field" />
          </InputArea>
        )}
      </div>

      <button onClick={calculate} aria-label="Calculate new dimensions" className="btn-primary">
        Calculate
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-blue-600">{result.width} × {result.height}</div>
                <div className="text-xs text-gray-500 mt-1">New Size (px)</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-purple-600">{result.ratio}</div>
                <div className="text-xs text-gray-500 mt-1">Aspect Ratio</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-green-600">{(result.scale * 100).toFixed(1)}%</div>
                <div className="text-xs text-gray-500 mt-1">Scale</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
