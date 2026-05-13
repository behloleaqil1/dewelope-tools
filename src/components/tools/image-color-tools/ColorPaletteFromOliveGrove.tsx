'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromOliveGrove - Generate color palettes inspired by olive groves.
 */
export default function ColorPaletteFromOliveGrove({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [style, setStyle] = useState('mediterranean');
  const [colorCount, setColorCount] = useState('5');
  const [output, setOutput] = useState('');

  const palettes: Record<string, string[]> = {
    mediterranean: ['#556B2F', '#8FBC8F', '#F5F5DC', '#DAA520', '#8B7355', '#6B8E23', '#BDB76B', '#2E8B57'],
    tuscan: ['#808000', '#C2B280', '#F4A460', '#D2691E', '#556B2F', '#BC8F8F', '#CD853F', '#6B4423'],
    harvest: ['#3B5323', '#4A7023', '#6B8E23', '#9ACD32', '#ADFF2F', '#556B2F', '#8B8B00', '#BDB76B'],
    morning: ['#98FB98', '#90EE90', '#8FBC8F', '#66CDAA', '#3CB371', '#2E8B57', '#228B22', '#006400'],
    autumn: ['#8B4513', '#A0522D', '#CD853F', '#DEB887', '#D2B48C', '#BC8F8F', '#F4A460', '#DAA520'],
  };

  const generate = () => {
    const count = Math.min(8, Math.max(2, parseInt(colorCount) || 5));
    const palette = palettes[style] || palettes.mediterranean;
    const selected = palette.slice(0, count);

    const cssVars = selected.map((c, i) => `  --olive-grove-${i + 1}: ${c};`).join('\n');
    const result = `Olive Grove Palette: ${style.charAt(0).toUpperCase() + style.slice(1)}
═══════════════════════════════════
${selected.map((c, i) => `${i + 1}. ${c}  ██████`).join('\n')}

CSS Variables:
:root {
${cssVars}
}

Tailwind Config:
colors: {
  'olive-grove': {
${selected.map((c, i) => `    ${(i + 1) * 100}: '${c}',`).join('\n')}
  }
}`;

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-style`} className="block text-sm font-medium text-gray-700 mb-1">Palette Style</label>
            <select id={`${toolId}-style`} value={style} onChange={(e) => setStyle(e.target.value)} className="input-field" aria-label={`Palette style for ${toolName}`}>
              <option value="mediterranean">Mediterranean Olive</option>
              <option value="tuscan">Tuscan Grove</option>
              <option value="harvest">Olive Harvest</option>
              <option value="morning">Morning Dew</option>
              <option value="autumn">Autumn Olive</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-count`} className="block text-sm font-medium text-gray-700 mb-1">Number of Colors (2-8)</label>
            <input id={`${toolId}-count`} type="number" min="2" max="8" value={colorCount} onChange={(e) => setColorCount(e.target.value)} className="input-field" aria-label="Number of colors" />
          </div>
          <button onClick={generate} className="btn-primary w-full">Generate Olive Grove Palette</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Palette</label>
            <div className="flex gap-1 mb-3">
              {(palettes[style] || palettes.mediterranean).slice(0, parseInt(colorCount) || 5).map((color, i) => (
                <div key={i} className="h-12 flex-1 rounded" style={{ backgroundColor: color }} title={color} />
              ))}
            </div>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
