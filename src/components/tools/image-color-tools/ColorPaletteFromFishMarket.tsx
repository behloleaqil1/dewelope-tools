'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromFishMarket - Generate color palettes inspired by fish markets.
 * Offers palettes based on various fish market themes like Tsukiji, Mediterranean, etc.
 */
export default function ColorPaletteFromFishMarket({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [theme, setTheme] = useState('tsukiji');
  const [count, setCount] = useState('5');
  const [output, setOutput] = useState('');
  const [colors, setColors] = useState<string[]>([]);

  const palettes: Record<string, { name: string; colors: string[] }> = {
    tsukiji: { name: 'Tsukiji Tuna Market', colors: ['#1B2838', '#8B1A1A', '#C41E3A', '#E8E0D5', '#4A6741', '#2F4F4F', '#CD5C5C', '#F5F5DC'] },
    mediterranean: { name: 'Mediterranean Catch', colors: ['#1E90FF', '#00CED1', '#F0E68C', '#FF6347', '#2E8B57', '#87CEEB', '#FFD700', '#FF4500'] },
    nordic: { name: 'Nordic Fish Hall', colors: ['#2C3E50', '#5D6D7E', '#AEB6BF', '#ECF0F1', '#E74C3C', '#F39C12', '#1ABC9C', '#34495E'] },
    tropical: { name: 'Tropical Reef Market', colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#FF8C00', '#00FA9A'] },
    lobster: { name: 'Lobster Wharf', colors: ['#8B0000', '#DC143C', '#FF6347', '#FFA07A', '#2F4F4F', '#708090', '#F5F5F5', '#1C1C1C'] },
    oyster: { name: 'Oyster Bar', colors: ['#D4C5A9', '#B8A88A', '#8B7D6B', '#F5F0E8', '#6B8E7B', '#4A6B5D', '#E8DCC8', '#3D3D3D'] },
  };

  const generate = () => {
    const palette = palettes[theme];
    if (!palette) return;

    const numColors = Math.min(Math.max(parseInt(count) || 5, 2), 8);
    const selected = palette.colors.slice(0, numColors);
    setColors(selected);

    const lines = [
      `=== ${palette.name} Palette ===`,
      ``,
      `Colors:`,
      ...selected.map((c, i) => `  ${i + 1}. ${c}`),
      ``,
      `CSS Variables:`,
      ...selected.map((c, i) => `  --fish-market-${i + 1}: ${c};`),
      ``,
      `Tailwind Config:`,
      `  colors: {`,
      ...selected.map((c, i) => `    'fish-${i + 1}': '${c}',`),
      `  }`,
    ];

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-theme`} className="block text-sm font-medium text-gray-700 mb-1">
              Fish Market Theme
            </label>
            <select
              id={`${toolId}-theme`}
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              aria-label={`Theme for ${toolName}`}
              className="input-field"
            >
              <option value="tsukiji">Tsukiji Tuna Market</option>
              <option value="mediterranean">Mediterranean Catch</option>
              <option value="nordic">Nordic Fish Hall</option>
              <option value="tropical">Tropical Reef Market</option>
              <option value="lobster">Lobster Wharf</option>
              <option value="oyster">Oyster Bar</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-count`} className="block text-sm font-medium text-gray-700 mb-1">
              Number of Colors (2-8)
            </label>
            <input
              id={`${toolId}-count`}
              type="number"
              min="2"
              max="8"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              aria-label="Number of colors"
              className="input-field"
            />
          </div>
          <button onClick={generate} className="btn-primary w-full">
            Generate Palette
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Generated Palette</label>
            <div className="flex gap-1 h-12 rounded-md overflow-hidden">
              {colors.map((color, i) => (
                <div key={i} className="flex-1" style={{ backgroundColor: color }} title={color} />
              ))}
            </div>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded-md">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
