'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * VintageColorGenerator - Generate vintage/retro color palettes.
 * Creates muted, warm-toned palettes inspired by vintage aesthetics.
 */
export default function VintageColorGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [count, setCount] = useState('6');
  const [style, setStyle] = useState<'70s' | '50s' | 'sepia' | 'faded'>('70s');
  const [colors, setColors] = useState<string[]>([]);

  const vintagePalettes = {
    '70s': [
      '#C75B12', '#D4A03C', '#8B6914', '#5C4033', '#A0522D',
      '#CD853F', '#DAA520', '#B8860B', '#D2691E', '#CC7722',
      '#E8A317', '#C19A6B', '#6B4423', '#8B4513', '#A0785A',
      '#D2B48C', '#F4A460', '#DEB887', '#BC8F8F', '#CD5C5C',
    ],
    '50s': [
      '#87CEEB', '#FFB6C1', '#98FB98', '#FFDAB9', '#E6E6FA',
      '#F0E68C', '#DDA0DD', '#B0E0E6', '#FFC0CB', '#AFEEEE',
      '#F5DEB3', '#FFE4E1', '#E0FFFF', '#FAFAD2', '#D8BFD8',
      '#FFFACD', '#F0FFF0', '#FFF0F5', '#F5F5DC', '#FFEFD5',
    ],
    sepia: [
      '#704214', '#8B6914', '#A0522D', '#6B4423', '#5C4033',
      '#8B4513', '#A0785A', '#C19A6B', '#D2B48C', '#DEB887',
      '#F5DEB3', '#FAEBD7', '#D2691E', '#CD853F', '#BC8F8F',
      '#A52A2A', '#800000', '#654321', '#3B2F2F', '#4A3728',
    ],
    faded: [
      '#B5C7B0', '#C4A882', '#D4B896', '#A8B5A0', '#C9B8A0',
      '#B0A090', '#A0B0A0', '#C0B0A0', '#D0C0B0', '#B8A898',
      '#A8B8A8', '#C8B8A8', '#D8C8B8', '#B0A0B0', '#C0B0C0',
      '#A0A0B0', '#B0B0C0', '#C0C0D0', '#D0D0E0', '#E0E0F0',
    ],
  };

  const generate = () => {
    const num = Math.min(Math.max(parseInt(count) || 6, 1), 12);
    const palette = vintagePalettes[style];
    const shuffled = [...palette].sort(() => Math.random() - 0.5);
    setColors(shuffled.slice(0, num));
  };

  const copyText = colors.join(', ');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${toolId}-count`} className="block text-sm font-medium text-gray-700 mb-1">
              Number of Colors
            </label>
            <input
              id={`${toolId}-count`}
              type="number"
              min="1"
              max="12"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              aria-label={`Number of colors for ${toolName}`}
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-style`} className="block text-sm font-medium text-gray-700 mb-1">
              Vintage Style
            </label>
            <select
              id={`${toolId}-style`}
              value={style}
              onChange={(e) => setStyle(e.target.value as '70s' | '50s' | 'sepia' | 'faded')}
              aria-label="Vintage style"
              className="input-field"
            >
              <option value="70s">1970s Retro</option>
              <option value="50s">1950s Pastel</option>
              <option value="sepia">Sepia Tones</option>
              <option value="faded">Faded Vintage</option>
            </select>
          </div>
        </div>
      </InputArea>

      <button onClick={generate} aria-label="Generate vintage palette" className="btn-primary">
        Generate Vintage Palette
      </button>

      <OutputArea hasContent={colors.length > 0}>
        {colors.length > 0 && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Vintage Color Palette</label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {colors.map((color, i) => (
                <div key={i} className="text-center">
                  <div
                    className="w-full h-16 rounded-lg border border-gray-200 shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs font-mono text-gray-600 mt-1 block">{color}</span>
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
