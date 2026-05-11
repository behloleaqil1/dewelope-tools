'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * HslToHexConverter - Convert HSL values to HEX and RGB with live preview.
 */
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;

  if (h < 60) { r = c; g = x; b = 0; }
  else if (h < 120) { r = x; g = c; b = 0; }
  else if (h < 180) { r = 0; g = c; b = x; }
  else if (h < 240) { r = 0; g = x; b = c; }
  else if (h < 300) { r = x; g = 0; b = c; }
  else { r = c; g = 0; b = x; }

  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
  ];
}

export default function HslToHexConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [hue, setHue] = useState('210');
  const [saturation, setSaturation] = useState('70');
  const [lightness, setLightness] = useState('50');

  const h = Math.min(360, Math.max(0, parseInt(hue) || 0));
  const s = Math.min(100, Math.max(0, parseInt(saturation) || 0));
  const l = Math.min(100, Math.max(0, parseInt(lightness) || 0));

  const [r, g, b] = hslToRgb(h, s, l);
  const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();
  const hslStr = `hsl(${h}, ${s}%, ${l}%)`;
  const rgbStr = `rgb(${r}, ${g}, ${b})`;

  const copyText = `HSL: ${hslStr}\nHEX: ${hex}\nRGB: ${rgbStr}`;

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-2">HSL Values</label>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor={`${toolId}-h`} className="block text-xs text-gray-500 mb-1">Hue (0-360)</label>
            <input id={`${toolId}-h`} type="number" min="0" max="360" value={hue} onChange={(e) => setHue(e.target.value)} aria-label={`Hue for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-s`} className="block text-xs text-gray-500 mb-1">Saturation (0-100)</label>
            <input id={`${toolId}-s`} type="number" min="0" max="100" value={saturation} onChange={(e) => setSaturation(e.target.value)} aria-label={`Saturation for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-l`} className="block text-xs text-gray-500 mb-1">Lightness (0-100)</label>
            <input id={`${toolId}-l`} type="number" min="0" max="100" value={lightness} onChange={(e) => setLightness(e.target.value)} aria-label={`Lightness for ${toolName}`} className="input-field" />
          </div>
        </div>
        <div className="mt-3">
          <input type="range" min="0" max="360" value={h} onChange={(e) => setHue(e.target.value)} className="w-full" aria-label="Hue slider" />
        </div>
      </InputArea>

      <OutputArea hasContent={true}>
        <div className="space-y-3">
          <div className="w-full h-24 rounded-lg border border-gray-200" style={{ backgroundColor: hex }} aria-label="Color preview" />
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
              <div className="text-lg font-bold text-gray-800 font-mono">{hex}</div>
              <div className="text-xs text-gray-500 mt-1">HEX</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
              <div className="text-lg font-bold text-gray-800 font-mono">{rgbStr}</div>
              <div className="text-xs text-gray-500 mt-1">RGB</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
              <div className="text-lg font-bold text-gray-800 font-mono">{hslStr}</div>
              <div className="text-xs text-gray-500 mt-1">HSL</div>
            </div>
          </div>
          <CopyToClipboard text={copyText} />
        </div>
      </OutputArea>
    </div>
  );
}
