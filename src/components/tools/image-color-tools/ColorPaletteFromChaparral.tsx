'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromChaparral - Generate color palettes inspired by chaparral biome.
 * Includes themes like Dry Scrubland, Coastal Sage, Manzanita, Wildfire Sunset, and Mediterranean Hills.
 */
export default function ColorPaletteFromChaparral({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [theme, setTheme] = useState('dry-scrubland');
  const [colorCount, setColorCount] = useState(5);
  const [format, setFormat] = useState('css');
  const [output, setOutput] = useState('');
  const [swatches, setSwatches] = useState<string[]>([]);

  const themes: Record<string, { name: string; colors: string[] }> = {
    'dry-scrubland': { name: 'Dry Scrubland', colors: ['#8B7355', '#C4A882', '#D4C5A9', '#6B5B3E', '#A0926B', '#E8DCC8', '#4A3F2F', '#BFA76F'] },
    'coastal-sage': { name: 'Coastal Sage', colors: ['#7A8B6F', '#9CAF88', '#B5C4A5', '#5C6B52', '#A8B89A', '#D1DEC6', '#4A5740', '#8FA07E'] },
    'manzanita': { name: 'Manzanita', colors: ['#8B3A3A', '#A0522D', '#CD853F', '#6B2D2D', '#B8604A', '#D4956A', '#4A1F1F', '#C47451'] },
    'wildfire-sunset': { name: 'Wildfire Sunset', colors: ['#CC5500', '#FF6B35', '#FFA07A', '#8B3800', '#E8601C', '#FFB88C', '#662200', '#FF8C5A'] },
    'mediterranean-hills': { name: 'Mediterranean Hills', colors: ['#6B8E23', '#808000', '#BDB76B', '#556B2F', '#9ACD32', '#DAD870', '#3B4F14', '#A9B84E'] },
    'chaparral-twilight': { name: 'Chaparral Twilight', colors: ['#4A3B6B', '#6B5B8A', '#8B7BAA', '#2E2347', '#7A6B99', '#A99BC4', '#1E1530', '#5C4D7A'] },
  };

  const generate = () => {
    const selectedTheme = themes[theme];
    if (!selectedTheme) return;

    const colors = selectedTheme.colors.slice(0, colorCount);
    setSwatches(colors);

    let code = '';
    if (format === 'css') {
      code = `:root {\n${colors.map((c, i) => `  --chaparral-${i + 1}: ${c};`).join('\n')}\n}`;
    } else if (format === 'tailwind') {
      code = `// tailwind.config.js\ncolors: {\n  chaparral: {\n${colors.map((c, i) => `    ${(i + 1) * 100}: '${c}',`).join('\n')}\n  }\n}`;
    } else {
      code = colors.map((c, i) => `$chaparral-${i + 1}: ${c};`).join('\n');
    }

    setOutput(code);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor={`${toolId}-theme`} className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
            <select id={`${toolId}-theme`} value={theme} onChange={(e) => setTheme(e.target.value)} className="input-field" aria-label={`Theme selection for ${toolName}`}>
              {Object.entries(themes).map(([key, val]) => (
                <option key={key} value={key}>{val.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-count`} className="block text-sm font-medium text-gray-700 mb-1">Colors (3-8)</label>
            <input id={`${toolId}-count`} type="number" min={3} max={8} value={colorCount} onChange={(e) => setColorCount(Number(e.target.value))} className="input-field" aria-label="Number of colors" />
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
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Color Swatches</label>
            <div className="flex gap-2 flex-wrap">
              {swatches.map((color, i) => (
                <div key={i} className="text-center">
                  <div className="w-12 h-12 rounded-lg border border-gray-200" style={{ backgroundColor: color }} />
                  <span className="text-xs text-gray-600 mt-1 block">{color}</span>
                </div>
              ))}
            </div>
            <label className="block text-sm font-medium text-gray-700">Code Output</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
