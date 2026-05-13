'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromSteppe - Generate color palettes inspired by steppe landscapes.
 */
export default function ColorPaletteFromSteppe({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [theme, setTheme] = useState('golden-grassland');
  const [count, setCount] = useState('5');
  const [format, setFormat] = useState('css');
  const [output, setOutput] = useState('');

  const themes: Record<string, { name: string; colors: string[] }> = {
    'golden-grassland': { name: 'Golden Grassland', colors: ['#C8A951', '#E8D44D', '#8B7D3C', '#F5E6A3', '#6B5B2A', '#D4B84A', '#A69032', '#F0DC82'] },
    'mongolian-plains': { name: 'Mongolian Plains', colors: ['#8B7355', '#C4A882', '#5C4A3A', '#DEC9A8', '#3D3226', '#A68B6B', '#E8D5B7', '#7A6248'] },
    'kazakh-steppe': { name: 'Kazakh Steppe', colors: ['#9CAF88', '#C5D4A0', '#6B8F5B', '#E2EBD5', '#4A6B3A', '#B8CC8E', '#7DA368', '#D8E4C8'] },
    'winter-steppe': { name: 'Winter Steppe', colors: ['#B8C4D0', '#DDE4EA', '#8A9BAD', '#F0F3F6', '#6B7D8F', '#C8D3DC', '#A0B0C0', '#E8ECF0'] },
    'sunset-prairie': { name: 'Sunset Prairie', colors: ['#D4764A', '#E8A070', '#A85530', '#F0C4A0', '#8B3D1F', '#CC8B5E', '#F5D4B8', '#B86840'] },
    'dry-savanna': { name: 'Dry Savanna', colors: ['#B8956B', '#D4B88A', '#8B6F4A', '#E8D4B0', '#6B5235', '#C4A478', '#F0E0C8', '#A08060'] },
  };

  const generate = () => {
    const numColors = Math.min(8, Math.max(3, parseInt(count) || 5));
    const selectedTheme = themes[theme];
    if (!selectedTheme) return;

    const colors = selectedTheme.colors.slice(0, numColors);
    let result = '';

    if (format === 'css') {
      result = `:root {\n${colors.map((c, i) => `  --steppe-${i + 1}: ${c};`).join('\n')}\n}`;
    } else if (format === 'tailwind') {
      result = `// tailwind.config.js\ncolors: {\n  steppe: {\n${colors.map((c, i) => `    ${(i + 1) * 100}: '${c}',`).join('\n')}\n  }\n}`;
    } else {
      result = colors.map((c, i) => `$steppe-${i + 1}: ${c};`).join('\n');
    }

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-theme`} className="block text-sm font-medium text-gray-700 mb-1">Steppe Theme</label>
            <select id={`${toolId}-theme`} value={theme} onChange={(e) => setTheme(e.target.value)} className="input-field" aria-label={`Theme for ${toolName}`}>
              {Object.entries(themes).map(([key, val]) => (
                <option key={key} value={key}>{val.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor={`${toolId}-count`} className="block text-sm font-medium text-gray-700 mb-1">Number of Colors (3-8)</label>
              <input id={`${toolId}-count`} type="number" min="3" max="8" value={count} onChange={(e) => setCount(e.target.value)} className="input-field" aria-label="Number of colors" />
            </div>
            <div>
              <label htmlFor={`${toolId}-format`} className="block text-sm font-medium text-gray-700 mb-1">Output Format</label>
              <select id={`${toolId}-format`} value={format} onChange={(e) => setFormat(e.target.value)} className="input-field" aria-label="Output format">
                <option value="css">CSS Variables</option>
                <option value="tailwind">Tailwind Config</option>
                <option value="scss">SCSS Variables</option>
              </select>
            </div>
          </div>
          <button onClick={generate} className="btn-primary w-full">Generate Palette</button>
          <div className="flex flex-wrap gap-2 mt-2">
            {themes[theme]?.colors.slice(0, parseInt(count) || 5).map((color, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-10 h-10 rounded border border-gray-200" style={{ backgroundColor: color }} />
                <span className="text-xs text-gray-500 mt-1">{color}</span>
              </div>
            ))}
          </div>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Palette Code</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-3 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
