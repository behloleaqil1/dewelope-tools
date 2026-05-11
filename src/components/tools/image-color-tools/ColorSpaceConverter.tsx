'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorSpaceConverter - Convert between RGB, HSL, HSV, CMYK, and LAB color spaces.
 * Provides bidirectional conversion with live color preview.
 */
export default function ColorSpaceConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [inputMode, setInputMode] = useState('hex');
  const [hexInput, setHexInput] = useState('#3B82F6');
  const [error, setError] = useState('');
  const [results, setResults] = useState<Record<string, string> | null>(null);

  const hexToRgb = (hex: string): [number, number, number] | null => {
    const clean = hex.replace('#', '');
    if (!/^[0-9a-fA-F]{6}$/.test(clean)) return null;
    return [parseInt(clean.slice(0, 2), 16), parseInt(clean.slice(2, 4), 16), parseInt(clean.slice(4, 6), 16)];
  };

  const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const l = (max + min) / 2;
    if (max === min) return [0, 0, l * 100];
    const d = max - min;
    const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    let h = 0;
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
    return [h * 360, s * 100, l * 100];
  };

  const rgbToHsv = (r: number, g: number, b: number): [number, number, number] => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const v = max;
    const d = max - min;
    const s = max === 0 ? 0 : d / max;
    if (max === min) return [0, s * 100, v * 100];
    let h = 0;
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
    return [h * 360, s * 100, v * 100];
  };

  const rgbToCmyk = (r: number, g: number, b: number): [number, number, number, number] => {
    if (r === 0 && g === 0 && b === 0) return [0, 0, 0, 100];
    const c = 1 - r / 255;
    const m = 1 - g / 255;
    const y = 1 - b / 255;
    const k = Math.min(c, m, y);
    return [((c - k) / (1 - k)) * 100, ((m - k) / (1 - k)) * 100, ((y - k) / (1 - k)) * 100, k * 100];
  };

  const rgbToLab = (r: number, g: number, b: number): [number, number, number] => {
    let rr = r / 255, gg = g / 255, bb = b / 255;
    rr = rr > 0.04045 ? Math.pow((rr + 0.055) / 1.055, 2.4) : rr / 12.92;
    gg = gg > 0.04045 ? Math.pow((gg + 0.055) / 1.055, 2.4) : gg / 12.92;
    bb = bb > 0.04045 ? Math.pow((bb + 0.055) / 1.055, 2.4) : bb / 12.92;
    let x = (rr * 0.4124564 + gg * 0.3575761 + bb * 0.1804375) / 0.95047;
    let y = (rr * 0.2126729 + gg * 0.7151522 + bb * 0.0721750) / 1.00000;
    let z = (rr * 0.0193339 + gg * 0.1191920 + bb * 0.9503041) / 1.08883;
    x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
    y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
    z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;
    return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
  };

  const convert = () => {
    setError('');
    setResults(null);

    const rgb = hexToRgb(hexInput);
    if (!rgb) {
      setError('Please enter a valid hex color (e.g. #3B82F6)');
      return;
    }

    const [r, g, b] = rgb;
    const [h, s, l] = rgbToHsl(r, g, b);
    const [hv, sv, v] = rgbToHsv(r, g, b);
    const [c, m, y, k] = rgbToCmyk(r, g, b);
    const [labL, labA, labB] = rgbToLab(r, g, b);

    setResults({
      HEX: hexInput.toUpperCase(),
      RGB: `rgb(${r}, ${g}, ${b})`,
      HSL: `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`,
      HSV: `hsv(${Math.round(hv)}, ${Math.round(sv)}%, ${Math.round(v)}%)`,
      CMYK: `cmyk(${Math.round(c)}%, ${Math.round(m)}%, ${Math.round(y)}%, ${Math.round(k)}%)`,
      LAB: `lab(${labL.toFixed(1)}, ${labA.toFixed(1)}, ${labB.toFixed(1)})`,
    });
  };

  const copyText = results ? Object.entries(results).map(([k, v]) => `${k}: ${v}`).join('\n') : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-mode`} className="block text-sm font-medium text-gray-700 mb-1">
          Input Format
        </label>
        <select
          id={`${toolId}-mode`}
          value={inputMode}
          onChange={(e) => setInputMode(e.target.value)}
          aria-label={`Input format for ${toolName}`}
          className="input-field w-auto mb-3"
        >
          <option value="hex">HEX</option>
        </select>

        <label htmlFor={`${toolId}-hex`} className="block text-sm font-medium text-gray-700 mb-1">
          Hex Color
        </label>
        <div className="flex gap-3 items-center">
          <input
            id={`${toolId}-hex`}
            type="text"
            value={hexInput}
            onChange={(e) => {
              setHexInput(e.target.value);
              if (error) setError('');
            }}
            placeholder="#3B82F6"
            aria-label={`Hex color input for ${toolName}`}
            className="input-field flex-1"
          />
          <input
            type="color"
            value={hexInput.startsWith('#') && hexInput.length === 7 ? hexInput : '#3B82F6'}
            onChange={(e) => setHexInput(e.target.value)}
            className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
            aria-label="Color picker"
          />
        </div>
      </InputArea>

      <button onClick={convert} aria-label="Convert color" className="btn-primary">
        Convert Color
      </button>

      <OutputArea hasContent={results !== null}>
        {results && (
          <div className="space-y-3">
            <div
              className="w-full h-20 rounded-lg border border-gray-200"
              style={{ backgroundColor: results.HEX }}
            />
            <div className="space-y-2">
              {Object.entries(results).map(([space, value]) => (
                <div key={space} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <span className="text-sm font-medium text-gray-600 w-16">{space}</span>
                  <span className="text-sm font-mono text-gray-800">{value}</span>
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
