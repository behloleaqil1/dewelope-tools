'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromHex - Generate analogous, monochromatic palette from a single hex color.
 */
export default function ColorPaletteFromHex({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [hexInput, setHexInput] = useState('#3b82f6');
  const [paletteType, setPaletteType] = useState<'analogous' | 'monochromatic' | 'complementary' | 'triadic'>('analogous');
  const [error, setError] = useState('');
  const [palette, setPalette] = useState<string[]>([]);

  function hexToHsl(hex: string): [number, number, number] {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return [0, 0, 0];
    const r = parseInt(result[1], 16) / 255;
    const g = parseInt(result[2], 16) / 255;
    const b = parseInt(result[3], 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return [h * 360, s * 100, l * 100];
  }

  function hslToHex(h: number, s: number, l: number): string {
    h = ((h % 360) + 360) % 360;
    s = Math.max(0, Math.min(100, s)) / 100;
    l = Math.max(0, Math.min(100, l)) / 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }

  const generate = () => {
    setError('');
    const hex = hexInput.trim();
    if (!/^#?[0-9a-fA-F]{6}$/.test(hex)) {
      setError('Please enter a valid 6-digit hex color');
      setPalette([]);
      return;
    }

    const normalizedHex = hex.startsWith('#') ? hex : `#${hex}`;
    const [h, s, l] = hexToHsl(normalizedHex);
    const colors: string[] = [];

    switch (paletteType) {
      case 'analogous':
        colors.push(hslToHex(h - 30, s, l));
        colors.push(hslToHex(h - 15, s, l));
        colors.push(normalizedHex);
        colors.push(hslToHex(h + 15, s, l));
        colors.push(hslToHex(h + 30, s, l));
        break;
      case 'monochromatic':
        colors.push(hslToHex(h, s, Math.max(10, l - 30)));
        colors.push(hslToHex(h, s, Math.max(10, l - 15)));
        colors.push(normalizedHex);
        colors.push(hslToHex(h, s, Math.min(90, l + 15)));
        colors.push(hslToHex(h, s, Math.min(90, l + 30)));
        break;
      case 'complementary':
        colors.push(hslToHex(h, s, Math.max(10, l - 15)));
        colors.push(normalizedHex);
        colors.push(hslToHex(h, s, Math.min(90, l + 15)));
        colors.push(hslToHex(h + 180, s, l));
        colors.push(hslToHex(h + 180, s, Math.min(90, l + 15)));
        break;
      case 'triadic':
        colors.push(normalizedHex);
        colors.push(hslToHex(h + 120, s, l));
        colors.push(hslToHex(h + 240, s, l));
        colors.push(hslToHex(h + 120, s, Math.min(90, l + 15)));
        colors.push(hslToHex(h + 240, s, Math.min(90, l + 15)));
        break;
    }

    setPalette(colors);
  };

  const copyText = palette.join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-hex`} className="block text-sm font-medium text-gray-700 mb-1">
          Base Hex Color
        </label>
        <div className="flex gap-2">
          <input
            id={`${toolId}-hex`}
            type="text"
            value={hexInput}
            onChange={(e) => { setHexInput(e.target.value); if (error) setError(''); }}
            placeholder="#3b82f6"
            aria-label={`Hex color input for ${toolName}`}
            className="input-field flex-1 font-mono"
          />
          <input
            type="color"
            value={hexInput.startsWith('#') ? hexInput : `#${hexInput}`}
            onChange={(e) => setHexInput(e.target.value)}
            className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
            aria-label="Color picker"
          />
        </div>
        <div className="mt-3">
          <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">Palette Type</label>
          <select id={`${toolId}-type`} value={paletteType} onChange={(e) => setPaletteType(e.target.value as typeof paletteType)} className="input-field" aria-label="Palette type">
            <option value="analogous">Analogous</option>
            <option value="monochromatic">Monochromatic</option>
            <option value="complementary">Complementary</option>
            <option value="triadic">Triadic</option>
          </select>
        </div>
      </InputArea>

      <button onClick={generate} aria-label="Generate palette" className="btn-primary">
        Generate Palette
      </button>

      <OutputArea hasContent={palette.length > 0}>
        {palette.length > 0 && (
          <div className="space-y-3">
            <div className="flex rounded-lg overflow-hidden border border-gray-200 h-24">
              {palette.map((color, i) => (
                <div key={i} className="flex-1 flex items-end justify-center pb-2" style={{ backgroundColor: color }}>
                  <span className="text-xs font-mono px-1 py-0.5 rounded bg-white/80 text-gray-800">{color}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-5 gap-2">
              {palette.map((color, i) => (
                <div key={i} className="text-center">
                  <div className="w-full h-12 rounded border border-gray-200" style={{ backgroundColor: color }} />
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
