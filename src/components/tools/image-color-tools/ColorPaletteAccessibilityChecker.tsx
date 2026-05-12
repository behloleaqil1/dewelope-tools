'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteAccessibilityChecker - Check entire color palette for WCAG compliance.
 * Tests all color combinations for contrast ratios and reports AA/AAA pass/fail.
 */
export default function ColorPaletteAccessibilityChecker({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [colors, setColors] = useState<string[]>(['#1a1a2e', '#16213e', '#0f3460', '#e94560', '#ffffff']);
  const [newColor, setNewColor] = useState('#000000');
  const [results, setResults] = useState<{
    pairs: { fg: string; bg: string; ratio: number; aaLarge: boolean; aaNormal: boolean; aaaLarge: boolean; aaaNormal: boolean }[];
    totalPairs: number;
    passingAA: number;
    passingAAA: number;
  } | null>(null);

  const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    const h = hex.replace('#', '');
    return {
      r: parseInt(h.substring(0, 2), 16),
      g: parseInt(h.substring(2, 4), 16),
      b: parseInt(h.substring(4, 6), 16),
    };
  };

  const relativeLuminance = (r: number, g: number, b: number): number => {
    const [rs, gs, bs] = [r, g, b].map((c) => {
      const s = c / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const contrastRatio = (hex1: string, hex2: string): number => {
    const c1 = hexToRgb(hex1);
    const c2 = hexToRgb(hex2);
    const l1 = relativeLuminance(c1.r, c1.g, c1.b);
    const l2 = relativeLuminance(c2.r, c2.g, c2.b);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  };

  const addColor = () => {
    if (colors.length < 12 && /^#[0-9a-fA-F]{6}$/.test(newColor)) {
      setColors([...colors, newColor]);
    }
  };

  const removeColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const checkAccessibility = () => {
    if (colors.length < 2) return;

    const pairs: { fg: string; bg: string; ratio: number; aaLarge: boolean; aaNormal: boolean; aaaLarge: boolean; aaaNormal: boolean }[] = [];

    for (let i = 0; i < colors.length; i++) {
      for (let j = 0; j < colors.length; j++) {
        if (i === j) continue;
        const ratio = contrastRatio(colors[i], colors[j]);
        pairs.push({
          fg: colors[i],
          bg: colors[j],
          ratio,
          aaNormal: ratio >= 4.5,
          aaLarge: ratio >= 3,
          aaaNormal: ratio >= 7,
          aaaLarge: ratio >= 4.5,
        });
      }
    }

    pairs.sort((a, b) => b.ratio - a.ratio);

    setResults({
      pairs,
      totalPairs: pairs.length,
      passingAA: pairs.filter((p) => p.aaNormal).length,
      passingAAA: pairs.filter((p) => p.aaaNormal).length,
    });
  };

  const copyText = results
    ? `WCAG Accessibility Report\nTotal Pairs: ${results.totalPairs}\nPassing AA (Normal): ${results.passingAA}\nPassing AAA (Normal): ${results.passingAAA}\n\n${results.pairs.map((p) => `${p.fg} on ${p.bg}: ${p.ratio.toFixed(2)}:1 - AA:${p.aaNormal ? 'PASS' : 'FAIL'} AAA:${p.aaaNormal ? 'PASS' : 'FAIL'}`).join('\n')}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-2">Color Palette</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {colors.map((color, i) => (
            <div key={i} className="flex items-center gap-1 bg-gray-100 rounded px-2 py-1">
              <div className="w-6 h-6 rounded border border-gray-300" style={{ background: color }} />
              <span className="text-xs font-mono">{color}</span>
              <button onClick={() => removeColor(i)} className="text-red-400 hover:text-red-600 text-xs ml-1" aria-label={`Remove color ${color}`}>×</button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="color"
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
            className="w-10 h-10 rounded cursor-pointer"
            aria-label={`Pick new color for ${toolName}`}
          />
          <input
            type="text"
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
            className="input-field flex-1"
            placeholder="#000000"
            aria-label={`New color hex value for ${toolName}`}
          />
          <button onClick={addColor} className="btn-primary text-sm" disabled={colors.length >= 12}>
            Add
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">{colors.length}/12 colors</p>
      </InputArea>

      <button onClick={checkAccessibility} aria-label="Check palette accessibility" className="btn-primary" disabled={colors.length < 2}>
        Check Accessibility
      </button>

      <OutputArea hasContent={results !== null}>
        {results && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-gray-700">{results.totalPairs}</div>
                <div className="text-xs text-gray-500">Total Pairs</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-green-600">{results.passingAA}</div>
                <div className="text-xs text-gray-500">Pass AA (4.5:1)</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600">{results.passingAAA}</div>
                <div className="text-xs text-gray-500">Pass AAA (7:1)</div>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              <table className="w-full text-xs border-collapse">
                <thead className="sticky top-0 bg-white">
                  <tr className="bg-gray-100">
                    <th className="p-2 border border-gray-200 text-left">Foreground</th>
                    <th className="p-2 border border-gray-200 text-left">Background</th>
                    <th className="p-2 border border-gray-200 text-center">Ratio</th>
                    <th className="p-2 border border-gray-200 text-center">AA</th>
                    <th className="p-2 border border-gray-200 text-center">AAA</th>
                    <th className="p-2 border border-gray-200 text-center">Preview</th>
                  </tr>
                </thead>
                <tbody>
                  {results.pairs.map((pair, i) => (
                    <tr key={i}>
                      <td className="p-2 border border-gray-200">
                        <div className="flex items-center gap-1">
                          <div className="w-4 h-4 rounded" style={{ background: pair.fg }} />
                          <span className="font-mono">{pair.fg}</span>
                        </div>
                      </td>
                      <td className="p-2 border border-gray-200">
                        <div className="flex items-center gap-1">
                          <div className="w-4 h-4 rounded" style={{ background: pair.bg }} />
                          <span className="font-mono">{pair.bg}</span>
                        </div>
                      </td>
                      <td className="p-2 border border-gray-200 text-center font-mono">{pair.ratio.toFixed(2)}:1</td>
                      <td className="p-2 border border-gray-200 text-center">
                        <span className={pair.aaNormal ? 'text-green-600 font-bold' : 'text-red-500'}>
                          {pair.aaNormal ? '✓' : '✗'}
                        </span>
                      </td>
                      <td className="p-2 border border-gray-200 text-center">
                        <span className={pair.aaaNormal ? 'text-green-600 font-bold' : 'text-red-500'}>
                          {pair.aaaNormal ? '✓' : '✗'}
                        </span>
                      </td>
                      <td className="p-2 border border-gray-200 text-center">
                        <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ color: pair.fg, background: pair.bg }}>
                          Aa
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
