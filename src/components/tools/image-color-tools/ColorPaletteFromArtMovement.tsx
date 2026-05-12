'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromArtMovement - Generate color palettes inspired by art movements.
 */
export default function ColorPaletteFromArtMovement({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [movement, setMovement] = useState('impressionism');
  const [paletteSize, setPaletteSize] = useState('5');
  const [palette, setPalette] = useState<{ hex: string; name: string }[]>([]);

  const movements: Record<string, { name: string; colors: { hex: string; name: string }[] }> = {
    impressionism: {
      name: 'Impressionism',
      colors: [
        { hex: '#7EB5D6', name: 'Monet Blue' },
        { hex: '#F5E6A3', name: 'Sunlit Yellow' },
        { hex: '#A8D5A2', name: 'Garden Green' },
        { hex: '#E8A4C8', name: 'Renoir Pink' },
        { hex: '#F4C97E', name: 'Golden Light' },
        { hex: '#B8D4E3', name: 'Water Lily Blue' },
        { hex: '#D4A5D0', name: 'Lavender Haze' },
        { hex: '#9BC4A8', name: 'Meadow Green' },
      ],
    },
    cubism: {
      name: 'Cubism',
      colors: [
        { hex: '#8B6F47', name: 'Analytical Brown' },
        { hex: '#4A5568', name: 'Geometric Gray' },
        { hex: '#C4A35A', name: 'Ochre Gold' },
        { hex: '#2D3748', name: 'Picasso Dark' },
        { hex: '#A0AEC0', name: 'Fractured Silver' },
        { hex: '#6B4C3B', name: 'Braque Umber' },
        { hex: '#D4C5A9', name: 'Canvas Beige' },
        { hex: '#718096', name: 'Steel Fragment' },
      ],
    },
    surrealism: {
      name: 'Surrealism',
      colors: [
        { hex: '#1A237E', name: 'Dream Blue' },
        { hex: '#FF6F00', name: 'Dalí Orange' },
        { hex: '#4A148C', name: 'Subconscious Purple' },
        { hex: '#FFD600', name: 'Melting Gold' },
        { hex: '#B71C1C', name: 'Magritte Red' },
        { hex: '#006064', name: 'Deep Teal' },
        { hex: '#E65100', name: 'Burning Amber' },
        { hex: '#311B92', name: 'Midnight Violet' },
      ],
    },
    artDeco: {
      name: 'Art Deco',
      colors: [
        { hex: '#D4AF37', name: 'Deco Gold' },
        { hex: '#1B1B1B', name: 'Onyx Black' },
        { hex: '#C0C0C0', name: 'Chrome Silver' },
        { hex: '#006B3F', name: 'Emerald Green' },
        { hex: '#800020', name: 'Burgundy' },
        { hex: '#E8D5B7', name: 'Champagne' },
        { hex: '#003153', name: 'Prussian Blue' },
        { hex: '#B87333', name: 'Copper' },
      ],
    },
    popArt: {
      name: 'Pop Art',
      colors: [
        { hex: '#FF0000', name: 'Warhol Red' },
        { hex: '#FFFF00', name: 'Lichtenstein Yellow' },
        { hex: '#0000FF', name: 'Klein Blue' },
        { hex: '#FF69B4', name: 'Hot Pink' },
        { hex: '#00FF00', name: 'Neon Green' },
        { hex: '#FF8C00', name: 'Pop Orange' },
        { hex: '#8B00FF', name: 'Electric Violet' },
        { hex: '#00CED1', name: 'Turquoise Pop' },
      ],
    },
    baroque: {
      name: 'Baroque',
      colors: [
        { hex: '#4A0E0E', name: 'Caravaggio Red' },
        { hex: '#C9A84C', name: 'Gilded Gold' },
        { hex: '#1A1A2E', name: 'Rembrandt Dark' },
        { hex: '#6B3A2A', name: 'Velvet Brown' },
        { hex: '#2C3E50', name: 'Deep Navy' },
        { hex: '#8B4513', name: 'Sienna' },
        { hex: '#DAA520', name: 'Antique Gold' },
        { hex: '#3D0C02', name: 'Mahogany' },
      ],
    },
    minimalism: {
      name: 'Minimalism',
      colors: [
        { hex: '#FFFFFF', name: 'Pure White' },
        { hex: '#000000', name: 'Absolute Black' },
        { hex: '#F5F5F5', name: 'Off White' },
        { hex: '#333333', name: 'Charcoal' },
        { hex: '#CCCCCC', name: 'Light Gray' },
        { hex: '#666666', name: 'Medium Gray' },
        { hex: '#E0E0E0', name: 'Whisper Gray' },
        { hex: '#1A1A1A', name: 'Near Black' },
      ],
    },
    fauvism: {
      name: 'Fauvism',
      colors: [
        { hex: '#FF2400', name: 'Matisse Red' },
        { hex: '#0047AB', name: 'Cobalt Blue' },
        { hex: '#FFBF00', name: 'Amber Yellow' },
        { hex: '#228B22', name: 'Forest Green' },
        { hex: '#FF00FF', name: 'Wild Magenta' },
        { hex: '#FF7F50', name: 'Coral' },
        { hex: '#4B0082', name: 'Indigo' },
        { hex: '#32CD32', name: 'Lime Green' },
      ],
    },
  };

  const generate = () => {
    const size = Math.min(8, Math.max(3, parseInt(paletteSize) || 5));
    const movementData = movements[movement];
    if (!movementData) return;

    const shuffled = [...movementData.colors].sort(() => Math.random() - 0.5);
    setPalette(shuffled.slice(0, size));
  };

  const copyText = palette.map((c) => `${c.hex} - ${c.name}`).join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-movement`} className="block text-sm font-medium text-gray-700 mb-1">Art Movement</label>
        <select
          id={`${toolId}-movement`}
          value={movement}
          onChange={(e) => setMovement(e.target.value)}
          className="input-field"
          aria-label={`Art movement for ${toolName}`}
        >
          {Object.entries(movements).map(([key, val]) => (
            <option key={key} value={key}>{val.name}</option>
          ))}
        </select>
        <label htmlFor={`${toolId}-size`} className="block text-sm font-medium text-gray-700 mb-1 mt-3">Palette Size (3-8)</label>
        <input
          id={`${toolId}-size`}
          type="number"
          min="3"
          max="8"
          value={paletteSize}
          onChange={(e) => setPaletteSize(e.target.value)}
          className="input-field w-24"
          aria-label={`Palette size for ${toolName}`}
        />
      </InputArea>

      <button onClick={generate} aria-label="Generate palette" className="btn-primary">
        Generate Palette
      </button>

      <OutputArea hasContent={palette.length > 0}>
        {palette.length > 0 && (
          <div className="space-y-3">
            <div className="flex gap-2 flex-wrap">
              {palette.map((color, i) => (
                <div key={i} className="text-center">
                  <div
                    className="w-16 h-16 rounded-lg border border-gray-200 shadow-sm"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="text-xs font-mono mt-1">{color.hex}</div>
                  <div className="text-xs text-gray-500">{color.name}</div>
                </div>
              ))}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
