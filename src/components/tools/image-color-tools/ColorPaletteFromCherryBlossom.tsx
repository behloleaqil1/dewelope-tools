'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromCherryBlossom - Generate color palettes inspired by cherry blossoms.
 * Creates harmonious palettes based on sakura/cherry blossom color themes.
 */
export default function ColorPaletteFromCherryBlossom({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [paletteStyle, setPaletteStyle] = useState('classic');
  const [colorCount, setColorCount] = useState('6');
  const [output, setOutput] = useState<{ colors: { hex: string; name: string }[] } | null>(null);

  const palettes: Record<string, { hex: string; name: string }[]> = {
    classic: [
      { hex: '#FFB7C5', name: 'Sakura Pink' },
      { hex: '#FF69B4', name: 'Hot Pink Blossom' },
      { hex: '#FFC0CB', name: 'Petal Pink' },
      { hex: '#FADADD', name: 'Pale Blossom' },
      { hex: '#F8E8EE', name: 'Blossom White' },
      { hex: '#8B4513', name: 'Branch Brown' },
      { hex: '#228B22', name: 'Leaf Green' },
      { hex: '#FFE4E1', name: 'Misty Rose' },
    ],
    spring: [
      { hex: '#F9A8D4', name: 'Spring Bloom' },
      { hex: '#EC4899', name: 'Vivid Sakura' },
      { hex: '#FDE68A', name: 'Sunlit Petal' },
      { hex: '#A7F3D0', name: 'Fresh Leaf' },
      { hex: '#FBCFE8', name: 'Soft Blossom' },
      { hex: '#6EE7B7', name: 'Spring Green' },
      { hex: '#FDF2F8', name: 'Blossom Mist' },
      { hex: '#D946EF', name: 'Orchid Accent' },
    ],
    twilight: [
      { hex: '#BE185D', name: 'Dusk Sakura' },
      { hex: '#9D174D', name: 'Deep Rose' },
      { hex: '#831843', name: 'Night Blossom' },
      { hex: '#FBA4C4', name: 'Twilight Pink' },
      { hex: '#4C1D95', name: 'Evening Sky' },
      { hex: '#7C3AED', name: 'Purple Dusk' },
      { hex: '#F9A8D4', name: 'Fading Petal' },
      { hex: '#1E1B4B', name: 'Night Canopy' },
    ],
    watercolor: [
      { hex: '#FECDD3', name: 'Wash Pink' },
      { hex: '#FFE4E6', name: 'Diluted Rose' },
      { hex: '#FFF1F2', name: 'Paper White' },
      { hex: '#E8D5D3', name: 'Warm Wash' },
      { hex: '#D4C5C7', name: 'Grey Petal' },
      { hex: '#F5E6E8', name: 'Blush Wash' },
      { hex: '#FCE7F3', name: 'Light Sakura' },
      { hex: '#FBBF24', name: 'Gold Accent' },
    ],
  };

  const generate = () => {
    const count = Math.min(Math.max(parseInt(colorCount) || 4, 2), 8);
    const palette = palettes[paletteStyle] || palettes.classic;
    setOutput({ colors: palette.slice(0, count) });
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-style`} className="block text-sm font-medium text-gray-700 mb-1">Palette Style</label>
              <select id={`${toolId}-style`} value={paletteStyle} onChange={e => setPaletteStyle(e.target.value)} className="input-field" aria-label={`Palette style for ${toolName}`}>
                <option value="classic">Classic Sakura</option>
                <option value="spring">Spring Garden</option>
                <option value="twilight">Twilight Blossom</option>
                <option value="watercolor">Watercolor</option>
              </select>
            </div>
            <div>
              <label htmlFor={`${toolId}-count`} className="block text-sm font-medium text-gray-700 mb-1">Number of Colors (2-8)</label>
              <input id={`${toolId}-count`} type="number" min="2" max="8" value={colorCount} onChange={e => setColorCount(e.target.value)} className="input-field" aria-label="Number of colors" />
            </div>
          </div>
          <button onClick={generate} className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors min-h-[44px]">Generate Palette</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Cherry Blossom Palette</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {output.colors.map((color, i) => (
                <div key={i} className="text-center">
                  <div className="w-full h-20 rounded-lg border border-gray-200 shadow-sm" style={{ backgroundColor: color.hex }} />
                  <p className="text-xs font-medium text-gray-700 mt-1">{color.name}</p>
                  <p className="text-xs text-gray-500">{color.hex}</p>
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
