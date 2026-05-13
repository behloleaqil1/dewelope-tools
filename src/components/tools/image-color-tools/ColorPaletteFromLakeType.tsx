'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromLakeType - Generate color palettes inspired by different lake types.
 * Includes alpine, crater, salt, glacial, and tropical lakes.
 */
export default function ColorPaletteFromLakeType({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [lakeType, setLakeType] = useState('alpine');
  const [output, setOutput] = useState('');

  const palettes: Record<string, { name: string; colors: { hex: string; name: string }[] }> = {
    alpine: { name: 'Alpine Lake', colors: [{ hex: '#1B4F72', name: 'Deep Alpine Blue' }, { hex: '#2E86C1', name: 'Mountain Water' }, { hex: '#85C1E9', name: 'Glacial Reflection' }, { hex: '#D4E6F1', name: 'Morning Mist' }, { hex: '#2C3E50', name: 'Pine Shadow' }] },
    crater: { name: 'Crater Lake', colors: [{ hex: '#154360', name: 'Crater Depth' }, { hex: '#1A5276', name: 'Volcanic Blue' }, { hex: '#2471A3', name: 'Caldera Water' }, { hex: '#5DADE2', name: 'Crater Surface' }, { hex: '#515A5A', name: 'Basalt Edge' }] },
    salt: { name: 'Salt Lake', colors: [{ hex: '#F9E79F', name: 'Salt Crust' }, { hex: '#F5CBA7', name: 'Mineral Deposit' }, { hex: '#E8DAEF', name: 'Brine Pink' }, { hex: '#AED6F1', name: 'Shallow Brine' }, { hex: '#FDFEFE', name: 'Salt White' }] },
    glacial: { name: 'Glacial Lake', colors: [{ hex: '#48C9B0', name: 'Glacial Turquoise' }, { hex: '#76D7C4', name: 'Meltwater' }, { hex: '#A3E4D7', name: 'Ice Reflection' }, { hex: '#D0ECE7', name: 'Frozen Mist' }, { hex: '#1ABC9C', name: 'Deep Glacial' }] },
    tropical: { name: 'Tropical Lake', colors: [{ hex: '#0E6655', name: 'Tropical Depth' }, { hex: '#148F77', name: 'Jungle Water' }, { hex: '#45B39D', name: 'Warm Lagoon' }, { hex: '#A2D9CE', name: 'Shallow Tropical' }, { hex: '#27AE60', name: 'Surrounding Canopy' }] },
  };

  const generate = () => {
    const palette = palettes[lakeType];
    if (!palette) return;

    const lines = [
      `=== ${palette.name} Color Palette ===`,
      ``,
      ...palette.colors.map((c, i) => `  ${i + 1}. ${c.name}: ${c.hex}`),
      ``,
      `--- CSS Variables ---`,
      `:root {`,
      ...palette.colors.map((c, i) => `  --lake-${lakeType}-${i + 1}: ${c.hex};`),
      `}`,
    ];
    setOutput(lines.join('\n'));
  };

  const palette = palettes[lakeType];

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">Lake Type</label>
            <select id={`${toolId}-type`} value={lakeType} onChange={(e) => setLakeType(e.target.value)} className="input-field" aria-label={`Lake type for ${toolName}`}>
              <option value="alpine">Alpine Lake</option>
              <option value="crater">Crater Lake</option>
              <option value="salt">Salt Lake</option>
              <option value="glacial">Glacial Lake</option>
              <option value="tropical">Tropical Lake</option>
            </select>
          </div>
          <button onClick={generate} className="btn-primary">Generate Palette</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Color Palette</label>
            <div className="flex gap-2 mb-3">
              {palette.colors.map((c, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded border border-gray-200" style={{ backgroundColor: c.hex }} title={c.name} />
                  <span className="text-xs text-gray-500 mt-1">{c.hex}</span>
                </div>
              ))}
            </div>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
