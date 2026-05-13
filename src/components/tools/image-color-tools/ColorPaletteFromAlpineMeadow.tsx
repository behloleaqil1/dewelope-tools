'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromAlpineMeadow - Generate palettes inspired by alpine meadows.
 */
export default function ColorPaletteFromAlpineMeadow({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [theme, setTheme] = useState('wildflower');
  const [numColors, setNumColors] = useState('5');
  const [format, setFormat] = useState('css');
  const [output, setOutput] = useState('');

  const palettes: Record<string, string[]> = {
    wildflower: ['#7B2D8B', '#E8A838', '#4CAF50', '#F06292', '#81D4FA', '#FFD54F', '#AED581', '#CE93D8'],
    snowcap: ['#ECEFF1', '#B0BEC5', '#78909C', '#546E7A', '#37474F', '#CFD8DC', '#90A4AE', '#455A64'],
    sunrise: ['#FF6F00', '#FF8F00', '#FFA000', '#FFB300', '#FFC107', '#FFCA28', '#FFD54F', '#FFE082'],
    glacialLake: ['#006064', '#00838F', '#0097A7', '#00ACC1', '#00BCD4', '#26C6DA', '#4DD0E1', '#80DEEA'],
    edelweiss: ['#FAFAFA', '#F5F5F5', '#E8F5E9', '#C8E6C9', '#A5D6A7', '#81C784', '#66BB6A', '#4CAF50'],
    alpineForest: ['#1B5E20', '#2E7D32', '#388E3C', '#43A047', '#4CAF50', '#66BB6A', '#81C784', '#A5D6A7'],
  };

  const themeNames: Record<string, string> = {
    wildflower: 'Alpine Wildflower',
    snowcap: 'Mountain Snowcap',
    sunrise: 'Alpine Sunrise',
    glacialLake: 'Glacial Lake',
    edelweiss: 'Edelweiss Bloom',
    alpineForest: 'Alpine Forest',
  };

  const generate = () => {
    const colors = palettes[theme].slice(0, parseInt(numColors));
    let result = '';

    if (format === 'css') {
      result = `:root {\n${colors.map((c, i) => `  --alpine-meadow-${i + 1}: ${c};`).join('\n')}\n}`;
    } else if (format === 'tailwind') {
      result = `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n        'alpine-meadow': {\n${colors.map((c, i) => `          ${(i + 1) * 100}: '${c}',`).join('\n')}\n        }\n      }\n    }\n  }\n}`;
    } else {
      result = colors.map((c, i) => `$alpine-meadow-${i + 1}: ${c};`).join('\n');
    }

    const swatches = colors.map((c, i) => `  ${i + 1}. ${c} - ${themeNames[theme]} ${i + 1}`).join('\n');
    setOutput(`Theme: ${themeNames[theme]}\nColors: ${colors.length}\n\nColor Swatches:\n${swatches}\n\n${format.toUpperCase()} Output:\n${result}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor={`${toolId}-theme`} className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
            <select id={`${toolId}-theme`} value={theme} onChange={(e) => setTheme(e.target.value)} className="input-field" aria-label={`Theme for ${toolName}`}>
              <option value="wildflower">Alpine Wildflower</option>
              <option value="snowcap">Mountain Snowcap</option>
              <option value="sunrise">Alpine Sunrise</option>
              <option value="glacialLake">Glacial Lake</option>
              <option value="edelweiss">Edelweiss Bloom</option>
              <option value="alpineForest">Alpine Forest</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-num`} className="block text-sm font-medium text-gray-700 mb-1">Number of Colors</label>
            <select id={`${toolId}-num`} value={numColors} onChange={(e) => setNumColors(e.target.value)} className="input-field" aria-label="Number of colors">
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
            </select>
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
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Palette</label>
            <div className="flex gap-2 mb-3">
              {palettes[theme].slice(0, parseInt(numColors)).map((color, i) => (
                <div key={i} className="w-10 h-10 rounded-lg border border-gray-200" style={{ backgroundColor: color }} title={color} />
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
