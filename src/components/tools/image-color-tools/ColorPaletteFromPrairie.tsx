'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromPrairie - Generate color palettes inspired by prairies and grasslands.
 * Offers multiple prairie themes with CSS, Tailwind, and SCSS output.
 */
export default function ColorPaletteFromPrairie({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [theme, setTheme] = useState('golden-wheat');
  const [count, setCount] = useState(5);
  const [output, setOutput] = useState('');

  const themes: Record<string, { name: string; colors: string[] }> = {
    'golden-wheat': { name: 'Golden Wheat Field', colors: ['#F5DEB3', '#DAA520', '#B8860B', '#8B7355', '#6B4423', '#F0E68C', '#FFD700', '#CD853F'] },
    'tallgrass': { name: 'Tallgrass Prairie', colors: ['#7CFC00', '#556B2F', '#6B8E23', '#9ACD32', '#8FBC8F', '#2E8B57', '#3CB371', '#90EE90'] },
    'wildflower': { name: 'Wildflower Meadow', colors: ['#FF6347', '#FF69B4', '#DDA0DD', '#9370DB', '#FFD700', '#FFA500', '#87CEEB', '#98FB98'] },
    'sunset-plains': { name: 'Sunset on the Plains', colors: ['#FF4500', '#FF6347', '#FF8C00', '#FFA07A', '#FFD700', '#2F4F4F', '#483D8B', '#8B0000'] },
    'morning-dew': { name: 'Morning Dew', colors: ['#E0F7FA', '#B2EBF2', '#80DEEA', '#4DB6AC', '#AED581', '#C5E1A5', '#DCEDC8', '#F1F8E9'] },
    'autumn-grass': { name: 'Autumn Grassland', colors: ['#8B4513', '#A0522D', '#CD853F', '#D2691E', '#DEB887', '#F4A460', '#DAA520', '#B8860B'] },
  };

  const generate = () => {
    const selectedTheme = themes[theme];
    if (!selectedTheme) return;

    const shuffled = [...selectedTheme.colors].sort(() => Math.random() - 0.5);
    const palette = shuffled.slice(0, Math.min(count, selectedTheme.colors.length));

    let result = `=== ${selectedTheme.name} Palette ===\n\n`;
    result += `Colors:\n`;
    palette.forEach((color, i) => {
      result += `  ${i + 1}. ${color}\n`;
    });

    result += `\n/* CSS Custom Properties */\n:root {\n`;
    palette.forEach((color, i) => {
      result += `  --prairie-${i + 1}: ${color};\n`;
    });
    result += `}\n`;

    result += `\n/* Tailwind Config */\ncolors: {\n  prairie: {\n`;
    palette.forEach((color, i) => {
      result += `    '${(i + 1) * 100}': '${color}',\n`;
    });
    result += `  }\n}\n`;

    result += `\n/* SCSS Variables */\n`;
    palette.forEach((color, i) => {
      result += `$prairie-${i + 1}: ${color};\n`;
    });

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-theme`} className="block text-sm font-medium text-gray-700 mb-1">Prairie Theme</label>
            <select id={`${toolId}-theme`} value={theme} onChange={(e) => setTheme(e.target.value)} className="input-field" aria-label={`Theme for ${toolName}`}>
              {Object.entries(themes).map(([key, val]) => (
                <option key={key} value={key}>{val.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-count`} className="block text-sm font-medium text-gray-700 mb-1">Number of Colors (3-8)</label>
            <input id={`${toolId}-count`} type="number" min={3} max={8} value={count} onChange={(e) => setCount(parseInt(e.target.value) || 5)} className="input-field" aria-label="Number of colors" />
          </div>
        </div>
        <button onClick={generate} className="mt-4 btn-primary">Generate Palette</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Generated Prairie Palette</label>
            <div className="flex gap-2 flex-wrap">
              {output.match(/#[0-9A-Fa-f]{6}/g)?.slice(0, count).map((color, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-lg border border-gray-200" style={{ backgroundColor: color }} />
                  <span className="text-xs mt-1 font-mono">{color}</span>
                </div>
              ))}
            </div>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto max-h-80">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
