'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromCloudType - Generate color palettes inspired by cloud types.
 * Supports cumulus, cirrus, nimbus, stratus, cumulonimbus, and more.
 */
export default function ColorPaletteFromCloudType({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [cloudType, setCloudType] = useState('cumulus');
  const [output, setOutput] = useState('');
  const [palette, setPalette] = useState<string[]>([]);

  const palettes: Record<string, { colors: string[]; description: string }> = {
    cumulus: {
      colors: ['#FFFFFF', '#F0F4F8', '#B8D4E3', '#87CEEB', '#4A90D9'],
      description: 'Bright white fluffy clouds against blue sky — clean, optimistic, airy',
    },
    cirrus: {
      colors: ['#F8F9FA', '#E8EDF2', '#C9D6E3', '#A3B8CC', '#7B9DB8'],
      description: 'Thin wispy ice clouds at high altitude — delicate, ethereal, cool',
    },
    nimbus: {
      colors: ['#2C3E50', '#4A5568', '#718096', '#A0AEC0', '#CBD5E0'],
      description: 'Dark rain-bearing clouds — dramatic, moody, powerful',
    },
    stratus: {
      colors: ['#D1D5DB', '#B0B8C4', '#8E99A4', '#6B7B8A', '#4A5568'],
      description: 'Low uniform gray layer — calm, muted, overcast',
    },
    cumulonimbus: {
      colors: ['#1A1A2E', '#16213E', '#0F3460', '#533483', '#E94560'],
      description: 'Towering thunderstorm clouds — intense, dramatic, electric',
    },
    altocumulus: {
      colors: ['#FFF5E6', '#FFE4CC', '#FFDAB9', '#87CEEB', '#6BB3D9'],
      description: 'Mid-level patchy clouds at sunset — warm, scattered, peaceful',
    },
    lenticular: {
      colors: ['#FF6B6B', '#FFA07A', '#FFD700', '#98D8C8', '#7EC8E3'],
      description: 'Lens-shaped clouds near mountains — surreal, colorful, rare',
    },
    mammatus: {
      colors: ['#4A0E4E', '#7B2D8B', '#C77DFF', '#E8B4F8', '#F5E6FF'],
      description: 'Pouch-like formations under storms — unusual, purple-tinged, ominous',
    },
  };

  const generate = () => {
    const selected = palettes[cloudType];
    if (!selected) return;

    setPalette(selected.colors);

    const cssVars = selected.colors
      .map((c, i) => `  --cloud-${cloudType}-${(i + 1) * 100}: ${c};`)
      .join('\n');

    const result = [
      `═══ ${cloudType.charAt(0).toUpperCase() + cloudType.slice(1)} Cloud Palette ═══`,
      ``,
      `Description: ${selected.description}`,
      ``,
      `Colors:`,
      ...selected.colors.map((c, i) => `  ${i + 1}. ${c}`),
      ``,
      `CSS Variables:`,
      `:root {`,
      cssVars,
      `}`,
      ``,
      `Tailwind Config:`,
      `colors: {`,
      `  cloud: {`,
      ...selected.colors.map((c, i) => `    ${(i + 1) * 100}: '${c}',`),
      `  }`,
      `}`,
    ];

    setOutput(result.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">Cloud Type</label>
            <select id={`${toolId}-type`} value={cloudType} onChange={(e) => setCloudType(e.target.value)} className="input-field" aria-label={`Cloud type for ${toolName}`}>
              <option value="cumulus">Cumulus (fluffy white)</option>
              <option value="cirrus">Cirrus (wispy ice)</option>
              <option value="nimbus">Nimbus (rain clouds)</option>
              <option value="stratus">Stratus (flat gray layer)</option>
              <option value="cumulonimbus">Cumulonimbus (thunderstorm)</option>
              <option value="altocumulus">Altocumulus (patchy sunset)</option>
              <option value="lenticular">Lenticular (lens-shaped)</option>
              <option value="mammatus">Mammatus (pouch-like)</option>
            </select>
          </div>
          <button onClick={generate} className="btn-primary">Generate Palette</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Palette Preview</label>
            <div className="flex gap-2">
              {palette.map((color, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className="w-12 h-12 rounded-lg border border-gray-200" style={{ backgroundColor: color }} />
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
