'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * WinterColorGenerator - Generate winter/ice-themed color palettes
 * with cool blues, silvers, whites, and frosty tones.
 */
export default function WinterColorGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [paletteSize, setPaletteSize] = useState('5');
  const [style, setStyle] = useState<'frost' | 'arctic' | 'midnight' | 'snowfall'>('frost');
  const [palette, setPalette] = useState<{ hex: string; name: string }[]>([]);

  const winterPalettes: Record<string, { hex: string; name: string }[]> = {
    frost: [
      { hex: '#E8F4FD', name: 'Frost White' },
      { hex: '#B8D4E3', name: 'Ice Blue' },
      { hex: '#7FB3D3', name: 'Frozen Lake' },
      { hex: '#4A90B8', name: 'Winter Sky' },
      { hex: '#2C6E91', name: 'Deep Frost' },
      { hex: '#D6EAF8', name: 'Snow Mist' },
      { hex: '#A3CCE9', name: 'Glacier' },
      { hex: '#5DADE2', name: 'Crystal Blue' },
    ],
    arctic: [
      { hex: '#F0F8FF', name: 'Arctic White' },
      { hex: '#C8E6F5', name: 'Polar Ice' },
      { hex: '#89CFF0', name: 'Arctic Blue' },
      { hex: '#4FB3D9', name: 'Tundra' },
      { hex: '#1B7FA6', name: 'Deep Arctic' },
      { hex: '#E0F0F9', name: 'Snowdrift' },
      { hex: '#A8D8EA', name: 'Icicle' },
      { hex: '#3498DB', name: 'Northern Sea' },
    ],
    midnight: [
      { hex: '#1B2838', name: 'Midnight Blue' },
      { hex: '#2C3E50', name: 'Winter Night' },
      { hex: '#34495E', name: 'Dark Slate' },
      { hex: '#5D6D7E', name: 'Storm Cloud' },
      { hex: '#85929E', name: 'Silver Frost' },
      { hex: '#AEB6BF', name: 'Moonlit Snow' },
      { hex: '#D5D8DC', name: 'Pale Moon' },
      { hex: '#192A3E', name: 'Deep Night' },
    ],
    snowfall: [
      { hex: '#FFFFFF', name: 'Pure Snow' },
      { hex: '#F5F6FA', name: 'Fresh Snow' },
      { hex: '#DFE6E9', name: 'Snowflake' },
      { hex: '#B2BEC3', name: 'Sleet' },
      { hex: '#636E72', name: 'Charcoal Ice' },
      { hex: '#E8ECEF', name: 'Powder' },
      { hex: '#CCD1D9', name: 'Silver' },
      { hex: '#A4B0BE', name: 'Frozen Mist' },
    ],
  };

  const generate = () => {
    const size = Math.min(Math.max(parseInt(paletteSize) || 5, 3), 8);
    const source = winterPalettes[style];
    const shuffled = [...source].sort(() => Math.random() - 0.5);
    setPalette(shuffled.slice(0, size));
  };

  const copyText = palette.map(c => `${c.name}: ${c.hex}`).join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-style`} className="block text-sm font-medium text-gray-700 mb-1">
            Winter Style
          </label>
          <select
            id={`${toolId}-style`}
            value={style}
            onChange={(e) => setStyle(e.target.value as typeof style)}
            aria-label={`Style for ${toolName}`}
            className="input-field"
          >
            <option value="frost">Frost</option>
            <option value="arctic">Arctic</option>
            <option value="midnight">Midnight Winter</option>
            <option value="snowfall">Snowfall</option>
          </select>
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-size`} className="block text-sm font-medium text-gray-700 mb-1">
            Palette Size (3-8)
          </label>
          <input
            id={`${toolId}-size`}
            type="number"
            min="3"
            max="8"
            value={paletteSize}
            onChange={(e) => setPaletteSize(e.target.value)}
            aria-label={`Palette size for ${toolName}`}
            className="input-field"
          />
        </InputArea>
      </div>

      <button onClick={generate} aria-label="Generate palette" className="btn-primary">
        Generate Winter Palette
      </button>

      <OutputArea hasContent={palette.length > 0}>
        {palette.length > 0 && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {palette.map((color, i) => (
                <div key={i} className="text-center">
                  <div
                    className="w-full h-20 rounded-lg border border-gray-200 shadow-sm"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="text-xs font-medium text-gray-700 mt-1">{color.name}</div>
                  <div className="text-xs font-mono text-gray-500">{color.hex}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-1 h-12 rounded-lg overflow-hidden border border-gray-200">
              {palette.map((color, i) => (
                <div key={i} className="flex-1" style={{ backgroundColor: color.hex }} />
              ))}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
