'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromGemstone - Generate color palettes inspired by gemstones.
 */
export default function ColorPaletteFromGemstone({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [selectedGemstone, setSelectedGemstone] = useState('');
  const [output, setOutput] = useState<{ name: string; colors: { hex: string; name: string }[] } | null>(null);

  const gemstones: Record<string, { hex: string; name: string }[]> = {
    Ruby: [
      { hex: '#9B111E', name: 'Deep Ruby' },
      { hex: '#E0115F', name: 'Ruby Red' },
      { hex: '#CF1020', name: 'Lava Red' },
      { hex: '#722F37', name: 'Wine' },
      { hex: '#F4C2C2', name: 'Rose Quartz Light' },
    ],
    Emerald: [
      { hex: '#046307', name: 'Deep Emerald' },
      { hex: '#50C878', name: 'Emerald Green' },
      { hex: '#009B77', name: 'Tropical Green' },
      { hex: '#2E8B57', name: 'Sea Green' },
      { hex: '#D0F0C0', name: 'Tea Green' },
    ],
    Sapphire: [
      { hex: '#0F52BA', name: 'Sapphire Blue' },
      { hex: '#082567', name: 'Deep Sapphire' },
      { hex: '#1560BD', name: 'Denim Blue' },
      { hex: '#6593F5', name: 'Cornflower' },
      { hex: '#B0C4DE', name: 'Light Steel' },
    ],
    Amethyst: [
      { hex: '#9966CC', name: 'Amethyst' },
      { hex: '#6B3FA0', name: 'Royal Purple' },
      { hex: '#E0B0FF', name: 'Mauve' },
      { hex: '#4B0082', name: 'Indigo' },
      { hex: '#DDA0DD', name: 'Plum' },
    ],
    Topaz: [
      { hex: '#FFC87C', name: 'Topaz Gold' },
      { hex: '#FF8C00', name: 'Dark Orange' },
      { hex: '#FFBF00', name: 'Amber' },
      { hex: '#E2725B', name: 'Terra Cotta' },
      { hex: '#FFF8DC', name: 'Cornsilk' },
    ],
    Opal: [
      { hex: '#A8C3BC', name: 'Opal Green' },
      { hex: '#C9B1FF', name: 'Opal Lavender' },
      { hex: '#FFD1DC', name: 'Opal Pink' },
      { hex: '#87CEEB', name: 'Sky Blue' },
      { hex: '#FAFAD2', name: 'Light Goldenrod' },
    ],
    Diamond: [
      { hex: '#B9F2FF', name: 'Diamond Blue' },
      { hex: '#F0F8FF', name: 'Alice Blue' },
      { hex: '#E6E6FA', name: 'Lavender' },
      { hex: '#FFFFFF', name: 'Pure White' },
      { hex: '#C0C0C0', name: 'Silver' },
    ],
    Garnet: [
      { hex: '#733635', name: 'Garnet' },
      { hex: '#8B0000', name: 'Dark Red' },
      { hex: '#A52A2A', name: 'Brown' },
      { hex: '#800020', name: 'Burgundy' },
      { hex: '#D2691E', name: 'Chocolate' },
    ],
    Turquoise: [
      { hex: '#30D5C8', name: 'Turquoise' },
      { hex: '#008080', name: 'Teal' },
      { hex: '#40E0D0', name: 'Turquoise Light' },
      { hex: '#7FFFD4', name: 'Aquamarine' },
      { hex: '#2F4F4F', name: 'Dark Slate' },
    ],
    Peridot: [
      { hex: '#B4C424', name: 'Peridot' },
      { hex: '#9ACD32', name: 'Yellow Green' },
      { hex: '#6B8E23', name: 'Olive Drab' },
      { hex: '#ADFF2F', name: 'Green Yellow' },
      { hex: '#556B2F', name: 'Dark Olive' },
    ],
  };

  function handleGenerate() {
    if (!selectedGemstone || !gemstones[selectedGemstone]) return;
    setOutput({ name: selectedGemstone, colors: gemstones[selectedGemstone] });
  }

  const copyText = output
    ? output.colors.map((c) => `${c.name}: ${c.hex}`).join('\n')
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-gemstone`} className="block text-sm font-medium text-gray-700 mb-1">
          Select Gemstone
        </label>
        <select
          id={`${toolId}-gemstone`}
          value={selectedGemstone}
          onChange={(e) => setSelectedGemstone(e.target.value)}
          className="input-field mb-3"
          aria-label={`Gemstone selection for ${toolName}`}
        >
          <option value="">-- Choose a gemstone --</option>
          {Object.keys(gemstones).map((gem) => (
            <option key={gem} value={gem}>{gem}</option>
          ))}
        </select>
        <button
          onClick={handleGenerate}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          disabled={!selectedGemstone}
        >
          Generate Palette
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              {output.name} Palette
            </label>
            <div className="grid grid-cols-5 gap-2">
              {output.colors.map((color, i) => (
                <div key={i} className="text-center">
                  <div
                    className="w-full h-16 rounded border border-gray-200"
                    style={{ backgroundColor: color.hex }}
                  />
                  <p className="text-xs mt-1 font-mono">{color.hex}</p>
                  <p className="text-xs text-gray-600">{color.name}</p>
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
