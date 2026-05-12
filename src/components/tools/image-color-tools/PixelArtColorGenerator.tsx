'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

interface ColorSwatch {
  hex: string;
  name: string;
}

const PIXEL_ART_PALETTES: { name: string; hRange: [number, number]; sRange: [number, number]; lRange: [number, number] }[] = [
  { name: 'NES Red', hRange: [0, 8], sRange: [75, 95], lRange: [45, 55] },
  { name: 'Game Boy Green', hRange: [90, 120], sRange: [40, 70], lRange: [30, 50] },
  { name: 'SNES Blue', hRange: [210, 230], sRange: [70, 90], lRange: [40, 55] },
  { name: 'Arcade Yellow', hRange: [48, 58], sRange: [85, 100], lRange: [50, 60] },
  { name: 'Retro Orange', hRange: [20, 35], sRange: [80, 95], lRange: [48, 58] },
  { name: 'Pixel Purple', hRange: [270, 290], sRange: [55, 75], lRange: [40, 55] },
  { name: 'Sprite Cyan', hRange: [175, 195], sRange: [60, 80], lRange: [45, 58] },
  { name: 'Dungeon Brown', hRange: [25, 40], sRange: [40, 60], lRange: [25, 38] },
  { name: 'Health Pink', hRange: [330, 345], sRange: [60, 80], lRange: [55, 68] },
  { name: 'Coin Gold', hRange: [42, 52], sRange: [75, 95], lRange: [45, 55] },
  { name: 'Sky Light', hRange: [195, 210], sRange: [50, 70], lRange: [70, 82] },
  { name: 'Shadow Dark', hRange: [230, 260], sRange: [15, 30], lRange: [15, 25] },
];

/**
 * PixelArtColorGenerator - Generate pixel art/8-bit color palettes.
 * Creates vibrant, limited-palette colors inspired by retro gaming aesthetics.
 */
export default function PixelArtColorGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [count, setCount] = useState('8');
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

  // Snap to nearest 8-bit style value (reduce color depth)
  function snapTo8Bit(hex: string): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const snap = (v: number) => Math.round(v / 32) * 32;
    const toHex = (v: number) => Math.min(255, snap(v)).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  function handleGenerate() {
    const num = Math.max(1, Math.min(12, parseInt(count) || 8));
    const colors: ColorSwatch[] = [];
    const usedIndices = new Set<number>();

    for (let i = 0; i < num; i++) {
      let idx = Math.floor(Math.random() * PIXEL_ART_PALETTES.length);
      if (usedIndices.size < PIXEL_ART_PALETTES.length) {
        while (usedIndices.has(idx)) idx = Math.floor(Math.random() * PIXEL_ART_PALETTES.length);
      }
      usedIndices.add(idx);

      const p = PIXEL_ART_PALETTES[idx];
      const hue = p.hRange[0] + Math.random() * (p.hRange[1] - p.hRange[0]);
      const sat = p.sRange[0] + Math.random() * (p.sRange[1] - p.sRange[0]);
      const lit = p.lRange[0] + Math.random() * (p.lRange[1] - p.lRange[0]);
      const rawHex = hslToHex(Math.round(hue) % 360, Math.round(sat), Math.round(lit));
      const hex = snapTo8Bit(rawHex);
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

      <button onClick={handleGenerate} aria-label="Generate pixel art palette" className="btn-primary">
        Generate Pixel Art Palette
      </button>

      <OutputArea hasContent={palette.length > 0}>
        {palette.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">Pixel Art / 8-Bit Color Palette</h3>
              <CopyToClipboard text={allHexValues} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {palette.map((color, idx) => (
                <div key={idx} className="text-center">
                  <div
                    className="w-full h-16 rounded border-2 border-gray-800 mb-1"
                    style={{ backgroundColor: color.hex, imageRendering: 'pixelated' }}
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
