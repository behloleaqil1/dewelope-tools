'use client';

import { useState, useCallback } from 'react';
import { ToolEngineProps } from '@/types';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';
import { calculateAspectRatio, AspectRatioResult } from '@/lib/image-color-tools';
import { validateNumeric, validateRange } from '@/lib/validation';

const COMMON_PRESETS = [
  { label: '16:9 (Widescreen)', width: 1920, height: 1080 },
  { label: '4:3 (Standard)', width: 1024, height: 768 },
  { label: '1:1 (Square)', width: 1080, height: 1080 },
  { label: '21:9 (Ultrawide)', width: 2560, height: 1080 },
  { label: '9:16 (Portrait)', width: 1080, height: 1920 },
  { label: '3:2 (Photo)', width: 1500, height: 1000 },
];

/**
 * AspectRatioCalculator - Calculates simplified aspect ratio from width/height.
 * Includes common presets for quick selection.
 * Requirements: 7.6, 7.7
 */
export default function AspectRatioCalculator({ toolId, toolName }: ToolEngineProps) {
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [result, setResult] = useState<AspectRatioResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const calculate = useCallback(() => {
    const newErrors: Record<string, string> = {};

    const widthValidation = validateNumeric(width, 'width');
    if (!widthValidation.valid) {
      newErrors.width = widthValidation.error!;
    }

    const heightValidation = validateNumeric(height, 'height');
    if (!heightValidation.valid) {
      newErrors.height = heightValidation.error!;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    const numWidth = Number(width.trim());
    const numHeight = Number(height.trim());

    const widthRange = validateRange(numWidth, 1, 100000, 'width');
    if (!widthRange.valid) {
      newErrors.width = widthRange.error!;
    }

    const heightRange = validateRange(numHeight, 1, 100000, 'height');
    if (!heightRange.valid) {
      newErrors.height = heightRange.error!;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});
    setResult(calculateAspectRatio(numWidth, numHeight));
  }, [width, height]);

  const applyPreset = useCallback((presetWidth: number, presetHeight: number) => {
    setWidth(String(presetWidth));
    setHeight(String(presetHeight));
    setErrors({});
    setResult(calculateAspectRatio(presetWidth, presetHeight));
  }, []);

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWidth(e.target.value);
    if (errors.width) {
      setErrors((prev) => ({ ...prev, width: '' }));
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHeight(e.target.value);
    if (errors.height) {
      setErrors((prev) => ({ ...prev, height: '' }));
    }
  };

  return (
    <div className="space-y-6" data-tool-id={toolId}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputArea error={errors.width}>
            <label htmlFor={`${toolId}-width`} className="block text-sm font-medium text-gray-700 mb-1">
              Width (px)
            </label>
            <input
              id={`${toolId}-width`}
              type="text"
              inputMode="numeric"
              value={width}
              onChange={handleWidthChange}
              placeholder="e.g. 1920"
              aria-label={`Width in pixels for ${toolName}`}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
            />
          </InputArea>

          <InputArea error={errors.height}>
            <label htmlFor={`${toolId}-height`} className="block text-sm font-medium text-gray-700 mb-1">
              Height (px)
            </label>
            <input
              id={`${toolId}-height`}
              type="text"
              inputMode="numeric"
              value={height}
              onChange={handleHeightChange}
              placeholder="e.g. 1080"
              aria-label={`Height in pixels for ${toolName}`}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
            />
          </InputArea>
        </div>

        <button
          onClick={calculate}
          aria-label="Calculate aspect ratio"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-h-[44px] min-w-[44px]"
        >
          Calculate
        </button>
      </div>

      <div>
        <div className="text-sm font-medium text-gray-700 mb-2">Common Presets</div>
        <div className="flex flex-wrap gap-2">
          {COMMON_PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => applyPreset(preset.width, preset.height)}
              aria-label={`Apply preset ${preset.label}`}
              className="px-3 py-2 text-sm bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-h-[44px]"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="text-lg font-semibold text-gray-800">
              Aspect Ratio: {result.ratio}
            </div>
            <div className="text-sm text-gray-600 bg-white p-3 rounded border border-gray-200 font-mono">
              {width} × {height} → {result.simplified.w}:{result.simplified.h}
            </div>
            <CopyToClipboard text={result.ratio} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
