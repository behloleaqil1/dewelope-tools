'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromLeather - Generate color palettes inspired by leather types.
 * Provides 5-color palettes based on various leather materials.
 */
export default function ColorPaletteFromLeather({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [selectedLeather, setSelectedLeather] = useState('tan-cowhide');
  const [output, setOutput] = useState('');
  const [palette, setPalette] = useState<string[]>([]);

  const leatherPalettes: Record<string, { name: string; colors: string[]; description: string }> = {
    'tan-cowhide': { name: 'Tan Cowhide', colors: ['#C19A6B', '#A0522D', '#8B4513', '#D2B48C', '#F5DEB3'], description: 'Classic tan leather with warm golden-brown tones' },
    'dark-brown': { name: 'Dark Brown Leather', colors: ['#3B2F2F', '#5C4033', '#6B4423', '#8B6914', '#4A3728'], description: 'Rich dark brown with deep chocolate undertones' },
    'black-leather': { name: 'Black Leather', colors: ['#1A1A1A', '#2C2C2C', '#3D3D3D', '#4F4F4F', '#0D0D0D'], description: 'Sleek black leather with subtle gray variations' },
    'cognac': { name: 'Cognac', colors: ['#9A4E1C', '#B5651D', '#CD853F', '#DEB887', '#7B3F00'], description: 'Warm cognac with amber and honey highlights' },
    'oxblood': { name: 'Oxblood', colors: ['#4A0000', '#6B0000', '#800020', '#722F37', '#3C1414'], description: 'Deep oxblood red with burgundy richness' },
    'saddle': { name: 'Saddle Leather', colors: ['#8B4513', '#A0522D', '#CD853F', '#D2691E', '#BC8F8F'], description: 'Traditional saddle leather with warm russet tones' },
    'olive-leather': { name: 'Olive Leather', colors: ['#556B2F', '#6B8E23', '#808000', '#4B5320', '#3B3C36'], description: 'Earthy olive green with natural patina' },
    'navy-leather': { name: 'Navy Leather', colors: ['#1B2838', '#2C3E50', '#34495E', '#1A2530', '#0F1C2E'], description: 'Deep navy blue with sophisticated depth' },
    'caramel': { name: 'Caramel', colors: ['#FFD59A', '#E8A838', '#C68E17', '#B8860B', '#DAA520'], description: 'Light caramel with golden warmth' },
    'distressed': { name: 'Distressed Leather', colors: ['#8B7355', '#A0926B', '#6B5B3E', '#BDB76B', '#9C8B6B'], description: 'Aged distressed leather with weathered character' },
    'suede': { name: 'Suede', colors: ['#C4A882', '#B89B72', '#A68B5B', '#D4C4A8', '#E8D8B8'], description: 'Soft suede with velvety muted tones' },
    'patent': { name: 'Patent Leather', colors: ['#1C1C1C', '#8B0000', '#000080', '#2F4F4F', '#191970'], description: 'Glossy patent leather with high-shine depth' },
  };

  const generate = () => {
    const leather = leatherPalettes[selectedLeather];
    if (!leather) return;

    setPalette(leather.colors);
    const lines = [
      `=== ${leather.name} Palette ===`,
      `${leather.description}`,
      ``,
      ...leather.colors.map((color, i) => `Color ${i + 1}: ${color}`),
      ``,
      `CSS Variables:`,
      ...leather.colors.map((color, i) => `--leather-${i + 1}: ${color};`),
    ];
    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-leather`} className="block text-sm font-medium text-gray-700 mb-1">Select Leather Type</label>
        <select id={`${toolId}-leather`} value={selectedLeather} onChange={(e) => setSelectedLeather(e.target.value)} className="input-field" aria-label={`Leather type for ${toolName}`}>
          {Object.entries(leatherPalettes).map(([key, val]) => (
            <option key={key} value={key}>{val.name}</option>
          ))}
        </select>
        <button onClick={generate} className="btn-primary mt-3">Generate Palette</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              {palette.map((color, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className="w-16 h-16 rounded-lg border border-gray-200 shadow-sm" style={{ backgroundColor: color }} />
                  <span className="text-xs font-mono text-gray-600">{color}</span>
                </div>
              ))}
            </div>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
