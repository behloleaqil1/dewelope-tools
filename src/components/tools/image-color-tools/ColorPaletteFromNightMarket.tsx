'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const THEMES: Record<string, { name: string; colors: string[] }> = {
  taipei: { name: 'Taipei Night Market', colors: ['#FF4136', '#FF851B', '#FFDC00', '#2ECC40', '#0074D9', '#B10DC9', '#FF6B6B', '#C44D58'] },
  bangkok: { name: 'Bangkok Street Food', colors: ['#E74C3C', '#F39C12', '#F1C40F', '#27AE60', '#8E44AD', '#D35400', '#C0392B', '#E67E22'] },
  hongkong: { name: 'Hong Kong Neon', colors: ['#FF0066', '#00FFCC', '#FF6600', '#0099FF', '#FF33CC', '#00FF66', '#FFCC00', '#CC00FF'] },
  osaka: { name: 'Osaka Dotonbori', colors: ['#DC143C', '#FF8C00', '#FFD700', '#228B22', '#4169E1', '#9400D3', '#FF69B4', '#00CED1'] },
  hanoi: { name: 'Hanoi Old Quarter', colors: ['#8B0000', '#CD853F', '#DAA520', '#556B2F', '#2F4F4F', '#800020', '#D2691E', '#B8860B'] },
  mumbai: { name: 'Mumbai Bazaar', colors: ['#FF1493', '#FF8C00', '#FFD700', '#32CD32', '#00BFFF', '#9932CC', '#FF4500', '#00FA9A'] },
};

/**
 * ColorPaletteFromNightMarket - Generate palettes inspired by Asian night markets.
 */
export default function ColorPaletteFromNightMarket({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [theme, setTheme] = useState('taipei');
  const [count, setCount] = useState('5');
  const [output, setOutput] = useState('');
  const [palette, setPalette] = useState<string[]>([]);

  const generate = () => {
    const t = THEMES[theme];
    if (!t) return;
    const n = Math.min(Math.max(parseInt(count) || 5, 2), 8);
    const selected = t.colors.slice(0, n);
    setPalette(selected);

    const lines = [
      `Theme: ${t.name}`,
      `Colors: ${n}`,
      ``,
      `Hex Values:`,
      ...selected.map((c, i) => `  ${i + 1}. ${c}`),
      ``,
      `CSS Variables:`,
      ...selected.map((c, i) => `  --night-market-${i + 1}: ${c};`),
      ``,
      `Tailwind Config:`,
      ...selected.map((c, i) => `  'night-market-${i + 1}': '${c}',`),
    ];
    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-theme`} className="block text-sm font-medium text-gray-700 mb-1">Night Market Theme</label>
            <select id={`${toolId}-theme`} value={theme} onChange={(e) => setTheme(e.target.value)} aria-label={`Theme for ${toolName}`} className="input-field">
              {Object.entries(THEMES).map(([key, val]) => (
                <option key={key} value={key}>{val.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-count`} className="block text-sm font-medium text-gray-700 mb-1">Number of Colors (2-8)</label>
            <input id={`${toolId}-count`} type="number" min="2" max="8" value={count} onChange={(e) => setCount(e.target.value)} aria-label="Number of colors" className="input-field" />
          </div>
        </div>
        <button onClick={generate} className="mt-4 btn-primary">Generate Palette</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            {palette.length > 0 && (
              <div className="flex gap-2 mb-3">
                {palette.map((color, i) => (
                  <div key={i} className="w-10 h-10 rounded border border-gray-200" style={{ backgroundColor: color }} title={color} />
                ))}
              </div>
            )}
            <label className="block text-sm font-medium text-gray-700">Palette Output</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
