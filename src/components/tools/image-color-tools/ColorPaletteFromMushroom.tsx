'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromMushroom - Generate color palettes inspired by mushrooms/fungi.
 */

const MUSHROOM_PALETTES: Record<string, { name: string; colors: string[] }> = {
  'fly-agaric': { name: 'Fly Agaric', colors: ['#CC0000', '#FFFFFF', '#8B4513', '#556B2F', '#F5F5DC'] },
  'chanterelle': { name: 'Chanterelle', colors: ['#FFB347', '#E8A317', '#C68E17', '#8B6914', '#3B2F2F'] },
  'morel': { name: 'Morel', colors: ['#4A3728', '#6B4E37', '#8B7355', '#C4A882', '#F5E6D3'] },
  'blue-oyster': { name: 'Blue Oyster', colors: ['#4169E1', '#6A8EBF', '#B0C4DE', '#F0F8FF', '#2F4F4F'] },
  'lions-mane': { name: "Lion's Mane", colors: ['#FFFDD0', '#FAEBD7', '#F5DEB3', '#DEB887', '#8B7D6B'] },
  'shiitake': { name: 'Shiitake', colors: ['#3B2F2F', '#5C4033', '#8B6914', '#C4A882', '#FFFFF0'] },
  'reishi': { name: 'Reishi', colors: ['#8B0000', '#A0522D', '#CD853F', '#DEB887', '#2F1B14'] },
  'turkey-tail': { name: 'Turkey Tail', colors: ['#4B3621', '#8B7355', '#B8860B', '#87CEEB', '#F0FFF0'] },
  'death-cap': { name: 'Death Cap', colors: ['#9ACD32', '#6B8E23', '#556B2F', '#FFFFF0', '#F5F5DC'] },
  'porcini': { name: 'Porcini', colors: ['#654321', '#8B4513', '#D2B48C', '#FAEBD7', '#FFFFF0'] },
};

export default function ColorPaletteFromMushroom({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [selected, setSelected] = useState('fly-agaric');
  const [output, setOutput] = useState('');

  const generate = () => {
    const palette = MUSHROOM_PALETTES[selected];
    if (!palette) return;

    const cssVars = palette.colors.map((c, i) => `  --mushroom-${i + 1}: ${c};`).join('\n');
    const lines = [
      `/* ${palette.name} Palette */`,
      `:root {`,
      cssVars,
      `}`,
      ``,
      `/* Colors: ${palette.colors.join(', ')} */`,
    ];
    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-mushroom`} className="block text-sm font-medium text-gray-700 mb-1">Select Mushroom</label>
            <select id={`${toolId}-mushroom`} value={selected} onChange={e => setSelected(e.target.value)} aria-label={`Mushroom selection for ${toolName}`} className="input-field">
              {Object.entries(MUSHROOM_PALETTES).map(([key, val]) => (
                <option key={key} value={key}>{val.name}</option>
              ))}
            </select>
          </div>
          <button onClick={generate} className="btn-primary w-full">Generate Palette</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Color Palette</label>
            <div className="flex gap-2">
              {MUSHROOM_PALETTES[selected]?.colors.map((color, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className="w-12 h-12 rounded-md border border-gray-200" style={{ backgroundColor: color }} />
                  <span className="text-xs font-mono text-gray-600">{color}</span>
                </div>
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
