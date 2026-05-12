'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * AnalogousColorGenerator - Generates analogous colors (adjacent on the color wheel).
 * Rotates hue by ±30° increments in HSL color space.
 */
export default function AnalogousColorGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [hexInput, setHexInput] = useState('#3b82f6');
  const [count, setCount] = useState('5');
  const [angle, setAngle] = useState('30');
  const [result, setResult] = useState<string[] | null>(null);
  const [error, setError] = useState<string | undefined>();

  function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const cleaned = hex.replace('#', '');
    if (!/^[0-9a-fA-F]{6}$/.test(cleaned) && !/^[0-9a-fA-F]{3}$/.test(cleaned)) return null;
    let r: number, g: number, b: number;
    if (cleaned.length === 3) {
      r = parseInt(cleaned[0] + cleaned[0], 16);
      g = parseInt(cleaned[1] + cleaned[1], 16);
      b = parseInt(cleaned[2] + cleaned[2], 16);
    } else {
      r = parseInt(cleaned.slice(0, 2), 16);
      g = parseInt(cleaned.slice(2, 4), 16);
      b = parseInt(cleaned.slice(4, 6), 16);
    }
    return { r, g, b };
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

  function hslToHex(h: number, s: number, l: number): string {
    s /= 100; l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;
    if (h < 60) { r = c; g = x; }
    else if (h < 120) { r = x; g = c; }
    else if (h < 180) { g = c; b = x; }
    else if (h < 240) { g = x; b = c; }
    else if (h < 300) { r = x; b = c; }
    else { r = c; b = x; }
    const toHex = (v: number) => Math.round((v + m) * 255).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  function handleGenerate() {
    setError(undefined);
    setResult(null);

    const rgb = hexToRgb(hexInput.trim());
    if (!rgb) {
      setError('Please enter a valid hex color (e.g., #3b82f6)');
      return;
    }

    const numColors = parseInt(count, 10);
    if (isNaN(numColors) || numColors < 3 || numColors > 12) {
      setError('Number of colors must be between 3 and 12');
      return;
    }

    const deg = parseInt(angle, 10);
    if (isNaN(deg) || deg < 5 || deg > 60) {
      setError('Angle must be between 5 and 60 degrees');
      return;
    }

    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const colors: string[] = [];
    const half = Math.floor(numColors / 2);

    for (let i = -half; i <= half; i++) {
      if (colors.length >= numColors) break;
      const newHue = (hsl.h + i * deg + 360) % 360;
      colors.push(hslToHex(newHue, hsl.s, hsl.l));
    }

    setResult(colors);
  }

  const copyText = result ? result.join('\n') : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-color`} className="block text-sm font-medium text-gray-700 mb-1">
          Base Color (Hex)
        </label>
        <div className="flex gap-3 items-center mb-3">
          <input
            id={`${toolId}-color`}
            type="text"
            value={hexInput}
            onChange={(e) => setHexInput(e.target.value)}
            placeholder="#3b82f6"
            aria-label={`Hex color input for ${toolName}`}
            className="input-field flex-1"
          />
          <input
            type="color"
            value={hexInput.length === 7 ? hexInput : '#3b82f6'}
            onChange={(e) => setHexInput(e.target.value)}
            aria-label="Color picker"
            className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${toolId}-count`} className="block text-sm font-medium text-gray-700 mb-1">
              Number of Colors
            </label>
            <input
              id={`${toolId}-count`}
              type="number"
              min="3"
              max="12"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              aria-label="Number of analogous colors"
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-angle`} className="block text-sm font-medium text-gray-700 mb-1">
              Angle (degrees)
            </label>
            <input
              id={`${toolId}-angle`}
              type="number"
              min="5"
              max="60"
              value={angle}
              onChange={(e) => setAngle(e.target.value)}
              aria-label="Angle between colors in degrees"
              className="input-field"
            />
          </div>
        </div>
      </InputArea>

      <button onClick={handleGenerate} aria-label="Generate analogous colors" className="btn-primary">
        Generate Analogous Colors
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="flex gap-2 flex-wrap">
              {result.map((color, i) => (
                <div key={i} className="text-center">
                  <div
                    className="w-16 h-16 rounded-lg border border-gray-200"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs font-mono text-gray-600 mt-1 block">{color}</span>
                </div>
              ))}
            </div>
            <div className="w-full h-12 rounded-lg border border-gray-200 overflow-hidden flex">
              {result.map((color, i) => (
                <div key={i} className="flex-1" style={{ backgroundColor: color }} />
              ))}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
