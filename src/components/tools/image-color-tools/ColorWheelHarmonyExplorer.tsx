'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorWheelHarmonyExplorer - Interactive color wheel with harmony rules.
 */
export default function ColorWheelHarmonyExplorer({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [baseColor, setBaseColor] = useState('#e63946');
  const [harmony, setHarmony] = useState('complementary');
  const [result, setResult] = useState<{ colors: string[]; names: string[] } | null>(null);

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
    h = ((h % 360) + 360) % 360;
    s /= 100; l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }

  function explore() {
    const [h, s, l] = hexToHsl(baseColor);
    const colors: string[] = [baseColor];
    const names: string[] = ['Base'];

    switch (harmony) {
      case 'complementary':
        colors.push(hslToHex(h + 180, s, l));
        names.push('Complement');
        break;
      case 'analogous':
        colors.push(hslToHex(h - 30, s, l), hslToHex(h + 30, s, l));
        names.push('Analogous -30°', 'Analogous +30°');
        break;
      case 'triadic':
        colors.push(hslToHex(h + 120, s, l), hslToHex(h + 240, s, l));
        names.push('Triadic +120°', 'Triadic +240°');
        break;
      case 'split-complementary':
        colors.push(hslToHex(h + 150, s, l), hslToHex(h + 210, s, l));
        names.push('Split +150°', 'Split +210°');
        break;
      case 'tetradic':
        colors.push(hslToHex(h + 90, s, l), hslToHex(h + 180, s, l), hslToHex(h + 270, s, l));
        names.push('Tetradic +90°', 'Tetradic +180°', 'Tetradic +270°');
        break;
    }

    setResult({ colors, names });
  }

  const copyText = result ? result.colors.map((c, i) => `${result.names[i]}: ${c}`).join('\n') : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="flex items-center gap-4 flex-wrap">
          <div>
            <label htmlFor={`${toolId}-color`} className="block text-sm font-medium text-gray-700 mb-1">Base Color</label>
            <input id={`${toolId}-color`} type="color" value={baseColor} onChange={(e) => setBaseColor(e.target.value)} aria-label={`Base color for ${toolName}`} className="w-12 h-10 rounded border border-gray-300 cursor-pointer" />
          </div>
          <div>
            <label htmlFor={`${toolId}-harmony`} className="block text-sm font-medium text-gray-700 mb-1">Harmony</label>
            <select id={`${toolId}-harmony`} value={harmony} onChange={(e) => setHarmony(e.target.value)} aria-label="Color harmony type" className="input-field">
              <option value="complementary">Complementary</option>
              <option value="analogous">Analogous</option>
              <option value="triadic">Triadic</option>
              <option value="split-complementary">Split Complementary</option>
              <option value="tetradic">Tetradic</option>
            </select>
          </div>
        </div>
      </InputArea>

      <button onClick={explore} aria-label="Explore color harmony" className="btn-primary">Explore Harmony</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="flex gap-2 h-20">
              {result.colors.map((c, i) => (
                <div key={i} className="flex-1 rounded-lg border border-gray-200" style={{ backgroundColor: c }} title={`${result.names[i]}: ${c}`} />
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {result.colors.map((c, i) => (
                <div key={i} className="text-center text-sm">
                  <div className="w-full h-8 rounded" style={{ backgroundColor: c }} />
                  <div className="text-xs text-gray-600 mt-1">{result.names[i]}</div>
                  <div className="text-xs font-mono text-gray-500">{c}</div>
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
