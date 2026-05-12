'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorLightenDarken - Lighten or darken a color by exact percentage steps.
 */
export default function ColorLightenDarken({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [hex, setHex] = useState('#3b82f6');
  const [percent, setPercent] = useState('10');
  const [results, setResults] = useState<{ lighter: string[]; darker: string[] } | null>(null);
  const [error, setError] = useState<string | undefined>();

  function adjustColor(hexColor: string, amount: number): string {
    const c = hexColor.replace('#', '');
    const num = parseInt(c, 16);
    let r = (num >> 16) + amount;
    let g = ((num >> 8) & 0x00ff) + amount;
    let b = (num & 0x0000ff) + amount;
    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  }

  function generate() {
    setError(undefined);
    setResults(null);
    const cleaned = hex.trim();
    if (!/^#[0-9a-fA-F]{6}$/.test(cleaned)) { setError('Enter a valid 6-digit hex color'); return; }
    const pct = parseInt(percent);
    if (isNaN(pct) || pct <= 0 || pct > 50) { setError('Percentage must be 1-50'); return; }

    const lighter: string[] = [];
    const darker: string[] = [];
    for (let i = 1; i <= 5; i++) {
      const amount = Math.round((255 * pct * i) / 100);
      lighter.push(adjustColor(cleaned, amount));
      darker.push(adjustColor(cleaned, -amount));
    }
    setResults({ lighter, darker });
  }

  const copyText = results ? `Lighter: ${results.lighter.join(', ')}\nDarker: ${results.darker.join(', ')}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-hex`} className="block text-sm font-medium text-gray-700 mb-1">Color for {toolName}</label>
        <div className="flex gap-2 items-center">
          <input id={`${toolId}-hex`} type="text" value={hex} onChange={(e) => setHex(e.target.value)} placeholder="#3b82f6" aria-label="Hex color" className="input-field flex-1" />
          <input type="color" value={hex} onChange={(e) => setHex(e.target.value)} aria-label="Color picker" className="w-10 h-10 rounded border border-gray-300 cursor-pointer" />
          <input type="text" inputMode="numeric" value={percent} onChange={(e) => setPercent(e.target.value)} placeholder="10" aria-label="Step percentage" className="input-field w-20" />
          <span className="text-sm text-gray-500">%</span>
        </div>
      </InputArea>

      <button onClick={generate} aria-label="Generate lighter and darker shades" className="btn-primary">Generate</button>

      <OutputArea hasContent={results !== null}>
        {results && (
          <div className="space-y-3">
            <div><span className="text-sm font-medium text-gray-700">Lighter</span>
              <div className="flex gap-1 mt-1">{results.lighter.map((c, i) => (
                <div key={i} className="flex-1 text-center"><div className="h-10 rounded" style={{ backgroundColor: c }} /><span className="text-xs font-mono">{c}</span></div>
              ))}</div>
            </div>
            <div><span className="text-sm font-medium text-gray-700">Darker</span>
              <div className="flex gap-1 mt-1">{results.darker.map((c, i) => (
                <div key={i} className="flex-1 text-center"><div className="h-10 rounded" style={{ backgroundColor: c }} /><span className="text-xs font-mono">{c}</span></div>
              ))}</div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
