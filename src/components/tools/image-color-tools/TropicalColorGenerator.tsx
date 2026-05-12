'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TropicalColorGenerator - Generate tropical-themed color palettes
 * with vibrant greens, ocean blues, sunset oranges, and exotic flower tones.
 */
export default function TropicalColorGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [paletteSize, setPaletteSize] = useState('5');
  const [style, setStyle] = useState<'ocean' | 'jungle' | 'sunset' | 'exotic'>('ocean');
  const [palette, setPalette] = useState<{ hex: string; name: string }[]>([]);

  const tropicalPalettes: Record<string, { hex: string; name: string }[]> = {
    ocean: [
      { hex: '#00CEC9', name: 'Turquoise Sea' },
      { hex: '#0984E3', name: 'Ocean Blue' },
      { hex: '#74B9FF', name: 'Lagoon' },
      { hex: '#00B894', name: 'Reef Green' },
      { hex: '#55EFC4', name: 'Seafoam' },
      { hex: '#81ECEC', name: 'Shallow Water' },
      { hex: '#006266', name: 'Deep Ocean' },
      { hex: '#48DBFB', name: 'Tropical Wave' },
    ],
    jungle: [
      { hex: '#00B894', name: 'Tropical Leaf' },
      { hex: '#00A86B', name: 'Jungle Green' },
      { hex: '#2ECC71', name: 'Palm Frond' },
      { hex: '#27AE60', name: 'Rainforest' },
      { hex: '#1ABC9C', name: 'Fern' },
      { hex: '#A3CB38', name: 'Lime Leaf' },
      { hex: '#009432', name: 'Deep Jungle' },
      { hex: '#6AB04C', name: 'Canopy' },
    ],
    sunset: [
      { hex: '#FF6B6B', name: 'Coral Sunset' },
      { hex: '#FF9FF3', name: 'Hibiscus Pink' },
      { hex: '#FECA57', name: 'Mango' },
      { hex: '#FF9F43', name: 'Papaya' },
      { hex: '#EE5A24', name: 'Tropical Sun' },
      { hex: '#F368E0', name: 'Orchid' },
      { hex: '#FD79A8', name: 'Flamingo' },
      { hex: '#E17055', name: 'Guava' },
    ],
    exotic: [
      { hex: '#6C5CE7', name: 'Exotic Purple' },
      { hex: '#A29BFE', name: 'Passion Fruit' },
      { hex: '#FD79A8', name: 'Dragon Fruit' },
      { hex: '#00CEC9', name: 'Parrot Blue' },
      { hex: '#FFEAA7', name: 'Pineapple' },
      { hex: '#55EFC4', name: 'Toucan Green' },
      { hex: '#E84393', name: 'Bougainvillea' },
      { hex: '#00B894', name: 'Tropical Mint' },
    ],
  };

  const generate = () => {
    const size = Math.min(Math.max(parseInt(paletteSize) || 5, 3), 8);
    const source = tropicalPalettes[style];
    const shuffled = [...source].sort(() => Math.random() - 0.5);
    setPalette(shuffled.slice(0, size));
  };

  const copyText = palette.map(c => `${c.name}: ${c.hex}`).join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-style`} className="block text-sm font-medium text-gray-700 mb-1">
            Tropical Style
          </label>
          <select
            id={`${toolId}-style`}
            value={style}
            onChange={(e) => setStyle(e.target.value as typeof style)}
            aria-label={`Style for ${toolName}`}
            className="input-field"
          >
            <option value="ocean">Ocean & Beach</option>
            <option value="jungle">Jungle & Rainforest</option>
            <option value="sunset">Tropical Sunset</option>
            <option value="exotic">Exotic Flowers & Fruits</option>
          </select>
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-size`} className="block text-sm font-medium text-gray-700 mb-1">
            Palette Size (3-8)
          </label>
          <input
            id={`${toolId}-size`}
            type="number"
            min="3"
            max="8"
            value={paletteSize}
            onChange={(e) => setPaletteSize(e.target.value)}
            aria-label={`Palette size for ${toolName}`}
            className="input-field"
          />
        </InputArea>
      </div>

      <button onClick={generate} aria-label="Generate palette" className="btn-primary">
        Generate Tropical Palette
      </button>

      <OutputArea hasContent={palette.length > 0}>
        {palette.length > 0 && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {palette.map((color, i) => (
                <div key={i} className="text-center">
                  <div
                    className="w-full h-20 rounded-lg border border-gray-200 shadow-sm"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="text-xs font-medium text-gray-700 mt-1">{color.name}</div>
                  <div className="text-xs font-mono text-gray-500">{color.hex}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-1 h-12 rounded-lg overflow-hidden border border-gray-200">
              {palette.map((color, i) => (
                <div key={i} className="flex-1" style={{ backgroundColor: color.hex }} />
              ))}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
