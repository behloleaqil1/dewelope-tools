'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromCrystal - Palettes inspired by crystals (amethyst, quartz, etc.)
 * Generates color palettes based on the natural colors found in various crystals and gemstones.
 */
export default function ColorPaletteFromCrystal({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [selectedCrystal, setSelectedCrystal] = useState('amethyst');
  const [output, setOutput] = useState<{ name: string; colors: { hex: string; name: string }[] } | null>(null);

  const crystalPalettes: Record<string, { name: string; colors: { hex: string; name: string }[] }> = {
    amethyst: {
      name: 'Amethyst',
      colors: [
        { hex: '#9B59B6', name: 'Deep Amethyst' },
        { hex: '#C39BD3', name: 'Light Amethyst' },
        { hex: '#7D3C98', name: 'Royal Purple' },
        { hex: '#E8DAEF', name: 'Pale Lavender' },
        { hex: '#4A235A', name: 'Dark Violet' },
      ],
    },
    'rose-quartz': {
      name: 'Rose Quartz',
      colors: [
        { hex: '#F5B7B1', name: 'Soft Rose' },
        { hex: '#FADBD8', name: 'Blush Pink' },
        { hex: '#E74C3C', name: 'Deep Rose' },
        { hex: '#F9EBEA', name: 'Pale Rose' },
        { hex: '#CD6155', name: 'Dusty Rose' },
      ],
    },
    citrine: {
      name: 'Citrine',
      colors: [
        { hex: '#F39C12', name: 'Golden Citrine' },
        { hex: '#F7DC6F', name: 'Light Citrine' },
        { hex: '#D4AC0D', name: 'Deep Gold' },
        { hex: '#FEF9E7', name: 'Pale Yellow' },
        { hex: '#B7950B', name: 'Amber' },
      ],
    },
    emerald: {
      name: 'Emerald',
      colors: [
        { hex: '#27AE60', name: 'Emerald Green' },
        { hex: '#82E0AA', name: 'Light Emerald' },
        { hex: '#1E8449', name: 'Deep Emerald' },
        { hex: '#D5F5E3', name: 'Pale Green' },
        { hex: '#145A32', name: 'Dark Forest' },
      ],
    },
    sapphire: {
      name: 'Sapphire',
      colors: [
        { hex: '#2E86C1', name: 'Royal Sapphire' },
        { hex: '#85C1E9', name: 'Light Sapphire' },
        { hex: '#1B4F72', name: 'Deep Blue' },
        { hex: '#D6EAF8', name: 'Ice Blue' },
        { hex: '#21618C', name: 'Midnight Sapphire' },
      ],
    },
    obsidian: {
      name: 'Obsidian',
      colors: [
        { hex: '#1C2833', name: 'Obsidian Black' },
        { hex: '#566573', name: 'Volcanic Gray' },
        { hex: '#2C3E50', name: 'Dark Slate' },
        { hex: '#ABB2B9', name: 'Silver Sheen' },
        { hex: '#17202A', name: 'Deep Obsidian' },
      ],
    },
    opal: {
      name: 'Opal',
      colors: [
        { hex: '#AED6F1', name: 'Opal Blue' },
        { hex: '#F9E79F', name: 'Fire Opal' },
        { hex: '#D2B4DE', name: 'Opal Violet' },
        { hex: '#A3E4D7', name: 'Opal Green' },
        { hex: '#FADBD8', name: 'Opal Pink' },
      ],
    },
    turquoise: {
      name: 'Turquoise',
      colors: [
        { hex: '#1ABC9C', name: 'Turquoise' },
        { hex: '#76D7C4', name: 'Light Turquoise' },
        { hex: '#148F77', name: 'Deep Turquoise' },
        { hex: '#D1F2EB', name: 'Pale Aqua' },
        { hex: '#0E6655', name: 'Dark Teal' },
      ],
    },
  };

  const generate = () => {
    const palette = crystalPalettes[selectedCrystal];
    if (palette) {
      setOutput(palette);
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-crystal`} className="block text-sm font-medium text-gray-700 mb-1">
          Select Crystal
        </label>
        <select
          id={`${toolId}-crystal`}
          value={selectedCrystal}
          onChange={(e) => setSelectedCrystal(e.target.value)}
          className="input-field"
          aria-label={`Crystal selection for ${toolName}`}
        >
          {Object.entries(crystalPalettes).map(([key, val]) => (
            <option key={key} value={key}>{val.name}</option>
          ))}
        </select>

        <button
          onClick={generate}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
              {output.colors.map((color, idx) => (
                <div key={idx} className="text-center">
                  <div
                    className="w-full h-16 rounded-lg border border-gray-200"
                    style={{ backgroundColor: color.hex }}
                  />
                  <p className="text-xs font-mono mt-1 text-gray-700">{color.hex}</p>
                  <p className="text-xs text-gray-500">{color.name}</p>
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
