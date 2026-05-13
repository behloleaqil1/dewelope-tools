'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromRicePaddy - Generate color palettes inspired by rice paddies.
 * Offers multiple styles with configurable color count.
 */
export default function ColorPaletteFromRicePaddy({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [style, setStyle] = useState('terraced-green');
  const [colorCount, setColorCount] = useState('5');
  const [output, setOutput] = useState('');
  const [colors, setColors] = useState<string[]>([]);

  const palettes: Record<string, string[]> = {
    'terraced-green': ['#4A7C3F', '#6B8E23', '#8FBC8F', '#2E8B57', '#556B2F', '#90EE90', '#228B22', '#3CB371'],
    'golden-harvest': ['#DAA520', '#B8860B', '#F4A460', '#CD853F', '#D2B48C', '#FFD700', '#BDB76B', '#8B7355'],
    'morning-mist': ['#B0C4DE', '#87CEEB', '#E0E8D0', '#A8C090', '#D3E4CD', '#C8DFC8', '#F0F8E8', '#98B888'],
    'sunset-paddy': ['#FF6B35', '#FF8C42', '#FFD166', '#06D6A0', '#1B9AAA', '#EF476F', '#FFC43D', '#118AB2'],
    'monsoon-season': ['#2C3E50', '#34495E', '#5D8A68', '#7FB069', '#95BF74', '#3D5A3E', '#4A6741', '#6B9B6B'],
  };

  const generate = () => {
    const count = Math.min(8, Math.max(2, parseInt(colorCount, 10) || 5));
    const palette = palettes[style] || palettes['terraced-green'];
    const selected = palette.slice(0, count);
    setColors(selected);

    const cssVars = selected.map((c, i) => `  --rice-paddy-${i + 1}: ${c};`).join('\n');
    const result = `Rice Paddy Palette: ${style.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
═══════════════════════════════════════
Colors (${count}):
${selected.map((c, i) => `  ${i + 1}. ${c}`).join('\n')}

CSS Variables:
:root {
${cssVars}
}

Tailwind Config:
${selected.map((c, i) => `  'rice-paddy-${i + 1}': '${c}',`).join('\n')}`;

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-style`} className="block text-sm font-medium text-gray-700 mb-1">Palette Style</label>
            <select id={`${toolId}-style`} value={style} onChange={(e) => setStyle(e.target.value)} aria-label={`Palette style for ${toolName}`} className="input-field">
              <option value="terraced-green">Terraced Green</option>
              <option value="golden-harvest">Golden Harvest</option>
              <option value="morning-mist">Morning Mist</option>
              <option value="sunset-paddy">Sunset Paddy</option>
              <option value="monsoon-season">Monsoon Season</option>
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
