'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CyberpunkNeonGenerator - Generate cyberpunk neon glow color palettes.
 * Creates vibrant neon palettes with dark backgrounds typical of cyberpunk aesthetics.
 */

interface NeonTheme {
  name: string;
  colors: string[];
  background: string;
  description: string;
}

const THEMES: NeonTheme[] = [
  { name: 'Tokyo Nights', colors: ['#FF00FF', '#00FFFF', '#FF1493', '#7B68EE', '#00FF7F'], background: '#0A0A1A', description: 'Magenta and cyan neons against deep midnight' },
  { name: 'Blade Runner', colors: ['#FF6B00', '#FF00AA', '#00BFFF', '#FFD700', '#8B00FF'], background: '#0D0D1A', description: 'Warm neons cutting through dark rain-soaked streets' },
  { name: 'Synthwave', colors: ['#FF00FF', '#FF6EC7', '#7DF9FF', '#39FF14', '#FFFF00'], background: '#1A0033', description: 'Retro-futuristic pinks and electric blues' },
  { name: 'Neon District', colors: ['#39FF14', '#FF073A', '#00FFFF', '#FF00FF', '#FFFF00'], background: '#0A0A0A', description: 'High-contrast neon signs in dark alleyways' },
  { name: 'Digital Rain', colors: ['#00FF41', '#00CC33', '#39FF14', '#7FFF00', '#ADFF2F'], background: '#000D00', description: 'Matrix-inspired cascading green phosphor' },
  { name: 'Akira Red', colors: ['#FF0000', '#FF1744', '#FF4081', '#FF6E40', '#FFAB40'], background: '#1A0000', description: 'Aggressive reds and oranges of neo-Tokyo' },
  { name: 'Ghost Shell', colors: ['#00E5FF', '#1DE9B6', '#00BFA5', '#64FFDA', '#A7FFEB'], background: '#001A1A', description: 'Cool cyborg teals and aqua interfaces' },
  { name: 'Vaporwave', colors: ['#FF71CE', '#01CDFE', '#05FFA1', '#B967FF', '#FFFB96'], background: '#1A0033', description: 'Pastel neons with nostalgic digital aesthetics' },
  { name: 'Chrome', colors: ['#C0C0C0', '#E8E8E8', '#00FFFF', '#FF00FF', '#FFFFFF'], background: '#0A0A1A', description: 'Metallic silvers with accent neon highlights' },
  { name: 'Outrun', colors: ['#FF2975', '#F222FF', '#8C1EFF', '#FF6600', '#FFCC00'], background: '#120024', description: 'Hot pinks and purples of endless highway' },
];

export default function CyberpunkNeonGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [selectedTheme, setSelectedTheme] = useState(0);
  const [palette, setPalette] = useState<string[]>(THEMES[0].colors);
  const [background, setBackground] = useState(THEMES[0].background);
  const [glowIntensity, setGlowIntensity] = useState(20);

  const selectTheme = (idx: number) => {
    setSelectedTheme(idx);
    setPalette(THEMES[idx].colors);
    setBackground(THEMES[idx].background);
  };

  const generateVariation = () => {
    const base = THEMES[selectedTheme].colors;
    const varied = base.map((color) => {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);

      // Shift hue slightly while keeping high saturation
      const shift = Math.floor((Math.random() - 0.5) * 40);
      const vr = Math.max(0, Math.min(255, r + shift));
      const vg = Math.max(0, Math.min(255, g + shift));
      const vb = Math.max(0, Math.min(255, b + shift));

      return `#${vr.toString(16).padStart(2, '0')}${vg.toString(16).padStart(2, '0')}${vb.toString(16).padStart(2, '0')}`.toUpperCase();
    });
    setPalette(varied);
  };

  const randomTheme = () => {
    const idx = Math.floor(Math.random() * THEMES.length);
    selectTheme(idx);
  };

  const copyText = `Cyberpunk Neon Palette: ${THEMES[selectedTheme].name}\nBackground: ${background}\nColors: ${palette.join(', ')}\n${THEMES[selectedTheme].description}\n\nCSS Variables:\n--bg: ${background};\n${palette.map((c, i) => `--neon-${i + 1}: ${c};`).join('\n')}\n--glow: 0 0 ${glowIntensity}px currentColor;`;

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-theme`} className="block text-sm font-medium text-gray-700 mb-1">Neon Theme</label>
        <select id={`${toolId}-theme`} value={selectedTheme} onChange={(e) => selectTheme(Number(e.target.value))} aria-label={`Theme for ${toolName}`} className="input-field">
          {THEMES.map((t, i) => (
            <option key={i} value={i}>{t.name}</option>
          ))}
        </select>
      </InputArea>

      <InputArea>
        <label htmlFor={`${toolId}-glow`} className="block text-sm font-medium text-gray-700 mb-1">Glow Intensity: {glowIntensity}px</label>
        <input id={`${toolId}-glow`} type="range" min="5" max="50" value={glowIntensity} onChange={(e) => setGlowIntensity(Number(e.target.value))} aria-label={`Glow intensity for ${toolName}`} className="w-full" />
      </InputArea>

      <div className="flex gap-3">
        <button onClick={generateVariation} aria-label="Generate variation" className="btn-primary">Generate Variation</button>
        <button onClick={randomTheme} aria-label="Random theme" className="btn-primary bg-purple-600 hover:bg-purple-700">Random Theme</button>
      </div>

      <OutputArea hasContent={palette.length > 0}>
        <div className="space-y-3">
          <div className="text-sm text-gray-700">
            <span className="font-medium">{THEMES[selectedTheme].name}</span>
            <span className="text-gray-500 ml-2">— {THEMES[selectedTheme].description}</span>
          </div>

          <div className="rounded-lg overflow-hidden border border-gray-200" style={{ backgroundColor: background }}>
            <div className="p-6 flex justify-center gap-4">
              {palette.map((color, i) => (
                <div key={i} className="text-center">
                  <div
                    className="w-12 h-12 rounded-full mx-auto"
                    style={{
                      backgroundColor: color,
                      boxShadow: `0 0 ${glowIntensity}px ${color}, 0 0 ${glowIntensity * 2}px ${color}40`,
                    }}
                  />
                  <span className="text-[10px] font-mono mt-2 block" style={{ color }}>{color}</span>
                </div>
              ))}
            </div>
            <div className="px-6 pb-4 text-center">
              <span className="text-xs font-mono" style={{ color: palette[0] }}>Background: {background}</span>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {palette.map((color, i) => (
              <div key={i} className="text-center">
                <div className="w-full h-10 rounded-lg border border-gray-200" style={{ backgroundColor: color }} />
                <span className="text-xs font-mono text-gray-600 mt-1 block">{color}</span>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <h4 className="text-xs font-medium text-gray-700 mb-1">CSS Glow Effect</h4>
            <code className="text-xs font-mono text-gray-600">
              box-shadow: 0 0 {glowIntensity}px {palette[0]}, 0 0 {glowIntensity * 2}px {palette[0]}40;
            </code>
          </div>

          <CopyToClipboard text={copyText} />
        </div>
      </OutputArea>
    </div>
  );
}
