'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

interface ColorSwatch {
  hex: string;
  name: string;
}

/**
 * EarthToneGenerator - Generates earth-tone color palettes.
 * Creates natural colors like browns, greens, tans, and terracotta.
 */
export default function EarthToneGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [count, setCount] = useState('6');
  const [palette, setPalette] = useState<ColorSwatch[]>([]);

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

  // Earth tone hue ranges: browns (20-40), olive/green (60-120), tan/sand (30-50), terracotta (10-25)
  const EARTH_RANGES = [
    { name: 'Terracotta', hMin: 8, hMax: 22, sMin: 40, sMax: 65, lMin: 30, lMax: 50 },
    { name: 'Sienna', hMin: 15, hMax: 30, sMin: 45, sMax: 70, lMin: 25, lMax: 45 },
    { name: 'Sand', hMin: 35, hMax: 50, sMin: 30, sMax: 55, lMin: 55, lMax: 75 },
    { name: 'Tan', hMin: 30, hMax: 45, sMin: 25, sMax: 50, lMin: 45, lMax: 65 },
    { name: 'Olive', hMin: 60, hMax: 90, sMin: 20, sMax: 45, lMin: 30, lMax: 50 },
    { name: 'Moss', hMin: 80, hMax: 120, sMin: 20, sMax: 40, lMin: 25, lMax: 45 },
    { name: 'Forest', hMin: 100, hMax: 140, sMin: 15, sMax: 35, lMin: 20, lMax: 40 },
    { name: 'Clay', hMin: 12, hMax: 28, sMin: 35, sMax: 60, lMin: 35, lMax: 55 },
    { name: 'Umber', hMin: 20, hMax: 35, sMin: 30, sMax: 55, lMin: 20, lMax: 35 },
    { name: 'Khaki', hMin: 45, hMax: 60, sMin: 25, sMax: 45, lMin: 50, lMax: 70 },
    { name: 'Sage', hMin: 90, hMax: 130, sMin: 10, sMax: 30, lMin: 40, lMax: 60 },
    { name: 'Bark', hMin: 18, hMax: 32, sMin: 35, sMax: 55, lMin: 15, lMax: 30 },
  ];

  function handleGenerate() {
    const num = Math.max(1, Math.min(12, parseInt(count) || 6));
    const colors: ColorSwatch[] = [];

    for (let i = 0; i < num; i++) {
      const range = EARTH_RANGES[Math.floor(Math.random() * EARTH_RANGES.length)];
      const hue = range.hMin + Math.round(Math.random() * (range.hMax - range.hMin));
      const saturation = range.sMin + Math.round(Math.random() * (range.sMax - range.sMin));
      const lightness = range.lMin + Math.round(Math.random() * (range.lMax - range.lMin));
      const hex = hslToHex(hue, saturation, lightness);
      colors.push({ hex, name: range.name });
    }

    setPalette(colors);
  }

  const allHexValues = palette.map((c) => c.hex).join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-count`} className="block text-sm font-medium text-gray-700 mb-1">
          Number of Colors (1-12)
        </label>
        <input
          id={`${toolId}-count`}
          type="number"
          min="1"
          max="12"
          value={count}
          onChange={(e) => setCount(e.target.value)}
          aria-label={`Number of colors for ${toolName}`}
          className="input-field w-32"
        />
      </InputArea>

      <button onClick={handleGenerate} aria-label="Generate earth tone palette" className="btn-primary">
        Generate Earth Tones
      </button>

      <OutputArea hasContent={palette.length > 0}>
        {palette.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">Earth Tone Palette</h3>
              <CopyToClipboard text={allHexValues} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {palette.map((color, idx) => (
                <div key={idx} className="text-center">
                  <div
                    className="w-full h-20 rounded-lg border border-gray-200 mb-1"
                    style={{ backgroundColor: color.hex }}
                    aria-label={`${color.name}: ${color.hex}`}
                  />
                  <span className="text-xs font-mono text-gray-600">{color.hex}</span>
                  <span className="block text-xs text-gray-400">{color.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
