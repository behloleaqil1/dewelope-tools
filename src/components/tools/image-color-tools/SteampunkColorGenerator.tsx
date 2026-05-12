'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

interface ColorSwatch {
  hex: string;
  name: string;
}

const STEAMPUNK_PALETTES: { name: string; hRange: [number, number]; sRange: [number, number]; lRange: [number, number] }[] = [
  { name: 'Brass', hRange: [38, 48], sRange: [65, 80], lRange: [42, 52] },
  { name: 'Copper', hRange: [18, 28], sRange: [60, 75], lRange: [40, 50] },
  { name: 'Aged Bronze', hRange: [30, 40], sRange: [40, 55], lRange: [30, 40] },
  { name: 'Iron Gray', hRange: [210, 220], sRange: [5, 15], lRange: [35, 45] },
  { name: 'Mahogany', hRange: [8, 18], sRange: [50, 65], lRange: [22, 32] },
  { name: 'Parchment', hRange: [38, 48], sRange: [30, 45], lRange: [82, 90] },
  { name: 'Verdigris', hRange: [160, 175], sRange: [35, 50], lRange: [38, 48] },
  { name: 'Burgundy Leather', hRange: [345, 358], sRange: [40, 55], lRange: [25, 35] },
  { name: 'Coal Black', hRange: [0, 360], sRange: [0, 5], lRange: [8, 15] },
  { name: 'Amber', hRange: [35, 42], sRange: [80, 92], lRange: [45, 55] },
  { name: 'Rust Patina', hRange: [12, 22], sRange: [55, 70], lRange: [35, 45] },
  { name: 'Ivory Gear', hRange: [42, 52], sRange: [20, 35], lRange: [88, 94] },
];

/**
 * SteampunkColorGenerator - Generate steampunk-themed color palettes.
 * Creates industrial, Victorian-era inspired color combinations.
 */
export default function SteampunkColorGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
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

  function handleGenerate() {
    const num = Math.max(1, Math.min(12, parseInt(count) || 6));
    const colors: ColorSwatch[] = [];
    const usedIndices = new Set<number>();

    for (let i = 0; i < num; i++) {
      let idx = Math.floor(Math.random() * STEAMPUNK_PALETTES.length);
      if (usedIndices.size < STEAMPUNK_PALETTES.length) {
        while (usedIndices.has(idx)) idx = Math.floor(Math.random() * STEAMPUNK_PALETTES.length);
      }
      usedIndices.add(idx);

      const p = STEAMPUNK_PALETTES[idx];
      const hue = p.hRange[0] + Math.random() * (p.hRange[1] - p.hRange[0]);
      const sat = p.sRange[0] + Math.random() * (p.sRange[1] - p.sRange[0]);
      const lit = p.lRange[0] + Math.random() * (p.lRange[1] - p.lRange[0]);
      const hex = hslToHex(Math.round(hue) % 360, Math.round(sat), Math.round(lit));
      colors.push({ hex, name: p.name });
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

      <button onClick={handleGenerate} aria-label="Generate steampunk color palette" className="btn-primary">
        Generate Steampunk Palette
      </button>

      <OutputArea hasContent={palette.length > 0}>
        {palette.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">Steampunk Color Palette</h3>
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
