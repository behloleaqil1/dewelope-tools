'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * GalaxyColorGenerator - Generate galaxy/space-themed color palettes.
 */
export default function GalaxyColorGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [count, setCount] = useState('6');
  const [colors, setColors] = useState<string[]>([]);

  const galaxyHues = [
    { h: [240, 270], s: [40, 70], l: [10, 25] },   // deep space blue
    { h: [270, 300], s: [50, 80], l: [20, 40] },   // nebula purple
    { h: [200, 230], s: [60, 90], l: [30, 50] },   // cosmic blue
    { h: [300, 330], s: [40, 70], l: [40, 60] },   // stellar pink
    { h: [180, 210], s: [50, 80], l: [50, 70] },   // starlight cyan
    { h: [40, 60], s: [70, 95], l: [60, 80] },     // star gold
    { h: [250, 280], s: [30, 55], l: [15, 30] },   // void indigo
    { h: [320, 350], s: [45, 75], l: [35, 55] },   // aurora magenta
  ];

  const hslToHex = (h: number, s: number, l: number): string => {
    s /= 100;
    l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const randBetween = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

  const generate = () => {
    const n = Math.max(1, Math.min(12, parseInt(count) || 6));
    const palette: string[] = [];

    for (let i = 0; i < n; i++) {
      const preset = galaxyHues[i % galaxyHues.length];
      const h = randBetween(preset.h[0], preset.h[1]);
      const s = randBetween(preset.s[0], preset.s[1]);
      const l = randBetween(preset.l[0], preset.l[1]);
      palette.push(hslToHex(h, s, l));
    }

    setColors(palette);
  };

  const copyText = colors.join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-count`} className="block text-sm font-medium text-gray-700 mb-1">Number of Colors (1-12)</label>
        <input id={`${toolId}-count`} type="number" min="1" max="12" value={count} onChange={(e) => setCount(e.target.value)} aria-label={`Number of colors for ${toolName}`} className="input-field w-32" />
      </InputArea>

      <button onClick={generate} className="btn-primary" aria-label="Generate galaxy palette">Generate Galaxy Palette</button>

      <OutputArea hasContent={colors.length > 0}>
        {colors.length > 0 && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Galaxy Palette</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {colors.map((color, i) => (
                <div key={i} className="text-center">
                  <div className="w-full h-20 rounded-lg border border-gray-200 shadow-sm" style={{ backgroundColor: color }} />
                  <div className="text-xs font-mono mt-1 text-gray-700">{color}</div>
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
