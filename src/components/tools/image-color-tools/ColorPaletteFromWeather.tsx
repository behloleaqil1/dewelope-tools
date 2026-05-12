'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromWeather - Generate color palettes inspired by weather conditions.
 * Supports sunny, rainy, stormy, foggy, snowy, and more.
 */
export default function ColorPaletteFromWeather({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [weather, setWeather] = useState('sunny');
  const [palette, setPalette] = useState<{ name: string; hex: string }[]>([]);

  const weatherPalettes: Record<string, { name: string; hex: string }[]> = {
    sunny: [
      { name: 'Golden Sun', hex: '#FFD700' },
      { name: 'Clear Sky', hex: '#87CEEB' },
      { name: 'Warm Sand', hex: '#F4E4C1' },
      { name: 'Sunflower', hex: '#FFA500' },
      { name: 'Bright Day', hex: '#FFFACD' },
    ],
    rainy: [
      { name: 'Storm Cloud', hex: '#708090' },
      { name: 'Wet Slate', hex: '#4A5568' },
      { name: 'Rain Drop', hex: '#A4C8E1' },
      { name: 'Puddle', hex: '#6B8E9F' },
      { name: 'Overcast', hex: '#B0BEC5' },
    ],
    stormy: [
      { name: 'Thunder', hex: '#2C3E50' },
      { name: 'Lightning', hex: '#F1C40F' },
      { name: 'Dark Cloud', hex: '#1A1A2E' },
      { name: 'Electric', hex: '#9B59B6' },
      { name: 'Charcoal', hex: '#34495E' },
    ],
    foggy: [
      { name: 'Mist', hex: '#D3D3D3' },
      { name: 'Haze', hex: '#E8E8E8' },
      { name: 'Soft Gray', hex: '#C0C0C0' },
      { name: 'Pearl', hex: '#F5F5F5' },
      { name: 'Dove', hex: '#A9A9A9' },
    ],
    snowy: [
      { name: 'Fresh Snow', hex: '#FFFAFA' },
      { name: 'Ice Blue', hex: '#B0E0E6' },
      { name: 'Frost', hex: '#E0F7FA' },
      { name: 'Winter Sky', hex: '#778899' },
      { name: 'Glacier', hex: '#E8F4FD' },
    ],
    sunset: [
      { name: 'Coral', hex: '#FF6B6B' },
      { name: 'Amber', hex: '#FF8E53' },
      { name: 'Dusk Purple', hex: '#7C3AED' },
      { name: 'Rose Gold', hex: '#E8A87C' },
      { name: 'Twilight', hex: '#2D1B69' },
    ],
  };

  const generate = () => {
    setPalette(weatherPalettes[weather] || weatherPalettes.sunny);
  };

  const paletteText = palette.map((c) => `${c.name}: ${c.hex}`).join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-weather`} className="block text-sm font-medium text-gray-700 mb-1">
          Weather Condition
        </label>
        <select
          id={`${toolId}-weather`}
          value={weather}
          onChange={(e) => setWeather(e.target.value)}
          aria-label={`Weather selection for ${toolName}`}
          className="input-field mb-3"
        >
          <option value="sunny">☀️ Sunny</option>
          <option value="rainy">🌧️ Rainy</option>
          <option value="stormy">⛈️ Stormy</option>
          <option value="foggy">🌫️ Foggy</option>
          <option value="snowy">❄️ Snowy</option>
          <option value="sunset">🌅 Sunset</option>
        </select>
        <button onClick={generate} className="btn-primary">
          Generate Palette
        </button>
      </InputArea>

      <OutputArea hasContent={palette.length > 0}>
        {palette.length > 0 && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Weather Palette</label>
            <div className="grid grid-cols-5 gap-2">
              {palette.map((color, i) => (
                <div key={i} className="text-center">
                  <div
                    className="w-full h-16 rounded border border-gray-200"
                    style={{ backgroundColor: color.hex }}
                  />
                  <p className="text-xs mt-1 font-medium text-gray-700">{color.name}</p>
                  <p className="text-xs text-gray-500 font-mono">{color.hex}</p>
                </div>
              ))}
            </div>
            <CopyToClipboard text={paletteText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
