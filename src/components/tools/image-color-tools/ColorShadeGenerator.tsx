'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

interface Shade {
  hex: string;
  lightness: number;
}

/**
 * ColorShadeGenerator - Generates 10 shades from lightest to darkest
 * for a given hex color by adjusting lightness in HSL color space.
 */
export default function ColorShadeGenerator({ toolId, toolName: _toolName }: { toolId: string; toolName: string }) {
  const [hexInput, setHexInput] = useState('#3b82f6');
  const [shades, setShades] = useState<Shade[]>([]);
  const [error, setError] = useState<string | undefined>();

  function hexToHsl(hex: string): { h: number; s: number; l: number } | null {
    const cleaned = hex.replace('#', '');
    if (!/^[0-9a-fA-F]{6}$/.test(cleaned) && !/^[0-9a-fA-F]{3}$/.test(cleaned)) {
      return null;
    }

    let r: number, g: number, b: number;

    if (cleaned.length === 3) {
      r = parseInt(cleaned[0] + cleaned[0], 16) / 255;
      g = parseInt(cleaned[1] + cleaned[1], 16) / 255;
      b = parseInt(cleaned[2] + cleaned[2], 16) / 255;
    } else {
      r = parseInt(cleaned.slice(0, 2), 16) / 255;
      g = parseInt(cleaned.slice(2, 4), 16) / 255;
      b = parseInt(cleaned.slice(4, 6), 16) / 255;
    }

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    let h = 0;
    let s = 0;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  }

  function hslToHex(h: number, s: number, l: number): string {
    const sNorm = s / 100;
    const lNorm = l / 100;

    const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = lNorm - c / 2;

    let r = 0, g = 0, b = 0;

    if (h < 60) { r = c; g = x; b = 0; }
    else if (h < 120) { r = x; g = c; b = 0; }
    else if (h < 180) { r = 0; g = c; b = x; }
    else if (h < 240) { r = 0; g = x; b = c; }
    else if (h < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }

    const toHex = (val: number) => {
      const hex = Math.round((val + m) * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  function handleGenerate() {
    setError(undefined);
    setShades([]);

    const cleaned = hexInput.trim();
    const hsl = hexToHsl(cleaned);

    if (!hsl) {
      setError('Please enter a valid hex color (e.g., #3b82f6 or #f00)');
      return;
    }

    // Generate 10 shades from lightness 95% (lightest) to 10% (darkest)
    const generatedShades: Shade[] = [];
    for (let i = 0; i < 10; i++) {
      const lightness = 95 - (i * 85) / 9; // 95 down to ~10
      const hex = hslToHex(hsl.h, hsl.s, lightness);
      generatedShades.push({ hex, lightness: Math.round(lightness) });
    }

    setShades(generatedShades);
  }

  const allHexValues = shades.map((s) => s.hex).join('\n');

  return (
    <div className="space-y-5">
      <InputArea error={error}>
        <label htmlFor={`${toolId}-color`} className="block text-sm font-medium text-gray-700 mb-1">
          Base Color (Hex)
        </label>
        <div className="flex gap-3 items-center">
          <input
            id={`${toolId}-color`}
            type="text"
            value={hexInput}
            onChange={(e) => setHexInput(e.target.value)}
            placeholder="#3b82f6"
            aria-label="Hex color input for shade generation"
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

      <button
        onClick={handleGenerate}
        aria-label="Generate color shades"
        className="btn-primary"
      >
        Generate Shades
      </button>

      <OutputArea hasContent={shades.length > 0}>
        {shades.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">Color Shades</h3>
              <CopyToClipboard text={allHexValues} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {shades.map((shade, idx) => (
                <div key={idx} className="text-center">
                  <div
                    className="w-full h-16 rounded-lg border border-gray-200 mb-1"
                    style={{ backgroundColor: shade.hex }}
                    aria-label={`Shade ${idx + 1}: ${shade.hex}`}
                  />
                  <span className="text-xs font-mono text-gray-600">{shade.hex}</span>
                  <span className="block text-xs text-gray-400">L: {shade.lightness}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
