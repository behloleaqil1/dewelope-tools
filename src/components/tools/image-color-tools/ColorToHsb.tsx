'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorToHsb - Convert colors to HSB/HSV format with visual picker.
 * Accepts hex, RGB, or HSL input and outputs HSB (Hue, Saturation, Brightness).
 */
export default function ColorToHsb({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [hexInput, setHexInput] = useState('#3b82f6');
  const [result, setResult] = useState<{ h: number; s: number; b: number; r: number; g: number; bl: number } | null>(null);

  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const clean = hex.replace('#', '');
    let fullHex = clean;
    if (clean.length === 3) {
      fullHex = clean.split('').map((c) => c + c).join('');
    }
    if (fullHex.length !== 6 || !/^[0-9a-fA-F]{6}$/.test(fullHex)) return null;
    return {
      r: parseInt(fullHex.slice(0, 2), 16),
      g: parseInt(fullHex.slice(2, 4), 16),
      b: parseInt(fullHex.slice(4, 6), 16),
    };
  };

  const rgbToHsb = (r: number, g: number, b: number) => {
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;
    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    const delta = max - min;

    let h = 0;
    if (delta !== 0) {
      if (max === rNorm) h = ((gNorm - bNorm) / delta) % 6;
      else if (max === gNorm) h = (bNorm - rNorm) / delta + 2;
      else h = (rNorm - gNorm) / delta + 4;
      h = Math.round(h * 60);
      if (h < 0) h += 360;
    }

    const s = max === 0 ? 0 : Math.round((delta / max) * 100);
    const brightness = Math.round(max * 100);

    return { h, s, b: brightness };
  };

  const convert = () => {
    const rgb = hexToRgb(hexInput);
    if (!rgb) return;
    const hsb = rgbToHsb(rgb.r, rgb.g, rgb.b);
    setResult({ ...hsb, r: rgb.r, g: rgb.g, bl: rgb.b });
  };

  const copyText = result
    ? `HSB: ${result.h}°, ${result.s}%, ${result.b}%\nRGB: rgb(${result.r}, ${result.g}, ${result.bl})\nHex: ${hexInput}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-color`} className="block text-sm font-medium text-gray-700 mb-1">
          Color (Hex)
        </label>
        <div className="flex gap-3 items-center">
          <input
            id={`${toolId}-picker`}
            type="color"
            value={hexInput.startsWith('#') && hexInput.length === 7 ? hexInput : '#3b82f6'}
            onChange={(e) => setHexInput(e.target.value)}
            aria-label={`Color picker for ${toolName}`}
            className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
          />
          <input
            id={`${toolId}-color`}
            type="text"
            value={hexInput}
            onChange={(e) => setHexInput(e.target.value)}
            placeholder="#3b82f6"
            aria-label={`Hex color input for ${toolName}`}
            className="input-field flex-1"
          />
        </div>
      </InputArea>

      <button onClick={convert} aria-label="Convert to HSB" className="btn-primary">
        Convert to HSB
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-16 h-16 rounded-lg border border-gray-300" style={{ backgroundColor: hexInput }} />
              <div className="text-sm text-gray-600">
                <div>Hex: {hexInput}</div>
                <div>RGB: rgb({result.r}, {result.g}, {result.bl})</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.h}°</div>
                <div className="text-xs text-gray-500 mt-1">Hue</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.s}%</div>
                <div className="text-xs text-gray-500 mt-1">Saturation</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.b}%</div>
                <div className="text-xs text-gray-500 mt-1">Brightness</div>
              </div>
            </div>
            <div className="text-sm font-mono text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200">
              HSB({result.h}°, {result.s}%, {result.b}%)
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
