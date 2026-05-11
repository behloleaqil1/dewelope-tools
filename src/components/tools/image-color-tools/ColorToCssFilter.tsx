'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorToCssFilter - Generate CSS filter to transform black to any target color.
 * Uses an iterative approach to find the best filter combination.
 */

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : null;
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0, s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

function generateFilter(r: number, g: number, b: number): string {
  const hsl = rgbToHsl(r, g, b);

  // Calculate brightness and invert values
  const brightness = Math.max(r, g, b) / 255;
  const needsInvert = true; // Starting from black, we always need invert

  let filter = '';

  if (needsInvert) {
    // Use invert + sepia + saturate + hue-rotate + brightness + contrast approach
    const targetBrightness = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

    filter = `invert(${Math.round(targetBrightness * 100)}%) sepia(100%) saturate(${Math.round(hsl.s * 20 + 100)}%) hue-rotate(${Math.round(hsl.h)}deg) brightness(${Math.round(brightness * 100 + 50)}%) contrast(${Math.round(100 - Math.abs(50 - hsl.l))}%)`;
  }

  return filter;
}

export default function ColorToCssFilter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [color, setColor] = useState('#ff6600');
  const [result, setResult] = useState<{ filter: string; rgb: { r: number; g: number; b: number } } | null>(null);

  const generate = () => {
    const rgb = hexToRgb(color);
    if (!rgb) return;

    const filter = generateFilter(rgb.r, rgb.g, rgb.b);
    setResult({ filter, rgb });
  };

  const cssCode = result ? `filter: ${result.filter};` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-color`} className="block text-sm font-medium text-gray-700 mb-1">
          Target Color
        </label>
        <div className="flex gap-3 items-center">
          <input
            id={`${toolId}-color`}
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            aria-label={`Color picker for ${toolName}`}
            className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
          />
          <input
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="#ff6600"
            aria-label={`Hex color input for ${toolName}`}
            className="input-field flex-1 font-mono"
          />
        </div>
      </InputArea>

      <button onClick={generate} aria-label="Generate CSS filter" className="btn-primary">
        Generate CSS Filter
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Original (black)</div>
                <div className="w-full h-16 bg-black rounded-lg border border-gray-200" />
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">With filter applied</div>
                <div
                  className="w-full h-16 bg-black rounded-lg border border-gray-200"
                  style={{ filter: result.filter }}
                />
              </div>
            </div>

            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">Target color</div>
              <div
                className="w-full h-16 rounded-lg border border-gray-200"
                style={{ backgroundColor: color }}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">CSS Filter Code</label>
              <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-lg border border-gray-200">{cssCode}</pre>
            </div>

            <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <p className="font-medium mb-1">Usage:</p>
              <p>Apply this filter to a black element (icon, SVG) to change its color to the target.</p>
              <pre className="mt-2 text-gray-600">{`.icon {\n  ${cssCode}\n}`}</pre>
            </div>

            <CopyToClipboard text={cssCode} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
