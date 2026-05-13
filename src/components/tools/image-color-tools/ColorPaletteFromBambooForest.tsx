'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const THEMES = {
  'bamboo-grove': { name: 'Bamboo Grove', colors: ['#2D5016', '#4A7C23', '#6B8E23', '#8FBC3B', '#C5E17A', '#F0F7E4', '#3E2723', '#5D4037'] },
  'misty-bamboo': { name: 'Misty Bamboo', colors: ['#4A6741', '#6B8F62', '#8FB583', '#B8D4B0', '#E8F5E1', '#F5F5F5', '#78909C', '#546E7A'] },
  'bamboo-sunset': { name: 'Bamboo Sunset', colors: ['#33691E', '#558B2F', '#7CB342', '#FF8F00', '#FFB300', '#FFF176', '#4E342E', '#3E2723'] },
  'zen-garden': { name: 'Zen Garden', colors: ['#2E7D32', '#43A047', '#66BB6A', '#A5D6A7', '#E8F5E9', '#FAFAFA', '#795548', '#A1887F'] },
  'bamboo-rain': { name: 'Bamboo Rain', colors: ['#1B5E20', '#388E3C', '#4CAF50', '#81C784', '#C8E6C9', '#B3E5FC', '#0288D1', '#01579B'] },
  'autumn-bamboo': { name: 'Autumn Bamboo', colors: ['#33691E', '#689F38', '#9E9D24', '#F9A825', '#FF6F00', '#BF360C', '#4E342E', '#3E2723'] },
};

type ThemeKey = keyof typeof THEMES;

export default function ColorPaletteFromBambooForest({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [theme, setTheme] = useState<ThemeKey>('bamboo-grove');
  const [colorCount, setColorCount] = useState(6);
  const [format, setFormat] = useState('css');
  const [output, setOutput] = useState('');

  const generate = () => {
    const selectedTheme = THEMES[theme];
    const colors = selectedTheme.colors.slice(0, colorCount);

    let code = '';
    if (format === 'css') {
      code = `:root {\n${colors.map((c, i) => `  --bamboo-${i + 1}: ${c};`).join('\n')}\n}`;
    } else if (format === 'tailwind') {
      code = `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n        bamboo: {\n${colors.map((c, i) => `          ${(i + 1) * 100}: '${c}',`).join('\n')}\n        }\n      }\n    }\n  }\n}`;
    } else {
      code = colors.map((c, i) => `$bamboo-${i + 1}: ${c};`).join('\n');
    }

    const swatches = colors.map((c, i) => `  ${i + 1}. ${c} - ${selectedTheme.name} ${i + 1}`).join('\n');

    setOutput(`Theme: ${selectedTheme.name}\nColors: ${colorCount}\n\nPalette:\n${swatches}\n\n${format.toUpperCase()} Code:\n${code}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor={`${toolId}-theme`} className="block text-sm font-medium text-gray-700 mb-1">Bamboo Theme</label>
            <select id={`${toolId}-theme`} value={theme} onChange={(e) => setTheme(e.target.value as ThemeKey)} className="input-field" aria-label={`Theme for ${toolName}`}>
              {Object.entries(THEMES).map(([key, val]) => (
                <option key={key} value={key}>{val.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-count`} className="block text-sm font-medium text-gray-700 mb-1">Number of Colors</label>
            <input id={`${toolId}-count`} type="number" min={3} max={8} value={colorCount} onChange={(e) => setColorCount(parseInt(e.target.value) || 3)} className="input-field" aria-label="Number of colors" />
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
        <button onClick={generate} className="btn-primary mt-4">Generate Palette</button>

        <div className="mt-4 flex flex-wrap gap-2">
          {THEMES[theme].colors.slice(0, colorCount).map((color, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-12 h-12 rounded border shadow-sm" style={{ backgroundColor: color }} />
              <span className="text-xs text-gray-500 mt-1">{color}</span>
            </div>
          ))}
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Palette</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded border overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
