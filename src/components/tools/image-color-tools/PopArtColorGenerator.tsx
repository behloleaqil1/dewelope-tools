'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

interface ColorSwatch {
  hex: string;
  name: string;
}

const POP_ART_PALETTES: { name: string; hRange: [number, number]; sRange: [number, number]; lRange: [number, number] }[] = [
  { name: 'Hot Pink', hRange: [325, 340], sRange: [85, 95], lRange: [55, 65] },
  { name: 'Electric Blue', hRange: [195, 210], sRange: [85, 95], lRange: [50, 60] },
  { name: 'Lemon Yellow', hRange: [50, 58], sRange: [90, 98], lRange: [55, 65] },
  { name: 'Vivid Orange', hRange: [15, 28], sRange: [90, 98], lRange: [52, 60] },
  { name: 'Lime Green', hRange: [85, 100], sRange: [75, 90], lRange: [45, 55] },
  { name: 'Pop Purple', hRange: [275, 290], sRange: [70, 85], lRange: [50, 60] },
  { name: 'Cherry Red', hRange: [350, 360], sRange: [80, 92], lRange: [48, 56] },
  { name: 'Turquoise', hRange: [170, 185], sRange: [70, 85], lRange: [48, 58] },
  { name: 'Magenta', hRange: [295, 310], sRange: [75, 90], lRange: [52, 62] },
  { name: 'Sunshine', hRange: [42, 50], sRange: [88, 96], lRange: [58, 66] },
  { name: 'Coral', hRange: [5, 15], sRange: [80, 92], lRange: [60, 68] },
  { name: 'Cyan Pop', hRange: [185, 195], sRange: [80, 92], lRange: [52, 60] },
];

/**
 * PopArtColorGenerator - Generate Pop Art-themed color palettes.
 * Creates bold, vibrant, high-saturation color combinations inspired by Pop Art.
 */
export default function PopArtColorGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
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
      let idx = Math.floor(Math.random() * POP_ART_PALETTES.length);
      if (usedIndices.size < POP_ART_PALETTES.length) {
        while (usedIndices.has(idx)) idx = Math.floor(Math.random() * POP_ART_PALETTES.length);
      }
      usedIndices.add(idx);

      const p = POP_ART_PALETTES[idx];
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

      <button onClick={handleGenerate} aria-label="Generate Pop Art color palette" className="btn-primary">
        Generate Pop Art Palette
      </button>

      <OutputArea hasContent={palette.length > 0}>
        {palette.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">Pop Art Color Palette</h3>
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
