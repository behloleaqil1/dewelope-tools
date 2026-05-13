'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromCave - Generate color palettes inspired by caves.
 * Includes stalactite, crystal, underground, limestone, and more.
 */
export default function ColorPaletteFromCave({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [caveType, setCaveType] = useState('stalactite');
  const [output, setOutput] = useState('');

  const palettes: Record<string, { name: string; colors: { hex: string; name: string }[] }> = {
    stalactite: {
      name: 'Stalactite',
      colors: [
        { hex: '#D4C5A9', name: 'Limestone Drip' },
        { hex: '#8B7D6B', name: 'Cave Stone' },
        { hex: '#5C4A3A', name: 'Mineral Brown' },
        { hex: '#3D3028', name: 'Deep Cavern' },
        { hex: '#F5F0E8', name: 'Calcite White' },
      ],
    },
    crystal: {
      name: 'Crystal Cave',
      colors: [
        { hex: '#A8D8EA', name: 'Crystal Blue' },
        { hex: '#7B68EE', name: 'Amethyst Glow' },
        { hex: '#E8D5F5', name: 'Quartz Light' },
        { hex: '#4A3B6B', name: 'Deep Crystal' },
        { hex: '#C4F0F5', name: 'Ice Crystal' },
      ],
    },
    underground: {
      name: 'Underground River',
      colors: [
        { hex: '#1A3A4A', name: 'Deep Water' },
        { hex: '#2E6B7B', name: 'Underground Pool' },
        { hex: '#4A9BAD', name: 'Cave Stream' },
        { hex: '#0D1F2D', name: 'Abyss Dark' },
        { hex: '#6BC5D4', name: 'Subterranean Blue' },
      ],
    },
    limestone: {
      name: 'Limestone',
      colors: [
        { hex: '#F5F1E6', name: 'Raw Limestone' },
        { hex: '#D9CDB8', name: 'Weathered Stone' },
        { hex: '#B8A88A', name: 'Fossil Beige' },
        { hex: '#8C7B66', name: 'Sediment' },
        { hex: '#6B5B4A', name: 'Ancient Rock' },
      ],
    },
    glowworm: {
      name: 'Glowworm Cave',
      colors: [
        { hex: '#0A1628', name: 'Cave Darkness' },
        { hex: '#1B3A5C', name: 'Night Ceiling' },
        { hex: '#4FFFB0', name: 'Bioluminescent' },
        { hex: '#7BFFDA', name: 'Glow Light' },
        { hex: '#2A5C3A', name: 'Moss Dark' },
      ],
    },
    lava: {
      name: 'Lava Tube',
      colors: [
        { hex: '#1A0A0A', name: 'Volcanic Dark' },
        { hex: '#4A1A1A', name: 'Cooled Basalt' },
        { hex: '#8B2500', name: 'Ember Glow' },
        { hex: '#CC4400', name: 'Molten Edge' },
        { hex: '#3D2B1F', name: 'Obsidian Brown' },
      ],
    },
    ice: {
      name: 'Ice Cave',
      colors: [
        { hex: '#E8F4F8', name: 'Glacial White' },
        { hex: '#B8DDE6', name: 'Frozen Blue' },
        { hex: '#7BBAD4', name: 'Ice Wall' },
        { hex: '#4A8FA8', name: 'Deep Ice' },
        { hex: '#2C5F73', name: 'Permafrost' },
      ],
    },
    bat: {
      name: 'Bat Cave',
      colors: [
        { hex: '#0D0D0D', name: 'Pitch Black' },
        { hex: '#2B2B2B', name: 'Shadow' },
        { hex: '#4A4A4A', name: 'Guano Gray' },
        { hex: '#6B6B6B', name: 'Stone Gray' },
        { hex: '#1A1A2E', name: 'Midnight Blue' },
      ],
    },
  };

  const generate = () => {
    const palette = palettes[caveType];
    if (!palette) return;

    const lines = [
      `═══ ${palette.name} Cave Palette ═══`,
      '',
      '── Colors ──',
      ...palette.colors.map((c, i) => `  ${i + 1}. ${c.name}: ${c.hex}`),
      '',
      '── CSS Variables ──',
      ':root {',
      ...palette.colors.map((c, i) => `  --cave-${caveType}-${i + 1}: ${c.hex};`),
      '}',
      '',
      '── Tailwind Config ──',
      `'${caveType}': {`,
      ...palette.colors.map((c, i) => `  '${(i + 1) * 100}': '${c.hex}',`),
      '}',
    ];

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">
              Cave Inspiration
            </label>
            <select
              id={`${toolId}-type`}
              value={caveType}
              onChange={(e) => setCaveType(e.target.value)}
              className="input-field"
              aria-label={`Cave type for ${toolName}`}
            >
              <option value="stalactite">Stalactite</option>
              <option value="crystal">Crystal Cave</option>
              <option value="underground">Underground River</option>
              <option value="limestone">Limestone</option>
              <option value="glowworm">Glowworm Cave</option>
              <option value="lava">Lava Tube</option>
              <option value="ice">Ice Cave</option>
              <option value="bat">Bat Cave</option>
            </select>
          </div>
          <button onClick={generate} className="btn-primary" aria-label="Generate cave palette">
            Generate Palette
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Generated Palette</label>
            <div className="flex gap-2 mb-3">
              {palettes[caveType]?.colors.map((c, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div
                    className="w-12 h-12 rounded-lg border border-gray-200"
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                  <span className="text-xs text-gray-500 mt-1">{c.hex}</span>
                </div>
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
