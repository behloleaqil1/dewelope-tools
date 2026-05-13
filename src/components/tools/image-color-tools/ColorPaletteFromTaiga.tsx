'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromTaiga - Generate color palettes inspired by taiga/boreal forest landscapes.
 * Offers themes like Spruce Forest, Winter Taiga, Autumn Boreal, Moss & Lichen, etc.
 */

const TAIGA_THEMES: Record<string, { name: string; colors: string[]; description: string }> = {
  spruce: { name: 'Spruce Forest', colors: ['#1B3A2D', '#2D5A3F', '#4A7C59', '#6B9B6E', '#8FBC8F', '#C8DFC8', '#E8F5E8', '#0F2419'], description: 'Deep evergreen tones of dense spruce forests' },
  winter: { name: 'Winter Taiga', colors: ['#E8EDF2', '#C5D3E0', '#9BB0C7', '#6B8BA8', '#4A6B82', '#2C4A5E', '#1A3040', '#F5F8FA'], description: 'Cold blues and whites of snow-covered boreal forest' },
  autumn: { name: 'Autumn Boreal', colors: ['#8B4513', '#A0522D', '#CD853F', '#DAA520', '#B8860B', '#6B4423', '#4A3015', '#E8C36A'], description: 'Warm golden and brown tones of fall larch needles' },
  moss: { name: 'Moss & Lichen', colors: ['#556B2F', '#6B8E23', '#8FBC3F', '#9ACD32', '#A8C256', '#BDB76B', '#C4C99A', '#3D5020'], description: 'Soft greens and yellows of forest floor moss and lichen' },
  twilight: { name: 'Boreal Twilight', colors: ['#1A1A2E', '#2D2D5E', '#4A3F7A', '#6B5B95', '#8B7BAF', '#B8A9D4', '#D4C5E8', '#0F0F1A'], description: 'Purple and deep blue hues of northern twilight' },
  birch: { name: 'Birch Grove', colors: ['#F5F5DC', '#E8E0C8', '#D4C9A8', '#C0B288', '#8B7D5E', '#6B5D3E', '#4A3F28', '#FAFAF0'], description: 'Cream and bark tones of birch tree groves' },
};

export default function ColorPaletteFromTaiga({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [theme, setTheme] = useState('spruce');
  const [colorCount, setColorCount] = useState('6');
  const [format, setFormat] = useState<'css' | 'tailwind' | 'scss'>('css');
  const [output, setOutput] = useState('');

  const generate = () => {
    const selectedTheme = TAIGA_THEMES[theme];
    if (!selectedTheme) return;

    const count = Math.max(3, Math.min(8, parseInt(colorCount) || 6));
    const colors = selectedTheme.colors.slice(0, count);

    let result = '';
    if (format === 'css') {
      result = `/* ${selectedTheme.name} - ${selectedTheme.description} */\n:root {\n`;
      colors.forEach((color, i) => {
        result += `  --taiga-${theme}-${(i + 1) * 100}: ${color};\n`;
      });
      result += `}\n`;
    } else if (format === 'tailwind') {
      result = `// ${selectedTheme.name} - ${selectedTheme.description}\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n        'taiga-${theme}': {\n`;
      colors.forEach((color, i) => {
        result += `          ${(i + 1) * 100}: '${color}',\n`;
      });
      result += `        },\n      },\n    },\n  },\n};\n`;
    } else {
      result = `// ${selectedTheme.name} - ${selectedTheme.description}\n`;
      colors.forEach((color, i) => {
        result += `$taiga-${theme}-${(i + 1) * 100}: ${color};\n`;
      });
    }

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor={`${toolId}-theme`} className="block text-sm font-medium text-gray-700 mb-1">Taiga Theme</label>
            <select id={`${toolId}-theme`} value={theme} onChange={(e) => setTheme(e.target.value)} className="input-field" aria-label={`Theme selection for ${toolName}`}>
              {Object.entries(TAIGA_THEMES).map(([key, t]) => (
                <option key={key} value={key}>{t.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-count`} className="block text-sm font-medium text-gray-700 mb-1">Number of Colors (3-8)</label>
            <input id={`${toolId}-count`} type="number" min="3" max="8" value={colorCount} onChange={(e) => setColorCount(e.target.value)} className="input-field" aria-label="Number of colors" />
          </div>
          <div>
            <label htmlFor={`${toolId}-format`} className="block text-sm font-medium text-gray-700 mb-1">Output Format</label>
            <select id={`${toolId}-format`} value={format} onChange={(e) => setFormat(e.target.value as 'css' | 'tailwind' | 'scss')} className="input-field" aria-label="Output format">
              <option value="css">CSS Custom Properties</option>
              <option value="tailwind">Tailwind Config</option>
              <option value="scss">SCSS Variables</option>
            </select>
          </div>
        </div>
        <button onClick={generate} className="btn-primary mt-4">Generate Palette</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Generated Palette</label>
            <div className="flex gap-2 flex-wrap">
              {TAIGA_THEMES[theme]?.colors.slice(0, parseInt(colorCount) || 6).map((color, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className="w-12 h-12 rounded-lg border border-gray-200 shadow-sm" style={{ backgroundColor: color }} />
                  <span className="text-xs font-mono text-gray-600">{color}</span>
                </div>
              ))}
            </div>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
