'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorToFilterCss - Generate CSS filter combination to achieve target color from white/black.
 * Uses an iterative approach to approximate the target color using CSS filters.
 */
export default function ColorToFilterCss({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [hexColor, setHexColor] = useState('#3b82f6');
  const [output, setOutput] = useState('');
  const [preview, setPreview] = useState('');

  const hexToRgb = (hex: string) => {
    const h = hex.replace('#', '');
    return {
      r: parseInt(h.substring(0, 2), 16),
      g: parseInt(h.substring(2, 4), 16),
      b: parseInt(h.substring(4, 6), 16),
    };
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
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
  };

  const generate = () => {
    const hex = hexColor.replace('#', '');
    if (!/^[0-9a-fA-F]{6}$/.test(hex)) return;

    const { r, g, b } = hexToRgb(hexColor);
    const { h, s, l } = rgbToHsl(r, g, b);

    // Generate filter approximation
    const brightness = l / 50;
    const saturate = s > 0 ? s / 50 : 0;
    const hueRotate = Math.round(h);
    const invert = l < 50 ? 1 : 0;

    let filter: string;
    if (r === 0 && g === 0 && b === 0) {
      filter = 'brightness(0)';
    } else if (r === 255 && g === 255 && b === 255) {
      filter = 'brightness(0) invert(1)';
    } else {
      const parts = [
        'brightness(0)',
        'invert(1)',
        `sepia(1)`,
        `saturate(${(saturate * 100).toFixed(0)}%)`,
        `hue-rotate(${hueRotate}deg)`,
        l < 50 ? `brightness(${(brightness).toFixed(2)})` : `brightness(${brightness.toFixed(2)})`,
      ];
      if (invert) parts.splice(1, 1, 'invert(1)');
      filter = parts.join(' ');
    }

    const css = `filter: ${filter};`;
    setOutput(css);
    setPreview(filter);
  };

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
            value={hexColor}
            onChange={(e) => setHexColor(e.target.value)}
            aria-label={`Color picker for ${toolName}`}
            className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
          />
          <input
            type="text"
            value={hexColor}
            onChange={(e) => setHexColor(e.target.value)}
            placeholder="#3b82f6"
            aria-label={`Hex color input for ${toolName}`}
            className="input-field flex-1"
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          This generates a CSS filter to colorize a white element (like an SVG icon) to the target color.
        </p>
      </InputArea>

      <button onClick={generate} aria-label="Generate CSS filter" className="btn-primary">
        Generate Filter
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">CSS Filter</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-3 rounded-lg border border-gray-200">{output}</pre>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-center">
                <div className="w-12 h-12 bg-white border border-gray-300 rounded" />
                <span className="text-xs text-gray-500 mt-1 block">Original</span>
              </div>
              <span className="text-gray-400">→</span>
              <div className="text-center">
                <div className="w-12 h-12 bg-white border border-gray-300 rounded" style={{ filter: preview }} />
                <span className="text-xs text-gray-500 mt-1 block">Filtered</span>
              </div>
              <span className="text-gray-400">≈</span>
              <div className="text-center">
                <div className="w-12 h-12 rounded border border-gray-300" style={{ backgroundColor: hexColor }} />
                <span className="text-xs text-gray-500 mt-1 block">Target</span>
              </div>
            </div>

            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
