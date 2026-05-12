'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromCountry - Generate color palettes inspired by country flags and culture.
 * Includes flag colors and culturally significant tones for various countries.
 */
export default function ColorPaletteFromCountry({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [country, setCountry] = useState('japan');
  const [paletteSize, setPaletteSize] = useState('5');
  const [output, setOutput] = useState<string[]>([]);

  const countryPalettes: Record<string, { colors: string[]; description: string }> = {
    japan: {
      colors: ['#BC002D', '#FFFFFF', '#2D0A31', '#E8D5B7', '#5B8C5A', '#D4A574', '#1B1B1B', '#F0C14B', '#8B4513', '#C41E3A'],
      description: 'Japan: Rising sun red and white, with cherry blossom pink, matcha green, and traditional indigo.',
    },
    france: {
      colors: ['#002395', '#FFFFFF', '#ED2939', '#1E3A5F', '#C8B560', '#4A0E4E', '#F5E6CC', '#8B0000', '#2F4F4F', '#D4AF37'],
      description: 'France: Tricolore blue, white, and red, with Parisian gold, lavender purple, and champagne tones.',
    },
    india: {
      colors: ['#FF9933', '#FFFFFF', '#138808', '#000080', '#FF6600', '#800020', '#FFD700', '#4B0082', '#DC143C', '#228B22'],
      description: 'India: Saffron, white, and green with Ashoka blue, marigold gold, and rich jewel tones.',
    },
    brazil: {
      colors: ['#009C3B', '#FFDF00', '#002776', '#FFFFFF', '#00A859', '#FFB800', '#1C39BB', '#2E8B57', '#DAA520', '#4169E1'],
      description: 'Brazil: Vibrant green, canary yellow, and deep blue with tropical and carnival-inspired hues.',
    },
    mexico: {
      colors: ['#006847', '#FFFFFF', '#CE1126', '#8B4513', '#FFD700', '#FF6347', '#2E8B57', '#D2691E', '#FF4500', '#1E90FF'],
      description: 'Mexico: Flag green, white, and red with terracotta, marigold gold, and vibrant folk art colors.',
    },
    italy: {
      colors: ['#009246', '#FFFFFF', '#CE2B37', '#F5DEB3', '#8B4513', '#DAA520', '#556B2F', '#800020', '#D2B48C', '#4682B4'],
      description: 'Italy: Green, white, and red with Tuscan terracotta, olive, Renaissance gold, and Mediterranean blue.',
    },
    morocco: {
      colors: ['#C1272D', '#006233', '#E8A317', '#1E4D8C', '#F5DEB3', '#8B4513', '#CD853F', '#2F4F4F', '#FF8C00', '#4169E1'],
      description: 'Morocco: Rich red and green with desert sand, cobalt blue, saffron, and warm terracotta.',
    },
    sweden: {
      colors: ['#006AA7', '#FECC00', '#1B365D', '#FFFFFF', '#4A90D9', '#2E8B57', '#87CEEB', '#F0E68C', '#708090', '#B0C4DE'],
      description: 'Sweden: Royal blue and golden yellow with Nordic sky blue, forest green, and cool Scandinavian tones.',
    },
    egypt: {
      colors: ['#CE1126', '#FFFFFF', '#000000', '#C09853', '#DAA520', '#8B4513', '#F5DEB3', '#1E90FF', '#CD853F', '#2F4F4F'],
      description: 'Egypt: Flag red, white, and black with pharaonic gold, desert sand, Nile blue, and ancient stone.',
    },
    greece: {
      colors: ['#0D5EAF', '#FFFFFF', '#1E90FF', '#87CEEB', '#F5F5DC', '#D4AF37', '#4682B4', '#FFFFF0', '#6495ED', '#B8860B'],
      description: 'Greece: Aegean blue and white with Mediterranean azure, marble ivory, and olive gold.',
    },
  };

  const countries = Object.keys(countryPalettes);

  const generate = () => {
    const size = Math.min(Math.max(parseInt(paletteSize) || 5, 3), 8);
    const palette = countryPalettes[country];
    const shuffled = [...palette.colors].sort(() => Math.random() - 0.5);
    setOutput(shuffled.slice(0, size));
  };

  const copyText = output.length > 0
    ? `${country.charAt(0).toUpperCase() + country.slice(1)} Color Palette\n${countryPalettes[country].description}\n\nColors:\n${output.join('\n')}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-country`} className="block text-sm font-medium text-gray-700 mb-1">
          Select Country
        </label>
        <select
          id={`${toolId}-country`}
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          aria-label={`Country selection for ${toolName}`}
          className="input-field"
        >
          {countries.map((c) => (
            <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
          ))}
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

      <button onClick={generate} aria-label="Generate country palette" className="btn-primary">
        Generate Palette
      </button>

      <OutputArea hasContent={output.length > 0}>
        {output.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">{countryPalettes[country].description}</p>
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
