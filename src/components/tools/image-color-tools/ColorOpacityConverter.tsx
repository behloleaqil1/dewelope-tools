'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorOpacityConverter - Converts between hex with alpha (#RRGGBBAA) and rgba().
 * Supports 8-digit hex, 4-digit shorthand hex, and rgba() formats.
 */
export default function ColorOpacityConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{ hex8: string; rgba: string; r: number; g: number; b: number; a: number } | null>(null);
  const [error, setError] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!input.trim()) {
      setResult(null);
      setError('');
      return;
    }

    debounceRef.current = setTimeout(() => {
      const trimmed = input.trim();

      // Try parsing as hex (#RRGGBBAA, #RRGGBB, #RGBA, #RGB)
      const hexMatch = trimmed.match(/^#?([0-9a-fA-F]{3,8})$/);
      if (hexMatch) {
        const hex = hexMatch[1];
        let r: number, g: number, b: number, a: number;

        if (hex.length === 8) {
          r = parseInt(hex.slice(0, 2), 16);
          g = parseInt(hex.slice(2, 4), 16);
          b = parseInt(hex.slice(4, 6), 16);
          a = parseInt(hex.slice(6, 8), 16) / 255;
        } else if (hex.length === 6) {
          r = parseInt(hex.slice(0, 2), 16);
          g = parseInt(hex.slice(2, 4), 16);
          b = parseInt(hex.slice(4, 6), 16);
          a = 1;
        } else if (hex.length === 4) {
          r = parseInt(hex[0] + hex[0], 16);
          g = parseInt(hex[1] + hex[1], 16);
          b = parseInt(hex[2] + hex[2], 16);
          a = parseInt(hex[3] + hex[3], 16) / 255;
        } else if (hex.length === 3) {
          r = parseInt(hex[0] + hex[0], 16);
          g = parseInt(hex[1] + hex[1], 16);
          b = parseInt(hex[2] + hex[2], 16);
          a = 1;
        } else {
          setError('Invalid hex format. Use #RGB, #RGBA, #RRGGBB, or #RRGGBBAA');
          setResult(null);
          return;
        }

        const alphaHex = Math.round(a * 255).toString(16).padStart(2, '0');
        const hex8 = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}${alphaHex}`.toUpperCase();
        const rgba = `rgba(${r}, ${g}, ${b}, ${parseFloat(a.toFixed(3))})`;

        setResult({ hex8, rgba, r, g, b, a });
        setError('');
        return;
      }

      // Try parsing as rgba/rgb
      const rgbaMatch = trimmed.match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*([\d.]+))?\s*\)$/);
      if (rgbaMatch) {
        const r = parseInt(rgbaMatch[1]);
        const g = parseInt(rgbaMatch[2]);
        const b = parseInt(rgbaMatch[3]);
        const a = rgbaMatch[4] !== undefined ? parseFloat(rgbaMatch[4]) : 1;

        if (r > 255 || g > 255 || b > 255 || a > 1 || a < 0) {
          setError('Invalid RGBA values. R/G/B: 0-255, A: 0-1');
          setResult(null);
          return;
        }

        const alphaHex = Math.round(a * 255).toString(16).padStart(2, '0');
        const hex8 = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}${alphaHex}`.toUpperCase();
        const rgba = `rgba(${r}, ${g}, ${b}, ${parseFloat(a.toFixed(3))})`;

        setResult({ hex8, rgba, r, g, b, a });
        setError('');
        return;
      }

      setError('Enter a hex color (#RRGGBBAA) or rgba(r, g, b, a)');
      setResult(null);
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [input]);

  const copyText = result ? `Hex (8-digit): ${result.hex8}\nRGBA: ${result.rgba}\nR: ${result.r}, G: ${result.g}, B: ${result.b}, A: ${result.a.toFixed(3)}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter Color (Hex or RGBA)
        </label>
        <input
          id={`${toolId}-input`}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="#FF5733CC or rgba(255, 87, 51, 0.8)"
          aria-label={`Color input for ${toolName}`}
          className="input-field font-mono"
        />
      </InputArea>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-lg border border-gray-300 shadow-sm"
                style={{ backgroundColor: result.rgba }}
                aria-label="Color preview"
              />
              <div className="flex-1 space-y-1">
                <div className="text-sm">
                  <span className="text-gray-500">Hex (8-digit):</span>{' '}
                  <span className="font-mono font-bold text-gray-800">{result.hex8}</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">RGBA:</span>{' '}
                  <span className="font-mono font-bold text-gray-800">{result.rgba}</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Opacity:</span>{' '}
                  <span className="font-mono font-bold text-gray-800">{(result.a * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <div className="bg-gray-50 p-2 rounded border border-gray-200 text-center">
                <div className="text-lg font-bold text-red-600">{result.r}</div>
                <div className="text-xs text-gray-500">Red</div>
              </div>
              <div className="bg-gray-50 p-2 rounded border border-gray-200 text-center">
                <div className="text-lg font-bold text-green-600">{result.g}</div>
                <div className="text-xs text-gray-500">Green</div>
              </div>
              <div className="bg-gray-50 p-2 rounded border border-gray-200 text-center">
                <div className="text-lg font-bold text-blue-600">{result.b}</div>
                <div className="text-xs text-gray-500">Blue</div>
              </div>
              <div className="bg-gray-50 p-2 rounded border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-700">{result.a.toFixed(3)}</div>
                <div className="text-xs text-gray-500">Alpha</div>
              </div>
            </div>

            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
