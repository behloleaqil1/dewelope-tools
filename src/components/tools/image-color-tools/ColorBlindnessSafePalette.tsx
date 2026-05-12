'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorBlindnessSafePalette - Generate palettes safe for all color vision types.
 * Uses colors that are distinguishable for protanopia, deuteranopia, and tritanopia.
 */

// Curated color-blind safe palettes (based on research by Wong, Okabe & Ito)
const SAFE_PALETTES = {
  'wong': {
    name: 'Wong (Nature)',
    colors: ['#000000', '#E69F00', '#56B4E9', '#009E73', '#F0E442', '#0072B2', '#D55E00', '#CC79A7'],
    description: 'Recommended by Nature journal, distinguishable for all CVD types',
  },
  'tol-bright': {
    name: 'Tol Bright',
    colors: ['#4477AA', '#EE6677', '#228833', '#CCBB44', '#66CCEE', '#AA3377', '#BBBBBB'],
    description: 'Paul Tol bright qualitative scheme',
  },
  'tol-muted': {
    name: 'Tol Muted',
    colors: ['#332288', '#88CCEE', '#44AA99', '#117733', '#999933', '#DDCC77', '#CC6677', '#882255', '#AA4499'],
    description: 'Paul Tol muted qualitative scheme',
  },
  'ibm': {
    name: 'IBM Design',
    colors: ['#648FFF', '#785EF0', '#DC267F', '#FE6100', '#FFB000'],
    description: 'IBM accessible color palette for data visualization',
  },
  'okabe-ito': {
    name: 'Okabe-Ito',
    colors: ['#E69F00', '#56B4E9', '#009E73', '#F0E442', '#0072B2', '#D55E00', '#CC79A7', '#000000'],
    description: 'Classic Okabe & Ito palette for universal accessibility',
  },
};

type PaletteKey = keyof typeof SAFE_PALETTES;

export default function ColorBlindnessSafePalette({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [selectedPalette, setSelectedPalette] = useState<PaletteKey>('wong');
  const [numColors, setNumColors] = useState(5);
  const [generated, setGenerated] = useState<string[]>([]);

  const generate = () => {
    const palette = SAFE_PALETTES[selectedPalette];
    const count = Math.min(numColors, palette.colors.length);
    setGenerated(palette.colors.slice(0, count));
  };

  const copyText = generated.join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-palette`} className="block text-sm font-medium text-gray-700 mb-1">
          Select Palette
        </label>
        <select
          id={`${toolId}-palette`}
          value={selectedPalette}
          onChange={(e) => setSelectedPalette(e.target.value as PaletteKey)}
          aria-label={`Palette selection for ${toolName}`}
          className="input-field"
        >
          {Object.entries(SAFE_PALETTES).map(([key, val]) => (
            <option key={key} value={key}>{val.name} ({val.colors.length} colors)</option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">{SAFE_PALETTES[selectedPalette].description}</p>
      </InputArea>

      <InputArea>
        <label htmlFor={`${toolId}-count`} className="block text-sm font-medium text-gray-700 mb-1">
          Number of Colors (max {SAFE_PALETTES[selectedPalette].colors.length})
        </label>
        <input
          id={`${toolId}-count`}
          type="number"
          min={2}
          max={SAFE_PALETTES[selectedPalette].colors.length}
          value={numColors}
          onChange={(e) => setNumColors(parseInt(e.target.value) || 2)}
          aria-label={`Number of colors for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <button onClick={generate} aria-label="Generate safe palette" className="btn-primary">
        Generate Palette
      </button>

      <OutputArea hasContent={generated.length > 0}>
        {generated.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">Color-Blind Safe Palette</label>
              <CopyToClipboard text={copyText} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {generated.map((color, idx) => (
                <div key={idx} className="text-center">
                  <div
                    className="w-full h-16 rounded-lg border border-gray-200 mb-1"
                    style={{ backgroundColor: color }}
                    aria-label={`Color ${idx + 1}: ${color}`}
                  />
                  <span className="text-xs font-mono text-gray-600">{color}</span>
                </div>
              ))}
            </div>
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-xs text-blue-700">
              These colors are designed to be distinguishable for people with protanopia (red-blind), deuteranopia (green-blind), and tritanopia (blue-blind) color vision deficiencies.
            </div>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
