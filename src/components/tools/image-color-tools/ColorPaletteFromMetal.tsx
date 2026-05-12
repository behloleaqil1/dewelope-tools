'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromMetal - Generate color palettes inspired by metals.
 * Provides curated palettes for gold, silver, copper, bronze, and more.
 */
export default function ColorPaletteFromMetal({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [selectedMetal, setSelectedMetal] = useState('gold');
  const [output, setOutput] = useState('');

  const metalPalettes: Record<string, { name: string; colors: { hex: string; name: string }[] }> = {
    gold: {
      name: 'Gold',
      colors: [
        { hex: '#FFD700', name: 'Pure Gold' },
        { hex: '#DAA520', name: 'Goldenrod' },
        { hex: '#B8860B', name: 'Dark Goldenrod' },
        { hex: '#FFC125', name: 'Gold Leaf' },
        { hex: '#CD950C', name: 'Antique Gold' },
      ],
    },
    silver: {
      name: 'Silver',
      colors: [
        { hex: '#C0C0C0', name: 'Silver' },
        { hex: '#A8A9AD', name: 'Polished Silver' },
        { hex: '#D3D3D3', name: 'Light Silver' },
        { hex: '#808080', name: 'Tarnished Silver' },
        { hex: '#E8E8E8', name: 'Sterling' },
      ],
    },
    copper: {
      name: 'Copper',
      colors: [
        { hex: '#B87333', name: 'Copper' },
        { hex: '#DA8A67', name: 'Light Copper' },
        { hex: '#8C4A2F', name: 'Dark Copper' },
        { hex: '#CB6D51', name: 'Burnished Copper' },
        { hex: '#6E3B2A', name: 'Aged Copper' },
      ],
    },
    bronze: {
      name: 'Bronze',
      colors: [
        { hex: '#CD7F32', name: 'Bronze' },
        { hex: '#A0522D', name: 'Sienna Bronze' },
        { hex: '#8B4513', name: 'Saddle Bronze' },
        { hex: '#D2691E', name: 'Chocolate Bronze' },
        { hex: '#9C661F', name: 'Antique Bronze' },
      ],
    },
    platinum: {
      name: 'Platinum',
      colors: [
        { hex: '#E5E4E2', name: 'Platinum' },
        { hex: '#BCC6CC', name: 'Cool Platinum' },
        { hex: '#D4D7DC', name: 'Bright Platinum' },
        { hex: '#9EA4AB', name: 'Dark Platinum' },
        { hex: '#C9CCD1', name: 'Matte Platinum' },
      ],
    },
    rosegold: {
      name: 'Rose Gold',
      colors: [
        { hex: '#B76E79', name: 'Rose Gold' },
        { hex: '#E8A0A0', name: 'Light Rose Gold' },
        { hex: '#C9787C', name: 'Warm Rose Gold' },
        { hex: '#9C5A5A', name: 'Deep Rose Gold' },
        { hex: '#DBA8A8', name: 'Blush Rose Gold' },
      ],
    },
  };

  const generate = () => {
    const palette = metalPalettes[selectedMetal];
    if (!palette) return;

    const lines = [`${palette.name} Palette`, '═'.repeat(30), ''];
    palette.colors.forEach((c) => {
      lines.push(`${c.hex}  ${c.name}`);
    });
    lines.push('');
    lines.push('CSS Variables:');
    palette.colors.forEach((c, i) => {
      lines.push(`--${selectedMetal}-${i + 1}: ${c.hex};`);
    });

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-metal`} className="block text-sm font-medium text-gray-700 mb-1">
              Select Metal
            </label>
            <select
              id={`${toolId}-metal`}
              value={selectedMetal}
              onChange={(e) => setSelectedMetal(e.target.value)}
              aria-label={`Metal selection for ${toolName}`}
              className="input-field"
            >
              <option value="gold">Gold</option>
              <option value="silver">Silver</option>
              <option value="copper">Copper</option>
              <option value="bronze">Bronze</option>
              <option value="platinum">Platinum</option>
              <option value="rosegold">Rose Gold</option>
            </select>
          </div>
          <button onClick={generate} className="btn-primary w-full">Generate Palette</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Palette</label>
            <div className="flex gap-2 mb-3">
              {metalPalettes[selectedMetal]?.colors.map((c, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-lg border border-gray-200 shadow-sm" style={{ backgroundColor: c.hex }} title={c.name} />
                  <span className="text-xs text-gray-500 mt-1">{c.hex}</span>
                </div>
              ))}
            </div>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
