'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const MINERAL_PALETTES: Record<string, { name: string; colors: { hex: string; name: string }[] }> = {
  amethyst: { name: 'Amethyst', colors: [{ hex: '#9B59B6', name: 'Deep Amethyst' }, { hex: '#C39BD3', name: 'Light Amethyst' }, { hex: '#7D3C98', name: 'Royal Purple' }, { hex: '#E8DAEF', name: 'Lavender Quartz' }, { hex: '#4A235A', name: 'Dark Crystal' }] },
  malachite: { name: 'Malachite', colors: [{ hex: '#0E6655', name: 'Deep Malachite' }, { hex: '#1ABC9C', name: 'Polished Green' }, { hex: '#A2D9CE', name: 'Light Banding' }, { hex: '#0B5345', name: 'Dark Vein' }, { hex: '#D4EFDF', name: 'Pale Green' }] },
  lapis: { name: 'Lapis Lazuli', colors: [{ hex: '#1A5276', name: 'Deep Lapis' }, { hex: '#2E86C1', name: 'Azure Blue' }, { hex: '#AED6F1', name: 'Light Lazuli' }, { hex: '#D4AC0D', name: 'Pyrite Gold' }, { hex: '#0E1F40', name: 'Midnight Blue' }] },
  rose_quartz: { name: 'Rose Quartz', colors: [{ hex: '#F5B7B1', name: 'Soft Rose' }, { hex: '#E74C8B', name: 'Deep Rose' }, { hex: '#FADBD8', name: 'Pale Pink' }, { hex: '#C0392B', name: 'Garnet Accent' }, { hex: '#FDFEFE', name: 'Crystal White' }] },
  obsidian: { name: 'Obsidian', colors: [{ hex: '#17202A', name: 'Volcanic Black' }, { hex: '#2C3E50', name: 'Dark Glass' }, { hex: '#566573', name: 'Smoky Edge' }, { hex: '#ABB2B9', name: 'Silver Sheen' }, { hex: '#1B2631', name: 'Deep Obsidian' }] },
  turquoise: { name: 'Turquoise', colors: [{ hex: '#17A2B8', name: 'True Turquoise' }, { hex: '#76D7C4', name: 'Light Turquoise' }, { hex: '#0E6251', name: 'Deep Teal' }, { hex: '#D1F2EB', name: 'Pale Aqua' }, { hex: '#148F77', name: 'Green Turquoise' }] },
  tiger_eye: { name: "Tiger's Eye", colors: [{ hex: '#B7950B', name: 'Golden Band' }, { hex: '#7D6608', name: 'Dark Amber' }, { hex: '#F4D03F', name: 'Light Gold' }, { hex: '#6E2C00', name: 'Brown Base' }, { hex: '#F9E79F', name: 'Pale Honey' }] },
  opal: { name: 'Opal', colors: [{ hex: '#AED6F1', name: 'Blue Fire' }, { hex: '#ABEBC6', name: 'Green Flash' }, { hex: '#F9E79F', name: 'Yellow Play' }, { hex: '#F5B7B1', name: 'Pink Shimmer' }, { hex: '#FDFEFE', name: 'White Base' }] },
  granite: { name: 'Granite', colors: [{ hex: '#717D7E', name: 'Medium Gray' }, { hex: '#2C3E50', name: 'Dark Feldspar' }, { hex: '#F2F3F4', name: 'White Quartz' }, { hex: '#E59866', name: 'Pink Feldspar' }, { hex: '#B2BABB', name: 'Light Mica' }] },
  jade: { name: 'Jade', colors: [{ hex: '#1E8449', name: 'Imperial Jade' }, { hex: '#82E0AA', name: 'Light Jade' }, { hex: '#0B5345', name: 'Dark Nephrite' }, { hex: '#D5F5E3', name: 'Pale Jade' }, { hex: '#196F3D', name: 'Deep Green' }] },
};

export default function ColorPaletteFromMineral({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [selected, setSelected] = useState('amethyst');
  const [output, setOutput] = useState('');

  const generate = () => {
    const palette = MINERAL_PALETTES[selected];
    if (!palette) return;
    const lines = [`🪨 ${palette.name} Palette`, ''];
    palette.colors.forEach((c, i) => {
      lines.push(`${i + 1}. ${c.name}: ${c.hex}`);
    });
    setOutput(lines.join('\n'));
  };

  const palette = MINERAL_PALETTES[selected];

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-mineral`} className="block text-sm font-medium text-gray-700 mb-1">
          Select Mineral / Rock
        </label>
        <select
          id={`${toolId}-mineral`}
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="input-field"
          aria-label={`Mineral selection for ${toolName}`}
        >
          {Object.entries(MINERAL_PALETTES).map(([key, val]) => (
            <option key={key} value={key}>{val.name}</option>
          ))}
        </select>
        <button onClick={generate} className="btn-primary mt-2">Generate Palette</button>
      </InputArea>
      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-3">
            <div className="flex gap-2">
              {palette?.colors.map((c, i) => (
                <div key={i} className="flex-1 text-center">
                  <div className="h-16 rounded" style={{ backgroundColor: c.hex }} />
                  <p className="text-xs mt-1 text-gray-600">{c.hex}</p>
                  <p className="text-xs text-gray-500">{c.name}</p>
                </div>
              ))}
            </div>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
