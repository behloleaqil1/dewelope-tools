'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromStone - Generate palettes inspired by stones (marble, granite, slate).
 */
export default function ColorPaletteFromStone({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [stoneType, setStoneType] = useState('marble');
  const [output, setOutput] = useState<{ name: string; colors: { hex: string; name: string }[] } | null>(null);

  const stonePalettes: Record<string, { name: string; colors: { hex: string; name: string }[] }> = {
    marble: { name: 'Marble', colors: [{ hex: '#F5F5F0', name: 'White Marble' }, { hex: '#D4D0C8', name: 'Veined Cream' }, { hex: '#A9A9A9', name: 'Grey Vein' }, { hex: '#696969', name: 'Dark Streak' }, { hex: '#2F2F2F', name: 'Nero Marquina' }] },
    granite: { name: 'Granite', colors: [{ hex: '#C4B8A8', name: 'Light Granite' }, { hex: '#8B7D6B', name: 'Warm Granite' }, { hex: '#5C5346', name: 'Dark Granite' }, { hex: '#3D3530', name: 'Black Granite' }, { hex: '#D4A574', name: 'Feldspar Pink' }] },
    slate: { name: 'Slate', colors: [{ hex: '#708090', name: 'Slate Grey' }, { hex: '#4A5568', name: 'Dark Slate' }, { hex: '#2D3748', name: 'Deep Slate' }, { hex: '#1A202C', name: 'Midnight Slate' }, { hex: '#A0AEC0', name: 'Light Slate' }] },
    sandstone: { name: 'Sandstone', colors: [{ hex: '#F4E4C1', name: 'Light Sand' }, { hex: '#DEB887', name: 'Burlywood' }, { hex: '#C4A35A', name: 'Golden Sand' }, { hex: '#8B7355', name: 'Dark Sandstone' }, { hex: '#A0522D', name: 'Sienna' }] },
    limestone: { name: 'Limestone', colors: [{ hex: '#FAF0E6', name: 'Linen White' }, { hex: '#E8DCC8', name: 'Cream Limestone' }, { hex: '#C8B896', name: 'Warm Limestone' }, { hex: '#A89070', name: 'Aged Limestone' }, { hex: '#7A6652', name: 'Fossil Brown' }] },
    obsidian: { name: 'Obsidian', colors: [{ hex: '#0D0D0D', name: 'Pure Obsidian' }, { hex: '#1C1C2E', name: 'Midnight Glass' }, { hex: '#2D1B4E', name: 'Purple Sheen' }, { hex: '#3D3D3D', name: 'Smoky Edge' }, { hex: '#4A4A5A', name: 'Reflective Grey' }] },
    jade: { name: 'Jade', colors: [{ hex: '#00A86B', name: 'Imperial Jade' }, { hex: '#4F7942', name: 'Nephrite Green' }, { hex: '#2E8B57', name: 'Sea Green Jade' }, { hex: '#1B4D3E', name: 'Deep Jade' }, { hex: '#98FB98', name: 'Pale Jade' }] },
    lapis: { name: 'Lapis Lazuli', colors: [{ hex: '#26619C', name: 'Lapis Blue' }, { hex: '#1B3A5C', name: 'Deep Lapis' }, { hex: '#4169E1', name: 'Royal Blue' }, { hex: '#C5B358', name: 'Pyrite Gold' }, { hex: '#F0F8FF', name: 'Calcite White' }] },
  };

  const generate = () => {
    setOutput(stonePalettes[stoneType]);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-stone`} className="block text-sm font-medium text-gray-700 mb-1">Select Stone Type</label>
        <select id={`${toolId}-stone`} value={stoneType} onChange={(e) => setStoneType(e.target.value)} aria-label={`Stone type for ${toolName}`} className="input-field">
          <option value="marble">Marble</option>
          <option value="granite">Granite</option>
          <option value="slate">Slate</option>
          <option value="sandstone">Sandstone</option>
          <option value="limestone">Limestone</option>
          <option value="obsidian">Obsidian</option>
          <option value="jade">Jade</option>
          <option value="lapis">Lapis Lazuli</option>
        </select>
        <button onClick={generate} className="btn-primary mt-4">Generate Palette</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">{output.name} Palette</label>
            <div className="grid grid-cols-5 gap-2">
              {output.colors.map((color, i) => (
                <div key={i} className="text-center">
                  <div className="w-full h-20 rounded-lg border border-gray-200" style={{ backgroundColor: color.hex }} />
                  <p className="text-xs font-mono mt-1">{color.hex}</p>
                  <p className="text-xs text-gray-600">{color.name}</p>
                </div>
              ))}
            </div>
            <CopyToClipboard text={output.colors.map(c => `${c.hex} - ${c.name}`).join('\n')} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
