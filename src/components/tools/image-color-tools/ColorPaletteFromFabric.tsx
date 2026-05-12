'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromFabric - Generate color palettes inspired by fabrics.
 * Choose from denim, silk, velvet, linen, tweed, and more.
 */
export default function ColorPaletteFromFabric({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [fabric, setFabric] = useState('denim');
  const [output, setOutput] = useState<{ name: string; colors: { hex: string; label: string }[] } | null>(null);

  const fabricPalettes: Record<string, { name: string; colors: { hex: string; label: string }[] }> = {
    denim: { name: 'Denim', colors: [{ hex: '#1B3A5C', label: 'Dark Indigo' }, { hex: '#3B6FA0', label: 'Classic Blue' }, { hex: '#6B9FD4', label: 'Washed Denim' }, { hex: '#A8C8E8', label: 'Light Chambray' }, { hex: '#D4E6F1', label: 'Bleached Denim' }] },
    silk: { name: 'Silk', colors: [{ hex: '#F5E6D3', label: 'Ivory Silk' }, { hex: '#E8C4A8', label: 'Champagne' }, { hex: '#D4A574', label: 'Gold Silk' }, { hex: '#C9B8D4', label: 'Lavender Silk' }, { hex: '#F0D4E8', label: 'Rose Silk' }] },
    velvet: { name: 'Velvet', colors: [{ hex: '#2D1B4E', label: 'Deep Purple' }, { hex: '#4A1942', label: 'Burgundy Velvet' }, { hex: '#1B3D2F', label: 'Emerald Velvet' }, { hex: '#8B1A1A', label: 'Crimson Velvet' }, { hex: '#1A1A3D', label: 'Midnight Velvet' }] },
    linen: { name: 'Linen', colors: [{ hex: '#FAF0E6', label: 'Natural Linen' }, { hex: '#E8DCC8', label: 'Oatmeal' }, { hex: '#D4C5A9', label: 'Flax' }, { hex: '#C2B280', label: 'Sand Linen' }, { hex: '#8B7D6B', label: 'Dark Linen' }] },
    tweed: { name: 'Tweed', colors: [{ hex: '#5C4033', label: 'Brown Tweed' }, { hex: '#8B7355', label: 'Tan Tweed' }, { hex: '#6B8E23', label: 'Olive Tweed' }, { hex: '#A0522D', label: 'Rust Tweed' }, { hex: '#D2B48C', label: 'Light Tweed' }] },
    cashmere: { name: 'Cashmere', colors: [{ hex: '#F5F0EB', label: 'Cream Cashmere' }, { hex: '#D4C4B0', label: 'Camel' }, { hex: '#B8A088', label: 'Warm Taupe' }, { hex: '#8B7D6B', label: 'Mink' }, { hex: '#4A3728', label: 'Espresso' }] },
    satin: { name: 'Satin', colors: [{ hex: '#FFD700', label: 'Gold Satin' }, { hex: '#C0C0C0', label: 'Silver Satin' }, { hex: '#FF69B4', label: 'Hot Pink Satin' }, { hex: '#4169E1', label: 'Royal Blue Satin' }, { hex: '#2F4F4F', label: 'Dark Teal Satin' }] },
    cotton: { name: 'Cotton', colors: [{ hex: '#FFFFFF', label: 'White Cotton' }, { hex: '#87CEEB', label: 'Sky Blue' }, { hex: '#FFB6C1', label: 'Pink Cotton' }, { hex: '#98FB98', label: 'Mint Cotton' }, { hex: '#FFFACD', label: 'Lemon Cotton' }] },
  };

  const generate = () => {
    setOutput(fabricPalettes[fabric]);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-fabric`} className="block text-sm font-medium text-gray-700 mb-1">Select Fabric</label>
        <select id={`${toolId}-fabric`} value={fabric} onChange={(e) => setFabric(e.target.value)} className="input-field" aria-label={`Fabric selection for ${toolName}`}>
          {Object.entries(fabricPalettes).map(([key, val]) => (
            <option key={key} value={key}>{val.name}</option>
          ))}
        </select>
        <button onClick={generate} className="btn-primary mt-4">Generate Palette</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">{output.name} Palette</label>
            <div className="grid grid-cols-5 gap-2">
              {output.colors.map((color, i) => (
                <div key={i} className="text-center">
                  <div className="w-full h-16 rounded-lg border border-gray-200" style={{ backgroundColor: color.hex }} />
                  <p className="text-xs font-mono mt-1 text-gray-700">{color.hex}</p>
                  <p className="text-xs text-gray-500">{color.label}</p>
                </div>
              ))}
            </div>
            <CopyToClipboard text={output.colors.map(c => `${c.hex} - ${c.label}`).join('\n')} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
