'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorWheelGenerator - Generate complementary, triadic, tetradic, and analogous color schemes from a base color.
 */
export default function ColorWheelGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [baseColor, setBaseColor] = useState('#3b82f6');
  const [scheme, setScheme] = useState<'complementary' | 'triadic' | 'tetradic' | 'analogous' | 'split-complementary'>('complementary');

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
    return [h * 360, s * 100, l * 100];
  };

  const hslToHex = (h: number, s: number, l: number): string => {
    h = ((h % 360) + 360) % 360;
    s /= 100; l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const generateScheme = (): { name: string; hex: string }[] => {
    const [h, s, l] = hexToHsl(baseColor);
    const colors: { name: string; hex: string }[] = [{ name: 'Base', hex: baseColor }];

    switch (scheme) {
      case 'complementary':
        colors.push({ name: 'Complementary', hex: hslToHex(h + 180, s, l) });
        break;
      case 'triadic':
        colors.push({ name: 'Triadic 1', hex: hslToHex(h + 120, s, l) });
        colors.push({ name: 'Triadic 2', hex: hslToHex(h + 240, s, l) });
        break;
      case 'tetradic':
        colors.push({ name: 'Tetradic 1', hex: hslToHex(h + 90, s, l) });
        colors.push({ name: 'Tetradic 2', hex: hslToHex(h + 180, s, l) });
        colors.push({ name: 'Tetradic 3', hex: hslToHex(h + 270, s, l) });
        break;
      case 'analogous':
        colors.push({ name: 'Analogous 1', hex: hslToHex(h + 30, s, l) });
        colors.push({ name: 'Analogous 2', hex: hslToHex(h - 30, s, l) });
        break;
      case 'split-complementary':
        colors.push({ name: 'Split 1', hex: hslToHex(h + 150, s, l) });
        colors.push({ name: 'Split 2', hex: hslToHex(h + 210, s, l) });
        break;
    }
    return colors;
  };

  const colors = generateScheme();
  const copyText = colors.map((c) => `${c.name}: ${c.hex}`).join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label htmlFor={`${toolId}-color`} className="block text-sm font-medium text-gray-700 mb-1">
              Base Color
            </label>
            <div className="flex items-center gap-2">
              <input
                id={`${toolId}-color`}
                type="color"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value)}
                aria-label={`Base color for ${toolName}`}
                className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={baseColor}
                onChange={(e) => { if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) setBaseColor(e.target.value); }}
                className="input-field w-28 font-mono"
                aria-label="Base color hex value"
              />
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-scheme`} className="block text-sm font-medium text-gray-700 mb-1">
              Color Scheme
            </label>
            <select
              id={`${toolId}-scheme`}
              value={scheme}
              onChange={(e) => setScheme(e.target.value as typeof scheme)}
              aria-label={`Color scheme type for ${toolName}`}
              className="input-field"
            >
              <option value="complementary">Complementary</option>
              <option value="triadic">Triadic</option>
              <option value="tetradic">Tetradic</option>
              <option value="analogous">Analogous</option>
              <option value="split-complementary">Split Complementary</option>
            </select>
          </div>
        </div>
      </InputArea>

      <OutputArea hasContent={true}>
        <div className="space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {colors.map((c, i) => (
              <div key={i} className="text-center">
                <div
                  className="w-full h-20 rounded-lg border border-gray-200 mb-1"
                  style={{ backgroundColor: c.hex }}
                />
                <div className="text-xs font-medium text-gray-700">{c.name}</div>
                <div className="text-xs font-mono text-gray-500">{c.hex}</div>
              </div>
            ))}
          </div>
          <CopyToClipboard text={copyText} />
        </div>
      </OutputArea>
    </div>
  );
}
