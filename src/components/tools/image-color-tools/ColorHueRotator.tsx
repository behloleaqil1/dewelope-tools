'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorHueRotator - Rotates the hue of a color by a specified number of degrees with preview.
 */
export default function ColorHueRotator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [color, setColor] = useState('#ff0000');
  const [degrees, setDegrees] = useState(180);

  function hexToHsl(hex: string): [number, number, number] {
    const h = hex.replace('#', '');
    const r = parseInt(h.slice(0, 2), 16) / 255;
    const g = parseInt(h.slice(2, 4), 16) / 255;
    const b = parseInt(h.slice(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    let hue = 0;
    let s = 0;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) hue = ((g - b) / d + (g < b ? 6 : 0)) / 6;
      else if (max === g) hue = ((b - r) / d + 2) / 6;
      else hue = ((r - g) / d + 4) / 6;
    }

    return [hue * 360, s * 100, l * 100];
  }

  function hslToHex(h: number, s: number, l: number): string {
    h = ((h % 360) + 360) % 360;
    s = s / 100;
    l = l / 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;

    let r = 0, g = 0, b = 0;
    if (h < 60) { r = c; g = x; }
    else if (h < 120) { r = x; g = c; }
    else if (h < 180) { g = c; b = x; }
    else if (h < 240) { g = x; b = c; }
    else if (h < 300) { r = x; b = c; }
    else { r = c; b = x; }

    const toHex = (v: number) => Math.round((v + m) * 255).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  const [h, s, l] = hexToHsl(color);
  const rotatedHue = (h + degrees) % 360;
  const rotatedColor = hslToHex(rotatedHue, s, l);

  const copyText = `Original: ${color} (H: ${h.toFixed(1)}°)\nRotation: ${degrees}°\nResult: ${rotatedColor} (H: ${rotatedHue.toFixed(1)}°)`;

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-3">Rotate color hue for {toolName}</label>
        <div className="flex items-center gap-4">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            aria-label="Select color"
            className="w-16 h-16 rounded cursor-pointer border border-gray-200"
          />
          <div className="flex-1">
            <input
              type="text"
              value={color}
              onChange={(e) => { if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) setColor(e.target.value); }}
              aria-label="Color hex value"
              className="input-field text-sm font-mono"
            />
            <div className="text-xs text-gray-500 mt-1">Hue: {h.toFixed(1)}°</div>
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-xs text-gray-500 mb-1">Rotation: {degrees}°</label>
          <input
            type="range"
            min="0"
            max="359"
            value={degrees}
            onChange={(e) => setDegrees(parseInt(e.target.value))}
            aria-label="Hue rotation degrees"
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>0°</span>
            <span>90°</span>
            <span>180°</span>
            <span>270°</span>
            <span>359°</span>
          </div>
        </div>
      </InputArea>

      <OutputArea hasContent={true}>
        <div className="space-y-3">
          <div className="flex h-20 rounded-lg overflow-hidden border border-gray-200">
            <div className="w-1/2 flex items-center justify-center text-white text-sm font-mono" style={{ backgroundColor: color }}>
              {color}
            </div>
            <div className="w-1/2 flex items-center justify-center text-white text-sm font-mono" style={{ backgroundColor: rotatedColor }}>
              {rotatedColor}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
              <div className="text-sm font-bold font-mono text-gray-700">{color}</div>
              <div className="text-xs text-gray-500">Original (H: {h.toFixed(1)}°)</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
              <div className="text-sm font-bold font-mono text-gray-700">{rotatedColor}</div>
              <div className="text-xs text-gray-500">Rotated (H: {rotatedHue.toFixed(1)}°)</div>
            </div>
          </div>
          <CopyToClipboard text={copyText} />
        </div>
      </OutputArea>
    </div>
  );
}
