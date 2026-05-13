'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromSavanna - Generate color palettes inspired by African savanna landscapes.
 */
export default function ColorPaletteFromSavanna({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [theme, setTheme] = useState('golden-hour');
  const [count, setCount] = useState(5);
  const [output, setOutput] = useState('');
  const [colors, setColors] = useState<string[]>([]);

  const themes: Record<string, { name: string; colors: string[] }> = {
    'golden-hour': {
      name: 'Golden Hour',
      colors: ['#F4A460', '#DAA520', '#CD853F', '#D2691E', '#8B4513', '#F5DEB3', '#FFD700', '#E8B84B', '#C4722F', '#A0522D'],
    },
    'dry-season': {
      name: 'Dry Season',
      colors: ['#C2B280', '#D2B48C', '#DEB887', '#F5F5DC', '#8B7355', '#A0926B', '#BDB76B', '#E6D5A8', '#9C8B6E', '#6B5B3E'],
    },
    'sunset-plains': {
      name: 'Sunset Plains',
      colors: ['#FF6347', '#FF4500', '#FF8C00', '#FFA07A', '#8B0000', '#DC143C', '#FF7F50', '#E25822', '#CC5500', '#B22222'],
    },
    'acacia-grove': {
      name: 'Acacia Grove',
      colors: ['#556B2F', '#6B8E23', '#808000', '#9ACD32', '#2E8B57', '#3CB371', '#228B22', '#4F7942', '#8FBC8F', '#A9BA9D'],
    },
    'watering-hole': {
      name: 'Watering Hole',
      colors: ['#4682B4', '#5F9EA0', '#87CEEB', '#B0C4DE', '#2F4F4F', '#708090', '#778899', '#6495ED', '#4169E1', '#1E90FF'],
    },
    'wildlife': {
      name: 'Wildlife',
      colors: ['#F5F5DC', '#000000', '#8B4513', '#D2691E', '#FFD700', '#FF8C00', '#808080', '#A0522D', '#2F4F4F', '#F4A460'],
    },
  };

  const generate = () => {
    const themeData = themes[theme];
    if (!themeData) return;

    const shuffled = [...themeData.colors].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, count);
    setColors(selected);

    const cssVars = selected.map((c, i) => `  --savanna-${i + 1}: ${c};`).join('\n');
    const tailwind = selected.map((c, i) => `      'savanna-${i + 1}': '${c}',`).join('\n');
    const scss = selected.map((c, i) => `$savanna-${i + 1}: ${c};`).join('\n');

    const result = [
      `=== ${themeData.name} Savanna Palette ===`,
      '',
      'Colors:',
      ...selected.map((c, i) => `  ${i + 1}. ${c}`),
      '',
      '--- CSS Custom Properties ---',
      ':root {',
      cssVars,
      '}',
      '',
      '--- Tailwind Config ---',
      'colors: {',
      tailwind,
      '}',
      '',
      '--- SCSS Variables ---',
      scss,
    ];

    setOutput(result.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Savanna Theme</label>
              <select value={theme} onChange={e => setTheme(e.target.value)} className="input-field" aria-label="Savanna theme">
                {Object.entries(themes).map(([key, val]) => (
                  <option key={key} value={key}>{val.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Number of Colors</label>
              <input type="number" min={3} max={8} value={count} onChange={e => setCount(Number(e.target.value))} className="input-field" aria-label="Number of colors" />
            </div>
          </div>

          <button onClick={generate} className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium" aria-label={`Generate ${toolName}`}>
            Generate Palette
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-3">
            <div className="flex gap-2 flex-wrap">
              {colors.map((c, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded border shadow-sm" style={{ backgroundColor: c }} />
                  <span className="text-xs mt-1 font-mono">{c}</span>
                </div>
              ))}
            </div>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded border">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
