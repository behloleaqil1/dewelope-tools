'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

interface PaletteColor {
  name: string;
  hex: string;
}

interface OceanZone {
  name: string;
  depth: string;
  colors: PaletteColor[];
}

const OCEAN_ZONES: OceanZone[] = [
  {
    name: 'Sunlight Zone (Epipelagic)',
    depth: '0–200m',
    colors: [
      { name: 'Surface Sparkle', hex: '#7FDBFF' },
      { name: 'Tropical Aqua', hex: '#39CCCC' },
      { name: 'Coral Reef', hex: '#FF6B6B' },
      { name: 'Sandy Shore', hex: '#F5E6D3' },
      { name: 'Sea Foam', hex: '#B2DFDB' },
    ],
  },
  {
    name: 'Twilight Zone (Mesopelagic)',
    depth: '200–1000m',
    colors: [
      { name: 'Fading Light', hex: '#4A90D9' },
      { name: 'Deep Cerulean', hex: '#2E5090' },
      { name: 'Bioluminescent', hex: '#00E5FF' },
      { name: 'Twilight Purple', hex: '#5C4B8A' },
      { name: 'Jellyfish Glow', hex: '#E040FB' },
    ],
  },
  {
    name: 'Midnight Zone (Bathypelagic)',
    depth: '1000–4000m',
    colors: [
      { name: 'Abyssal Blue', hex: '#1A237E' },
      { name: 'Midnight Ink', hex: '#0D1B2A' },
      { name: 'Deep Pressure', hex: '#1B2838' },
      { name: 'Anglerfish Lure', hex: '#76FF03' },
      { name: 'Void Indigo', hex: '#1A1A3E' },
    ],
  },
  {
    name: 'Abyssal Zone (Abyssopelagic)',
    depth: '4000–6000m',
    colors: [
      { name: 'Crushing Depth', hex: '#0A0A1A' },
      { name: 'Thermal Vent', hex: '#FF3D00' },
      { name: 'Sulfur Plume', hex: '#FFD600' },
      { name: 'Iron Black', hex: '#1C1C1C' },
      { name: 'Mineral Blue', hex: '#263238' },
    ],
  },
  {
    name: 'Hadal Zone (Hadopelagic)',
    depth: '6000–11000m',
    colors: [
      { name: 'Trench Black', hex: '#050505' },
      { name: 'Pressure Dark', hex: '#0D0D1A' },
      { name: 'Mariana Deep', hex: '#0A1628' },
      { name: 'Extremophile', hex: '#B71C1C' },
      { name: 'Sediment Gray', hex: '#37474F' },
    ],
  },
];

/**
 * ColorPaletteFromOceanDepth - Generate palettes inspired by ocean depth zones.
 * Each zone (Sunlight, Twilight, Midnight, Abyssal, Hadal) has a curated 5-color palette.
 */
export default function ColorPaletteFromOceanDepth({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [selectedZone, setSelectedZone] = useState(0);
  const [output, setOutput] = useState('');
  const [palette, setPalette] = useState<PaletteColor[]>([]);

  const generate = () => {
    const zone = OCEAN_ZONES[selectedZone];
    setPalette(zone.colors);
    const text = zone.colors.map(c => `${c.name}: ${c.hex}`).join('\n');
    setOutput(`${zone.name} (${zone.depth})\n\n${text}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-zone`} className="block text-sm font-medium text-gray-700 mb-1">
              Ocean Depth Zone
            </label>
            <select
              id={`${toolId}-zone`}
              value={selectedZone}
              onChange={(e) => setSelectedZone(parseInt(e.target.value))}
              aria-label={`Ocean zone selection for ${toolName}`}
              className="input-field w-full"
            >
              {OCEAN_ZONES.map((zone, i) => (
                <option key={i} value={i}>{zone.name} ({zone.depth})</option>
              ))}
            </select>
          </div>
          <button onClick={generate} className="btn-primary text-sm">
            Generate Palette
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              {OCEAN_ZONES[selectedZone].name} Palette
            </label>
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
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
