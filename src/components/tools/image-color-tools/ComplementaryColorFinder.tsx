'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ComplementaryColorFinder - Finds the complementary (opposite) color on the color wheel.
 * Converts hex to HSL, rotates hue by 180°, and converts back.
 */
export default function ComplementaryColorFinder({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [hexInput, setHexInput] = useState('#3b82f6');
  const [result, setResult] = useState<{ original: string; complementary: string } | null>(null);
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

  function handleFind() {
    setError(undefined);
    setResult(null);

    const rgb = hexToRgb(hexInput.trim());
    if (!rgb) {
      setError('Please enter a valid hex color (e.g., #3b82f6 or #f00)');
      return;
    }

    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const compHue = (hsl.h + 180) % 360;
    const complementary = hslToHex(compHue, hsl.s, hsl.l);
    const original = hexInput.trim().startsWith('#') ? hexInput.trim() : `#${hexInput.trim()}`;

    setResult({ original, complementary });
  }

  const copyText = result ? `Original: ${result.original}\nComplementary: ${result.complementary}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-color`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter Color (Hex)
        </label>
        <div className="flex gap-3 items-center">
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
      </InputArea>

      <button onClick={handleFind} aria-label="Find complementary color" className="btn-primary">
        Find Complementary
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="w-full h-24 rounded-lg border border-gray-200 mb-2" style={{ backgroundColor: result.original }} />
                <span className="text-sm font-mono text-gray-700">{result.original}</span>
                <span className="block text-xs text-gray-500">Original</span>
              </div>
              <div className="text-center">
                <div className="w-full h-24 rounded-lg border border-gray-200 mb-2" style={{ backgroundColor: result.complementary }} />
                <span className="text-sm font-mono text-gray-700">{result.complementary}</span>
                <span className="block text-xs text-gray-500">Complementary</span>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
