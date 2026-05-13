'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromSunflowerField - Generate color palettes inspired by sunflower fields.
 * Offers multiple styles with configurable color count.
 */
export default function ColorPaletteFromSunflowerField({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [style, setStyle] = useState('golden-hour');
  const [colorCount, setColorCount] = useState('5');
  const [output, setOutput] = useState('');
  const [colors, setColors] = useState<string[]>([]);

  const palettes: Record<string, string[]> = {
    'golden-hour': ['#F4A300', '#FFD700', '#8B6914', '#2E5A1C', '#87CEEB', '#E8A317', '#D4A017', '#556B2F'],
    'summer-bloom': ['#FFD700', '#FFA500', '#228B22', '#8B4513', '#87CEEB', '#FFEC8B', '#6B8E23', '#DAA520'],
    'rustic-field': ['#B8860B', '#CD853F', '#556B2F', '#8B7355', '#F5DEB3', '#A0522D', '#6B4226', '#DEB887'],
    'sunset-meadow': ['#FF6347', '#FF8C00', '#FFD700', '#2E8B57', '#4B0082', '#FF4500', '#DC143C', '#228B22'],
    'morning-dew': ['#FFFACD', '#98FB98', '#F0E68C', '#90EE90', '#FFD700', '#ADFF2F', '#F5F5DC', '#7CFC00'],
  };

  const generate = () => {
    const count = Math.min(8, Math.max(2, parseInt(colorCount, 10) || 5));
    const palette = palettes[style] || palettes['golden-hour'];
    const selected = palette.slice(0, count);
    setColors(selected);

    const cssVars = selected.map((c, i) => `  --sunflower-${i + 1}: ${c};`).join('\n');
    const result = `Sunflower Field Palette: ${style.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
═══════════════════════════════════════
Colors (${count}):
${selected.map((c, i) => `  ${i + 1}. ${c}`).join('\n')}

CSS Variables:
:root {
${cssVars}
}

Tailwind Config:
${selected.map((c, i) => `  'sunflower-${i + 1}': '${c}',`).join('\n')}`;

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-style`} className="block text-sm font-medium text-gray-700 mb-1">Palette Style</label>
            <select id={`${toolId}-style`} value={style} onChange={(e) => setStyle(e.target.value)} aria-label={`Palette style for ${toolName}`} className="input-field">
              <option value="golden-hour">Golden Hour</option>
              <option value="summer-bloom">Summer Bloom</option>
              <option value="rustic-field">Rustic Field</option>
              <option value="sunset-meadow">Sunset Meadow</option>
              <option value="morning-dew">Morning Dew</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-count`} className="block text-sm font-medium text-gray-700 mb-1">Number of Colors (2-8)</label>
            <input id={`${toolId}-count`} type="number" min="2" max="8" value={colorCount} onChange={(e) => setColorCount(e.target.value)} aria-label="Number of colors" className="input-field" />
          </div>
        </div>
        <button onClick={generate} className="btn-primary mt-4">Generate Palette</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Palette</label>
            <div className="flex gap-2 mb-3">
              {colors.map((color, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-lg border border-gray-200" style={{ backgroundColor: color }} />
                  <span className="text-xs text-gray-600 mt-1">{color}</span>
                </div>
              ))}
            </div>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
