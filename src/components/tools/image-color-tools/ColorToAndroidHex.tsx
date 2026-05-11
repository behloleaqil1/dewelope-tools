'use client';

import { useState, useEffect } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorToAndroidHex - Convert colors to Android ARGB hex format (#AARRGGBB).
 * Supports input as hex, RGB, or color picker with adjustable alpha.
 */
export default function ColorToAndroidHex({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [hexInput, setHexInput] = useState('#3498db');
  const [alpha, setAlpha] = useState(255);
  const [result, setResult] = useState<{ argb: string; rgb: string; r: number; g: number; b: number; a: number; javaInt: string } | null>(null);

  useEffect(() => {
    const hex = hexInput.replace('#', '').trim();
    let r = 0, g = 0, b = 0;

    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    } else if (hex.length === 6) {
      r = parseInt(hex.substring(0, 2), 16);
      g = parseInt(hex.substring(2, 4), 16);
      b = parseInt(hex.substring(4, 6), 16);
    } else {
      setResult(null);
      return;
    }

    if (isNaN(r) || isNaN(g) || isNaN(b)) {
      setResult(null);
      return;
    }

    const a = Math.max(0, Math.min(255, alpha));
    const alphaHex = a.toString(16).padStart(2, '0').toUpperCase();
    const rHex = r.toString(16).padStart(2, '0').toUpperCase();
    const gHex = g.toString(16).padStart(2, '0').toUpperCase();
    const bHex = b.toString(16).padStart(2, '0').toUpperCase();

    const argb = `#${alphaHex}${rHex}${gHex}${bHex}`;
    const rgb = `#${rHex}${gHex}${bHex}`;

    // Java/Kotlin Color.parseColor integer
    const intValue = ((a << 24) | (r << 16) | (g << 8) | b) >>> 0;
    const javaInt = `0x${intValue.toString(16).toUpperCase().padStart(8, '0')}`;

    setResult({ argb, rgb, r, g, b, a, javaInt });
  }, [hexInput, alpha]);

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-color`} className="block text-sm font-medium text-gray-700 mb-1">Color Picker</label>
          <input id={`${toolId}-color`} type="color" value={hexInput.length === 4 || hexInput.length === 7 ? hexInput : '#000000'} onChange={(e) => setHexInput(e.target.value)} className="w-full h-12 rounded cursor-pointer" aria-label={`Color picker for ${toolName}`} />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-hex`} className="block text-sm font-medium text-gray-700 mb-1">Hex Color</label>
          <input id={`${toolId}-hex`} type="text" value={hexInput} onChange={(e) => setHexInput(e.target.value)} placeholder="#3498db" aria-label="Hex color input" className="input-field font-mono" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-alpha`} className="block text-sm font-medium text-gray-700 mb-1">Alpha (0-255): {alpha}</label>
          <input id={`${toolId}-alpha`} type="range" min="0" max="255" value={alpha} onChange={(e) => setAlpha(Number(e.target.value))} className="w-full" aria-label="Alpha value" />
        </InputArea>
      </div>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-16 h-16 rounded-lg border border-gray-300" style={{ backgroundColor: result.rgb, opacity: result.a / 255 }} />
              <div>
                <div className="text-sm text-gray-500">Preview (with alpha)</div>
                <div className="font-mono text-lg font-bold text-gray-800">{result.argb}</div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="text-xs text-gray-500 mb-1">Android ARGB Hex</div>
                <div className="font-mono font-bold text-gray-800">{result.argb}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="text-xs text-gray-500 mb-1">Java/Kotlin Int</div>
                <div className="font-mono font-bold text-gray-800">{result.javaInt}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="text-xs text-gray-500 mb-1">RGB Values</div>
                <div className="font-mono text-gray-800">R: {result.r}, G: {result.g}, B: {result.b}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="text-xs text-gray-500 mb-1">Alpha</div>
                <div className="font-mono text-gray-800">{result.a} ({((result.a / 255) * 100).toFixed(0)}%)</div>
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="text-xs text-gray-500 mb-1">Android XML Usage</div>
              <pre className="font-mono text-sm text-gray-800">{`android:color="${result.argb}"`}</pre>
            </div>
            <CopyToClipboard text={result.argb} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
