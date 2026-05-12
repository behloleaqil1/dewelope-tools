'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * MonochromaticPalette - Generates a monochromatic palette from a base color (same hue, different lightness).
 */
export default function MonochromaticPalette({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [hexColor, setHexColor] = useState('#3b82f6');
  const [count, setCount] = useState('7');
  const [palette, setPalette] = useState<string[]>([]);

  const hexToHsl = (hex: string): [number, number, number] => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
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
    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
  };

  const hslToHex = (h: number, s: number, l: number): string => {
    const sN = s / 100, lN = l / 100;
    const c = (1 - Math.abs(2 * lN - 1)) * sN;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = lN - c / 2;
    let r = 0, g = 0, b = 0;
    if (h < 60) { r = c; g = x; }
    else if (h < 120) { r = x; g = c; }
    else if (h < 180) { g = c; b = x; }
    else if (h < 240) { g = x; b = c; }
    else if (h < 300) { r = x; b = c; }
    else { r = c; b = x; }
    const toHex = (v: number) => Math.round((v + m) * 255).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const generate = () => {
    const n = parseInt(count) || 7;
    const [h, s] = hexToHsl(hexColor);
    const colors: string[] = [];
    for (let i = 0; i < n; i++) {
      const lightness = Math.round(10 + (80 / (n - 1)) * i);
      colors.push(hslToHex(h, s, lightness));
    }
    setPalette(colors);
  };

  const copyText = palette.join(', ');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-color`} className="block text-sm font-medium text-gray-700 mb-1">
          Base Color
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
            className="input-field flex-1"
            placeholder="#3b82f6"
          />
        </div>
        <label htmlFor={`${toolId}-count`} className="block text-sm font-medium text-gray-700 mb-1 mt-3">
          Number of shades
        </label>
        <input
          id={`${toolId}-count`}
          type="number"
          min="3"
          max="15"
          value={count}
          onChange={(e) => setCount(e.target.value)}
          aria-label="Number of shades"
          className="input-field w-24"
        />
      </InputArea>

      <button onClick={generate} aria-label="Generate monochromatic palette" className="btn-primary">
        Generate Palette
      </button>

      <OutputArea hasContent={palette.length > 0}>
        {palette.length > 0 && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {palette.map((color, i) => (
                <div key={i} className="text-center">
                  <div className="w-16 h-16 rounded-lg border border-gray-200" style={{ backgroundColor: color }} />
                  <span className="text-xs font-mono text-gray-600 mt-1 block">{color}</span>
                </div>
              ))}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
