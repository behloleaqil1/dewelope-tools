'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ImpressionistColorGenerator - Generate color palettes inspired by Impressionist paintings.
 * Creates palettes based on famous Impressionist artists and their characteristic color choices.
 */

interface PalettePreset {
  name: string;
  artist: string;
  colors: string[];
  description: string;
}

const PRESETS: PalettePreset[] = [
  { name: 'Water Lilies', artist: 'Claude Monet', colors: ['#5B8C5A', '#8FBC8F', '#6B8E9F', '#9DC4D4', '#E8D5E0', '#4A7C59'], description: 'Soft greens and blues reflecting water and lily pads' },
  { name: 'Sunrise', artist: 'Claude Monet', colors: ['#FF6B35', '#F7C59F', '#8EAFC2', '#2E4057', '#EFEFD0', '#C4A35A'], description: 'Warm oranges against cool morning blues' },
  { name: 'Starry Night', artist: 'Vincent van Gogh', colors: ['#1B3A5C', '#2E5090', '#F4D03F', '#5DADE2', '#1A5276', '#F9E79F'], description: 'Deep blues with swirling golden yellows' },
  { name: 'Sunflowers', artist: 'Vincent van Gogh', colors: ['#F4D03F', '#D4AC0D', '#7D6608', '#F9E79F', '#B7950B', '#FDEBD0'], description: 'Rich golden yellows and warm ochres' },
  { name: 'Ballet Dancers', artist: 'Edgar Degas', colors: ['#F5E6D3', '#E8C4A2', '#D4A574', '#8B6F47', '#F0D9C1', '#C9A96E'], description: 'Soft warm tones of skin, tulle, and stage light' },
  { name: 'Luncheon', artist: 'Pierre-Auguste Renoir', colors: ['#E74C3C', '#F1948A', '#FADBD8', '#2E86C1', '#AED6F1', '#F9E79F'], description: 'Vibrant reds and blues with dappled sunlight' },
  { name: 'Haystacks', artist: 'Claude Monet', colors: ['#D4A03C', '#8B6914', '#E8C97D', '#6B4E2A', '#F5DEB3', '#A0522D'], description: 'Warm golden and amber tones of harvest fields' },
  { name: 'Garden Path', artist: 'Claude Monet', colors: ['#27AE60', '#82E0AA', '#F1C40F', '#E74C3C', '#8E44AD', '#F9E79F'], description: 'Vivid garden flowers against lush greens' },
  { name: 'Café Terrace', artist: 'Vincent van Gogh', colors: ['#F4D03F', '#2C3E50', '#1A5276', '#F39C12', '#784212', '#D4E6F1'], description: 'Warm lamplight against deep night sky' },
  { name: 'Bathers', artist: 'Paul Cézanne', colors: ['#5DADE2', '#AED6F1', '#F5CBA7', '#DC7633', '#2ECC71', '#85C1E9'], description: 'Cool blues with warm flesh tones and greens' },
];

export default function ImpressionistColorGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [selectedPreset, setSelectedPreset] = useState<number>(0);
  const [palette, setPalette] = useState<string[]>(PRESETS[0].colors);
  const [variation, setVariation] = useState(10);

  const generateVariation = () => {
    const base = PRESETS[selectedPreset].colors;
    const varied = base.map((color) => {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);

      const vr = Math.max(0, Math.min(255, r + Math.floor((Math.random() - 0.5) * 2 * variation)));
      const vg = Math.max(0, Math.min(255, g + Math.floor((Math.random() - 0.5) * 2 * variation)));
      const vb = Math.max(0, Math.min(255, b + Math.floor((Math.random() - 0.5) * 2 * variation)));

      return `#${vr.toString(16).padStart(2, '0')}${vg.toString(16).padStart(2, '0')}${vb.toString(16).padStart(2, '0')}`.toUpperCase();
    });
    setPalette(varied);
  };

  const selectPreset = (idx: number) => {
    setSelectedPreset(idx);
    setPalette(PRESETS[idx].colors);
  };

  const randomPreset = () => {
    const idx = Math.floor(Math.random() * PRESETS.length);
    selectPreset(idx);
  };

  const copyText = `Impressionist Palette: ${PRESETS[selectedPreset].name} (${PRESETS[selectedPreset].artist})\n${palette.join(', ')}\n${PRESETS[selectedPreset].description}`;

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-preset`} className="block text-sm font-medium text-gray-700 mb-1">Painting Inspiration</label>
        <select id={`${toolId}-preset`} value={selectedPreset} onChange={(e) => selectPreset(Number(e.target.value))} aria-label={`Preset for ${toolName}`} className="input-field">
          {PRESETS.map((p, i) => (
            <option key={i} value={i}>{p.name} — {p.artist}</option>
          ))}
        </select>
      </InputArea>

      <InputArea>
        <label htmlFor={`${toolId}-variation`} className="block text-sm font-medium text-gray-700 mb-1">Variation Amount: {variation}</label>
        <input id={`${toolId}-variation`} type="range" min="0" max="50" value={variation} onChange={(e) => setVariation(Number(e.target.value))} aria-label={`Variation for ${toolName}`} className="w-full" />
      </InputArea>

      <div className="flex gap-3">
        <button onClick={generateVariation} aria-label="Generate variation" className="btn-primary">Generate Variation</button>
        <button onClick={randomPreset} aria-label="Random preset" className="btn-primary bg-purple-600 hover:bg-purple-700">Random Painting</button>
      </div>

      <OutputArea hasContent={palette.length > 0}>
        <div className="space-y-3">
          <div className="text-sm text-gray-700">
            <span className="font-medium">{PRESETS[selectedPreset].name}</span> by <span className="italic">{PRESETS[selectedPreset].artist}</span>
          </div>
          <p className="text-xs text-gray-500">{PRESETS[selectedPreset].description}</p>

          <div className="flex rounded-lg overflow-hidden h-24 border border-gray-200">
            {palette.map((color, i) => (
              <div key={i} className="flex-1 relative group cursor-pointer" style={{ backgroundColor: color }} title={color}>
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-mono bg-white/80 px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">{color}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {palette.map((color, i) => (
              <div key={i} className="text-center">
                <div className="w-full h-12 rounded-lg border border-gray-200" style={{ backgroundColor: color }} />
                <span className="text-xs font-mono text-gray-600 mt-1 block">{color}</span>
              </div>
            ))}
          </div>

          <CopyToClipboard text={copyText} />
        </div>
      </OutputArea>
    </div>
  );
}
