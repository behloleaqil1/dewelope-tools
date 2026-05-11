'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorInversionTool - Inverts any color (complement) and shows both original and inverted.
 * Inversion formula: inverted = 255 - channel for each R, G, B channel.
 */
export default function ColorInversionTool({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('#3498db');
  const [result, setResult] = useState<{ original: string; inverted: string; originalRgb: string; invertedRgb: string } | null>(null);
  const [error, setError] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const parseColor = (color: string): { r: number; g: number; b: number } | null => {
    // Handle hex
    let hex = color.trim();
    if (hex.startsWith('#')) hex = hex.slice(1);
    if (/^[0-9a-fA-F]{3}$/.test(hex)) {
      const r = parseInt(hex[0] + hex[0], 16);
      const g = parseInt(hex[1] + hex[1], 16);
      const b = parseInt(hex[2] + hex[2], 16);
      return { r, g, b };
    }
    if (/^[0-9a-fA-F]{6}$/.test(hex)) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return { r, g, b };
    }
    // Handle rgb()
    const rgbMatch = color.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i);
    if (rgbMatch) {
      return { r: parseInt(rgbMatch[1]), g: parseInt(rgbMatch[2]), b: parseInt(rgbMatch[3]) };
    }
    return null;
  };

  const toHex = (r: number, g: number, b: number): string => {
    return '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('');
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      if (!input.trim()) {
        setResult(null);
        setError('');
        return;
      }

      const parsed = parseColor(input);
      if (!parsed) {
        setError('Enter a valid hex (#RGB or #RRGGBB) or rgb() color');
        setResult(null);
        return;
      }

      setError('');
      const { r, g, b } = parsed;
      const ir = 255 - r;
      const ig = 255 - g;
      const ib = 255 - b;

      setResult({
        original: toHex(r, g, b),
        inverted: toHex(ir, ig, ib),
        originalRgb: `rgb(${r}, ${g}, ${b})`,
        invertedRgb: `rgb(${ir}, ${ig}, ${ib})`,
      });
    }, 200);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input]);

  const copyText = result
    ? `Original: ${result.original} / ${result.originalRgb}\nInverted: ${result.inverted} / ${result.invertedRgb}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter a color to invert
        </label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={result?.original || '#3498db'}
            onChange={(e) => setInput(e.target.value)}
            aria-label="Color picker"
            className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
          />
          <input
            id={`${toolId}-input`}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="#3498db or rgb(52, 152, 219)"
            aria-label={`Color input for ${toolName}`}
            className="input-field flex-1"
          />
        </div>
      </InputArea>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div
                  className="w-full h-24 rounded-lg border border-gray-200 mb-2"
                  style={{ backgroundColor: result.original }}
                />
                <div className="text-sm font-medium text-gray-800">Original</div>
                <div className="text-xs font-mono text-gray-600">{result.original}</div>
                <div className="text-xs font-mono text-gray-500">{result.originalRgb}</div>
              </div>
              <div className="text-center">
                <div
                  className="w-full h-24 rounded-lg border border-gray-200 mb-2"
                  style={{ backgroundColor: result.inverted }}
                />
                <div className="text-sm font-medium text-gray-800">Inverted</div>
                <div className="text-xs font-mono text-gray-600">{result.inverted}</div>
                <div className="text-xs font-mono text-gray-500">{result.invertedRgb}</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
              Inversion: R={255 - parseInt(result.original.slice(1, 3), 16)}, G={255 - parseInt(result.original.slice(3, 5), 16)}, B={255 - parseInt(result.original.slice(5, 7), 16)} → {result.inverted}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
