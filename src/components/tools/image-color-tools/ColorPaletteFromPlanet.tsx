'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromPlanet - Generate color palettes inspired by planets in our solar system.
 */
export default function ColorPaletteFromPlanet({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [selectedPlanet, setSelectedPlanet] = useState('');
  const [output, setOutput] = useState<{ name: string; colors: { hex: string; name: string }[] } | null>(null);

  const planetPalettes: Record<string, { hex: string; name: string }[]> = {
    Mercury: [
      { hex: '#8C7E6D', name: 'Crater Gray' },
      { hex: '#B5A898', name: 'Mercury Dust' },
      { hex: '#5C5347', name: 'Iron Core' },
      { hex: '#D4C5B3', name: 'Solar Bleach' },
      { hex: '#3D3630', name: 'Shadow Basin' },
    ],
    Venus: [
      { hex: '#E8C86A', name: 'Sulfuric Gold' },
      { hex: '#D4A03C', name: 'Venusian Amber' },
      { hex: '#F5E6B8', name: 'Cloud Cream' },
      { hex: '#8B6914', name: 'Volcanic Ochre' },
      { hex: '#C2956B', name: 'Atmosphere Haze' },
    ],
    Earth: [
      { hex: '#1E90FF', name: 'Ocean Blue' },
      { hex: '#228B22', name: 'Forest Green' },
      { hex: '#F5F5DC', name: 'Cloud White' },
      { hex: '#8B4513', name: 'Continental Brown' },
      { hex: '#87CEEB', name: 'Atmosphere Cyan' },
    ],
    Mars: [
      { hex: '#C1440E', name: 'Rust Red' },
      { hex: '#E77D3A', name: 'Martian Orange' },
      { hex: '#8B4513', name: 'Iron Oxide' },
      { hex: '#D2691E', name: 'Olympus Mons' },
      { hex: '#F4A460', name: 'Dust Storm' },
    ],
    Jupiter: [
      { hex: '#C88B3A', name: 'Gas Band Gold' },
      { hex: '#8B5E3C', name: 'Storm Brown' },
      { hex: '#E8D5A3', name: 'Ammonia Cream' },
      { hex: '#D4422A', name: 'Great Red Spot' },
      { hex: '#F5E1C0', name: 'Cloud Layer' },
    ],
    Saturn: [
      { hex: '#E8D68C', name: 'Ring Gold' },
      { hex: '#C4A35A', name: 'Saturn Tan' },
      { hex: '#F5ECD7', name: 'Ice Ring' },
      { hex: '#8B7D5B', name: 'Hydrogen Haze' },
      { hex: '#D4C49A', name: 'Cassini Band' },
    ],
    Uranus: [
      { hex: '#72B5C7', name: 'Methane Teal' },
      { hex: '#A8D8E8', name: 'Ice Giant Blue' },
      { hex: '#4A9BAF', name: 'Deep Atmosphere' },
      { hex: '#C5E8F0', name: 'Polar Frost' },
      { hex: '#2E7A8C', name: 'Uranian Dark' },
    ],
    Neptune: [
      { hex: '#3355AA', name: 'Neptune Blue' },
      { hex: '#5577CC', name: 'Storm Cobalt' },
      { hex: '#1A3366', name: 'Deep Blue' },
      { hex: '#7799DD', name: 'Wind Streak' },
      { hex: '#99BBEE', name: 'Triton Frost' },
    ],
  };

  function handleGenerate() {
    if (!selectedPlanet) return;
    const colors = planetPalettes[selectedPlanet];
    if (colors) {
      setOutput({ name: selectedPlanet, colors });
    }
  }

  const outputText = output
    ? output.colors.map((c) => `${c.hex} - ${c.name}`).join('\n')
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-planet`} className="block text-sm font-medium text-gray-700 mb-1">
          Select a Planet
        </label>
        <select
          id={`${toolId}-planet`}
          value={selectedPlanet}
          onChange={(e) => setSelectedPlanet(e.target.value)}
          aria-label={`Planet selection for ${toolName}`}
          className="input-field"
        >
          <option value="">-- Choose a planet --</option>
          {Object.keys(planetPalettes).map((planet) => (
            <option key={planet} value={planet}>{planet}</option>
          ))}
        </select>
        <button onClick={handleGenerate} className="btn-primary mt-2">
          Generate Palette
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">{output.name} Palette</label>
            <div className="grid grid-cols-5 gap-2">
              {output.colors.map((color) => (
                <div key={color.hex} className="text-center">
                  <div className="w-full h-16 rounded border" style={{ backgroundColor: color.hex }} />
                  <p className="text-xs font-mono mt-1">{color.hex}</p>
                  <p className="text-xs text-gray-600">{color.name}</p>
                </div>
              ))}
            </div>
            <CopyToClipboard text={outputText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
