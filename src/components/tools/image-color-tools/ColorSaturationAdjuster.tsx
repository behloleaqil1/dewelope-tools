'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorSaturationAdjuster - Increase or decrease color saturation with live preview.
 */
export default function ColorSaturationAdjuster({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [color, setColor] = useState('#3b82f6');
  const [saturation, setSaturation] = useState(100);

  function hexToHsl(hex: string): [number, number, number] {
    const h = hex.replace('#', '');
    const r = parseInt(h.slice(0, 2), 16) / 255;
    const g = parseInt(h.slice(2, 4), 16) / 255;
    const b = parseInt(h.slice(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    let hue = 0;
    let sat = 0;

    if (max !== min) {
      const d = max - min;
      sat = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: hue = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: hue = ((b - r) / d + 2) / 6; break;
        case b: hue = ((r - g) / d + 4) / 6; break;
      }
    }

    return [Math.round(hue * 360), Math.round(sat * 100), Math.round(l * 100)];
  }

  function hslToHex(h: number, s: number, l: number): string {
    const sNorm = s / 100;
    const lNorm = l / 100;
    const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = lNorm - c / 2;
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
  const adjustedSat = Math.min(100, Math.max(0, Math.round(s * saturation / 100)));
  const adjustedColor = hslToHex(h, adjustedSat, l);

  // Generate saturation scale
  const scale = [0, 25, 50, 75, 100, 125, 150, 175, 200].map(pct => ({
    pct,
    color: hslToHex(h, Math.min(100, Math.max(0, Math.round(s * pct / 100))), l),
  }));

  const copyText = `Original: ${color} (HSL: ${h}°, ${s}%, ${l}%)\nAdjusted: ${adjustedColor} (HSL: ${h}°, ${adjustedSat}%, ${l}%)\nSaturation: ${saturation}%`;

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-2">Select color for {toolName}</label>
        <div className="flex items-center gap-4">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            aria-label="Color picker"
            className="w-16 h-16 rounded cursor-pointer border border-gray-200"
          />
          <input
            type="text"
            value={color}
            onChange={(e) => { if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) setColor(e.target.value); }}
            className="input-field font-mono w-32"
            aria-label="Hex color input"
          />
          <div className="text-sm text-gray-500">
            HSL: {h}°, {s}%, {l}%
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Saturation: {saturation}%
          </label>
          <input
            type="range"
            min="0"
            max="200"
            value={saturation}
            onChange={(e) => setSaturation(parseInt(e.target.value))}
            aria-label="Saturation adjustment"
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>0% (Grayscale)</span>
            <span>100% (Original)</span>
            <span>200% (Max)</span>
          </div>
        </div>
      </InputArea>

      <OutputArea hasContent={true}>
        <div className="space-y-3">
          <div className="flex h-24 rounded-lg overflow-hidden border border-gray-200">
            <div className="w-1/2 flex flex-col items-center justify-center" style={{ backgroundColor: color }}>
              <span className="text-xs font-mono bg-white/80 px-2 py-0.5 rounded">Original</span>
            </div>
            <div className="w-1/2 flex flex-col items-center justify-center" style={{ backgroundColor: adjustedColor }}>
              <span className="text-xs font-mono bg-white/80 px-2 py-0.5 rounded">Adjusted</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
              <div className="text-lg font-bold font-mono text-gray-800">{adjustedColor}</div>
              <div className="text-xs text-gray-500">Adjusted Hex</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
              <div className="text-lg font-bold font-mono text-gray-800">hsl({h}, {adjustedSat}%, {l}%)</div>
              <div className="text-xs text-gray-500">Adjusted HSL</div>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <div className="text-sm font-medium text-gray-700 mb-2">Saturation Scale</div>
            <div className="flex h-8 rounded overflow-hidden">
              {scale.map((s, i) => (
                <div key={i} className="flex-1" style={{ backgroundColor: s.color }} title={`${s.pct}%`} />
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0%</span>
              <span>100%</span>
              <span>200%</span>
            </div>
          </div>

          <CopyToClipboard text={copyText} />
        </div>
      </OutputArea>
    </div>
  );
}
