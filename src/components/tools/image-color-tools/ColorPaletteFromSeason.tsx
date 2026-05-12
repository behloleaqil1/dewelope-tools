'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromSeason - Generate color palettes based on seasons.
 * Creates harmonious palettes inspired by spring, summer, fall, and winter.
 */
export default function ColorPaletteFromSeason({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [season, setSeason] = useState<'spring' | 'summer' | 'fall' | 'winter'>('spring');
  const [paletteSize, setPaletteSize] = useState(5);
  const [palette, setPalette] = useState<string[]>([]);

  const seasonPalettes: Record<string, { colors: string[]; description: string }> = {
    spring: {
      colors: ['#F8BBD0', '#C8E6C9', '#FFF9C4', '#B3E5FC', '#E1BEE7', '#DCEDC8', '#FFE0B2', '#B2DFDB', '#F0F4C3', '#FFCCBC', '#D1C4E9', '#C5E1A5', '#FFECB3', '#80DEEA', '#F8BBD0'],
      description: 'Fresh pastels, soft greens, cherry blossoms, and new growth',
    },
    summer: {
      colors: ['#FF7043', '#FFCA28', '#26C6DA', '#66BB6A', '#AB47BC', '#FFA726', '#42A5F5', '#EF5350', '#FFEE58', '#26A69A', '#EC407A', '#29B6F6', '#FF7043', '#9CCC65', '#7E57C2'],
      description: 'Vibrant, warm, tropical hues with bright sunshine tones',
    },
    fall: {
      colors: ['#BF360C', '#E65100', '#F57F17', '#827717', '#4E342E', '#D84315', '#FF8F00', '#9E9D24', '#5D4037', '#E64A19', '#FF6F00', '#33691E', '#3E2723', '#F4511E', '#795548'],
      description: 'Warm earth tones, burnt oranges, deep reds, and golden yellows',
    },
    winter: {
      colors: ['#E3F2FD', '#90CAF9', '#546E7A', '#B0BEC5', '#263238', '#ECEFF1', '#78909C', '#455A64', '#CFD8DC', '#37474F', '#E0E0E0', '#607D8B', '#1B5E20', '#B71C1C', '#FAFAFA'],
      description: 'Cool blues, icy whites, deep grays, and evergreen accents',
    },
  };

  const generate = () => {
    const seasonData = seasonPalettes[season];
    const shuffled = [...seasonData.colors].sort(() => Math.random() - 0.5);
    setPalette(shuffled.slice(0, paletteSize));
  };

  const copyText = palette.length > 0
    ? `${season.charAt(0).toUpperCase() + season.slice(1)} Palette:\n${palette.join('\n')}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-season`} className="block text-sm font-medium text-gray-700 mb-1">
          Select Season
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(['spring', 'summer', 'fall', 'winter'] as const).map(s => (
            <button
              key={s}
              onClick={() => setSeason(s)}
              className={`px-4 py-3 rounded-lg text-sm font-medium border-2 transition-colors ${
                season === s
                  ? s === 'spring' ? 'border-pink-400 bg-pink-50 text-pink-700'
                  : s === 'summer' ? 'border-orange-400 bg-orange-50 text-orange-700'
                  : s === 'fall' ? 'border-amber-600 bg-amber-50 text-amber-800'
                  : 'border-blue-400 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}
              aria-label={`Select ${s}`}
            >
              {s === 'spring' ? '🌸' : s === 'summer' ? '☀️' : s === 'fall' ? '🍂' : '❄️'} {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">{seasonPalettes[season].description}</p>
      </InputArea>

      <InputArea>
        <label htmlFor={`${toolId}-size`} className="block text-sm font-medium text-gray-700 mb-1">
          Palette Size: {paletteSize} colors
        </label>
        <input
          id={`${toolId}-size`}
          type="range"
          min={3}
          max={8}
          value={paletteSize}
          onChange={(e) => setPaletteSize(parseInt(e.target.value))}
          aria-label={`Palette size for ${toolName}`}
          className="w-full"
        />
      </InputArea>

      <button onClick={generate} aria-label="Generate seasonal palette" className="btn-primary">
        Generate Palette
      </button>

      <OutputArea hasContent={palette.length > 0}>
        {palette.length > 0 && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              {season.charAt(0).toUpperCase() + season.slice(1)} Palette
            </label>
            <div className="flex gap-2 flex-wrap">
              {palette.map((color, i) => (
                <div key={i} className="text-center">
                  <div
                    className="w-16 h-16 rounded-lg border border-gray-200 shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs font-mono text-gray-600 mt-1 block">{color}</span>
                </div>
              ))}
            </div>
            <div className="flex h-12 rounded-lg overflow-hidden border border-gray-200">
              {palette.map((color, i) => (
                <div key={i} className="flex-1" style={{ backgroundColor: color }} />
              ))}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
