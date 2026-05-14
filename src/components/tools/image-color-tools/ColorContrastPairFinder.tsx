'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorContrastPairFinder - Find accessible color pairs meeting WCAG contrast ratios.
 */
export default function ColorContrastPairFinder({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [baseColor, setBaseColor] = useState('#3b82f6');
  const [result, setResult] = useState<{ pairs: { bg: string; fg: string; ratio: number; level: string }[] } | null>(null);

  function hexToRgb(hex: string): [number, number, number] {
    const h = hex.replace('#', '');
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }

  function relativeLuminance(r: number, g: number, b: number): number {
    const [rs, gs, bs] = [r, g, b].map(c => {
      const s = c / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  function contrastRatio(hex1: string, hex2: string): number {
    const [r1, g1, b1] = hexToRgb(hex1);
    const [r2, g2, b2] = hexToRgb(hex2);
    const l1 = relativeLuminance(r1, g1, b1);
    const l2 = relativeLuminance(r2, g2, b2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  }

  function findPairs() {
    const candidates = ['#ffffff', '#000000', '#1a1a1a', '#f5f5f5', '#fefefe', '#111827', '#f9fafb', '#374151', '#e5e7eb', '#1f2937', '#f3f4f6', '#4b5563'];
    const pairs: { bg: string; fg: string; ratio: number; level: string }[] = [];

    for (const candidate of candidates) {
      const ratio = Math.round(contrastRatio(baseColor, candidate) * 100) / 100;
      let level = 'Fail';
      if (ratio >= 7) level = 'AAA';
      else if (ratio >= 4.5) level = 'AA';
      else if (ratio >= 3) level = 'AA Large';

      if (ratio >= 3) {
        pairs.push({ bg: baseColor, fg: candidate, ratio, level });
      }
    }

    pairs.sort((a, b) => b.ratio - a.ratio);
    setResult({ pairs: pairs.slice(0, 8) });
  }

  const copyText = result
    ? result.pairs.map(p => `${p.fg} on ${p.bg} — ${p.ratio}:1 (${p.level})`).join('\n')
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-color`} className="block text-sm font-medium text-gray-700 mb-1">Base Color</label>
        <div className="flex items-center gap-3">
          <input
            id={`${toolId}-color`}
            type="color"
            value={baseColor}
            onChange={(e) => setBaseColor(e.target.value)}
            aria-label={`Base color for ${toolName}`}
            className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
          />
          <input
            type="text"
            value={baseColor}
            onChange={(e) => setBaseColor(e.target.value)}
            aria-label="Base color hex value"
            className="input-field w-32 font-mono"
          />
        </div>
      </InputArea>

      <button onClick={findPairs} aria-label="Find accessible color pairs" className="btn-primary">
        Find Accessible Pairs
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            {result.pairs.map((p, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="w-16 h-10 rounded flex items-center justify-center text-xs font-bold" style={{ backgroundColor: p.bg, color: p.fg }}>
                  Aa
                </div>
                <div className="flex-1 text-sm">
                  <span className="font-mono">{p.fg}</span> on <span className="font-mono">{p.bg}</span>
                </div>
                <div className="text-sm font-medium">
                  <span className="text-gray-600">{p.ratio}:1</span>
                  <span className={`ml-2 px-2 py-0.5 rounded text-xs ${p.level === 'AAA' ? 'bg-green-100 text-green-800' : p.level === 'AA' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {p.level}
                  </span>
                </div>
              </div>
            ))}
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
