'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

type BlendMode = 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'difference';

function hexToRgb(hex: string): [number, number, number] | null {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return null;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
  return [r, g, b];
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((c) => Math.round(Math.max(0, Math.min(255, c))).toString(16).padStart(2, '0')).join('');
}

function blendChannel(a: number, b: number, mode: BlendMode): number {
  const an = a / 255;
  const bn = b / 255;
  let result: number;

  switch (mode) {
    case 'multiply': result = an * bn; break;
    case 'screen': result = 1 - (1 - an) * (1 - bn); break;
    case 'overlay': result = an < 0.5 ? 2 * an * bn : 1 - 2 * (1 - an) * (1 - bn); break;
    case 'darken': result = Math.min(an, bn); break;
    case 'lighten': result = Math.max(an, bn); break;
    case 'difference': result = Math.abs(an - bn); break;
    default: result = an;
  }

  return Math.round(result * 255);
}

/**
 * ColorBlendingModes - Simulate Photoshop blend modes between two colors.
 */
export default function ColorBlendingModes({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [color1, setColor1] = useState('#3b82f6');
  const [color2, setColor2] = useState('#ef4444');
  const [blendMode, setBlendMode] = useState<BlendMode>('multiply');
  const [result, setResult] = useState<{ hex: string; rgb: [number, number, number] } | null>(null);
  const [error, setError] = useState<string | undefined>();

  function handleBlend() {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);

    if (!rgb1 || !rgb2) {
      setError('Please enter valid hex colors');
      setResult(null);
      return;
    }

    setError(undefined);

    const blended: [number, number, number] = [
      blendChannel(rgb1[0], rgb2[0], blendMode),
      blendChannel(rgb1[1], rgb2[1], blendMode),
      blendChannel(rgb1[2], rgb2[2], blendMode),
    ];

    setResult({ hex: rgbToHex(...blended), rgb: blended });
  }

  const copyText = result ? `Blend Mode: ${blendMode}\nColor 1: ${color1}\nColor 2: ${color2}\nResult: ${result.hex} | rgb(${result.rgb.join(', ')})` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-color1`} className="block text-sm font-medium text-gray-700 mb-1">Base Color</label>
            <div className="flex gap-2">
              <input id={`${toolId}-color1`} type="color" value={color1} onChange={(e) => setColor1(e.target.value)} className="w-12 h-10 rounded border border-gray-300 cursor-pointer" aria-label={`Base color for ${toolName}`} />
              <input type="text" value={color1} onChange={(e) => setColor1(e.target.value)} className="input-field text-sm font-mono flex-1" aria-label="Base color hex value" />
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-color2`} className="block text-sm font-medium text-gray-700 mb-1">Blend Color</label>
            <div className="flex gap-2">
              <input id={`${toolId}-color2`} type="color" value={color2} onChange={(e) => setColor2(e.target.value)} className="w-12 h-10 rounded border border-gray-300 cursor-pointer" aria-label="Blend color" />
              <input type="text" value={color2} onChange={(e) => setColor2(e.target.value)} className="input-field text-sm font-mono flex-1" aria-label="Blend color hex value" />
            </div>
          </div>
        </div>
        <div className="mt-3">
          <label htmlFor={`${toolId}-mode`} className="block text-sm font-medium text-gray-700 mb-1">Blend Mode</label>
          <select id={`${toolId}-mode`} value={blendMode} onChange={(e) => setBlendMode(e.target.value as BlendMode)} className="input-field text-sm" aria-label="Blend mode">
            <option value="multiply">Multiply</option>
            <option value="screen">Screen</option>
            <option value="overlay">Overlay</option>
            <option value="darken">Darken</option>
            <option value="lighten">Lighten</option>
            <option value="difference">Difference</option>
          </select>
        </div>
      </InputArea>

      <button onClick={handleBlend} aria-label="Blend colors" className="btn-primary">
        Blend Colors
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded-lg border border-gray-300" style={{ backgroundColor: color1 }} />
                <span className="text-gray-400 text-lg">+</span>
                <div className="w-12 h-12 rounded-lg border border-gray-300" style={{ backgroundColor: color2 }} />
                <span className="text-gray-400 text-lg">=</span>
                <div className="w-12 h-12 rounded-lg border border-gray-300" style={{ backgroundColor: result.hex }} />
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="text-sm font-mono text-gray-800">
                <div>HEX: {result.hex}</div>
                <div>RGB: rgb({result.rgb.join(', ')})</div>
                <div>Mode: {blendMode}</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
