'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromFlower - Generate color palettes inspired by flowers.
 * Curated 5-color palettes for popular flowers.
 */
export default function ColorPaletteFromFlower({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [selectedFlower, setSelectedFlower] = useState('rose');
  const [output, setOutput] = useState('');

  const flowerPalettes: Record<string, { name: string; colors: { hex: string; name: string }[] }> = {
    rose: { name: 'Rose', colors: [{ hex: '#C41E3A', name: 'Deep Red' }, { hex: '#E8A0BF', name: 'Soft Pink' }, { hex: '#2D5016', name: 'Stem Green' }, { hex: '#8B0000', name: 'Dark Rose' }, { hex: '#FFF0F5', name: 'Lavender Blush' }] },
    sunflower: { name: 'Sunflower', colors: [{ hex: '#FFD700', name: 'Golden Yellow' }, { hex: '#8B4513', name: 'Seed Brown' }, { hex: '#228B22', name: 'Forest Green' }, { hex: '#FFA500', name: 'Orange Petal' }, { hex: '#FFFACD', name: 'Lemon Chiffon' }] },
    lavender: { name: 'Lavender', colors: [{ hex: '#9B59B6', name: 'Purple' }, { hex: '#E8DAEF', name: 'Light Lavender' }, { hex: '#6C7A89', name: 'Sage' }, { hex: '#7D3C98', name: 'Deep Violet' }, { hex: '#F4ECF7', name: 'Pale Lilac' }] },
    cherry_blossom: { name: 'Cherry Blossom', colors: [{ hex: '#FFB7C5', name: 'Sakura Pink' }, { hex: '#FFFFFF', name: 'White Petal' }, { hex: '#8B4513', name: 'Branch Brown' }, { hex: '#FF69B4', name: 'Hot Pink' }, { hex: '#FFF0F5', name: 'Blush' }] },
    tulip: { name: 'Tulip', colors: [{ hex: '#FF6347', name: 'Red Tulip' }, { hex: '#FF1493', name: 'Deep Pink' }, { hex: '#32CD32', name: 'Lime Green' }, { hex: '#FFD700', name: 'Yellow Tulip' }, { hex: '#800080', name: 'Purple Tulip' }] },
    daisy: { name: 'Daisy', colors: [{ hex: '#FFFFFF', name: 'White Petal' }, { hex: '#FFD700', name: 'Yellow Center' }, { hex: '#90EE90', name: 'Light Green' }, { hex: '#F0F8FF', name: 'Alice Blue' }, { hex: '#556B2F', name: 'Dark Olive' }] },
    orchid: { name: 'Orchid', colors: [{ hex: '#DA70D6', name: 'Orchid Purple' }, { hex: '#FF00FF', name: 'Magenta' }, { hex: '#2E8B57', name: 'Sea Green' }, { hex: '#DDA0DD', name: 'Plum' }, { hex: '#4B0082', name: 'Indigo' }] },
    lotus: { name: 'Lotus', colors: [{ hex: '#FFC0CB', name: 'Pink' }, { hex: '#FAEBD7', name: 'Antique White' }, { hex: '#006400', name: 'Dark Green' }, { hex: '#FF69B4', name: 'Hot Pink' }, { hex: '#F5F5DC', name: 'Beige' }] },
    iris: { name: 'Iris', colors: [{ hex: '#4B0082', name: 'Indigo' }, { hex: '#6A5ACD', name: 'Slate Blue' }, { hex: '#9370DB', name: 'Medium Purple' }, { hex: '#FFD700', name: 'Gold Beard' }, { hex: '#228B22', name: 'Forest Green' }] },
    marigold: { name: 'Marigold', colors: [{ hex: '#FF8C00', name: 'Dark Orange' }, { hex: '#FFD700', name: 'Gold' }, { hex: '#B8860B', name: 'Dark Goldenrod' }, { hex: '#556B2F', name: 'Olive Green' }, { hex: '#FFF8DC', name: 'Cornsilk' }] },
  };

  function generate() {
    const flower = flowerPalettes[selectedFlower];
    if (!flower) return;

    const lines: string[] = [];
    lines.push(`🌸 ${flower.name} Palette`);
    lines.push('='.repeat(30));
    lines.push('');
    flower.colors.forEach((c, i) => {
      lines.push(`${i + 1}. ${c.name}: ${c.hex}`);
    });
    lines.push('');
    lines.push('CSS Variables:');
    flower.colors.forEach((c, i) => {
      lines.push(`  --flower-${i + 1}: ${c.hex};`);
    });

    setOutput(lines.join('\n'));
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-flower`} className="block text-sm font-medium text-gray-700 mb-1">
          Select a Flower
        </label>
        <select
          id={`${toolId}-flower`}
          value={selectedFlower}
          onChange={(e) => setSelectedFlower(e.target.value)}
          aria-label={`Flower selection for ${toolName}`}
          className="input-field mb-3"
        >
          {Object.entries(flowerPalettes).map(([key, val]) => (
            <option key={key} value={key}>{val.name}</option>
          ))}
        </select>
        <button onClick={generate} className="btn-primary mt-2">Generate Palette</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Flower Palette</label>
            <div className="flex gap-2 mb-3">
              {flowerPalettes[selectedFlower]?.colors.map((c, i) => (
                <div key={i} className="w-12 h-12 rounded border" style={{ backgroundColor: c.hex }} title={`${c.name} (${c.hex})`} />
              ))}
            </div>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
