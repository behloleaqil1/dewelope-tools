'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssAspectRatioGenerator - Generates CSS aspect-ratio property with common presets.
 * Supports custom ratios and provides live preview with generated CSS code.
 */
export default function CssAspectRatioGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [width, setWidth] = useState('16');
  const [height, setHeight] = useState('9');
  const [containerWidth, setContainerWidth] = useState('100%');

  const presets = [
    { label: '16:9 (Widescreen)', w: '16', h: '9' },
    { label: '4:3 (Standard)', w: '4', h: '3' },
    { label: '1:1 (Square)', w: '1', h: '1' },
    { label: '21:9 (Ultrawide)', w: '21', h: '9' },
    { label: '9:16 (Portrait)', w: '9', h: '16' },
    { label: '3:2 (Photo)', w: '3', h: '2' },
    { label: '2:1 (Univisium)', w: '2', h: '1' },
    { label: '5:4 (Monitor)', w: '5', h: '4' },
  ];

  const w = parseFloat(width) || 16;
  const h = parseFloat(height) || 9;

  const cssCode = `.aspect-ratio-box {
  aspect-ratio: ${w} / ${h};
  width: ${containerWidth};
}

/* Fallback for older browsers */
.aspect-ratio-box-fallback {
  position: relative;
  width: ${containerWidth};
  padding-bottom: ${((h / w) * 100).toFixed(4)}%;
}
.aspect-ratio-box-fallback > * {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}`;

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-2">Quick Presets</label>
        <div className="flex flex-wrap gap-2 mb-4">
          {presets.map((preset) => (
            <button
              key={preset.label}
              onClick={() => { setWidth(preset.w); setHeight(preset.h); }}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                width === preset.w && height === preset.h
                  ? 'bg-blue-100 border-blue-300 text-blue-700'
                  : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
              }`}
              aria-label={`Select ${preset.label} preset`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor={`${toolId}-width`} className="block text-sm font-medium text-gray-700 mb-1">
              Width Ratio
            </label>
            <input
              id={`${toolId}-width`}
              type="number"
              min="1"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              aria-label={`Width ratio for ${toolName}`}
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-height`} className="block text-sm font-medium text-gray-700 mb-1">
              Height Ratio
            </label>
            <input
              id={`${toolId}-height`}
              type="number"
              min="1"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              aria-label={`Height ratio for ${toolName}`}
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-container`} className="block text-sm font-medium text-gray-700 mb-1">
              Container Width
            </label>
            <input
              id={`${toolId}-container`}
              type="text"
              value={containerWidth}
              onChange={(e) => setContainerWidth(e.target.value)}
              placeholder="100%"
              aria-label={`Container width for ${toolName}`}
              className="input-field"
            />
          </div>
        </div>
      </InputArea>

      <OutputArea hasContent={true}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
            <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
              <div
                className="bg-blue-100 border-2 border-blue-300 border-dashed rounded-lg flex items-center justify-center max-w-full mx-auto"
                style={{ aspectRatio: `${w} / ${h}`, maxWidth: '300px' }}
              >
                <span className="text-blue-600 font-mono text-sm">{w}:{h}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Generated CSS</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{cssCode}</pre>
          </div>

          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
            <p>Padding-bottom fallback: <strong>{((h / w) * 100).toFixed(4)}%</strong></p>
            <p>Decimal ratio: <strong>{(w / h).toFixed(4)}</strong></p>
          </div>

          <CopyToClipboard text={cssCode} />
        </div>
      </OutputArea>
    </div>
  );
}
