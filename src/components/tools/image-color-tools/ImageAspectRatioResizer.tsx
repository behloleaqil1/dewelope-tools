'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ImageAspectRatioResizer - Calculates new dimensions while maintaining aspect ratio.
 * Enter original width/height and a new width or height to get the proportional dimension.
 */
export default function ImageAspectRatioResizer({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [origWidth, setOrigWidth] = useState('');
  const [origHeight, setOrigHeight] = useState('');
  const [newWidth, setNewWidth] = useState('');
  const [newHeight, setNewHeight] = useState('');
  const [result, setResult] = useState<{ width: number; height: number; ratio: string } | null>(null);
  const [error, setError] = useState<string | undefined>();

  function gcd(a: number, b: number): number {
    a = Math.abs(Math.round(a));
    b = Math.abs(Math.round(b));
    while (b) { const t = b; b = a % b; a = t; }
    return a;
  }

  function handleCalculate() {
    setError(undefined);
    setResult(null);

    const ow = parseFloat(origWidth);
    const oh = parseFloat(origHeight);

    if (!origWidth.trim() || !origHeight.trim() || isNaN(ow) || isNaN(oh) || ow <= 0 || oh <= 0) {
      setError('Please enter valid original width and height (positive numbers)');
      return;
    }

    const nw = newWidth.trim() ? parseFloat(newWidth) : NaN;
    const nh = newHeight.trim() ? parseFloat(newHeight) : NaN;

    if (isNaN(nw) && isNaN(nh)) {
      setError('Please enter either a new width or new height');
      return;
    }

    if (!isNaN(nw) && !isNaN(nh)) {
      setError('Enter only one of new width or new height (leave the other empty)');
      return;
    }

    const aspectRatio = ow / oh;
    let calcWidth: number, calcHeight: number;

    if (!isNaN(nw)) {
      calcWidth = nw;
      calcHeight = Math.round(nw / aspectRatio);
    } else {
      calcHeight = nh;
      calcWidth = Math.round(nh * aspectRatio);
    }

    const g = gcd(ow, oh);
    const ratioStr = `${ow / g}:${oh / g}`;

    setResult({ width: calcWidth, height: calcHeight, ratio: ratioStr });
  }

  const copyText = result ? `New dimensions: ${result.width} × ${result.height}\nAspect ratio: ${result.ratio}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="space-y-3">
        <InputArea error={error}>
          <p className="text-sm text-gray-600 mb-3">Enter original dimensions and either a new width or new height</p>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label htmlFor={`${toolId}-ow`} className="block text-xs font-medium text-gray-500 mb-1">Original Width</label>
              <input id={`${toolId}-ow`} type="text" inputMode="decimal" value={origWidth} onChange={(e) => setOrigWidth(e.target.value)} placeholder="e.g. 1920" aria-label={`Original width for ${toolName}`} className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-oh`} className="block text-xs font-medium text-gray-500 mb-1">Original Height</label>
              <input id={`${toolId}-oh`} type="text" inputMode="decimal" value={origHeight} onChange={(e) => setOrigHeight(e.target.value)} placeholder="e.g. 1080" aria-label={`Original height for ${toolName}`} className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-nw`} className="block text-xs font-medium text-gray-500 mb-1">New Width (or leave empty)</label>
              <input id={`${toolId}-nw`} type="text" inputMode="decimal" value={newWidth} onChange={(e) => setNewWidth(e.target.value)} placeholder="e.g. 1280" aria-label={`New width for ${toolName}`} className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-nh`} className="block text-xs font-medium text-gray-500 mb-1">New Height (or leave empty)</label>
              <input id={`${toolId}-nh`} type="text" inputMode="decimal" value={newHeight} onChange={(e) => setNewHeight(e.target.value)} placeholder="e.g. 720" aria-label={`New height for ${toolName}`} className="input-field" />
            </div>
          </div>
        </InputArea>
      </div>

      <button onClick={handleCalculate} aria-label="Calculate new dimensions" className="btn-primary">
        Calculate
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.width}</div>
                <div className="text-xs text-gray-500 mt-1">Width (px)</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.height}</div>
                <div className="text-xs text-gray-500 mt-1">Height (px)</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-gray-700">{result.ratio}</div>
                <div className="text-xs text-gray-500 mt-1">Aspect Ratio</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
