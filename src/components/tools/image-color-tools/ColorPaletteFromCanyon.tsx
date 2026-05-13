'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromCanyon - Generate color palettes inspired by canyons.
 * Includes Grand Canyon, Antelope Canyon, Bryce Canyon, and slot canyon palettes.
 */
export default function ColorPaletteFromCanyon({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [selectedCanyon, setSelectedCanyon] = useState('grand-canyon');
  const [output, setOutput] = useState('');
  const [palette, setPalette] = useState<string[]>([]);

  const canyonPalettes: Record<string, { name: string; colors: string[]; description: string }> = {
    'grand-canyon': {
      name: 'Grand Canyon',
      colors: ['#C1440E', '#E77D11', '#F2A65A', '#8B4513', '#D2691E', '#FFF8DC'],
      description: 'Warm terracotta, burnt orange, and sandstone tones from the Grand Canyon layers.',
    },
    'antelope-canyon': {
      name: 'Antelope Canyon',
      colors: ['#FF6B35', '#F7931E', '#FFD700', '#8B0000', '#CD853F', '#FAEBD7'],
      description: 'Glowing orange and gold tones from light filtering through Antelope Canyon.',
    },
    'bryce-canyon': {
      name: 'Bryce Canyon',
      colors: ['#E8523F', '#F4845F', '#FFB347', '#D4A574', '#8B6914', '#F5F5DC'],
      description: 'Pink and orange hoodoo formations against pale desert sky.',
    },
    'slot-canyon': {
      name: 'Slot Canyon',
      colors: ['#4A0E0E', '#8B2500', '#CD6600', '#FF8C00', '#FFB90F', '#2F1B14'],
      description: 'Deep shadows and brilliant light beams in narrow slot canyons.',
    },
    'zion-canyon': {
      name: 'Zion Canyon',
      colors: ['#A0522D', '#CD853F', '#DEB887', '#556B2F', '#8FBC8F', '#F0E68C'],
      description: 'Red sandstone cliffs with green vegetation and golden highlights.',
    },
    'canyon-sunset': {
      name: 'Canyon at Sunset',
      colors: ['#800020', '#C41E3A', '#FF6347', '#FF8C69', '#FFDAB9', '#4B0082'],
      description: 'Deep purples and fiery reds as the sun sets over canyon walls.',
    },
  };

  const generate = () => {
    const canyon = canyonPalettes[selectedCanyon];
    if (!canyon) return;

    setPalette(canyon.colors);
    const lines = [
      `🏜️ ${canyon.name} Palette`,
      `${canyon.description}`,
      ``,
      ...canyon.colors.map((color, i) => `Color ${i + 1}: ${color}`),
      ``,
      `CSS Variables:`,
      ...canyon.colors.map((color, i) => `--canyon-${i + 1}: ${color};`),
    ];
    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-canyon`} className="block text-sm font-medium text-gray-700 mb-1">Select Canyon Inspiration</label>
            <select id={`${toolId}-canyon`} value={selectedCanyon} onChange={(e) => setSelectedCanyon(e.target.value)} aria-label={`Canyon selection for ${toolName}`} className="input-field">
              {Object.entries(canyonPalettes).map(([key, val]) => (
                <option key={key} value={key}>{val.name}</option>
              ))}
            </select>
          </div>
          <button onClick={generate} className="btn-primary w-full">Generate Palette</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Canyon Palette</label>
            <div className="flex gap-2 flex-wrap">
              {palette.map((color, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-lg border border-gray-200 shadow-sm" style={{ backgroundColor: color }} />
                  <span className="text-xs font-mono mt-1 text-gray-600">{color}</span>
                </div>
              ))}
            </div>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
