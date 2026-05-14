'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * AccessibleColorPaletteGenerator - Generate WCAG-compliant color palettes.
 */
export default function AccessibleColorPaletteGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [baseColor, setBaseColor] = useState('#2563eb');
  const [paletteSize, setPaletteSize] = useState('5');
  const [result, setResult] = useState<{ colors: { hex: string; contrast: number; passAA: boolean; passAAA: boolean }[] } | null>(null);

  function hexToHsl(hex: string): [number, number, number] {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const l = (max + min) / 2;
    let h = 0, s = 0;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
      else if (max === g) h = ((b - r) / d + 2) / 6;
      else h = ((r - g) / d + 4) / 6;
    }
    return [h * 360, s * 100, l * 100];
  }

  function hslToHex(h: number, s: number, l: number): string {
    s /= 100; l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }

  function luminance(hex: string): number {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const [rs, gs, bs] = [r, g, b].map(c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  function contrastWith(hex: string): number {
    const l1 = luminance(hex);
    const l2 = luminance('#ffffff');
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return Math.round(((lighter + 0.05) / (darker + 0.05)) * 100) / 100;
  }

  function generate() {
    const size = parseInt(paletteSize);
    const [h, s] = hexToHsl(baseColor);
    const colors: { hex: string; contrast: number; passAA: boolean; passAAA: boolean }[] = [];

    for (let i = 0; i < size; i++) {
      const lightness = 15 + (i * (55 / Math.max(size - 1, 1)));
      const hex = hslToHex(h, s, lightness);
      const contrast = contrastWith(hex);
      colors.push({ hex, contrast, passAA: contrast >= 4.5, passAAA: contrast >= 7 });
    }

    setResult({ colors });
  }

  const copyText = result
    ? result.colors.map(c => `${c.hex} — ${c.contrast}:1 ${c.passAAA ? '(AAA)' : c.passAA ? '(AA)' : '(Fail)'}`).join('\n')
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="flex items-center gap-4">
          <div>
            <label htmlFor={`${toolId}-color`} className="block text-sm font-medium text-gray-700 mb-1">Base Color</label>
            <div className="flex items-center gap-2">
              <input id={`${toolId}-color`} type="color" value={baseColor} onChange={(e) => setBaseColor(e.target.value)} aria-label={`Base color for ${toolName}`} className="w-10 h-10 rounded border border-gray-300 cursor-pointer" />
              <input type="text" value={baseColor} onChange={(e) => setBaseColor(e.target.value)} aria-label="Base color hex" className="input-field w-28 font-mono" />
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-size`} className="block text-sm font-medium text-gray-700 mb-1">Palette Size</label>
            <select id={`${toolId}-size`} value={paletteSize} onChange={(e) => setPaletteSize(e.target.value)} aria-label="Palette size" className="input-field">
              <option value="3">3 colors</option>
              <option value="5">5 colors</option>
              <option value="7">7 colors</option>
              <option value="9">9 colors</option>
            </select>
          </div>
        </div>
      </InputArea>

      <button onClick={generate} aria-label="Generate accessible palette" className="btn-primary">
        Generate Palette
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="flex gap-1">
              {result.colors.map((c, i) => (
                <div key={i} className="flex-1 h-16 rounded" style={{ backgroundColor: c.hex }} title={`${c.hex} — ${c.contrast}:1`} />
              ))}
            </div>
            <div className="space-y-1">
              {result.colors.map((c, i) => (
                <div key={i} className="flex items-center justify-between text-sm px-2 py-1 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded" style={{ backgroundColor: c.hex }} />
                    <span className="font-mono">{c.hex}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">{c.contrast}:1</span>
                    <span className={`px-1.5 py-0.5 rounded text-xs ${c.passAAA ? 'bg-green-100 text-green-800' : c.passAA ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                      {c.passAAA ? 'AAA' : c.passAA ? 'AA' : 'Fail'}
                    </span>
                  </div>
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
