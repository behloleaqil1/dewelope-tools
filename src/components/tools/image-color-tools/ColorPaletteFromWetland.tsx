'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromWetland - Generate color palettes inspired by wetlands and marshes.
 * Includes themes like Misty Marsh, Mangrove, Bog, Estuary, Reed Bed, and Swamp.
 */
export default function ColorPaletteFromWetland({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [theme, setTheme] = useState('misty-marsh');
  const [colorCount, setColorCount] = useState('5');
  const [output, setOutput] = useState('');
  const [colors, setColors] = useState<string[]>([]);

  const themes: Record<string, { name: string; colors: string[] }> = {
    'misty-marsh': { name: 'Misty Marsh', colors: ['#8B9E8B', '#A3B5A3', '#C4D4C4', '#D9E5D9', '#6B7F6B', '#4A5E4A', '#B8C8B8', '#E8F0E8'] },
    'mangrove': { name: 'Mangrove', colors: ['#2D4A2D', '#3E5E3E', '#5A7A5A', '#7A9A7A', '#1A3A1A', '#4E6E4E', '#8BAA8B', '#3A5A3A'] },
    'bog': { name: 'Peat Bog', colors: ['#4A3728', '#5E4A3A', '#7A6450', '#96806A', '#3A2A1E', '#6E5844', '#B09A84', '#8A7460'] },
    'estuary': { name: 'Estuary', colors: ['#5A7A8A', '#7A9AAA', '#9ABACC', '#BADAEE', '#3A5A6A', '#4A6A7A', '#AACADD', '#6A8A9A'] },
    'reed-bed': { name: 'Reed Bed', colors: ['#8A7A40', '#A49A58', '#BEB470', '#D8CE88', '#706030', '#9A8A48', '#C8BE78', '#E2D890'] },
    'swamp': { name: 'Deep Swamp', colors: ['#1A2E1A', '#2A3E2A', '#3A4E3A', '#4A5E4A', '#0A1E0A', '#2E422E', '#5A6E5A', '#1E321E'] },
  };

  const generate = () => {
    const count = parseInt(colorCount);
    const themeData = themes[theme];
    if (!themeData) return;

    const shuffled = [...themeData.colors].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(count, themeData.colors.length));
    setColors(selected);

    const cssVars = selected.map((c, i) => `  --wetland-${i + 1}: ${c};`).join('\n');
    const tailwind = selected.map((c, i) => `        'wetland-${i + 1}': '${c}',`).join('\n');
    const scss = selected.map((c, i) => `$wetland-${i + 1}: ${c};`).join('\n');

    const lines = [
      `=== ${themeData.name} Palette ===`,
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

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-theme`} className="block text-sm font-medium text-gray-700 mb-1">Wetland Theme</label>
            <select id={`${toolId}-theme`} value={theme} onChange={(e) => setTheme(e.target.value)} className="input-field" aria-label={`Theme selection for ${toolName}`}>
              <option value="misty-marsh">Misty Marsh</option>
              <option value="mangrove">Mangrove</option>
              <option value="bog">Peat Bog</option>
              <option value="estuary">Estuary</option>
              <option value="reed-bed">Reed Bed</option>
              <option value="swamp">Deep Swamp</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-count`} className="block text-sm font-medium text-gray-700 mb-1">Number of Colors</label>
            <select id={`${toolId}-count`} value={colorCount} onChange={(e) => setColorCount(e.target.value)} className="input-field" aria-label="Number of colors">
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
            </select>
          </div>
        </div>
        <button onClick={generate} className="btn-primary mt-4">Generate Palette</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            {colors.length > 0 && (
              <div className="flex gap-2 mb-3">
                {colors.map((color, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-lg border border-gray-200" style={{ backgroundColor: color }} />
                    <span className="text-xs text-gray-500 mt-1">{color}</span>
                  </div>
                ))}
              </div>
            )}
            <label className="block text-sm font-medium text-gray-700">Palette Output</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
