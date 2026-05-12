'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

interface ColorSwatch {
  hex: string;
  name: string;
}

const DARK_ACADEMIA_PALETTES: { name: string; hRange: [number, number]; sRange: [number, number]; lRange: [number, number] }[] = [
  { name: 'Aged Parchment', hRange: [35, 50], sRange: [30, 50], lRange: [70, 82] },
  { name: 'Leather Brown', hRange: [20, 35], sRange: [40, 60], lRange: [25, 40] },
  { name: 'Ink Black', hRange: [0, 30], sRange: [5, 15], lRange: [10, 18] },
  { name: 'Forest Green', hRange: [120, 150], sRange: [20, 40], lRange: [20, 35] },
  { name: 'Burgundy Wine', hRange: [345, 360], sRange: [35, 55], lRange: [20, 35] },
  { name: 'Antique Gold', hRange: [40, 55], sRange: [50, 70], lRange: [40, 55] },
  { name: 'Charcoal Gray', hRange: [0, 20], sRange: [5, 15], lRange: [25, 35] },
  { name: 'Ivory Cream', hRange: [40, 55], sRange: [25, 45], lRange: [85, 93] },
  { name: 'Oxford Blue', hRange: [210, 230], sRange: [30, 50], lRange: [18, 30] },
  { name: 'Mahogany', hRange: [10, 20], sRange: [45, 65], lRange: [20, 32] },
  { name: 'Olive Drab', hRange: [70, 90], sRange: [20, 40], lRange: [25, 38] },
  { name: 'Sepia Tone', hRange: [25, 40], sRange: [35, 55], lRange: [35, 50] },
];

/**
 * DarkAcademiaColorGenerator - Generate dark academia aesthetic color palettes.
 * Creates moody, scholarly color combinations with aged parchment, leather, and ink tones.
 */
export default function DarkAcademiaColorGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
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
      let idx = Math.floor(Math.random() * DARK_ACADEMIA_PALETTES.length);
      if (usedIndices.size < DARK_ACADEMIA_PALETTES.length) {
        while (usedIndices.has(idx)) idx = Math.floor(Math.random() * DARK_ACADEMIA_PALETTES.length);
      }
      usedIndices.add(idx);

      const p = DARK_ACADEMIA_PALETTES[idx];
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

      <button onClick={handleGenerate} aria-label="Generate dark academia color palette" className="btn-primary">
        Generate Dark Academia Palette
      </button>

      <OutputArea hasContent={palette.length > 0}>
        {palette.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">Dark Academia Palette</h3>
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
