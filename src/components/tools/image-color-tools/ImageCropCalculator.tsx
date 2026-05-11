'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ImageCropCalculator - Calculates crop dimensions to achieve a target aspect ratio.
 * Shows the maximum crop area that fits within the original dimensions.
 */
export default function ImageCropCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [originalWidth, setOriginalWidth] = useState('');
  const [originalHeight, setOriginalHeight] = useState('');
  const [targetRatio, setTargetRatio] = useState('16:9');
  const [customRatioW, setCustomRatioW] = useState('');
  const [customRatioH, setCustomRatioH] = useState('');
  const [result, setResult] = useState<{ cropWidth: number; cropHeight: number; offsetX: number; offsetY: number; pixelsRemoved: number } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const presets = [
    { label: '16:9 (Widescreen)', value: '16:9' },
    { label: '4:3 (Standard)', value: '4:3' },
    { label: '1:1 (Square)', value: '1:1' },
    { label: '3:2 (Photo)', value: '3:2' },
    { label: '21:9 (Ultrawide)', value: '21:9' },
    { label: '9:16 (Portrait)', value: '9:16' },
    { label: '5:4 (Large Format)', value: '5:4' },
    { label: '2:3 (Portrait Photo)', value: '2:3' },
    { label: 'Custom', value: 'custom' },
  ];

  const calculate = () => {
    const newErrors: Record<string, string> = {};
    const w = parseInt(originalWidth);
    const h = parseInt(originalHeight);

    if (!originalWidth || isNaN(w) || w <= 0) newErrors.width = 'Enter a valid width';
    if (!originalHeight || isNaN(h) || h <= 0) newErrors.height = 'Enter a valid height';

    let ratioW: number, ratioH: number;
    if (targetRatio === 'custom') {
      ratioW = parseFloat(customRatioW);
      ratioH = parseFloat(customRatioH);
      if (!customRatioW || isNaN(ratioW) || ratioW <= 0) newErrors.ratioW = 'Enter valid ratio width';
      if (!customRatioH || isNaN(ratioH) || ratioH <= 0) newErrors.ratioH = 'Enter valid ratio height';
    } else {
      const parts = targetRatio.split(':');
      ratioW = parseInt(parts[0]);
      ratioH = parseInt(parts[1]);
    }

    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); setResult(null); return; }
    setErrors({});

    const targetAspect = ratioW / ratioH;
    const currentAspect = w / h;

    let cropWidth: number, cropHeight: number;
    if (currentAspect > targetAspect) {
      // Image is wider than target - crop width
      cropHeight = h;
      cropWidth = Math.round(h * targetAspect);
    } else {
      // Image is taller than target - crop height
      cropWidth = w;
      cropHeight = Math.round(w / targetAspect);
    }

    const offsetX = Math.round((w - cropWidth) / 2);
    const offsetY = Math.round((h - cropHeight) / 2);
    const pixelsRemoved = (w * h) - (cropWidth * cropHeight);

    setResult({ cropWidth, cropHeight, offsetX, offsetY, pixelsRemoved });
  };

  const copyText = result
    ? `Original: ${originalWidth}×${originalHeight}px\nCrop to: ${result.cropWidth}×${result.cropHeight}px\nOffset: x=${result.offsetX}, y=${result.offsetY}\nPixels removed: ${result.pixelsRemoved.toLocaleString()}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputArea error={errors.width}>
          <label htmlFor={`${toolId}-width`} className="block text-sm font-medium text-gray-700 mb-1">Original Width (px)</label>
          <input id={`${toolId}-width`} type="text" inputMode="numeric" value={originalWidth} onChange={(e) => setOriginalWidth(e.target.value)} placeholder="e.g. 1920" aria-label={`Original width for ${toolName}`} className="input-field" />
        </InputArea>

        <InputArea error={errors.height}>
          <label htmlFor={`${toolId}-height`} className="block text-sm font-medium text-gray-700 mb-1">Original Height (px)</label>
          <input id={`${toolId}-height`} type="text" inputMode="numeric" value={originalHeight} onChange={(e) => setOriginalHeight(e.target.value)} placeholder="e.g. 1080" aria-label={`Original height for ${toolName}`} className="input-field" />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-ratio`} className="block text-sm font-medium text-gray-700 mb-1">Target Aspect Ratio</label>
          <select id={`${toolId}-ratio`} value={targetRatio} onChange={(e) => setTargetRatio(e.target.value)} aria-label="Target aspect ratio" className="input-field">
            {presets.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        </InputArea>

        {targetRatio === 'custom' && (
          <div className="flex gap-2 items-end">
            <InputArea error={errors.ratioW}>
              <label htmlFor={`${toolId}-rw`} className="block text-sm font-medium text-gray-700 mb-1">Width Ratio</label>
              <input id={`${toolId}-rw`} type="text" inputMode="numeric" value={customRatioW} onChange={(e) => setCustomRatioW(e.target.value)} placeholder="16" aria-label="Custom ratio width" className="input-field" />
            </InputArea>
            <span className="pb-3 text-gray-500">:</span>
            <InputArea error={errors.ratioH}>
              <label htmlFor={`${toolId}-rh`} className="block text-sm font-medium text-gray-700 mb-1">Height Ratio</label>
              <input id={`${toolId}-rh`} type="text" inputMode="numeric" value={customRatioH} onChange={(e) => setCustomRatioH(e.target.value)} placeholder="9" aria-label="Custom ratio height" className="input-field" />
            </InputArea>
          </div>
        )}
      </div>

      <button onClick={calculate} aria-label="Calculate crop dimensions" className="btn-primary">
        Calculate Crop
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.cropWidth}×{result.cropHeight}</div>
                <div className="text-xs text-gray-500 mt-1">Crop Dimensions (px)</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.offsetX}, {result.offsetY}</div>
                <div className="text-xs text-gray-500 mt-1">Offset (x, y)</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <p>Crop from center: remove {result.offsetX}px from each side horizontally, {result.offsetY}px from top and bottom.</p>
              <p className="mt-1">Pixels removed: {result.pixelsRemoved.toLocaleString()} ({((result.pixelsRemoved / (parseInt(originalWidth) * parseInt(originalHeight))) * 100).toFixed(1)}% of original)</p>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
