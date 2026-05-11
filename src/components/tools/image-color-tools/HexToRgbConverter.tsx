'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * HexToRgbConverter - Converts hex color codes to RGB, HSL, and provides a live preview.
 * Also converts RGB values back to hex.
 */
export default function HexToRgbConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [hex, setHex] = useState('#3b82f6');
  const [result, setResult] = useState<{ r: number; g: number; b: number; h: number; s: number; l: number } | null>(null);
  const [error, setError] = useState<string | undefined>();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      setError(undefined);
      const cleaned = hex.trim().replace('#', '');

      let fullHex = cleaned;
      if (cleaned.length === 3) {
        fullHex = cleaned.split('').map((c) => c + c).join('');
      }

      if (!/^[0-9a-fA-F]{6}$/.test(fullHex)) {
        if (cleaned.length > 0) setError('Enter a valid hex color (e.g., #3b82f6 or #fff)');
        setResult(null);
        return;
      }

      const r = parseInt(fullHex.substring(0, 2), 16);
      const g = parseInt(fullHex.substring(2, 4), 16);
      const b = parseInt(fullHex.substring(4, 6), 16);

      // Convert to HSL
      const rn = r / 255, gn = g / 255, bn = b / 255;
      const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
      const l = (max + min) / 2;
      let h = 0, s = 0;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; break;
          case gn: h = ((bn - rn) / d + 2) / 6; break;
          case bn: h = ((rn - gn) / d + 4) / 6; break;
        }
      }

      setResult({
        r, g, b,
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100),
      });
    }, 200);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [hex]);

  const displayHex = result ? `#${result.r.toString(16).padStart(2, '0')}${result.g.toString(16).padStart(2, '0')}${result.b.toString(16).padStart(2, '0')}` : '';
  const copyText = result
    ? `HEX: ${displayHex}\nRGB: rgb(${result.r}, ${result.g}, ${result.b})\nHSL: hsl(${result.h}, ${result.s}%, ${result.l}%)\nRGB Values: R=${result.r} G=${result.g} B=${result.b}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter hex color for {toolName}
        </label>
        <div className="flex items-center gap-3">
          <input
            id={`${toolId}-input`}
            type="text"
            value={hex}
            onChange={(e) => setHex(e.target.value)}
            placeholder="#3b82f6"
            aria-label="Hex color input"
            className="input-field font-mono flex-1"
          />
          {result && (
            <div
              className="w-14 h-10 rounded-lg border border-gray-200 flex-shrink-0"
              style={{ backgroundColor: displayHex }}
              aria-label={`Color preview: ${displayHex}`}
            />
          )}
        </div>
      </InputArea>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div
              className="w-full h-20 rounded-lg border border-gray-200"
              style={{ backgroundColor: displayHex }}
              aria-label={`Large color preview: ${displayHex}`}
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-sm font-bold text-gray-700 font-mono">{displayHex}</div>
                <div className="text-xs text-gray-500 mt-1">HEX</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-sm font-bold text-gray-700 font-mono">rgb({result.r}, {result.g}, {result.b})</div>
                <div className="text-xs text-gray-500 mt-1">RGB</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-sm font-bold text-gray-700 font-mono">hsl({result.h}, {result.s}%, {result.l}%)</div>
                <div className="text-xs text-gray-500 mt-1">HSL</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-red-50 p-3 rounded-lg border border-red-100 text-center">
                <div className="text-xl font-bold text-red-600">{result.r}</div>
                <div className="text-xs text-gray-500">Red</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-100 text-center">
                <div className="text-xl font-bold text-green-600">{result.g}</div>
                <div className="text-xs text-gray-500">Green</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-center">
                <div className="text-xl font-bold text-blue-600">{result.b}</div>
                <div className="text-xs text-gray-500">Blue</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
