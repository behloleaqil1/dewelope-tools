'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorDistanceCalculator - Calculate perceptual distance (Delta E) between two colors.
 * Uses CIE76 Delta E formula for color difference measurement.
 */

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace('#', '');
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return null;
  return {
    r: parseInt(clean.substring(0, 2), 16),
    g: parseInt(clean.substring(2, 4), 16),
    b: parseInt(clean.substring(4, 6), 16),
  };
}

function rgbToLab(r: number, g: number, b: number): { L: number; a: number; b: number } {
  // sRGB to linear
  let rr = r / 255;
  let gg = g / 255;
  let bb = b / 255;

  rr = rr > 0.04045 ? Math.pow((rr + 0.055) / 1.055, 2.4) : rr / 12.92;
  gg = gg > 0.04045 ? Math.pow((gg + 0.055) / 1.055, 2.4) : gg / 12.92;
  bb = bb > 0.04045 ? Math.pow((bb + 0.055) / 1.055, 2.4) : bb / 12.92;

  // Linear RGB to XYZ (D65)
  let x = (rr * 0.4124564 + gg * 0.3575761 + bb * 0.1804375) / 0.95047;
  let y = (rr * 0.2126729 + gg * 0.7151522 + bb * 0.0721750) / 1.00000;
  let z = (rr * 0.0193339 + gg * 0.1191920 + bb * 0.9503041) / 1.08883;

  // XYZ to Lab
  const f = (t: number) => t > 0.008856 ? Math.pow(t, 1 / 3) : (7.787 * t) + 16 / 116;
  x = f(x);
  y = f(y);
  z = f(z);

  return {
    L: (116 * y) - 16,
    a: 500 * (x - y),
    b: 200 * (y - z),
  };
}

function deltaE(lab1: { L: number; a: number; b: number }, lab2: { L: number; a: number; b: number }): number {
  return Math.sqrt(
    Math.pow(lab2.L - lab1.L, 2) +
    Math.pow(lab2.a - lab1.a, 2) +
    Math.pow(lab2.b - lab1.b, 2)
  );
}

function getPerceptionLabel(de: number): string {
  if (de <= 1) return 'Not perceptible by human eyes';
  if (de <= 2) return 'Perceptible through close observation';
  if (de <= 10) return 'Perceptible at a glance';
  if (de <= 49) return 'Colors are more similar than different';
  return 'Colors are more different than similar';
}

export default function ColorDistanceCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [color1, setColor1] = useState('#3b82f6');
  const [color2, setColor2] = useState('#ef4444');
  const [result, setResult] = useState<{ deltaE: number; perception: string; lab1: { L: number; a: number; b: number }; lab2: { L: number; a: number; b: number } } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const calculate = () => {
    const newErrors: Record<string, string> = {};
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);

    if (!rgb1) newErrors.color1 = 'Invalid hex color';
    if (!rgb2) newErrors.color2 = 'Invalid hex color';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});
    const lab1 = rgbToLab(rgb1!.r, rgb1!.g, rgb1!.b);
    const lab2 = rgbToLab(rgb2!.r, rgb2!.g, rgb2!.b);
    const de = deltaE(lab1, lab2);

    setResult({ deltaE: de, perception: getPerceptionLabel(de), lab1, lab2 });
  };

  const copyText = result
    ? `Color 1: ${color1}\nColor 2: ${color2}\nDelta E (CIE76): ${result.deltaE.toFixed(2)}\nPerception: ${result.perception}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-2 gap-4">
        <InputArea error={errors.color1}>
          <label htmlFor={`${toolId}-color1`} className="block text-sm font-medium text-gray-700 mb-1">
            Color 1
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={color1}
              onChange={(e) => setColor1(e.target.value)}
              className="w-12 h-10 rounded cursor-pointer border border-gray-300"
              aria-label="Color 1 picker"
            />
            <input
              id={`${toolId}-color1`}
              type="text"
              value={color1}
              onChange={(e) => {
                setColor1(e.target.value);
                if (errors.color1) setErrors((prev) => ({ ...prev, color1: '' }));
              }}
              placeholder="#3b82f6"
              aria-label={`Color 1 hex for ${toolName}`}
              className="input-field flex-1 font-mono"
            />
          </div>
        </InputArea>

        <InputArea error={errors.color2}>
          <label htmlFor={`${toolId}-color2`} className="block text-sm font-medium text-gray-700 mb-1">
            Color 2
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={color2}
              onChange={(e) => setColor2(e.target.value)}
              className="w-12 h-10 rounded cursor-pointer border border-gray-300"
              aria-label="Color 2 picker"
            />
            <input
              id={`${toolId}-color2`}
              type="text"
              value={color2}
              onChange={(e) => {
                setColor2(e.target.value);
                if (errors.color2) setErrors((prev) => ({ ...prev, color2: '' }));
              }}
              placeholder="#ef4444"
              aria-label={`Color 2 hex for ${toolName}`}
              className="input-field flex-1 font-mono"
            />
          </div>
        </InputArea>
      </div>

      <button onClick={calculate} aria-label="Calculate color distance" className="btn-primary">
        Calculate Distance
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="flex gap-2 items-center justify-center">
              <div className="w-16 h-16 rounded-lg border border-gray-300" style={{ backgroundColor: color1 }} />
              <span className="text-gray-400 text-xl">↔</span>
              <div className="w-16 h-16 rounded-lg border border-gray-300" style={{ backgroundColor: color2 }} />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-3xl font-bold text-blue-600">{result.deltaE.toFixed(2)}</div>
              <div className="text-xs text-gray-500 mt-1">Delta E (CIE76)</div>
              <div className="text-sm text-gray-600 mt-2">{result.perception}</div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 grid grid-cols-2 gap-2">
              <div>
                <p className="font-medium">Color 1 Lab:</p>
                <p className="font-mono text-xs">L: {result.lab1.L.toFixed(2)}, a: {result.lab1.a.toFixed(2)}, b: {result.lab1.b.toFixed(2)}</p>
              </div>
              <div>
                <p className="font-medium">Color 2 Lab:</p>
                <p className="font-mono text-xs">L: {result.lab2.L.toFixed(2)}, a: {result.lab2.a.toFixed(2)}, b: {result.lab2.b.toFixed(2)}</p>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
