'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromDesertType - Generate color palettes inspired by desert types.
 * Includes Sahara, Gobi, Atacama, Mojave, Arabian, Kalahari, Sonoran, and Thar.
 */
export default function ColorPaletteFromDesertType({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [desertType, setDesertType] = useState('sahara');
  const [output, setOutput] = useState('');

  const palettes: Record<string, { name: string; colors: { hex: string; name: string }[] }> = {
    sahara: {
      name: 'Sahara',
      colors: [
        { hex: '#EDC9AF', name: 'Sand Dune' },
        { hex: '#C19A6B', name: 'Desert Tan' },
        { hex: '#D2691E', name: 'Saharan Orange' },
        { hex: '#8B4513', name: 'Scorched Earth' },
        { hex: '#F5DEB3', name: 'Wheat Gold' },
      ],
    },
    gobi: {
      name: 'Gobi',
      colors: [
        { hex: '#A0826D', name: 'Gobi Stone' },
        { hex: '#D4B896', name: 'Steppe Sand' },
        { hex: '#6B4E3D', name: 'Rocky Brown' },
        { hex: '#E8D5B7', name: 'Pale Dust' },
        { hex: '#4A3728', name: 'Dark Gravel' },
      ],
    },
    atacama: {
      name: 'Atacama',
      colors: [
        { hex: '#C8553D', name: 'Red Earth' },
        { hex: '#E8A87C', name: 'Copper Sand' },
        { hex: '#85461E', name: 'Iron Oxide' },
        { hex: '#F0E6D3', name: 'Salt Flat' },
        { hex: '#5C3317', name: 'Volcanic Soil' },
      ],
    },
    mojave: {
      name: 'Mojave',
      colors: [
        { hex: '#D2B48C', name: 'Tan Earth' },
        { hex: '#8FBC8F', name: 'Sage Green' },
        { hex: '#CD853F', name: 'Joshua Tree' },
        { hex: '#F4A460', name: 'Sandy Brown' },
        { hex: '#556B2F', name: 'Desert Olive' },
      ],
    },
    arabian: {
      name: 'Arabian',
      colors: [
        { hex: '#FAEBD7', name: 'Antique White' },
        { hex: '#DEB887', name: 'Burlywood' },
        { hex: '#B8860B', name: 'Dark Goldenrod' },
        { hex: '#8B7355', name: 'Camel' },
        { hex: '#FFD700', name: 'Gold Shimmer' },
      ],
    },
    kalahari: {
      name: 'Kalahari',
      colors: [
        { hex: '#CB4154', name: 'Red Sand' },
        { hex: '#E07C3E', name: 'Burnt Orange' },
        { hex: '#A0522D', name: 'Sienna' },
        { hex: '#F5E6CC', name: 'Dry Grass' },
        { hex: '#704214', name: 'Deep Rust' },
      ],
    },
    sonoran: {
      name: 'Sonoran',
      colors: [
        { hex: '#E6C88C', name: 'Cactus Gold' },
        { hex: '#7B9E6B', name: 'Saguaro Green' },
        { hex: '#C75B12', name: 'Sunset Orange' },
        { hex: '#4E6E4E', name: 'Palo Verde' },
        { hex: '#F0D9B5', name: 'Adobe Cream' },
      ],
    },
    thar: {
      name: 'Thar',
      colors: [
        { hex: '#E8C872', name: 'Golden Sand' },
        { hex: '#D4A03C', name: 'Turmeric' },
        { hex: '#8B6914', name: 'Camel Hide' },
        { hex: '#F5E1A4', name: 'Pale Marigold' },
        { hex: '#5C4033', name: 'Mud Brick' },
      ],
    },
  };

  const generate = () => {
    const palette = palettes[desertType];
    if (!palette) return;

    const lines = [
      `═══ ${palette.name} Desert Palette ═══`,
      '',
      '── Colors ──',
      ...palette.colors.map((c, i) => `  ${i + 1}. ${c.name}: ${c.hex}`),
      '',
      '── CSS Variables ──',
      ':root {',
      ...palette.colors.map((c, i) => `  --desert-${desertType}-${i + 1}: ${c.hex};`),
      '}',
      '',
      '── Tailwind Config ──',
      `'${desertType}': {`,
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
              Desert Type
            </label>
            <select
              id={`${toolId}-type`}
              value={desertType}
              onChange={(e) => setDesertType(e.target.value)}
              className="input-field"
              aria-label={`Desert type for ${toolName}`}
            >
              <option value="sahara">Sahara</option>
              <option value="gobi">Gobi</option>
              <option value="atacama">Atacama</option>
              <option value="mojave">Mojave</option>
              <option value="arabian">Arabian</option>
              <option value="kalahari">Kalahari</option>
              <option value="sonoran">Sonoran</option>
              <option value="thar">Thar</option>
            </select>
          </div>
          <button onClick={generate} className="btn-primary" aria-label="Generate desert palette">
            Generate Palette
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Generated Palette</label>
            <div className="flex gap-2 mb-3">
              {palettes[desertType]?.colors.map((c, i) => (
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
