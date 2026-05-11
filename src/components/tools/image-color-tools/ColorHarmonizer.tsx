'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

type HarmonyType = 'monochromatic' | 'analogous' | 'split-complementary' | 'triadic' | 'complementary';

/**
 * ColorHarmonizer - Generate monochromatic, analogous, split-complementary,
 * triadic, and complementary color palettes from a base color.
 */
export default function ColorHarmonizer({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [hexInput, setHexInput] = useState('#3b82f6');
  const [harmony, setHarmony] = useState<HarmonyType>('analogous');
  const [palette, setPalette] = useState<string[]>([]);
  const [error, setError] = useState<string | undefined>();

  function hexToHsl(hex: string): { h: number; s: number; l: number } | null {
    const cleaned = hex.replace('#', '');
    if (!/^[0-9a-fA-F]{6}$/.test(cleaned) && !/^[0-9a-fA-F]{3}$/.test(cleaned)) return null;

    let r: number, g: number, b: number;
    if (cleaned.length === 3) {
      r = parseInt(cleaned[0] + cleaned[0], 16) / 255;
      g = parseInt(cleaned[1] + cleaned[1], 16) / 255;
      b = parseInt(cleaned[2] + cleaned[2], 16) / 255;
    } else {
      r = parseInt(cleaned.slice(0, 2), 16) / 255;
      g = parseInt(cleaned.slice(2, 4), 16) / 255;
      b = parseInt(cleaned.slice(4, 6), 16) / 255;
    }

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
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

    return { h: h * 360, s: s * 100, l: l * 100 };
  }

  function hslToHex(h: number, s: number, l: number): string {
    const sN = s / 100;
    const lN = l / 100;
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

    const toHex = (val: number) => {
      const hex = Math.round((val + m) * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  function generatePalette() {
    setError(undefined);
    setPalette([]);

    const hsl = hexToHsl(hexInput.trim());
    if (!hsl) {
      setError('Please enter a valid hex color (e.g., #3b82f6)');
      return;
    }

    const { h, s, l } = hsl;
    let colors: string[] = [];

    switch (harmony) {
      case 'monochromatic':
        colors = [
          hslToHex(h, s, Math.min(l + 30, 95)),
          hslToHex(h, s, Math.min(l + 15, 90)),
          hslToHex(h, s, l),
          hslToHex(h, s, Math.max(l - 15, 10)),
          hslToHex(h, s, Math.max(l - 30, 5)),
        ];
        break;
      case 'analogous':
        colors = [
          hslToHex((h - 30 + 360) % 360, s, l),
          hslToHex((h - 15 + 360) % 360, s, l),
          hslToHex(h, s, l),
          hslToHex((h + 15) % 360, s, l),
          hslToHex((h + 30) % 360, s, l),
        ];
        break;
      case 'split-complementary':
        colors = [
          hslToHex(h, s, l),
          hslToHex((h + 150) % 360, s, l),
          hslToHex((h + 210) % 360, s, l),
        ];
        break;
      case 'triadic':
        colors = [
          hslToHex(h, s, l),
          hslToHex((h + 120) % 360, s, l),
          hslToHex((h + 240) % 360, s, l),
        ];
        break;
      case 'complementary':
        colors = [
          hslToHex(h, s, l),
          hslToHex((h + 180) % 360, s, l),
        ];
        break;
    }

    setPalette(colors);
  }

  const harmonyOptions: { value: HarmonyType; label: string }[] = [
    { value: 'monochromatic', label: 'Monochromatic' },
    { value: 'analogous', label: 'Analogous' },
    { value: 'split-complementary', label: 'Split-Complementary' },
    { value: 'triadic', label: 'Triadic' },
    { value: 'complementary', label: 'Complementary' },
  ];

  const allHexValues = palette.join('\n');

  return (
    <div className="space-y-5" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-color`} className="block text-sm font-medium text-gray-700 mb-1">
          Base Color (Hex)
        </label>
        <div className="flex gap-3 items-center">
          <input
            id={`${toolId}-color`}
            type="text"
            value={hexInput}
            onChange={(e) => setHexInput(e.target.value)}
            placeholder="#3b82f6"
            aria-label={`Hex color input for ${toolName}`}
            className="input-field flex-1"
          />
          <input
            type="color"
            value={hexInput.length === 7 ? hexInput : '#3b82f6'}
            onChange={(e) => setHexInput(e.target.value)}
            aria-label="Color picker"
            className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
          />
        </div>
      </InputArea>

      <InputArea>
        <label htmlFor={`${toolId}-harmony`} className="block text-sm font-medium text-gray-700 mb-1">
          Harmony Type
        </label>
        <select
          id={`${toolId}-harmony`}
          value={harmony}
          onChange={(e) => setHarmony(e.target.value as HarmonyType)}
          aria-label="Color harmony type"
          className="input-field"
        >
          {harmonyOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </InputArea>

      <button onClick={generatePalette} aria-label="Generate color palette" className="btn-primary">
        Generate Palette
      </button>

      <OutputArea hasContent={palette.length > 0}>
        {palette.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700 capitalize">{harmony} Palette</h3>
              <CopyToClipboard text={allHexValues} />
            </div>
            <div className="flex gap-2">
              {palette.map((color, idx) => (
                <div key={idx} className="flex-1 text-center">
                  <div
                    className="w-full h-20 rounded-lg border border-gray-200 mb-1"
                    style={{ backgroundColor: color }}
                    aria-label={`Color ${idx + 1}: ${color}`}
                  />
                  <span className="text-xs font-mono text-gray-600">{color}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
