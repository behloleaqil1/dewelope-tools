'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromRiverType - Generate color palettes inspired by river types.
 * Supports glacier, tropical, delta, mountain stream, and swamp river types.
 */

const RIVER_PALETTES: Record<string, { name: string; colors: { hex: string; name: string }[] }> = {
  glacier: {
    name: 'Glacier River',
    colors: [
      { hex: '#E8F4FD', name: 'Ice Mist' },
      { hex: '#B3DCF2', name: 'Glacial Blue' },
      { hex: '#6BB8E0', name: 'Meltwater' },
      { hex: '#2E8BC0', name: 'Deep Glacier' },
      { hex: '#1A5276', name: 'Crevasse' },
    ],
  },
  tropical: {
    name: 'Tropical River',
    colors: [
      { hex: '#E8F8E0', name: 'Canopy Light' },
      { hex: '#7DCEA0', name: 'Emerald Flow' },
      { hex: '#27AE60', name: 'Jungle Stream' },
      { hex: '#1E8449', name: 'Deep Tropical' },
      { hex: '#0B5345', name: 'Rainforest Dark' },
    ],
  },
  delta: {
    name: 'River Delta',
    colors: [
      { hex: '#FEF9E7', name: 'Sandy Shore' },
      { hex: '#F9E79F', name: 'Silt Gold' },
      { hex: '#D4AC0D', name: 'Delta Mud' },
      { hex: '#7D6608', name: 'Estuary Brown' },
      { hex: '#4A3B0F', name: 'Deep Sediment' },
    ],
  },
  mountain: {
    name: 'Mountain Stream',
    colors: [
      { hex: '#EBF5FB', name: 'Snow Melt' },
      { hex: '#AED6F1', name: 'Clear Stream' },
      { hex: '#5DADE2', name: 'Rapids Blue' },
      { hex: '#2471A3', name: 'Deep Pool' },
      { hex: '#1B4F72', name: 'Mountain Shadow' },
    ],
  },
  swamp: {
    name: 'Swamp River',
    colors: [
      { hex: '#F4F6F0', name: 'Moss Light' },
      { hex: '#A9DFBF', name: 'Algae Green' },
      { hex: '#6B8E6B', name: 'Murky Water' },
      { hex: '#4A6741', name: 'Swamp Depth' },
      { hex: '#2C3E2C', name: 'Bayou Dark' },
    ],
  },
};

export default function ColorPaletteFromRiverType({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [riverType, setRiverType] = useState('glacier');
  const [output, setOutput] = useState('');
  const [palette, setPalette] = useState<{ hex: string; name: string }[]>([]);

  const generate = () => {
    const selected = RIVER_PALETTES[riverType];
    if (!selected) return;

    setPalette(selected.colors);
    const lines = [
      `=== ${selected.name} Palette ===`,
      '',
      ...selected.colors.map(c => `${c.hex} - ${c.name}`),
      '',
      'CSS Variables:',
      ...selected.colors.map((c, i) => `--river-${i + 1}: ${c.hex};`),
    ];
    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">River Type</label>
        <select
          id={`${toolId}-type`}
          value={riverType}
          onChange={(e) => setRiverType(e.target.value)}
          className="input-field"
          aria-label={`River type for ${toolName}`}
        >
          <option value="glacier">Glacier River</option>
          <option value="tropical">Tropical River</option>
          <option value="delta">River Delta</option>
          <option value="mountain">Mountain Stream</option>
          <option value="swamp">Swamp River</option>
        </select>

        <button onClick={generate} className="btn-primary mt-3">Generate Palette</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Generated Palette</label>
            <div className="flex gap-2">
              {palette.map((c, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded border border-gray-200" style={{ backgroundColor: c.hex }} title={c.name} />
                  <span className="text-xs mt-1 text-gray-600">{c.hex}</span>
                </div>
              ))}
            </div>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-3 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
