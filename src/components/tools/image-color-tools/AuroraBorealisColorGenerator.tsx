'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * AuroraBorealisColorGenerator - Generate aurora/northern lights color palettes.
 * Creates ethereal palettes inspired by the aurora borealis with greens, purples, and blues.
 */

interface AuroraTheme {
  name: string;
  colors: string[];
  description: string;
}

const THEMES: AuroraTheme[] = [
  { name: 'Classic Green', colors: ['#00FF87', '#00E676', '#1DE9B6', '#64FFDA', '#A7FFEB'], description: 'Traditional green aurora dancing across the sky' },
  { name: 'Purple Curtain', colors: ['#7C4DFF', '#B388FF', '#EA80FC', '#E040FB', '#AA00FF'], description: 'Rare purple aurora with violet curtains' },
  { name: 'Green & Purple', colors: ['#00E676', '#69F0AE', '#B388FF', '#7C4DFF', '#311B92'], description: 'Classic mix of green and purple bands' },
  { name: 'Arctic Blue', colors: ['#00B0FF', '#40C4FF', '#80D8FF', '#00E5FF', '#18FFFF'], description: 'Cool blue aurora over arctic ice' },
  { name: 'Solar Storm', colors: ['#FF1744', '#FF4081', '#F50057', '#D500F9', '#651FFF'], description: 'Intense red aurora from strong solar activity' },
  { name: 'Midnight Dance', colors: ['#0D1B2A', '#1B2838', '#00BFA5', '#1DE9B6', '#69F0AE'], description: 'Subtle green glow against deep midnight sky' },
  { name: 'Nordic Glow', colors: ['#004D40', '#00695C', '#00897B', '#26A69A', '#80CBC4'], description: 'Soft teal glow over Nordic landscapes' },
  { name: 'Polar Vortex', colors: ['#1A237E', '#283593', '#3F51B5', '#7986CB', '#C5CAE9'], description: 'Deep indigo swirls of polar magnetic fields' },
  { name: 'Emerald Ribbon', colors: ['#2E7D32', '#43A047', '#66BB6A', '#81C784', '#A5D6A7'], description: 'Ribbon-like emerald bands across the horizon' },
  { name: 'Full Spectrum', colors: ['#FF1744', '#FFEA00', '#00E676', '#00B0FF', '#D500F9'], description: 'Rare full-spectrum aurora with all colors visible' },
];

export default function AuroraBorealisColorGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
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

  const copyText = `Aurora Borealis Palette: ${THEMES[selectedTheme].name}\nColors: ${palette.join(', ')}\n${THEMES[selectedTheme].description}\n\nCSS Variables:\n${palette.map((c, i) => `--aurora-${i + 1}: ${c};`).join('\n')}\n\nGradient:\nbackground: linear-gradient(180deg, #0D1B2A 0%, ${palette[2]} 50%, ${palette[0]} 100%);`;

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-theme`} className="block text-sm font-medium text-gray-700 mb-1">Aurora Theme</label>
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
        <button onClick={randomTheme} aria-label="Random theme" className="btn-primary bg-emerald-600 hover:bg-emerald-700">Random Theme</button>
      </div>

      <OutputArea hasContent={palette.length > 0}>
        <div className="space-y-3">
          <div className="text-sm text-gray-700">
            <span className="font-medium">{THEMES[selectedTheme].name}</span>
            <span className="text-gray-500 ml-2">— {THEMES[selectedTheme].description}</span>
          </div>

          <div className="rounded-lg overflow-hidden border border-gray-200" style={{ backgroundColor: '#0D1B2A' }}>
            <div className="h-28 w-full relative" style={{ background: `linear-gradient(180deg, #0D1B2A 0%, ${palette[2]}40 30%, ${palette[0]}60 60%, transparent 100%)` }}>
              <div className="absolute bottom-0 left-0 right-0 h-16" style={{ background: `linear-gradient(90deg, ${palette.map((c) => `${c}80`).join(', ')})`, filter: 'blur(8px)' }} />
            </div>
            <div className="p-4 flex justify-center gap-3">
              {palette.map((color, i) => (
                <div key={i} className="text-center">
                  <div className="w-10 h-10 rounded-full mx-auto" style={{ backgroundColor: color, boxShadow: `0 0 12px ${color}80` }} />
                  <span className="text-[10px] font-mono mt-1 block" style={{ color }}>{color}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {palette.map((color, i) => (
              <div key={i} className="text-center">
                <div className="w-full h-12 rounded-lg border border-gray-200" style={{ backgroundColor: color }} />
                <span className="text-xs font-mono text-gray-600 mt-1 block">{color}</span>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <h4 className="text-xs font-medium text-gray-700 mb-1">CSS Aurora Gradient</h4>
            <code className="text-xs font-mono text-gray-600 break-all">
              background: linear-gradient(180deg, #0D1B2A 0%, {palette[2]} 50%, {palette[0]} 100%);
            </code>
          </div>

          <CopyToClipboard text={copyText} />
        </div>
      </OutputArea>
    </div>
  );
}
