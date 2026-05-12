'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromConstellation - Generate color palettes inspired by constellations.
 * Each constellation has a curated set of 5 colors inspired by its mythology and star colors.
 */
export default function ColorPaletteFromConstellation({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [selectedConstellation, setSelectedConstellation] = useState('orion');
  const [output, setOutput] = useState<{ name: string; colors: { hex: string; name: string }[] } | null>(null);

  const constellations: Record<string, { name: string; colors: { hex: string; name: string }[] }> = {
    orion: {
      name: 'Orion (The Hunter)',
      colors: [
        { hex: '#1B1464', name: 'Deep Night Sky' },
        { hex: '#E8D5B7', name: 'Betelgeuse Glow' },
        { hex: '#7EC8E3', name: 'Rigel Blue' },
        { hex: '#C9A96E', name: 'Belt Gold' },
        { hex: '#2C3E50', name: 'Nebula Shadow' },
      ],
    },
    cassiopeia: {
      name: 'Cassiopeia (The Queen)',
      colors: [
        { hex: '#4A0E4E', name: 'Royal Purple' },
        { hex: '#FFD700', name: 'Crown Gold' },
        { hex: '#E8E8E8', name: 'Starlight Silver' },
        { hex: '#8B1A4A', name: 'Throne Crimson' },
        { hex: '#1A1A2E', name: 'Celestial Dark' },
      ],
    },
    ursa_major: {
      name: 'Ursa Major (Great Bear)',
      colors: [
        { hex: '#2D4A3E', name: 'Forest Night' },
        { hex: '#A0C4B8', name: 'Polar Ice' },
        { hex: '#5C4033', name: 'Bear Brown' },
        { hex: '#F5E6D3', name: 'Starlit Cream' },
        { hex: '#1E3A5F', name: 'Northern Sky' },
      ],
    },
    scorpius: {
      name: 'Scorpius (The Scorpion)',
      colors: [
        { hex: '#8B0000', name: 'Antares Red' },
        { hex: '#FF6B35', name: 'Scorpion Fire' },
        { hex: '#2C1810', name: 'Desert Night' },
        { hex: '#FFB347', name: 'Tail Amber' },
        { hex: '#4A1C2C', name: 'Venom Dark' },
      ],
    },
    lyra: {
      name: 'Lyra (The Lyre)',
      colors: [
        { hex: '#E6E6FA', name: 'Vega White' },
        { hex: '#9B59B6', name: 'Harmonic Violet' },
        { hex: '#3498DB', name: 'String Blue' },
        { hex: '#F39C12', name: 'Golden Note' },
        { hex: '#1A1A3E', name: 'Music Night' },
      ],
    },
    cygnus: {
      name: 'Cygnus (The Swan)',
      colors: [
        { hex: '#F8F8FF', name: 'Swan White' },
        { hex: '#87CEEB', name: 'Sky Lake' },
        { hex: '#2E4057', name: 'Wing Shadow' },
        { hex: '#B8D4E3', name: 'Feather Mist' },
        { hex: '#1B2838', name: 'Night Flight' },
      ],
    },
    leo: {
      name: 'Leo (The Lion)',
      colors: [
        { hex: '#DAA520', name: 'Regulus Gold' },
        { hex: '#8B4513', name: 'Mane Brown' },
        { hex: '#FF8C00', name: 'Lion Fire' },
        { hex: '#FFF8DC', name: 'Savanna Light' },
        { hex: '#2C1810', name: 'Pride Dark' },
      ],
    },
    aquarius: {
      name: 'Aquarius (Water Bearer)',
      colors: [
        { hex: '#00CED1', name: 'Water Flow' },
        { hex: '#1E90FF', name: 'Stream Blue' },
        { hex: '#E0FFFF', name: 'Aqua Mist' },
        { hex: '#2F4F4F', name: 'Deep Current' },
        { hex: '#7FFFD4', name: 'Spring Teal' },
      ],
    },
  };

  const generate = () => {
    const constellation = constellations[selectedConstellation];
    if (constellation) {
      setOutput(constellation);
    }
  };

  const copyText = output
    ? `${output.name}\n${output.colors.map(c => `${c.hex} - ${c.name}`).join('\n')}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-constellation`} className="block text-sm font-medium text-gray-700 mb-1">
          Select Constellation
        </label>
        <select
          id={`${toolId}-constellation`}
          value={selectedConstellation}
          onChange={(e) => setSelectedConstellation(e.target.value)}
          aria-label={`Constellation selection for ${toolName}`}
          className="input-field"
        >
          {Object.entries(constellations).map(([key, val]) => (
            <option key={key} value={key}>{val.name}</option>
          ))}
        </select>

        <button
          onClick={generate}
          className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
        >
          Generate Palette
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">{output.name}</label>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {output.colors.map((color, i) => (
                <div key={i} className="text-center">
                  <div
                    className="w-full h-20 rounded-lg border border-gray-200 mb-1"
                    style={{ backgroundColor: color.hex }}
                  />
                  <p className="text-xs font-mono text-gray-700">{color.hex}</p>
                  <p className="text-xs text-gray-500">{color.name}</p>
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
