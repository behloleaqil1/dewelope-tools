'use client';

import { useState } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * WatercolorPaletteGenerator - Generate watercolor-style muted palettes.
 * Creates soft, desaturated color palettes inspired by watercolor paintings.
 */
export default function WatercolorPaletteGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [theme, setTheme] = useState('spring');
  const [palette, setPalette] = useState<string[]>([]);

  const themes: Record<string, { name: string; hueRange: [number, number]; satRange: [number, number]; lightRange: [number, number] }> = {
    spring: { name: 'Spring Garden', hueRange: [80, 160], satRange: [25, 45], lightRange: [70, 88] },
    ocean: { name: 'Ocean Mist', hueRange: [180, 240], satRange: [20, 40], lightRange: [68, 85] },
    sunset: { name: 'Soft Sunset', hueRange: [0, 50], satRange: [30, 50], lightRange: [72, 88] },
    lavender: { name: 'Lavender Fields', hueRange: [260, 310], satRange: [25, 45], lightRange: [72, 88] },
    earth: { name: 'Earth Tones', hueRange: [20, 60], satRange: [20, 40], lightRange: [65, 82] },
    forest: { name: 'Misty Forest', hueRange: [100, 180], satRange: [15, 35], lightRange: [60, 80] },
    rose: { name: 'Rose Water', hueRange: [330, 370], satRange: [25, 45], lightRange: [75, 90] },
    autumn: { name: 'Autumn Wash', hueRange: [10, 45], satRange: [30, 50], lightRange: [65, 82] },
  };

  const hslToHex = (h: number, s: number, l: number): string => {
    h = ((h % 360) + 360) % 360;
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

  const generate = () => {
    const config = themes[theme];
    const colors: string[] = [];

    for (let i = 0; i < 5; i++) {
      const h = config.hueRange[0] + Math.random() * (config.hueRange[1] - config.hueRange[0]);
      const s = config.satRange[0] + Math.random() * (config.satRange[1] - config.satRange[0]);
      const l = config.lightRange[0] + Math.random() * (config.lightRange[1] - config.lightRange[0]);
      colors.push(hslToHex(h, s, l));
    }

    setPalette(colors);
  };

  const copyText = palette.length > 0
    ? `Watercolor Palette (${themes[theme].name}):\n${palette.join('\n')}\n\nCSS Variables:\n${palette.map((c, i) => `--watercolor-${i + 1}: ${c};`).join('\n')}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="space-y-3">
        <label htmlFor={`${toolId}-theme`} className="block text-sm font-medium text-gray-700">
          Watercolor Theme
        </label>
        <select
          id={`${toolId}-theme`}
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          aria-label={`Theme selection for ${toolName}`}
          className="input-field"
        >
          {Object.entries(themes).map(([key, val]) => (
            <option key={key} value={key}>{val.name}</option>
          ))}
        </select>
      </div>

      <button onClick={generate} className="btn-primary" aria-label="Generate watercolor palette">
        Generate Palette
      </button>

      <OutputArea hasContent={palette.length > 0}>
        {palette.length > 0 && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              {themes[theme].name} Palette
            </label>
            <div className="flex gap-2 h-24 rounded-lg overflow-hidden">
              {palette.map((color, i) => (
                <div
                  key={i}
                  className="flex-1 flex items-end justify-center pb-2"
                  style={{ backgroundColor: color }}
                >
                  <span className="text-xs font-mono bg-white/80 px-1 rounded">{color}</span>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <p className="text-xs font-medium text-gray-600 mb-2">CSS Variables:</p>
              <pre className="text-xs font-mono text-gray-700">
                {palette.map((c, i) => `--watercolor-${i + 1}: ${c};`).join('\n')}
              </pre>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
