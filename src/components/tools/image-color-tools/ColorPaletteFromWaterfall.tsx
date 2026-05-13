'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const waterfallPalettes: Record<string, { name: string; colors: { hex: string; name: string }[] }> = {
  niagara: { name: 'Niagara Falls', colors: [{ hex: '#1B4F72', name: 'Deep Blue Mist' }, { hex: '#5DADE2', name: 'Cascade Blue' }, { hex: '#AED6F1', name: 'Spray Foam' }, { hex: '#D5F5E3', name: 'Mossy Green' }, { hex: '#F7F9F9', name: 'White Water' }] },
  victoria: { name: 'Victoria Falls', colors: [{ hex: '#1A5276', name: 'Zambezi Deep' }, { hex: '#2E86C1', name: 'Mist Pool' }, { hex: '#85C1E9', name: 'Rainbow Spray' }, { hex: '#D4AC0D', name: 'Sunset Gold' }, { hex: '#7D6608', name: 'Basalt Brown' }] },
  iguazu: { name: 'Iguazu Falls', colors: [{ hex: '#0E6655', name: 'Tropical Green' }, { hex: '#1ABC9C', name: 'Emerald Pool' }, { hex: '#D35400', name: 'Red Earth' }, { hex: '#F39C12', name: 'Golden Mist' }, { hex: '#FDFEFE', name: 'Cascade White' }] },
  angel: { name: 'Angel Falls', colors: [{ hex: '#1B2631', name: 'Tepui Shadow' }, { hex: '#2C3E50', name: 'Cloud Forest' }, { hex: '#5D6D7E', name: 'Granite Gray' }, { hex: '#AEB6BF', name: 'Misty Silver' }, { hex: '#ECF0F1', name: 'Free Fall White' }] },
  yosemite: { name: 'Yosemite Falls', colors: [{ hex: '#6E2C00', name: 'Granite Rust' }, { hex: '#A04000', name: 'Sierra Orange' }, { hex: '#D4E6F1', name: 'Snow Melt' }, { hex: '#2E4053', name: 'Pine Shadow' }, { hex: '#85929E', name: 'Rock Face' }] },
  plitvice: { name: 'Plitvice Lakes', colors: [{ hex: '#0B5345', name: 'Travertine Deep' }, { hex: '#148F77', name: 'Mineral Green' }, { hex: '#76D7C4', name: 'Turquoise Pool' }, { hex: '#D5F5E3', name: 'Lime Moss' }, { hex: '#F9E79F', name: 'Limestone Gold' }] },
  iceland: { name: 'Icelandic Waterfall', colors: [{ hex: '#1C2833', name: 'Basalt Black' }, { hex: '#2C3E50', name: 'Volcanic Gray' }, { hex: '#5DADE2', name: 'Glacial Blue' }, { hex: '#D6EAF8', name: 'Ice Mist' }, { hex: '#FDFEFE', name: 'Arctic White' }] },
  tropical: { name: 'Tropical Cascade', colors: [{ hex: '#145A32', name: 'Jungle Deep' }, { hex: '#27AE60', name: 'Fern Green' }, { hex: '#82E0AA', name: 'Moss Light' }, { hex: '#3498DB', name: 'Pool Blue' }, { hex: '#F5B7B1', name: 'Orchid Pink' }] },
};

export default function ColorPaletteFromWaterfall({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [selected, setSelected] = useState('niagara');
  const [output, setOutput] = useState('');

  const generate = () => {
    const palette = waterfallPalettes[selected];
    if (!palette) return;

    const lines = [
      `/* ${palette.name} Palette */`,
      `:root {`,
      ...palette.colors.map((c, i) => `  --waterfall-${i + 1}: ${c.hex}; /* ${c.name} */`),
      `}`,
      ``,
      ...palette.colors.map(c => `${c.hex} - ${c.name}`),
    ];

    setOutput(lines.join('\n'));
  };

  const palette = waterfallPalettes[selected];

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-1">Select Waterfall</label>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="input-field mb-3"
          aria-label={`Waterfall selection for ${toolName}`}
        >
          {Object.entries(waterfallPalettes).map(([key, val]) => (
            <option key={key} value={key}>{val.name}</option>
          ))}
        </select>

        {palette && (
          <div className="flex gap-2 mb-3">
            {palette.colors.map((c, i) => (
              <div key={i} className="flex-1 h-12 rounded" style={{ backgroundColor: c.hex }} title={`${c.name} (${c.hex})`} />
            ))}
          </div>
        )}

        <button onClick={generate} className="btn-primary">Generate Palette</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">CSS Variables & Colors</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
