'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromMood - Generates color palettes based on mood/emotion keywords.
 * Maps emotions to color theory principles for harmonious palettes.
 */
export default function ColorPaletteFromMood({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [mood, setMood] = useState('');
  const [paletteSize, setPaletteSize] = useState(5);
  const [palette, setPalette] = useState<{ hex: string; name: string }[]>([]);
  const [error, setError] = useState<string | undefined>();

  const moodColors: Record<string, { hueRange: [number, number]; satRange: [number, number]; lightRange: [number, number]; label: string }> = {
    happy: { hueRange: [40, 60], satRange: [70, 95], lightRange: [55, 75], label: 'Happy' },
    joyful: { hueRange: [35, 55], satRange: [75, 100], lightRange: [60, 80], label: 'Joyful' },
    calm: { hueRange: [180, 220], satRange: [30, 55], lightRange: [60, 80], label: 'Calm' },
    peaceful: { hueRange: [170, 210], satRange: [25, 50], lightRange: [65, 85], label: 'Peaceful' },
    serene: { hueRange: [190, 230], satRange: [20, 45], lightRange: [70, 90], label: 'Serene' },
    energetic: { hueRange: [0, 30], satRange: [80, 100], lightRange: [45, 65], label: 'Energetic' },
    passionate: { hueRange: [340, 360], satRange: [75, 100], lightRange: [40, 60], label: 'Passionate' },
    romantic: { hueRange: [320, 350], satRange: [50, 75], lightRange: [60, 80], label: 'Romantic' },
    sad: { hueRange: [210, 250], satRange: [20, 40], lightRange: [30, 50], label: 'Sad' },
    melancholy: { hueRange: [220, 260], satRange: [15, 35], lightRange: [35, 55], label: 'Melancholy' },
    mysterious: { hueRange: [260, 300], satRange: [40, 70], lightRange: [20, 45], label: 'Mysterious' },
    dark: { hueRange: [240, 280], satRange: [30, 60], lightRange: [10, 30], label: 'Dark' },
    warm: { hueRange: [15, 45], satRange: [60, 85], lightRange: [50, 70], label: 'Warm' },
    cozy: { hueRange: [20, 40], satRange: [45, 70], lightRange: [45, 65], label: 'Cozy' },
    cool: { hueRange: [180, 240], satRange: [40, 65], lightRange: [50, 70], label: 'Cool' },
    fresh: { hueRange: [100, 160], satRange: [50, 80], lightRange: [55, 75], label: 'Fresh' },
    natural: { hueRange: [80, 140], satRange: [35, 60], lightRange: [40, 65], label: 'Natural' },
    elegant: { hueRange: [270, 310], satRange: [25, 50], lightRange: [30, 55], label: 'Elegant' },
    luxurious: { hueRange: [40, 55], satRange: [70, 95], lightRange: [40, 55], label: 'Luxurious' },
    playful: { hueRange: [280, 330], satRange: [65, 90], lightRange: [55, 75], label: 'Playful' },
    angry: { hueRange: [0, 15], satRange: [80, 100], lightRange: [35, 50], label: 'Angry' },
    nostalgic: { hueRange: [30, 50], satRange: [30, 50], lightRange: [55, 75], label: 'Nostalgic' },
    futuristic: { hueRange: [180, 260], satRange: [70, 100], lightRange: [40, 60], label: 'Futuristic' },
    minimalist: { hueRange: [0, 360], satRange: [0, 10], lightRange: [40, 95], label: 'Minimalist' },
    tropical: { hueRange: [140, 180], satRange: [70, 100], lightRange: [45, 65], label: 'Tropical' },
  };

  const hslToHex = (h: number, s: number, l: number): string => {
    const sNorm = s / 100;
    const lNorm = l / 100;
    const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = lNorm - c / 2;
    let r = 0, g = 0, b = 0;
    if (h < 60) { r = c; g = x; }
    else if (h < 120) { r = x; g = c; }
    else if (h < 180) { g = c; b = x; }
    else if (h < 240) { g = x; b = c; }
    else if (h < 300) { r = x; b = c; }
    else { r = c; b = x; }
    const toHex = (val: number) => Math.round((val + m) * 255).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const seededRandom = (seed: number): number => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  const generate = () => {
    const moodKey = mood.trim().toLowerCase();
    if (!moodKey) {
      setError('Please enter a mood or emotion keyword');
      setPalette([]);
      return;
    }

    const config = moodColors[moodKey];
    if (!config) {
      const available = Object.keys(moodColors).join(', ');
      setError(`Unknown mood. Try: ${available}`);
      setPalette([]);
      return;
    }

    setError(undefined);
    const colors: { hex: string; name: string }[] = [];
    const seed = moodKey.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);

    for (let i = 0; i < paletteSize; i++) {
      const r1 = seededRandom(seed + i * 7);
      const r2 = seededRandom(seed + i * 13 + 3);
      const r3 = seededRandom(seed + i * 19 + 7);

      const h = config.hueRange[0] + r1 * (config.hueRange[1] - config.hueRange[0]);
      const s = config.satRange[0] + r2 * (config.satRange[1] - config.satRange[0]);
      const l = config.lightRange[0] + r3 * (config.lightRange[1] - config.lightRange[0]);

      const hex = hslToHex(h % 360, s, l);
      colors.push({ hex, name: `${config.label} ${i + 1}` });
    }

    setPalette(colors);
  };

  const copyText = palette.map(c => c.hex).join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-mood`} className="block text-sm font-medium text-gray-700 mb-1">
          Mood / Emotion Keyword
        </label>
        <input
          id={`${toolId}-mood`}
          type="text"
          value={mood}
          onChange={(e) => { setMood(e.target.value); if (error) setError(undefined); }}
          placeholder="e.g. calm, energetic, romantic, mysterious..."
          aria-label={`Mood keyword for ${toolName}`}
          className="input-field"
        />
        <p className="text-xs text-gray-500 mt-1">
          Available: happy, joyful, calm, peaceful, serene, energetic, passionate, romantic, sad, melancholy, mysterious, dark, warm, cozy, cool, fresh, natural, elegant, luxurious, playful, angry, nostalgic, futuristic, minimalist, tropical
        </p>
      </InputArea>

      <div>
        <label htmlFor={`${toolId}-size`} className="block text-sm font-medium text-gray-700 mb-1">
          Palette Size
        </label>
        <select
          id={`${toolId}-size`}
          value={paletteSize}
          onChange={(e) => setPaletteSize(parseInt(e.target.value))}
          aria-label="Number of colors"
          className="input-field w-32"
        >
          {[3, 4, 5, 6, 7, 8].map(n => (
            <option key={n} value={n}>{n} colors</option>
          ))}
        </select>
      </div>

      <button onClick={generate} aria-label="Generate palette from mood" className="btn-primary">
        Generate Palette
      </button>

      <OutputArea hasContent={palette.length > 0}>
        {palette.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">Generated Palette</h3>
              <CopyToClipboard text={copyText} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {palette.map((color, idx) => (
                <div key={idx} className="text-center">
                  <div
                    className="w-full h-20 rounded-lg border border-gray-200 mb-1"
                    style={{ backgroundColor: color.hex }}
                    aria-label={`Color ${idx + 1}: ${color.hex}`}
                  />
                  <span className="text-xs font-mono text-gray-600">{color.hex}</span>
                  <span className="block text-xs text-gray-400">{color.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
