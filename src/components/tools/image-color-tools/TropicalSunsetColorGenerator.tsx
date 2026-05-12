'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TropicalSunsetColorGenerator - Generate tropical sunset color palettes.
 * Creates warm, vibrant palettes inspired by tropical sunsets with oranges, pinks, and purples.
 */

interface SunsetTheme {
  name: string;
  colors: string[];
  description: string;
}

const THEMES: SunsetTheme[] = [
  { name: 'Golden Hour', colors: ['#FF6B35', '#FF8C42', '#FFD166', '#F4845F', '#F7B267'], description: 'Warm golden tones as the sun touches the horizon' },
  { name: 'Mango Sky', colors: ['#FF4E50', '#FC913A', '#F9D423', '#EDE574', '#E1F5C4'], description: 'Vibrant mango and citrus hues across the sky' },
  { name: 'Ocean Twilight', colors: ['#2E1065', '#7C3AED', '#F472B6', '#FB923C', '#FDE047'], description: 'Deep purple ocean meeting fiery orange sky' },
  { name: 'Coral Reef', colors: ['#FF6B6B', '#FFA07A', '#FFD93D', '#FF8E72', '#FF4757'], description: 'Coral pinks and warm salmon tones' },
  { name: 'Paradise Island', colors: ['#E91E63', '#FF5722', '#FF9800', '#FFC107', '#FFEB3B'], description: 'Bold tropical reds fading to bright yellows' },
  { name: 'Hibiscus Dusk', colors: ['#C2185B', '#E91E63', '#FF5252', '#FF8A80', '#FFCCBC'], description: 'Deep hibiscus pinks softening to peach' },
  { name: 'Palm Silhouette', colors: ['#1A1A2E', '#16213E', '#E94560', '#FF6B35', '#FFA62B'], description: 'Dark palm shadows against a burning sky' },
  { name: 'Lagoon Sunset', colors: ['#00B4D8', '#48CAE4', '#F77F00', '#FCBF49', '#EAE2B7'], description: 'Turquoise lagoon reflecting warm sunset colors' },
  { name: 'Volcanic Glow', colors: ['#D32F2F', '#FF5722', '#FF9800', '#FFB74D', '#FFE0B2'], description: 'Intense volcanic reds and molten oranges' },
  { name: 'Bougainvillea', colors: ['#AD1457', '#D81B60', '#F06292', '#F8BBD0', '#FCE4EC'], description: 'Rich magenta bougainvillea flowers at sunset' },
];

export default function TropicalSunsetColorGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [selectedTheme, setSelectedTheme] = useState(0);
  const [palette, setPalette] = useState<string[]>(THEMES[0].colors);
  const [variation, setVariation] = useState(15);

  const selectTheme = (idx: number) => {
    setSelectedTheme(idx);
    setPalette(THEMES[idx].colors);
  };

  const generateVariation = () => {
    const base = THEMES[selectedTheme].colors;
    const varied = base.map((color) => {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      const shift = () => Math.floor((Math.random() - 0.5) * variation * 2);
      const vr = Math.max(0, Math.min(255, r + shift()));
      const vg = Math.max(0, Math.min(255, g + shift()));
      const vb = Math.max(0, Math.min(255, b + shift()));
      return `#${vr.toString(16).padStart(2, '0')}${vg.toString(16).padStart(2, '0')}${vb.toString(16).padStart(2, '0')}`.toUpperCase();
    });
    setPalette(varied);
  };

  const randomTheme = () => {
    const idx = Math.floor(Math.random() * THEMES.length);
    selectTheme(idx);
  };

  const copyText = `Tropical Sunset Palette: ${THEMES[selectedTheme].name}\nColors: ${palette.join(', ')}\n${THEMES[selectedTheme].description}\n\nCSS Variables:\n${palette.map((c, i) => `--sunset-${i + 1}: ${c};`).join('\n')}\n\nGradient:\nbackground: linear-gradient(135deg, ${palette.join(', ')});`;

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-theme`} className="block text-sm font-medium text-gray-700 mb-1">Sunset Theme</label>
        <select id={`${toolId}-theme`} value={selectedTheme} onChange={(e) => selectTheme(Number(e.target.value))} aria-label={`Theme for ${toolName}`} className="input-field">
          {THEMES.map((t, i) => (
            <option key={i} value={i}>{t.name}</option>
          ))}
        </select>
      </InputArea>

      <InputArea>
        <label htmlFor={`${toolId}-var`} className="block text-sm font-medium text-gray-700 mb-1">Variation Amount: {variation}</label>
        <input id={`${toolId}-var`} type="range" min="5" max="50" value={variation} onChange={(e) => setVariation(Number(e.target.value))} aria-label={`Variation for ${toolName}`} className="w-full" />
      </InputArea>

      <div className="flex gap-3">
        <button onClick={generateVariation} aria-label="Generate variation" className="btn-primary">Generate Variation</button>
        <button onClick={randomTheme} aria-label="Random theme" className="btn-primary bg-orange-600 hover:bg-orange-700">Random Theme</button>
      </div>

      <OutputArea hasContent={palette.length > 0}>
        <div className="space-y-3">
          <div className="text-sm text-gray-700">
            <span className="font-medium">{THEMES[selectedTheme].name}</span>
            <span className="text-gray-500 ml-2">— {THEMES[selectedTheme].description}</span>
          </div>

          <div className="rounded-lg overflow-hidden border border-gray-200">
            <div className="h-24 w-full" style={{ background: `linear-gradient(135deg, ${palette.join(', ')})` }} />
          </div>

          <div className="grid grid-cols-5 gap-2">
            {palette.map((color, i) => (
              <div key={i} className="text-center">
                <div className="w-full h-14 rounded-lg border border-gray-200" style={{ backgroundColor: color }} />
                <span className="text-xs font-mono text-gray-600 mt-1 block">{color}</span>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <h4 className="text-xs font-medium text-gray-700 mb-1">CSS Gradient</h4>
            <code className="text-xs font-mono text-gray-600 break-all">
              background: linear-gradient(135deg, {palette.join(', ')});
            </code>
          </div>

          <CopyToClipboard text={copyText} />
        </div>
      </OutputArea>
    </div>
  );
}
