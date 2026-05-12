'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromCeramic - Generate color palettes inspired by ceramics and pottery.
 */
export default function ColorPaletteFromCeramic({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [selectedStyle, setSelectedStyle] = useState('raku');
  const [output, setOutput] = useState<{ name: string; colors: { hex: string; name: string }[] } | null>(null);

  const ceramicPalettes: Record<string, { name: string; colors: { hex: string; name: string }[] }> = {
    raku: {
      name: 'Raku Pottery',
      colors: [
        { hex: '#2C3E50', name: 'Charcoal Glaze' },
        { hex: '#8B4513', name: 'Copper Flash' },
        { hex: '#C0C0C0', name: 'Silver Crackle' },
        { hex: '#556B2F', name: 'Moss Green' },
        { hex: '#DAA520', name: 'Gold Luster' },
      ],
    },
    celadon: {
      name: 'Celadon Ware',
      colors: [
        { hex: '#ACE1AF', name: 'Jade Green' },
        { hex: '#87CEAB', name: 'Celadon Mist' },
        { hex: '#E8F5E9', name: 'Pale Glaze' },
        { hex: '#4A7C59', name: 'Deep Celadon' },
        { hex: '#F5F5DC', name: 'Crackle White' },
      ],
    },
    terracotta: {
      name: 'Terracotta',
      colors: [
        { hex: '#E2725B', name: 'Classic Terra' },
        { hex: '#CD853F', name: 'Warm Clay' },
        { hex: '#8B4513', name: 'Burnt Sienna' },
        { hex: '#F4A460', name: 'Sandy Bisque' },
        { hex: '#D2691E', name: 'Fired Earth' },
      ],
    },
    blueWhite: {
      name: 'Blue & White Porcelain',
      colors: [
        { hex: '#1E3A5F', name: 'Cobalt Deep' },
        { hex: '#4169E1', name: 'Royal Blue' },
        { hex: '#87CEEB', name: 'Sky Wash' },
        { hex: '#F8F8FF', name: 'Porcelain White' },
        { hex: '#2F4F7F', name: 'Indigo Stroke' },
      ],
    },
    wabi: {
      name: 'Wabi-Sabi',
      colors: [
        { hex: '#8B7D6B', name: 'Aged Clay' },
        { hex: '#A0522D', name: 'Iron Oxide' },
        { hex: '#D2B48C', name: 'Natural Tan' },
        { hex: '#696969', name: 'Ash Gray' },
        { hex: '#F5F5DC', name: 'Unglazed' },
      ],
    },
    majolica: {
      name: 'Majolica',
      colors: [
        { hex: '#FFD700', name: 'Lustre Gold' },
        { hex: '#228B22', name: 'Leaf Green' },
        { hex: '#4169E1', name: 'Cobalt Blue' },
        { hex: '#FF6347', name: 'Tomato Red' },
        { hex: '#FFFAF0', name: 'Tin White' },
      ],
    },
  };

  const generate = () => {
    setOutput(ceramicPalettes[selectedStyle]);
  };

  const allColorsText = output
    ? output.colors.map((c) => `${c.name}: ${c.hex}`).join('\n')
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <label htmlFor={`${toolId}-style`} className="block text-sm font-medium text-gray-700 mb-1">
            Ceramic Style
          </label>
          <select
            id={`${toolId}-style`}
            value={selectedStyle}
            onChange={(e) => setSelectedStyle(e.target.value)}
            aria-label={`Ceramic style for ${toolName}`}
            className="input-field"
          >
            <option value="raku">Raku Pottery</option>
            <option value="celadon">Celadon Ware</option>
            <option value="terracotta">Terracotta</option>
            <option value="blueWhite">Blue & White Porcelain</option>
            <option value="wabi">Wabi-Sabi</option>
            <option value="majolica">Majolica</option>
          </select>
          <button onClick={generate} className="btn-primary w-full">
            Generate Palette
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">{output.name} Palette</label>
            <div className="grid grid-cols-5 gap-2">
              {output.colors.map((color, i) => (
                <div key={i} className="text-center">
                  <div
                    className="w-full h-20 rounded-lg border border-gray-200 mb-1"
                    style={{ backgroundColor: color.hex }}
                  />
                  <p className="text-xs font-medium text-gray-700">{color.name}</p>
                  <p className="text-xs text-gray-500">{color.hex}</p>
                </div>
              ))}
            </div>
            <CopyToClipboard text={allColorsText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
