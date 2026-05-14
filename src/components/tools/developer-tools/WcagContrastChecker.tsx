'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * WcagContrastChecker - Checks color contrast ratio against WCAG AA/AAA standards.
 */
export default function WcagContrastChecker({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [foreground, setForeground] = useState('#000000');
  const [background, setBackground] = useState('#ffffff');
  const [result, setResult] = useState<{ ratio: number; aaLarge: boolean; aaNormal: boolean; aaaLarge: boolean; aaaNormal: boolean } | null>(null);
  const [error, setError] = useState<string | undefined>();

  const hexToRgb = (hex: string): [number, number, number] | null => {
    const match = hex.replace('#', '').match(/^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    if (!match) return null;
    return [parseInt(match[1], 16), parseInt(match[2], 16), parseInt(match[3], 16)];
  };

  const relativeLuminance = (r: number, g: number, b: number): number => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      const s = c / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const check = () => {
    setError(undefined);
    setResult(null);
    const fg = hexToRgb(foreground);
    const bg = hexToRgb(background);
    if (!fg || !bg) { setError('Enter valid hex colors (e.g., #000000)'); return; }
    const l1 = relativeLuminance(...fg);
    const l2 = relativeLuminance(...bg);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    const ratio = (lighter + 0.05) / (darker + 0.05);
    setResult({
      ratio: Math.round(ratio * 100) / 100,
      aaNormal: ratio >= 4.5,
      aaLarge: ratio >= 3,
      aaaNormal: ratio >= 7,
      aaaLarge: ratio >= 4.5,
    });
  };

  const copyText = result ? `Contrast Ratio: ${result.ratio}:1\nAA Normal Text: ${result.aaNormal ? 'PASS' : 'FAIL'}\nAA Large Text: ${result.aaLarge ? 'PASS' : 'FAIL'}\nAAA Normal Text: ${result.aaaNormal ? 'PASS' : 'FAIL'}\nAAA Large Text: ${result.aaaLarge ? 'PASS' : 'FAIL'}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${toolId}-fg`} className="block text-sm font-medium text-gray-700 mb-1">Foreground Color</label>
            <div className="flex gap-2">
              <input id={`${toolId}-fg`} type="color" value={foreground} onChange={(e) => setForeground(e.target.value)} aria-label="Foreground color picker" className="h-10 w-12 rounded border border-gray-300 cursor-pointer" />
              <input type="text" value={foreground} onChange={(e) => setForeground(e.target.value)} aria-label={`Foreground hex color for ${toolName}`} className="input-field font-mono flex-1" />
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-bg`} className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
            <div className="flex gap-2">
              <input id={`${toolId}-bg`} type="color" value={background} onChange={(e) => setBackground(e.target.value)} aria-label="Background color picker" className="h-10 w-12 rounded border border-gray-300 cursor-pointer" />
              <input type="text" value={background} onChange={(e) => setBackground(e.target.value)} aria-label="Background hex color" className="input-field font-mono flex-1" />
            </div>
          </div>
        </div>
      </InputArea>
      <div className="p-4 rounded-lg border" style={{ backgroundColor: background, color: foreground }}>
        <p className="text-lg font-bold">Sample Text Preview</p>
        <p className="text-sm">This is how your text will look with these colors.</p>
      </div>
      <button onClick={check} aria-label="Check contrast ratio" className="btn-primary">Check Contrast</button>
      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="text-center bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="text-3xl font-bold text-gray-800">{result.ratio}:1</div>
              <div className="text-sm text-gray-500">Contrast Ratio</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'AA Normal (≥4.5)', pass: result.aaNormal },
                { label: 'AA Large (≥3.0)', pass: result.aaLarge },
                { label: 'AAA Normal (≥7.0)', pass: result.aaaNormal },
                { label: 'AAA Large (≥4.5)', pass: result.aaaLarge },
              ].map(item => (
                <div key={item.label} className={`p-3 rounded-lg border text-center ${item.pass ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <div className={`text-sm font-bold ${item.pass ? 'text-green-700' : 'text-red-700'}`}>{item.pass ? 'PASS' : 'FAIL'}</div>
                  <div className="text-xs text-gray-600">{item.label}</div>
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
