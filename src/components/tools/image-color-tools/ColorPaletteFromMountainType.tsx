'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromMountainType - Generate color palettes inspired by mountain types.
 */

const MOUNTAIN_PALETTES: Record<string, { name: string; colors: { hex: string; name: string }[] }> = {
  alpine: {
    name: 'Alpine',
    colors: [
      { hex: '#E8F4FD', name: 'Snow Cap' },
      { hex: '#87CEEB', name: 'Clear Sky' },
      { hex: '#4A7C59', name: 'Pine Forest' },
      { hex: '#6B7B8D', name: 'Granite' },
      { hex: '#2C3E50', name: 'Deep Shadow' },
    ],
  },
  volcanic: {
    name: 'Volcanic',
    colors: [
      { hex: '#FF4500', name: 'Lava Flow' },
      { hex: '#8B0000', name: 'Magma' },
      { hex: '#2C2C2C', name: 'Basalt' },
      { hex: '#FF8C00', name: 'Ember' },
      { hex: '#4A4A4A', name: 'Ash' },
    ],
  },
  coastal: {
    name: 'Coastal',
    colors: [
      { hex: '#006994', name: 'Ocean Deep' },
      { hex: '#40E0D0', name: 'Tidal Pool' },
      { hex: '#C2B280', name: 'Sandy Cliff' },
      { hex: '#228B22', name: 'Coastal Moss' },
      { hex: '#708090', name: 'Sea Mist' },
    ],
  },
  desert: {
    name: 'Desert Mountain',
    colors: [
      { hex: '#EDC9AF', name: 'Sandstone' },
      { hex: '#C19A6B', name: 'Desert Tan' },
      { hex: '#8B4513', name: 'Red Rock' },
      { hex: '#F4A460', name: 'Sunset Mesa' },
      { hex: '#2F4F4F', name: 'Shadow Canyon' },
    ],
  },
  glacial: {
    name: 'Glacial',
    colors: [
      { hex: '#F0F8FF', name: 'Ice White' },
      { hex: '#B0E0E6', name: 'Glacial Blue' },
      { hex: '#4682B4', name: 'Crevasse' },
      { hex: '#1C3A5F', name: 'Deep Ice' },
      { hex: '#E0E8F0', name: 'Frost' },
    ],
  },
  tropical: {
    name: 'Tropical Mountain',
    colors: [
      { hex: '#228B22', name: 'Jungle Canopy' },
      { hex: '#32CD32', name: 'Fern' },
      { hex: '#8FBC8F', name: 'Cloud Forest' },
      { hex: '#6B8E23', name: 'Moss' },
      { hex: '#4B0082', name: 'Orchid Shadow' },
    ],
  },
};

export default function ColorPaletteFromMountainType({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [mountainType, setMountainType] = useState('alpine');
  const [output, setOutput] = useState('');
  const [palette, setPalette] = useState<{ hex: string; name: string }[]>([]);

  const generate = () => {
    const selected = MOUNTAIN_PALETTES[mountainType];
    if (!selected) return;

    setPalette(selected.colors);

    const cssVars = selected.colors
      .map((c, i) => `  --mountain-${i + 1}: ${c.hex};`)
      .join('\n');

    const tailwind = selected.colors
      .map((c, i) => `  'mountain-${i + 1}': '${c.hex}',`)
      .join('\n');

    const result = [
      `${selected.name} Mountain Palette`,
      `${'='.repeat(40)}`,
      '',
      ...selected.colors.map((c) => `${c.hex} - ${c.name}`),
      '',
      `CSS Variables:`,
      `:root {\n${cssVars}\n}`,
      '',
      `Tailwind Config:`,
      `colors: {\n${tailwind}\n}`,
    ];

    setOutput(result.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">
              Mountain Type
            </label>
            <select
              id={`${toolId}-type`}
              value={mountainType}
              onChange={(e) => setMountainType(e.target.value)}
              aria-label={`Mountain type for ${toolName}`}
              className="input-field"
            >
              {Object.entries(MOUNTAIN_PALETTES).map(([key, val]) => (
                <option key={key} value={key}>{val.name}</option>
              ))}
            </select>
          </div>
          <button onClick={generate} className="btn-primary">
            Generate Palette
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Mountain Color Palette</label>
            <div className="flex gap-2 flex-wrap">
              {palette.map((c, i) => (
                <div key={i} className="text-center">
                  <div
                    className="w-16 h-16 rounded border border-gray-200"
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                  <span className="text-xs text-gray-600 mt-1 block">{c.hex}</span>
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
