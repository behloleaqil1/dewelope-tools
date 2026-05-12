'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromGlass - Generate color palettes inspired by stained glass art.
 * Includes Gothic Cathedral, Art Nouveau, Tiffany, Medieval, Modern Abstract, and Rose Window styles.
 */

const GLASS_PALETTES: Record<string, { name: string; colors: { hex: string; name: string }[] }> = {
  gothic: {
    name: 'Gothic Cathedral',
    colors: [
      { hex: '#1B3A6B', name: 'Cathedral Blue' },
      { hex: '#8B1A2D', name: 'Ruby Red' },
      { hex: '#D4AF37', name: 'Gold Leaf' },
      { hex: '#2E5A3A', name: 'Forest Emerald' },
      { hex: '#4A1A6B', name: 'Royal Purple' },
    ],
  },
  artNouveau: {
    name: 'Art Nouveau',
    colors: [
      { hex: '#5B8C5A', name: 'Sage Green' },
      { hex: '#E8A838', name: 'Amber Glow' },
      { hex: '#7B4B94', name: 'Wisteria' },
      { hex: '#C75B39', name: 'Burnt Sienna' },
      { hex: '#2C6E8A', name: 'Peacock Blue' },
    ],
  },
  tiffany: {
    name: 'Tiffany Style',
    colors: [
      { hex: '#4ECDC4', name: 'Opalescent Teal' },
      { hex: '#FF6B6B', name: 'Cranberry Glass' },
      { hex: '#95E1D3', name: 'Sea Foam' },
      { hex: '#F38181', name: 'Rose Petal' },
      { hex: '#AA96DA', name: 'Lavender Opal' },
    ],
  },
  medieval: {
    name: 'Medieval',
    colors: [
      { hex: '#1E3A5F', name: 'Cobalt Deep' },
      { hex: '#C41E3A', name: 'Crimson Glass' },
      { hex: '#FFD700', name: 'Gilded Yellow' },
      { hex: '#228B22', name: 'Verdant Green' },
      { hex: '#F5F5DC', name: 'Ivory Light' },
    ],
  },
  modern: {
    name: 'Modern Abstract',
    colors: [
      { hex: '#FF4500', name: 'Flame Orange' },
      { hex: '#00CED1', name: 'Turquoise Shard' },
      { hex: '#9400D3', name: 'Violet Prism' },
      { hex: '#32CD32', name: 'Lime Fragment' },
      { hex: '#FF1493', name: 'Fuchsia Panel' },
    ],
  },
  roseWindow: {
    name: 'Rose Window',
    colors: [
      { hex: '#4169E1', name: 'Royal Blue' },
      { hex: '#DC143C', name: 'Crimson Rose' },
      { hex: '#DAA520', name: 'Goldenrod' },
      { hex: '#483D8B', name: 'Dark Slate Blue' },
      { hex: '#B22222', name: 'Firebrick' },
    ],
  },
};

export default function ColorPaletteFromGlass({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [selectedStyle, setSelectedStyle] = useState('gothic');
  const [output, setOutput] = useState('');
  const [palette, setPalette] = useState<{ hex: string; name: string }[] | null>(null);

  const generate = () => {
    const style = GLASS_PALETTES[selectedStyle];
    if (!style) return;

    setPalette(style.colors);

    let result = `=== ${style.name} Stained Glass Palette ===\n\n`;
    style.colors.forEach((color, i) => {
      result += `${i + 1}. ${color.name}: ${color.hex}\n`;
    });
    result += `\nCSS Variables:\n`;
    style.colors.forEach((color, i) => {
      result += `  --glass-${i + 1}: ${color.hex};\n`;
    });

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-style`} className="block text-sm font-medium text-gray-700 mb-1">
          Stained Glass Style
        </label>
        <select
          id={`${toolId}-style`}
          value={selectedStyle}
          onChange={(e) => setSelectedStyle(e.target.value)}
          aria-label={`Glass style for ${toolName}`}
          className="input-field"
        >
          {Object.entries(GLASS_PALETTES).map(([key, val]) => (
            <option key={key} value={key}>{val.name}</option>
          ))}
        </select>
        <button
          onClick={generate}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Generate Palette
        </button>
      </InputArea>

      <OutputArea hasContent={!!palette}>
        {palette && (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Stained Glass Palette</label>
            <div className="flex gap-2 flex-wrap">
              {palette.map((color, i) => (
                <div key={i} className="text-center">
                  <div
                    className="w-16 h-16 rounded-md border border-gray-200 shadow-sm"
                    style={{ backgroundColor: color.hex }}
                    title={`${color.name}: ${color.hex}`}
                  />
                  <p className="text-xs text-gray-600 mt-1">{color.hex}</p>
                  <p className="text-xs text-gray-500">{color.name}</p>
                </div>
              ))}
            </div>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-md">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
