'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SpringColorGenerator - Generate spring-themed color palettes.
 */
export default function SpringColorGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [count, setCount] = useState('6');
  const [colors, setColors] = useState<string[]>([]);

  const springHues = [
    { h: [300, 330], s: [40, 70], l: [70, 85] },  // soft pink / cherry blossom
    { h: [90, 130], s: [40, 65], l: [55, 75] },   // fresh green
    { h: [180, 210], s: [35, 60], l: [65, 80] },  // sky blue
    { h: [50, 70], s: [60, 85], l: [65, 80] },    // daffodil yellow
    { h: [270, 300], s: [35, 60], l: [65, 80] },  // lavender
    { h: [330, 350], s: [50, 75], l: [60, 75] },  // rose
    { h: [140, 170], s: [30, 55], l: [60, 75] },  // mint green
    { h: [20, 40], s: [60, 80], l: [70, 85] },    // peach
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
      const preset = springHues[i % springHues.length];
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

      <button onClick={generate} className="btn-primary" aria-label="Generate spring palette">Generate Spring Palette</button>

      <OutputArea hasContent={colors.length > 0}>
        {colors.length > 0 && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Spring Palette</label>
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
