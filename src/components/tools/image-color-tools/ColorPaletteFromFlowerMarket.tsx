'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromFlowerMarket - Generate color palettes inspired by flower markets.
 */
export default function ColorPaletteFromFlowerMarket({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [style, setStyle] = useState('spring-tulips');
  const [count, setCount] = useState('5');
  const [output, setOutput] = useState('');
  const [colors, setColors] = useState<string[]>([]);

  const palettes: Record<string, string[]> = {
    'spring-tulips': ['#FF6B6B', '#FFE66D', '#FF8E53', '#FF4757', '#FFC312', '#F8B500', '#FFEAA7', '#DFE6E9'],
    'lavender-fields': ['#A29BFE', '#6C5CE7', '#DDA0DD', '#E8DAEF', '#9B59B6', '#8E44AD', '#BB8FCE', '#D2B4DE'],
    'tropical-orchids': ['#FF1493', '#FF69B4', '#FF6EB4', '#DA70D6', '#BA55D3', '#9932CC', '#FF00FF', '#EE82EE'],
    'english-roses': ['#FFB6C1', '#FF69B4', '#DB7093', '#C71585', '#FFC0CB', '#F08080', '#CD5C5C', '#E8A0BF'],
    'sunflower-stand': ['#FFD700', '#FFA500', '#FF8C00', '#DAA520', '#B8860B', '#F4D03F', '#F39C12', '#E67E22'],
    'wildflower-meadow': ['#87CEEB', '#98D8C8', '#F7DC6F', '#F1948A', '#BB8FCE', '#85C1E9', '#82E0AA', '#F8C471'],
    'cherry-blossom': ['#FFB7C5', '#FF92A5', '#FADADD', '#FFC0CB', '#FFE4E1', '#F4C2C2', '#FF69B4', '#FFF0F5'],
    'marigold-market': ['#FF8C00', '#FF6347', '#FFD700', '#FF4500', '#FFA07A', '#FF7F50', '#FFDAB9', '#F4A460'],
  };

  const generate = () => {
    const numColors = Math.min(8, Math.max(2, parseInt(count) || 5));
    const palette = palettes[style] || palettes['spring-tulips'];
    const selected = palette.slice(0, numColors);
    setColors(selected);

    let result = `=== Flower Market Palette: ${style.replace(/-/g, ' ')} ===\n\n`;
    result += `Colors (${selected.length}):\n`;
    selected.forEach((c, i) => {
      result += `  ${i + 1}. ${c}\n`;
    });
    result += `\n--- CSS Variables ---\n:root {\n`;
    selected.forEach((c, i) => {
      result += `  --flower-${i + 1}: ${c};\n`;
    });
    result += `}\n\n--- Tailwind Config ---\ncolors: {\n  flower: {\n`;
    selected.forEach((c, i) => {
      result += `    '${(i + 1) * 100}': '${c}',\n`;
    });
    result += `  }\n}\n`;

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-2">{toolName}</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${toolId}-style`} className="block text-xs text-gray-600 mb-1">Flower Market Style</label>
            <select id={`${toolId}-style`} value={style} onChange={(e) => setStyle(e.target.value)} className="input-field" aria-label="Select flower market style">
              <option value="spring-tulips">Spring Tulips</option>
              <option value="lavender-fields">Lavender Fields</option>
              <option value="tropical-orchids">Tropical Orchids</option>
              <option value="english-roses">English Roses</option>
              <option value="sunflower-stand">Sunflower Stand</option>
              <option value="wildflower-meadow">Wildflower Meadow</option>
              <option value="cherry-blossom">Cherry Blossom</option>
              <option value="marigold-market">Marigold Market</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-count`} className="block text-xs text-gray-600 mb-1">Number of Colors (2-8)</label>
            <input id={`${toolId}-count`} type="number" min="2" max="8" value={count} onChange={(e) => setCount(e.target.value)} className="input-field" aria-label="Number of colors" />
          </div>
        </div>
        <button onClick={generate} className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors" aria-label="Generate flower market palette">
          Generate Palette
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            {colors.length > 0 && (
              <div className="flex gap-1 mb-2">
                {colors.map((c, i) => (
                  <div key={i} className="w-10 h-10 rounded border" style={{ backgroundColor: c }} title={c} />
                ))}
              </div>
            )}
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded border">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
