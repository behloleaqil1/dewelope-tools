'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * MaterialDesignColorPicker - Material Design color system picker.
 */
export default function MaterialDesignColorPicker({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [selectedColor, setSelectedColor] = useState('blue');
  const [result, setResult] = useState<{ name: string; shades: { key: string; hex: string }[] } | null>(null);

  const MATERIAL_COLORS: Record<string, Record<string, string>> = {
    red: { '50': '#ffebee', '100': '#ffcdd2', '200': '#ef9a9a', '300': '#e57373', '400': '#ef5350', '500': '#f44336', '600': '#e53935', '700': '#d32f2f', '800': '#c62828', '900': '#b71c1c' },
    pink: { '50': '#fce4ec', '100': '#f8bbd0', '200': '#f48fb1', '300': '#f06292', '400': '#ec407a', '500': '#e91e63', '600': '#d81b60', '700': '#c2185b', '800': '#ad1457', '900': '#880e4f' },
    purple: { '50': '#f3e5f5', '100': '#e1bee7', '200': '#ce93d8', '300': '#ba68c8', '400': '#ab47bc', '500': '#9c27b0', '600': '#8e24aa', '700': '#7b1fa2', '800': '#6a1b9a', '900': '#4a148c' },
    blue: { '50': '#e3f2fd', '100': '#bbdefb', '200': '#90caf9', '300': '#64b5f6', '400': '#42a5f5', '500': '#2196f3', '600': '#1e88e5', '700': '#1976d2', '800': '#1565c0', '900': '#0d47a1' },
    green: { '50': '#e8f5e9', '100': '#c8e6c9', '200': '#a5d6a7', '300': '#81c784', '400': '#66bb6a', '500': '#4caf50', '600': '#43a047', '700': '#388e3c', '800': '#2e7d32', '900': '#1b5e20' },
    orange: { '50': '#fff3e0', '100': '#ffe0b2', '200': '#ffcc80', '300': '#ffb74d', '400': '#ffa726', '500': '#ff9800', '600': '#fb8c00', '700': '#f57c00', '800': '#ef6c00', '900': '#e65100' },
    grey: { '50': '#fafafa', '100': '#f5f5f5', '200': '#eeeeee', '300': '#e0e0e0', '400': '#bdbdbd', '500': '#9e9e9e', '600': '#757575', '700': '#616161', '800': '#424242', '900': '#212121' },
  };

  function pick() {
    const palette = MATERIAL_COLORS[selectedColor];
    if (!palette) return;
    const shades = Object.entries(palette).map(([key, hex]) => ({ key, hex }));
    setResult({ name: selectedColor, shades });
  }

  const copyText = result
    ? result.shades.map(s => `${result.name}-${s.key}: ${s.hex}`).join('\n')
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-color`} className="block text-sm font-medium text-gray-700 mb-1">Material Color</label>
        <select id={`${toolId}-color`} value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)} aria-label={`Material color for ${toolName}`} className="input-field w-40">
          {Object.keys(MATERIAL_COLORS).map(c => (
            <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
          ))}
        </select>
      </InputArea>

      <button onClick={pick} aria-label="Show Material Design colors" className="btn-primary">Show Palette</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="flex gap-0.5 h-12 rounded overflow-hidden">
              {result.shades.map(s => (
                <div key={s.key} className="flex-1" style={{ backgroundColor: s.hex }} title={`${s.key}: ${s.hex}`} />
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {result.shades.map(s => (
                <div key={s.key} className="text-center">
                  <div className="w-full h-8 rounded" style={{ backgroundColor: s.hex }} />
                  <div className="text-xs text-gray-600 mt-1">{s.key}</div>
                  <div className="text-xs font-mono text-gray-500">{s.hex}</div>
                </div>
              ))}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
