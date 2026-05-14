'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorNameLookupTool - Find closest named color from hex input.
 */
export default function ColorNameLookupTool({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [color, setColor] = useState('#ff6347');
  const [result, setResult] = useState<{ name: string; hex: string; distance: number; exact: boolean } | null>(null);

  const NAMED_COLORS: Record<string, string> = {
    'Red': '#ff0000', 'Tomato': '#ff6347', 'Coral': '#ff7f50', 'Orange': '#ffa500',
    'Gold': '#ffd700', 'Yellow': '#ffff00', 'Lime': '#00ff00', 'Green': '#008000',
    'Teal': '#008080', 'Cyan': '#00ffff', 'Blue': '#0000ff', 'Navy': '#000080',
    'Purple': '#800080', 'Magenta': '#ff00ff', 'Pink': '#ffc0cb', 'HotPink': '#ff69b4',
    'Crimson': '#dc143c', 'Maroon': '#800000', 'Olive': '#808000', 'DarkGreen': '#006400',
    'SteelBlue': '#4682b4', 'SlateGray': '#708090', 'Indigo': '#4b0082', 'Violet': '#ee82ee',
    'White': '#ffffff', 'Black': '#000000', 'Gray': '#808080', 'Silver': '#c0c0c0',
    'DarkRed': '#8b0000', 'OrangeRed': '#ff4500', 'DarkOrange': '#ff8c00', 'Khaki': '#f0e68c',
    'Chocolate': '#d2691e', 'SaddleBrown': '#8b4513', 'Sienna': '#a0522d', 'Peru': '#cd853f',
    'Tan': '#d2b48c', 'Wheat': '#f5deb3', 'Beige': '#f5f5dc', 'Ivory': '#fffff0',
    'MidnightBlue': '#191970', 'DodgerBlue': '#1e90ff', 'RoyalBlue': '#4169e1', 'CornflowerBlue': '#6495ed',
  };

  function hexToRgb(hex: string): [number, number, number] {
    const h = hex.replace('#', '');
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }

  function colorDistance(hex1: string, hex2: string): number {
    const [r1, g1, b1] = hexToRgb(hex1);
    const [r2, g2, b2] = hexToRgb(hex2);
    return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
  }

  function lookup() {
    let closest = { name: '', hex: '', distance: Infinity };
    for (const [name, hex] of Object.entries(NAMED_COLORS)) {
      const dist = colorDistance(color.toLowerCase(), hex);
      if (dist < closest.distance) {
        closest = { name, hex, distance: dist };
      }
    }
    setResult({ ...closest, distance: Math.round(closest.distance * 100) / 100, exact: closest.distance === 0 });
  }

  const copyText = result ? `${result.name} (${result.hex})` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-color`} className="block text-sm font-medium text-gray-700 mb-1">Color</label>
        <div className="flex items-center gap-3">
          <input id={`${toolId}-color`} type="color" value={color} onChange={(e) => setColor(e.target.value)} aria-label={`Color input for ${toolName}`} className="w-12 h-10 rounded border border-gray-300 cursor-pointer" />
          <input type="text" value={color} onChange={(e) => setColor(e.target.value)} aria-label="Color hex value" className="input-field w-32 font-mono" />
        </div>
      </InputArea>

      <button onClick={lookup} aria-label="Find closest named color" className="btn-primary">
        Find Color Name
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="w-16 h-16 rounded-lg border border-gray-300" style={{ backgroundColor: result.hex }} />
              <div>
                <div className="text-xl font-bold text-gray-800">{result.name}</div>
                <div className="text-sm font-mono text-gray-500">{result.hex}</div>
                {result.exact ? (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">Exact match</span>
                ) : (
                  <span className="text-xs text-gray-500">Distance: {result.distance}</span>
                )}
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
