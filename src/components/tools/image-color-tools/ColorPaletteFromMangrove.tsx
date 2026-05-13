'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromMangrove - Generate color palettes inspired by mangrove ecosystems.
 * Includes colors from roots, water, foliage, mud, and sky of various mangrove environments.
 */
const MANGROVE_PALETTES: Record<string, { name: string; colors: { hex: string; name: string }[] }> = {
  'red-mangrove': {
    name: 'Red Mangrove (Rhizophora)',
    colors: [
      { hex: '#5B3A29', name: 'Prop Root Brown' },
      { hex: '#2D5016', name: 'Canopy Green' },
      { hex: '#8B7355', name: 'Tidal Mud' },
      { hex: '#4A7C59', name: 'Leaf Underside' },
      { hex: '#6B8E7B', name: 'Brackish Water' },
    ],
  },
  'black-mangrove': {
    name: 'Black Mangrove (Avicennia)',
    colors: [
      { hex: '#3D3D3D', name: 'Pneumatophore Dark' },
      { hex: '#556B2F', name: 'Salt-Crusted Leaf' },
      { hex: '#C4A882', name: 'Sandy Substrate' },
      { hex: '#708090', name: 'Tidal Flat Gray' },
      { hex: '#8FBC8F', name: 'Mangrove Canopy' },
    ],
  },
  'white-mangrove': {
    name: 'White Mangrove (Laguncularia)',
    colors: [
      { hex: '#D2B48C', name: 'Bark Tan' },
      { hex: '#90EE90', name: 'Young Leaf' },
      { hex: '#F5F5DC', name: 'Salt Crystal' },
      { hex: '#6B8E23', name: 'Mature Foliage' },
      { hex: '#B8860B', name: 'Estuary Gold' },
    ],
  },
  'mangrove-sunset': {
    name: 'Mangrove at Sunset',
    colors: [
      { hex: '#FF6B35', name: 'Horizon Orange' },
      { hex: '#1A3A2A', name: 'Silhouette Green' },
      { hex: '#FFB347', name: 'Reflected Gold' },
      { hex: '#4A2C17', name: 'Root Shadow' },
      { hex: '#87CEEB', name: 'Fading Sky' },
    ],
  },
  'mangrove-underwater': {
    name: 'Mangrove Underwater',
    colors: [
      { hex: '#1B4D3E', name: 'Submerged Root' },
      { hex: '#20B2AA', name: 'Clear Tidal' },
      { hex: '#2E8B57', name: 'Algae Green' },
      { hex: '#5F9EA0', name: 'Shallow Water' },
      { hex: '#3CB371', name: 'Seagrass' },
    ],
  },
};

export default function ColorPaletteFromMangrove({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [selected, setSelected] = useState('red-mangrove');
  const [output, setOutput] = useState('');

  const generate = () => {
    const palette = MANGROVE_PALETTES[selected];
    if (!palette) return;
    const lines = [`Palette: ${palette.name}`, ''];
    palette.colors.forEach(c => {
      lines.push(`${c.hex} - ${c.name}`);
    });
    lines.push('');
    lines.push(`CSS Variables:`);
    palette.colors.forEach((c, i) => {
      lines.push(`  --mangrove-${i + 1}: ${c.hex};`);
    });
    setOutput(lines.join('\n'));
  };

  const palette = MANGROVE_PALETTES[selected];

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">Select Mangrove Type</label>
        <select id={`${toolId}-type`} value={selected} onChange={(e) => setSelected(e.target.value)} className="input-field" aria-label={`Mangrove type for ${toolName}`}>
          {Object.entries(MANGROVE_PALETTES).map(([key, val]) => (
            <option key={key} value={key}>{val.name}</option>
          ))}
        </select>
        <button onClick={generate} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">Generate Palette</button>
      </InputArea>

      {palette && (
        <div className="flex gap-2 flex-wrap">
          {palette.colors.map((c, i) => (
            <div key={i} className="text-center">
              <div className="w-16 h-16 rounded border border-gray-200" style={{ backgroundColor: c.hex }} title={c.name} />
              <span className="text-xs text-gray-600 mt-1 block">{c.hex}</span>
            </div>
          ))}
        </div>
      )}

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Palette Details</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
