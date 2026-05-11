'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorToTailwind - Find the closest Tailwind CSS color class for any hex color.
 * Compares against the full Tailwind CSS v3 color palette.
 */
export default function ColorToTailwind({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ className: string; hex: string; distance: number; inputHex: string }[] | null>(null);

  const tailwindColors: Record<string, Record<string, string>> = {
    slate: { '50': '#f8fafc', '100': '#f1f5f9', '200': '#e2e8f0', '300': '#cbd5e1', '400': '#94a3b8', '500': '#64748b', '600': '#475569', '700': '#334155', '800': '#1e293b', '900': '#0f172a', '950': '#020617' },
    gray: { '50': '#f9fafb', '100': '#f3f4f6', '200': '#e5e7eb', '300': '#d1d5db', '400': '#9ca3af', '500': '#6b7280', '600': '#4b5563', '700': '#374151', '800': '#1f2937', '900': '#111827', '950': '#030712' },
    red: { '50': '#fef2f2', '100': '#fee2e2', '200': '#fecaca', '300': '#fca5a5', '400': '#f87171', '500': '#ef4444', '600': '#dc2626', '700': '#b91c1c', '800': '#991b1b', '900': '#7f1d1d', '950': '#450a0a' },
    orange: { '50': '#fff7ed', '100': '#ffedd5', '200': '#fed7aa', '300': '#fdba74', '400': '#fb923c', '500': '#f97316', '600': '#ea580c', '700': '#c2410c', '800': '#9a3412', '900': '#7c2d12', '950': '#431407' },
    yellow: { '50': '#fefce8', '100': '#fef9c3', '200': '#fef08a', '300': '#fde047', '400': '#facc15', '500': '#eab308', '600': '#ca8a04', '700': '#a16207', '800': '#854d0e', '900': '#713f12', '950': '#422006' },
    green: { '50': '#f0fdf4', '100': '#dcfce7', '200': '#bbf7d0', '300': '#86efac', '400': '#4ade80', '500': '#22c55e', '600': '#16a34a', '700': '#15803d', '800': '#166534', '900': '#14532d', '950': '#052e16' },
    blue: { '50': '#eff6ff', '100': '#dbeafe', '200': '#bfdbfe', '300': '#93c5fd', '400': '#60a5fa', '500': '#3b82f6', '600': '#2563eb', '700': '#1d4ed8', '800': '#1e40af', '900': '#1e3a8a', '950': '#172554' },
    indigo: { '50': '#eef2ff', '100': '#e0e7ff', '200': '#c7d2fe', '300': '#a5b4fc', '400': '#818cf8', '500': '#6366f1', '600': '#4f46e5', '700': '#4338ca', '800': '#3730a3', '900': '#312e81', '950': '#1e1b4b' },
    purple: { '50': '#faf5ff', '100': '#f3e8ff', '200': '#e9d5ff', '300': '#d8b4fe', '400': '#c084fc', '500': '#a855f7', '600': '#9333ea', '700': '#7e22ce', '800': '#6b21a8', '900': '#581c87', '950': '#3b0764' },
    pink: { '50': '#fdf2f8', '100': '#fce7f3', '200': '#fbcfe8', '300': '#f9a8d4', '400': '#f472b6', '500': '#ec4899', '600': '#db2777', '700': '#be185d', '800': '#9d174d', '900': '#831843', '950': '#500724' },
    teal: { '50': '#f0fdfa', '100': '#ccfbf1', '200': '#99f6e4', '300': '#5eead4', '400': '#2dd4bf', '500': '#14b8a6', '600': '#0d9488', '700': '#0f766e', '800': '#115e59', '900': '#134e4a', '950': '#042f2e' },
    cyan: { '50': '#ecfeff', '100': '#cffafe', '200': '#a5f3fc', '300': '#67e8f9', '400': '#22d3ee', '500': '#06b6d4', '600': '#0891b2', '700': '#0e7490', '800': '#155e75', '900': '#164e63', '950': '#083344' },
  };

  const hexToRgb = (hex: string): [number, number, number] | null => {
    const clean = hex.replace('#', '');
    let full = clean;
    if (clean.length === 3) full = clean[0] + clean[0] + clean[1] + clean[1] + clean[2] + clean[2];
    if (full.length !== 6 || !/^[0-9a-fA-F]{6}$/.test(full)) return null;
    return [parseInt(full.slice(0, 2), 16), parseInt(full.slice(2, 4), 16), parseInt(full.slice(4, 6), 16)];
  };

  const colorDistance = (a: [number, number, number], b: [number, number, number]): number => {
    return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2);
  };

  const findClosest = () => {
    const trimmed = input.trim();
    if (!trimmed) {
      setError('Please enter a hex color.');
      setResult(null);
      return;
    }

    const rgb = hexToRgb(trimmed);
    if (!rgb) {
      setError('Invalid hex color. Use format: #FF5733 or FF5733');
      setResult(null);
      return;
    }

    setError('');
    const inputHex = '#' + trimmed.replace('#', '').toUpperCase();

    const matches: { className: string; hex: string; distance: number; inputHex: string }[] = [];

    for (const [colorName, shades] of Object.entries(tailwindColors)) {
      for (const [shade, hex] of Object.entries(shades)) {
        const colorRgb = hexToRgb(hex)!;
        const dist = colorDistance(rgb, colorRgb);
        matches.push({ className: `${colorName}-${shade}`, hex, distance: Math.round(dist * 100) / 100, inputHex });
      }
    }

    matches.sort((a, b) => a.distance - b.distance);
    setResult(matches.slice(0, 5));
  };

  const copyText = result
    ? `Input: ${result[0]?.inputHex}\nClosest Tailwind colors:\n${result.map((m) => `${m.className} (${m.hex}) - distance: ${m.distance}`).join('\n')}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter a hex color
        </label>
        <div className="flex gap-2">
          <input
            id={`${toolId}-input`}
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (error) setError('');
            }}
            placeholder="e.g. #3B82F6 or 3B82F6"
            aria-label={`Hex color input for ${toolName}`}
            className="input-field flex-1"
          />
          {input && hexToRgb(input.trim()) && (
            <div
              className="w-10 h-10 rounded-lg border border-gray-300 flex-shrink-0"
              style={{ backgroundColor: input.startsWith('#') ? input : `#${input}` }}
              aria-label="Color preview"
            />
          )}
        </div>
      </InputArea>

      <button onClick={findClosest} aria-label="Find Tailwind color" className="btn-primary">
        Find Tailwind Color
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            {result.map((match, i) => (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-lg border ${i === 0 ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                <div className="w-10 h-10 rounded-lg border border-gray-300 flex-shrink-0" style={{ backgroundColor: match.hex }} />
                <div className="flex-1">
                  <div className="font-mono text-sm font-bold text-gray-800">{match.className}</div>
                  <div className="text-xs text-gray-500">{match.hex} • distance: {match.distance}</div>
                </div>
                {i === 0 && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Best match</span>}
              </div>
            ))}
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
