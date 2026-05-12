'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromBiome - Generate color palettes inspired by biomes.
 * Includes curated palettes for tundra, rainforest, desert, ocean, savanna, and more.
 */
export default function ColorPaletteFromBiome({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [selectedBiome, setSelectedBiome] = useState('tundra');
  const [output, setOutput] = useState<{ name: string; colors: { hex: string; name: string }[] } | null>(null);

  const biomes: Record<string, { name: string; colors: { hex: string; name: string }[] }> = {
    tundra: {
      name: 'Tundra',
      colors: [
        { hex: '#E8F4F8', name: 'Frost White' },
        { hex: '#B0D4E3', name: 'Ice Blue' },
        { hex: '#7BA7BC', name: 'Frozen Lake' },
        { hex: '#4A6741', name: 'Lichen Green' },
        { hex: '#2C3E50', name: 'Polar Night' },
      ],
    },
    rainforest: {
      name: 'Rainforest',
      colors: [
        { hex: '#1B4332', name: 'Deep Canopy' },
        { hex: '#2D6A4F', name: 'Emerald Moss' },
        { hex: '#52B788', name: 'Tropical Leaf' },
        { hex: '#8B4513', name: 'Bark Brown' },
        { hex: '#F4A460', name: 'Orchid Gold' },
      ],
    },
    desert: {
      name: 'Desert',
      colors: [
        { hex: '#EDC9AF', name: 'Sand Dune' },
        { hex: '#C19A6B', name: 'Camel Tan' },
        { hex: '#8B5E3C', name: 'Terracotta' },
        { hex: '#F4E4C1', name: 'Bleached Bone' },
        { hex: '#E85D04', name: 'Sunset Orange' },
      ],
    },
    ocean: {
      name: 'Ocean',
      colors: [
        { hex: '#03045E', name: 'Abyss Blue' },
        { hex: '#0077B6', name: 'Deep Current' },
        { hex: '#00B4D8', name: 'Tropical Shallows' },
        { hex: '#90E0EF', name: 'Sea Foam' },
        { hex: '#CAF0F8', name: 'Surf Mist' },
      ],
    },
    savanna: {
      name: 'Savanna',
      colors: [
        { hex: '#F2CC8F', name: 'Dry Grass' },
        { hex: '#E07A5F', name: 'Sunset Clay' },
        { hex: '#81B29A', name: 'Acacia Green' },
        { hex: '#3D405B', name: 'Twilight' },
        { hex: '#F4F1DE', name: 'Ivory Dust' },
      ],
    },
    taiga: {
      name: 'Taiga (Boreal Forest)',
      colors: [
        { hex: '#2F4F4F', name: 'Dark Spruce' },
        { hex: '#556B2F', name: 'Pine Needle' },
        { hex: '#8FBC8F', name: 'Moss Light' },
        { hex: '#D2B48C', name: 'Birch Bark' },
        { hex: '#F5F5DC', name: 'Snow Dusted' },
      ],
    },
  };

  const generate = () => {
    setOutput(biomes[selectedBiome]);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-biome`} className="block text-sm font-medium text-gray-700 mb-1">
          Select Biome
        </label>
        <select
          id={`${toolId}-biome`}
          value={selectedBiome}
          onChange={(e) => setSelectedBiome(e.target.value)}
          aria-label={`Biome selection for ${toolName}`}
          className="input-field mb-3"
        >
          {Object.entries(biomes).map(([key, biome]) => (
            <option key={key} value={key}>{biome.name}</option>
          ))}
        </select>
        <button
          onClick={generate}
          className="btn-primary mt-2"
        >
          Generate Palette
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{output.name} Palette</label>
            <div className="grid grid-cols-5 gap-2">
              {output.colors.map((color) => (
                <div key={color.hex} className="text-center">
                  <div
                    className="w-full h-16 rounded border border-gray-200"
                    style={{ backgroundColor: color.hex }}
                  />
                  <p className="text-xs font-mono mt-1">{color.hex}</p>
                  <p className="text-xs text-gray-600">{color.name}</p>
                </div>
              ))}
            </div>
            <CopyToClipboard text={output.colors.map((c) => `${c.hex} - ${c.name}`).join('\n')} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
