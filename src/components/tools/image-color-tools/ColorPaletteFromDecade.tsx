'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromDecade - Generate color palettes inspired by different decades.
 * Includes iconic color combinations from the 60s, 70s, 80s, 90s, and 2000s.
 */
export default function ColorPaletteFromDecade({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [decade, setDecade] = useState<'60s' | '70s' | '80s' | '90s' | '2000s'>('80s');
  const [paletteSize, setPaletteSize] = useState('5');
  const [output, setOutput] = useState<string[]>([]);

  const decadePalettes: Record<string, { colors: string[]; description: string }> = {
    '60s': {
      colors: ['#FF6B35', '#F7C948', '#E8E8E8', '#7BC8A4', '#4ECDC4', '#2C3E50', '#E74C3C', '#F39C12', '#D35400', '#1ABC9C', '#8E44AD', '#2ECC71'],
      description: 'Psychedelic & Pop Art: Bold oranges, teals, and vibrant contrasts inspired by mod culture and flower power.',
    },
    '70s': {
      colors: ['#8B4513', '#D2691E', '#DAA520', '#F4A460', '#CD853F', '#556B2F', '#6B8E23', '#BDB76B', '#A0522D', '#DEB887', '#BC8F8F', '#F5DEB3'],
      description: 'Earth Tones & Harvest Gold: Warm browns, burnt oranges, avocado greens, and mustard yellows of the disco era.',
    },
    '80s': {
      colors: ['#FF00FF', '#00FFFF', '#FF1493', '#7B68EE', '#00FF00', '#FF4500', '#FFD700', '#9400D3', '#FF69B4', '#00CED1', '#FF6347', '#4169E1'],
      description: 'Neon & New Wave: Electric pinks, cyans, magentas, and bold neons inspired by synthwave and MTV culture.',
    },
    '90s': {
      colors: ['#008080', '#800080', '#FF00FF', '#C0C0C0', '#000080', '#808000', '#008000', '#4B0082', '#2F4F4F', '#696969', '#483D8B', '#556B2F'],
      description: 'Grunge & Minimalism: Deep teals, purples, muted tones, and the iconic Windows 95 palette.',
    },
    '2000s': {
      colors: ['#FF6600', '#3399FF', '#99CC00', '#CC0066', '#FFCC00', '#6633CC', '#00CCCC', '#FF3366', '#66CC33', '#0099FF', '#FF9900', '#9933FF'],
      description: 'Web 2.0 & Y2K: Glossy gradients, bright blues, lime greens, and the early internet aesthetic.',
    },
  };

  const generate = () => {
    const size = Math.min(Math.max(parseInt(paletteSize) || 5, 3), 8);
    const palette = decadePalettes[decade];
    const shuffled = [...palette.colors].sort(() => Math.random() - 0.5);
    setOutput(shuffled.slice(0, size));
  };

  const copyText = output.length > 0
    ? `${decade} Color Palette\n${decadePalettes[decade].description}\n\nColors:\n${output.join('\n')}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-decade`} className="block text-sm font-medium text-gray-700 mb-1">
          Select Decade
        </label>
        <select
          id={`${toolId}-decade`}
          value={decade}
          onChange={(e) => setDecade(e.target.value as '60s' | '70s' | '80s' | '90s' | '2000s')}
          aria-label={`Decade selection for ${toolName}`}
          className="input-field"
        >
          <option value="60s">1960s - Psychedelic & Pop Art</option>
          <option value="70s">1970s - Earth Tones & Disco</option>
          <option value="80s">1980s - Neon & New Wave</option>
          <option value="90s">1990s - Grunge & Minimalism</option>
          <option value="2000s">2000s - Web 2.0 & Y2K</option>
        </select>
      </InputArea>

      <InputArea>
        <label htmlFor={`${toolId}-size`} className="block text-sm font-medium text-gray-700 mb-1">
          Palette Size (3-8 colors)
        </label>
        <input
          id={`${toolId}-size`}
          type="text"
          inputMode="numeric"
          value={paletteSize}
          onChange={(e) => setPaletteSize(e.target.value)}
          placeholder="e.g., 5"
          aria-label={`Palette size for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <button onClick={generate} aria-label="Generate decade palette" className="btn-primary">
        Generate Palette
      </button>

      <OutputArea hasContent={output.length > 0}>
        {output.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">{decadePalettes[decade].description}</p>
            <div className="flex gap-2 flex-wrap">
              {output.map((color, i) => (
                <div key={i} className="text-center">
                  <div
                    className="w-16 h-16 rounded-lg border border-gray-200 shadow-sm"
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
