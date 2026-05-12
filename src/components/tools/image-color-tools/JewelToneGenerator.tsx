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
 * JewelToneGenerator - Generates jewel-tone color palettes.
 * Creates rich, saturated colors inspired by gemstones like emerald, ruby, sapphire, and amethyst.
 */
export default function JewelToneGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
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

  // Jewel tone ranges: deep, saturated colors inspired by gemstones
  const JEWEL_RANGES = [
    { name: 'Ruby', hMin: 345, hMax: 360, sMin: 65, sMax: 85, lMin: 30, lMax: 45 },
    { name: 'Garnet', hMin: 0, hMax: 10, sMin: 60, sMax: 80, lMin: 25, lMax: 40 },
    { name: 'Emerald', hMin: 140, hMax: 165, sMin: 60, sMax: 80, lMin: 25, lMax: 40 },
    { name: 'Sapphire', hMin: 210, hMax: 235, sMin: 65, sMax: 85, lMin: 25, lMax: 40 },
    { name: 'Amethyst', hMin: 270, hMax: 290, sMin: 50, sMax: 70, lMin: 30, lMax: 45 },
    { name: 'Topaz', hMin: 35, hMax: 50, sMin: 70, sMax: 90, lMin: 40, lMax: 55 },
    { name: 'Citrine', hMin: 45, hMax: 55, sMin: 75, sMax: 90, lMin: 45, lMax: 55 },
    { name: 'Tanzanite', hMin: 250, hMax: 270, sMin: 50, sMax: 70, lMin: 30, lMax: 45 },
    { name: 'Peridot', hMin: 80, hMax: 100, sMin: 55, sMax: 75, lMin: 35, lMax: 50 },
    { name: 'Tourmaline', hMin: 310, hMax: 340, sMin: 55, sMax: 75, lMin: 30, lMax: 45 },
    { name: 'Jade', hMin: 150, hMax: 170, sMin: 40, sMax: 60, lMin: 30, lMax: 45 },
    { name: 'Opal', hMin: 190, hMax: 210, sMin: 50, sMax: 70, lMin: 35, lMax: 50 },
  ];

  function handleGenerate() {
    const num = Math.max(1, Math.min(12, parseInt(count) || 6));
    const colors: ColorSwatch[] = [];

    for (let i = 0; i < num; i++) {
      const range = JEWEL_RANGES[Math.floor(Math.random() * JEWEL_RANGES.length)];
      const hue = range.hMin + Math.round(Math.random() * (range.hMax - range.hMin));
      const saturation = range.sMin + Math.round(Math.random() * (range.sMax - range.sMin));
      const lightness = range.lMin + Math.round(Math.random() * (range.lMax - range.lMin));
      const hex = hslToHex(hue % 360, saturation, lightness);
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

      <button onClick={handleGenerate} aria-label="Generate jewel tone palette" className="btn-primary">
        Generate Jewel Tones
      </button>

      <OutputArea hasContent={palette.length > 0}>
        {palette.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">Jewel Tone Palette</h3>
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
