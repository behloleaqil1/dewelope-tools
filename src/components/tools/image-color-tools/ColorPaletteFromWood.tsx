'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

interface WoodPalette {
  name: string;
  colors: { hex: string; name: string }[];
}

const woodPalettes: WoodPalette[] = [
  { name: 'Oak', colors: [{ hex: '#C4A35A', name: 'Golden Oak' }, { hex: '#8B6914', name: 'Dark Oak' }, { hex: '#D4B896', name: 'Light Oak' }, { hex: '#A0522D', name: 'Sienna Oak' }, { hex: '#F5DEB3', name: 'Wheat Oak' }] },
  { name: 'Walnut', colors: [{ hex: '#5C4033', name: 'Dark Walnut' }, { hex: '#3B2716', name: 'Deep Walnut' }, { hex: '#7B5B3A', name: 'Medium Walnut' }, { hex: '#4A3728', name: 'Rich Walnut' }, { hex: '#8B7355', name: 'Light Walnut' }] },
  { name: 'Cherry', colors: [{ hex: '#9B111E', name: 'Cherry Red' }, { hex: '#6B2D2D', name: 'Dark Cherry' }, { hex: '#C04040', name: 'Bright Cherry' }, { hex: '#8B4513', name: 'Aged Cherry' }, { hex: '#A0522D', name: 'Warm Cherry' }] },
  { name: 'Maple', colors: [{ hex: '#FFE4B5', name: 'Light Maple' }, { hex: '#DEB887', name: 'Honey Maple' }, { hex: '#F5DEB3', name: 'Cream Maple' }, { hex: '#D2B48C', name: 'Tan Maple' }, { hex: '#C8A96E', name: 'Golden Maple' }] },
  { name: 'Mahogany', colors: [{ hex: '#C04000', name: 'Red Mahogany' }, { hex: '#4E1609', name: 'Deep Mahogany' }, { hex: '#6B3A2A', name: 'Dark Mahogany' }, { hex: '#8B4513', name: 'Saddle Mahogany' }, { hex: '#A0522D', name: 'Warm Mahogany' }] },
  { name: 'Pine', colors: [{ hex: '#FAEBD7', name: 'Antique Pine' }, { hex: '#DEB887', name: 'Honey Pine' }, { hex: '#F5F5DC', name: 'Natural Pine' }, { hex: '#C8B560', name: 'Knotty Pine' }, { hex: '#E8D5B7', name: 'Light Pine' }] },
  { name: 'Ebony', colors: [{ hex: '#1C1C1C', name: 'True Ebony' }, { hex: '#2F2F2F', name: 'Charcoal Ebony' }, { hex: '#3D3D3D', name: 'Dark Ebony' }, { hex: '#0D0D0D', name: 'Jet Ebony' }, { hex: '#4A4A4A', name: 'Soft Ebony' }] },
  { name: 'Teak', colors: [{ hex: '#B8860B', name: 'Golden Teak' }, { hex: '#8B7355', name: 'Weathered Teak' }, { hex: '#A0522D', name: 'Rich Teak' }, { hex: '#CD853F', name: 'Honey Teak' }, { hex: '#6B4226', name: 'Dark Teak' }] },
];

export default function ColorPaletteFromWood({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [selectedWood, setSelectedWood] = useState('Oak');
  const [output, setOutput] = useState('');
  const [palette, setPalette] = useState<WoodPalette | null>(null);

  const generate = () => {
    const wood = woodPalettes.find(w => w.name === selectedWood);
    if (!wood) return;
    setPalette(wood);
    const text = wood.colors.map(c => `${c.name}: ${c.hex}`).join('\n');
    setOutput(text);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-wood`} className="block text-sm font-medium text-gray-700 mb-1">Select Wood Type</label>
            <select id={`${toolId}-wood`} value={selectedWood} onChange={(e) => setSelectedWood(e.target.value)} className="input-field" aria-label={`Wood type for ${toolName}`}>
              {woodPalettes.map(w => <option key={w.name} value={w.name}>{w.name}</option>)}
            </select>
          </div>
          <button onClick={generate} className="btn-primary">Generate Palette</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!palette}>
        {palette && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">{palette.name} Palette</label>
            <div className="grid grid-cols-5 gap-2">
              {palette.colors.map((c, i) => (
                <div key={i} className="text-center">
                  <div className="w-full h-16 rounded-lg border" style={{ backgroundColor: c.hex }} />
                  <p className="text-xs mt-1 font-medium text-gray-700">{c.name}</p>
                  <p className="text-xs text-gray-500">{c.hex}</p>
                </div>
              ))}
            </div>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
