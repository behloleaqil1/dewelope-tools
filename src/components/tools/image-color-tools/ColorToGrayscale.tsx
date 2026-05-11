'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorToGrayscale - Converts any color to its grayscale equivalent using the luminance formula.
 * Luminance = 0.2126 × R + 0.7152 × G + 0.0722 × B
 */
export default function ColorToGrayscale({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{ gray: number; hex: string; rgb: string; originalRgb: { r: number; g: number; b: number } } | null>(null);
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
      let r: number, g: number, b: number;

      // Try hex
      const hexMatch = trimmed.match(/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
      if (hexMatch) {
        const hex = hexMatch[1];
        if (hex.length === 3) {
          r = parseInt(hex[0] + hex[0], 16);
          g = parseInt(hex[1] + hex[1], 16);
          b = parseInt(hex[2] + hex[2], 16);
        } else {
          r = parseInt(hex.slice(0, 2), 16);
          g = parseInt(hex.slice(2, 4), 16);
          b = parseInt(hex.slice(4, 6), 16);
        }
      } else {
        // Try rgb()
        const rgbMatch = trimmed.match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/);
        if (rgbMatch) {
          r = parseInt(rgbMatch[1]);
          g = parseInt(rgbMatch[2]);
          b = parseInt(rgbMatch[3]);
          if (r > 255 || g > 255 || b > 255) {
            setError('RGB values must be 0-255');
            setResult(null);
            return;
          }
        } else {
          setError('Enter a hex color (#RGB or #RRGGBB) or rgb(r, g, b)');
          setResult(null);
          return;
        }
      }

      // Luminance formula (ITU-R BT.709)
      const gray = Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b);
      const grayHex = `#${gray.toString(16).padStart(2, '0').repeat(3)}`.toUpperCase();
      const grayRgb = `rgb(${gray}, ${gray}, ${gray})`;

      setResult({ gray, hex: grayHex, rgb: grayRgb, originalRgb: { r, g, b } });
      setError('');
    }, 300);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input]);

  const copyText = result
    ? `Original: rgb(${result.originalRgb.r}, ${result.originalRgb.g}, ${result.originalRgb.b})\nGrayscale Value: ${result.gray}\nGrayscale Hex: ${result.hex}\nGrayscale RGB: ${result.rgb}\nFormula: L = 0.2126×R + 0.7152×G + 0.0722×B`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter Color (Hex or RGB)
        </label>
        <input
          id={`${toolId}-input`}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="#FF5733 or rgb(255, 87, 51)"
          aria-label={`Color input for ${toolName}`}
          className="input-field font-mono"
        />
      </InputArea>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div
                  className="w-16 h-16 rounded-lg border border-gray-300 shadow-sm"
                  style={{ backgroundColor: `rgb(${result.originalRgb.r}, ${result.originalRgb.g}, ${result.originalRgb.b})` }}
                  aria-label="Original color preview"
                />
                <div className="text-xs text-gray-500 mt-1">Original</div>
              </div>
              <div className="text-2xl text-gray-400">→</div>
              <div className="text-center">
                <div
                  className="w-16 h-16 rounded-lg border border-gray-300 shadow-sm"
                  style={{ backgroundColor: result.hex }}
                  aria-label="Grayscale color preview"
                />
                <div className="text-xs text-gray-500 mt-1">Grayscale</div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between bg-gray-50 p-2 rounded border border-gray-200">
                <span className="text-sm text-gray-600">Grayscale Value</span>
                <span className="text-sm font-mono font-bold text-gray-800">{result.gray}</span>
              </div>
              <div className="flex justify-between bg-gray-50 p-2 rounded border border-gray-200">
                <span className="text-sm text-gray-600">Hex</span>
                <span className="text-sm font-mono font-bold text-gray-800">{result.hex}</span>
              </div>
              <div className="flex justify-between bg-gray-50 p-2 rounded border border-gray-200">
                <span className="text-sm text-gray-600">RGB</span>
                <span className="text-sm font-mono font-bold text-gray-800">{result.rgb}</span>
              </div>
            </div>

            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
              L = 0.2126×{result.originalRgb.r} + 0.7152×{result.originalRgb.g} + 0.0722×{result.originalRgb.b} = {result.gray}
            </div>

            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
