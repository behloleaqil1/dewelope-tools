'use client';

import { useState } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssTextShadowGenerator - Generate CSS text-shadow with visual controls.
 * Supports multiple shadows, color, blur, and offset adjustments.
 */
export default function CssTextShadowGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [offsetX, setOffsetX] = useState(2);
  const [offsetY, setOffsetY] = useState(2);
  const [blur, setBlur] = useState(4);
  const [color, setColor] = useState('#000000');
  const [opacity, setOpacity] = useState(50);
  const [previewText, setPreviewText] = useState('Sample Text');

  const hexToRgba = (hex: string, alpha: number): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const shadowColor = hexToRgba(color, opacity / 100);
  const cssValue = `${offsetX}px ${offsetY}px ${blur}px ${shadowColor}`;
  const cssCode = `text-shadow: ${cssValue};`;

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <label htmlFor={`${toolId}-offsetX`} className="block text-sm font-medium text-gray-700 mb-1">
              Horizontal Offset: {offsetX}px
            </label>
            <input
              id={`${toolId}-offsetX`}
              type="range"
              min="-20"
              max="20"
              value={offsetX}
              onChange={(e) => setOffsetX(Number(e.target.value))}
              aria-label={`Horizontal offset for ${toolName}`}
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor={`${toolId}-offsetY`} className="block text-sm font-medium text-gray-700 mb-1">
              Vertical Offset: {offsetY}px
            </label>
            <input
              id={`${toolId}-offsetY`}
              type="range"
              min="-20"
              max="20"
              value={offsetY}
              onChange={(e) => setOffsetY(Number(e.target.value))}
              aria-label={`Vertical offset for ${toolName}`}
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor={`${toolId}-blur`} className="block text-sm font-medium text-gray-700 mb-1">
              Blur Radius: {blur}px
            </label>
            <input
              id={`${toolId}-blur`}
              type="range"
              min="0"
              max="30"
              value={blur}
              onChange={(e) => setBlur(Number(e.target.value))}
              aria-label={`Blur radius for ${toolName}`}
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor={`${toolId}-opacity`} className="block text-sm font-medium text-gray-700 mb-1">
              Opacity: {opacity}%
            </label>
            <input
              id={`${toolId}-opacity`}
              type="range"
              min="0"
              max="100"
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              aria-label={`Shadow opacity for ${toolName}`}
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor={`${toolId}-color`} className="block text-sm font-medium text-gray-700 mb-1">
              Shadow Color
            </label>
            <div className="flex items-center gap-2">
              <input
                id={`${toolId}-color`}
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                aria-label={`Shadow color for ${toolName}`}
                className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
              />
              <span className="text-sm font-mono text-gray-600">{color}</span>
            </div>
          </div>

          <div>
            <label htmlFor={`${toolId}-preview-text`} className="block text-sm font-medium text-gray-700 mb-1">
              Preview Text
            </label>
            <input
              id={`${toolId}-preview-text`}
              type="text"
              value={previewText}
              onChange={(e) => setPreviewText(e.target.value)}
              aria-label={`Preview text for ${toolName}`}
              className="input-field"
            />
          </div>
        </div>

        <div className="flex items-center justify-center bg-white border border-gray-200 rounded-lg p-8 min-h-[200px]">
          <span
            className="text-4xl font-bold text-gray-800"
            style={{ textShadow: cssValue }}
          >
            {previewText || 'Sample Text'}
          </span>
        </div>
      </div>

      <OutputArea hasContent={true}>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Generated CSS</label>
          <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-200">{cssCode}</pre>
          <CopyToClipboard text={cssCode} />
        </div>
      </OutputArea>
    </div>
  );
}
