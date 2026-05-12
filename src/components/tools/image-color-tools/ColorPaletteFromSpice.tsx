'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromSpice - Generate color palettes inspired by spices.
 */
export default function ColorPaletteFromSpice({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [selectedSpice, setSelectedSpice] = useState('');
  const [output, setOutput] = useState<{ name: string; colors: { hex: string; name: string }[] } | null>(null);

  const spicePalettes: Record<string, { name: string; colors: { hex: string; name: string }[] }> = {
    turmeric: { name: 'Turmeric', colors: [{ hex: '#F4C430', name: 'Golden Turmeric' }, { hex: '#E8A317', name: 'Deep Saffron' }, { hex: '#C68E17', name: 'Warm Amber' }, { hex: '#8B6914', name: 'Earthy Gold' }, { hex: '#FFF8DC', name: 'Cream Base' }] },
    paprika: { name: 'Paprika', colors: [{ hex: '#C41E3A', name: 'Hot Paprika' }, { hex: '#E25822', name: 'Smoked Red' }, { hex: '#FF6347', name: 'Tomato Dust' }, { hex: '#8B2500', name: 'Dark Chili' }, { hex: '#FFE4C4', name: 'Bisque' }] },
    cinnamon: { name: 'Cinnamon', colors: [{ hex: '#D2691E', name: 'Cinnamon Bark' }, { hex: '#8B4513', name: 'Saddle Brown' }, { hex: '#A0522D', name: 'Sienna Stick' }, { hex: '#CD853F', name: 'Peru Warm' }, { hex: '#FAEBD7', name: 'Antique White' }] },
    saffron: { name: 'Saffron', colors: [{ hex: '#FF9933', name: 'Saffron Thread' }, { hex: '#CC7722', name: 'Ochre Gold' }, { hex: '#E6BE8A', name: 'Khaki Bloom' }, { hex: '#8B0000', name: 'Stigma Red' }, { hex: '#FFF5E1', name: 'Cream Petal' }] },
    cardamom: { name: 'Cardamom', colors: [{ hex: '#4A7C59', name: 'Green Pod' }, { hex: '#2E5339', name: 'Dark Husk' }, { hex: '#8FBC8F', name: 'Pale Seed' }, { hex: '#C8B560', name: 'Inner Gold' }, { hex: '#F0FFF0', name: 'Honeydew' }] },
    cumin: { name: 'Cumin', colors: [{ hex: '#93613A', name: 'Cumin Seed' }, { hex: '#6B4226', name: 'Roasted Brown' }, { hex: '#C19A6B', name: 'Desert Sand' }, { hex: '#DEB887', name: 'Burlywood' }, { hex: '#F5F5DC', name: 'Beige' }] },
    lavender: { name: 'Lavender', colors: [{ hex: '#9B59B6', name: 'Lavender Bud' }, { hex: '#7D3C98', name: 'Deep Purple' }, { hex: '#D2B4DE', name: 'Light Mauve' }, { hex: '#4A235A', name: 'Dark Stem' }, { hex: '#F4ECF7', name: 'Pale Bloom' }] },
    ginger: { name: 'Ginger', colors: [{ hex: '#B06500', name: 'Fresh Ginger' }, { hex: '#E8A838', name: 'Ginger Gold' }, { hex: '#F5CBA7', name: 'Pale Root' }, { hex: '#784212', name: 'Dark Skin' }, { hex: '#FEF9E7', name: 'Light Cream' }] },
    clove: { name: 'Clove', colors: [{ hex: '#3D0C02', name: 'Clove Bud' }, { hex: '#5C3317', name: 'Dark Spice' }, { hex: '#8B4513', name: 'Warm Brown' }, { hex: '#A0522D', name: 'Sienna' }, { hex: '#D2B48C', name: 'Tan' }] },
    mint: { name: 'Mint', colors: [{ hex: '#3EB489', name: 'Fresh Mint' }, { hex: '#98FF98', name: 'Pale Green' }, { hex: '#2E8B57', name: 'Sea Green' }, { hex: '#006400', name: 'Dark Leaf' }, { hex: '#F0FFF0', name: 'Mint Cream' }] },
  };

  const generate = () => {
    if (!selectedSpice || !spicePalettes[selectedSpice]) return;
    setOutput(spicePalettes[selectedSpice]);
  };

  const resultText = output ? output.colors.map(c => `${c.name}: ${c.hex}`).join('\n') : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-spice`} className="block text-sm font-medium text-gray-700 mb-1">Select a Spice</label>
            <select id={`${toolId}-spice`} value={selectedSpice} onChange={(e) => setSelectedSpice(e.target.value)} className="input-field" aria-label={`Spice selection for ${toolName}`}>
              <option value="">Choose a spice...</option>
              {Object.entries(spicePalettes).map(([key, val]) => (
                <option key={key} value={key}>{val.name}</option>
              ))}
            </select>
          </div>
          <button onClick={generate} className="btn-primary w-full" disabled={!selectedSpice}>Generate Palette</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">{output.name} Palette</label>
            <div className="grid grid-cols-5 gap-2">
              {output.colors.map((color, idx) => (
                <div key={idx} className="text-center">
                  <div className="w-full aspect-square rounded-lg shadow-sm border" style={{ backgroundColor: color.hex }} />
                  <div className="text-xs font-mono mt-1 text-gray-700">{color.hex}</div>
                  <div className="text-xs text-gray-500">{color.name}</div>
                </div>
              ))}
            </div>
            <CopyToClipboard text={resultText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
