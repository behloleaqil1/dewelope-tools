'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorBlindnessSimulator - Simulates how colors appear to people with different types of color blindness.
 * Supports Protanopia, Deuteranopia, Tritanopia, and Achromatopsia.
 */
export default function ColorBlindnessSimulator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [color, setColor] = useState('#3b82f6');

  function hexToRgb(hex: string): [number, number, number] {
    const h = hex.replace('#', '');
    return [
      parseInt(h.substring(0, 2), 16),
      parseInt(h.substring(2, 4), 16),
      parseInt(h.substring(4, 6), 16),
    ];
  }

  function rgbToHex(r: number, g: number, b: number): string {
    const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
    return '#' + [clamp(r), clamp(g), clamp(b)].map((v) => v.toString(16).padStart(2, '0')).join('');
  }

  // Color blindness simulation matrices (linearized sRGB)
  function simulateColorBlindness(rgb: [number, number, number], type: string): [number, number, number] {
    const [r, g, b] = rgb.map((v) => v / 255);

    // Convert to linear RGB
    const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
    const lr = toLinear(r), lg = toLinear(g), lb = toLinear(b);

    let sr: number, sg: number, sb: number;

    switch (type) {
      case 'protanopia': // No red cones
        sr = 0.567 * lr + 0.433 * lg + 0.0 * lb;
        sg = 0.558 * lr + 0.442 * lg + 0.0 * lb;
        sb = 0.0 * lr + 0.242 * lg + 0.758 * lb;
        break;
      case 'deuteranopia': // No green cones
        sr = 0.625 * lr + 0.375 * lg + 0.0 * lb;
        sg = 0.7 * lr + 0.3 * lg + 0.0 * lb;
        sb = 0.0 * lr + 0.3 * lg + 0.7 * lb;
        break;
      case 'tritanopia': // No blue cones
        sr = 0.95 * lr + 0.05 * lg + 0.0 * lb;
        sg = 0.0 * lr + 0.433 * lg + 0.567 * lb;
        sb = 0.0 * lr + 0.475 * lg + 0.525 * lb;
        break;
      case 'achromatopsia': // Total color blindness
        const gray = 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
        sr = gray; sg = gray; sb = gray;
        break;
      default:
        sr = lr; sg = lg; sb = lb;
    }

    // Convert back to sRGB
    const toSrgb = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);
    return [toSrgb(sr) * 255, toSrgb(sg) * 255, toSrgb(sb) * 255];
  }

  const types = [
    { id: 'protanopia', name: 'Protanopia', desc: 'No red cones (~1% of males)' },
    { id: 'deuteranopia', name: 'Deuteranopia', desc: 'No green cones (~1% of males)' },
    { id: 'tritanopia', name: 'Tritanopia', desc: 'No blue cones (very rare)' },
    { id: 'achromatopsia', name: 'Achromatopsia', desc: 'Total color blindness (very rare)' },
  ];

  const rgb = hexToRgb(color);
  const simulations = types.map((t) => ({
    ...t,
    hex: rgbToHex(...simulateColorBlindness(rgb, t.id)),
  }));

  const copyText = `Original: ${color}\n${simulations.map((s) => `${s.name}: ${s.hex}`).join('\n')}`;

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Select a color to simulate for {toolName}
        </label>
        <div className="flex items-center gap-3">
          <input
            id={`${toolId}-input`}
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            aria-label="Color picker"
            className="w-16 h-12 rounded cursor-pointer border border-gray-300"
          />
          <input
            type="text"
            value={color}
            onChange={(e) => {
              const v = e.target.value;
              if (/^#[0-9a-fA-F]{6}$/.test(v)) setColor(v);
            }}
            placeholder="#3b82f6"
            aria-label="Hex color input"
            className="input-field font-mono w-32"
          />
          <div
            className="w-24 h-12 rounded-lg border border-gray-200"
            style={{ backgroundColor: color }}
            aria-label={`Color preview: ${color}`}
          />
        </div>
      </InputArea>

      <OutputArea hasContent={true}>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg border border-gray-200" style={{ backgroundColor: color }} />
                <div>
                  <div className="text-sm font-semibold text-gray-700">Normal Vision</div>
                  <div className="text-xs font-mono text-gray-500">{color}</div>
                </div>
              </div>
            </div>
            {simulations.map((sim) => (
              <div key={sim.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg border border-gray-200" style={{ backgroundColor: sim.hex }} />
                  <div>
                    <div className="text-sm font-semibold text-gray-700">{sim.name}</div>
                    <div className="text-xs text-gray-500">{sim.desc}</div>
                    <div className="text-xs font-mono text-gray-500">{sim.hex}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <CopyToClipboard text={copyText} />
        </div>
      </OutputArea>
    </div>
  );
}
