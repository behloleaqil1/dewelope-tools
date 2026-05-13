'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromVineyard - Generate color palettes inspired by vineyards.
 * Offers multiple vineyard-themed styles with configurable color count.
 */
export default function ColorPaletteFromVineyard({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [style, setStyle] = useState('tuscan-sunset');
  const [colorCount, setColorCount] = useState(5);
  const [output, setOutput] = useState('');
  const [colors, setColors] = useState<string[]>([]);

  const palettes: Record<string, string[]> = {
    'tuscan-sunset': ['#722F37', '#8B4513', '#DAA520', '#F4A460', '#FFE4B5', '#CD853F', '#A0522D', '#DEB887'],
    'harvest-gold': ['#8B6914', '#B8860B', '#DAA520', '#FFD700', '#F0E68C', '#BDB76B', '#6B8E23', '#556B2F'],
    'grape-vine': ['#4B0082', '#6A0DAD', '#8B008B', '#9932CC', '#BA55D3', '#DDA0DD', '#E6E6FA', '#D8BFD8'],
    'morning-dew': ['#2E8B57', '#3CB371', '#66CDAA', '#8FBC8F', '#98FB98', '#F0FFF0', '#DCDCDC', '#B0C4DE'],
    'autumn-harvest': ['#8B0000', '#A52A2A', '#CD5C5C', '#F08080', '#FFB347', '#FF8C00', '#D2691E', '#8B4513'],
  };

  const styleNames: Record<string, string> = {
    'tuscan-sunset': 'Tuscan Sunset',
    'harvest-gold': 'Harvest Gold',
    'grape-vine': 'Grape Vine',
    'morning-dew': 'Morning Dew',
    'autumn-harvest': 'Autumn Harvest',
  };

  const generate = () => {
    const palette = palettes[style] || palettes['tuscan-sunset'];
    const selected = palette.slice(0, colorCount);
    setColors(selected);

    const cssVars = selected.map((c, i) => `  --vineyard-${i + 1}: ${c};`).join('\n');
    const result = `${styleNames[style]} Vineyard Palette
════════════════════════════════════════

Colors (${selected.length}):
${selected.map((c, i) => `  ${i + 1}. ${c}`).join('\n')}

CSS Variables:
:root {
${cssVars}
}

Tailwind Config:
${selected.map((c, i) => `  'vineyard-${i + 1}': '${c}',`).join('\n')}`;

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-style`} className="block text-sm font-medium text-gray-700 mb-1">Palette Style</label>
            <select id={`${toolId}-style`} value={style} onChange={(e) => setStyle(e.target.value)} className="input-field" aria-label={`Palette style for ${toolName}`}>
              <option value="tuscan-sunset">Tuscan Sunset</option>
              <option value="harvest-gold">Harvest Gold</option>
              <option value="grape-vine">Grape Vine</option>
              <option value="morning-dew">Morning Dew</option>
              <option value="autumn-harvest">Autumn Harvest</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-count`} className="block text-sm font-medium text-gray-700 mb-1">Number of Colors (2-8)</label>
            <input id={`${toolId}-count`} type="number" min={2} max={8} value={colorCount} onChange={(e) => setColorCount(Math.min(8, Math.max(2, parseInt(e.target.value) || 2)))} className="input-field" aria-label="Number of colors" />
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
                    <span className="text-xs text-gray-600 mt-1">{color}</span>
                  </div>
                ))}
              </div>
            )}
            <label className="block text-sm font-medium text-gray-700">Palette Details</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
