'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * LuminanceCalculator - Calculate relative luminance of a color using the WCAG formula.
 * Formula: L = 0.2126 * R + 0.7152 * G + 0.0722 * B (after linearization)
 */
export default function LuminanceCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [hexColor, setHexColor] = useState('#3B82F6');

  function linearize(srgb: number): number {
    const c = srgb / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  }

  function hexToRgb(hex: string): [number, number, number] | null {
    const match = hex.replace('#', '').match(/^([0-9a-f]{6})$/i);
    if (!match) return null;
    const r = parseInt(match[1].slice(0, 2), 16);
    const g = parseInt(match[1].slice(2, 4), 16);
    const b = parseInt(match[1].slice(4, 6), 16);
    return [r, g, b];
  }

  const rgb = hexToRgb(hexColor);
  let luminance: number | null = null;
  let rLinear = 0, gLinear = 0, bLinear = 0;

  if (rgb) {
    rLinear = linearize(rgb[0]);
    gLinear = linearize(rgb[1]);
    bLinear = linearize(rgb[2]);
    luminance = 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
  }

  const contrastOnWhite = luminance !== null ? (1.05) / (luminance + 0.05) : null;
  const contrastOnBlack = luminance !== null ? (luminance + 0.05) / 0.05 : null;

  const copyText = luminance !== null
    ? `Color: ${hexColor}\nRelative Luminance: ${luminance.toFixed(6)}\nContrast on white: ${contrastOnWhite?.toFixed(2)}:1\nContrast on black: ${contrastOnBlack?.toFixed(2)}:1`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-color`} className="block text-sm font-medium text-gray-700 mb-1">
          Select or enter a color
        </label>
        <div className="flex gap-3 items-center">
          <input
            id={`${toolId}-color`}
            type="color"
            value={hexColor}
            onChange={(e) => setHexColor(e.target.value)}
            className="w-16 h-10 rounded cursor-pointer border border-gray-300"
            aria-label={`Color picker for ${toolName}`}
          />
          <input
            type="text"
            value={hexColor}
            onChange={(e) => setHexColor(e.target.value)}
            placeholder="#3B82F6"
            aria-label="Hex color input"
            className="input-field flex-1 font-mono"
          />
        </div>
      </InputArea>

      <OutputArea hasContent={luminance !== null}>
        {luminance !== null && rgb && (
          <div className="space-y-3">
            <div className="w-full h-20 rounded-lg border border-gray-200" style={{ backgroundColor: hexColor }} aria-label="Color preview" />
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600 font-mono">{luminance.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">Relative Luminance</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-gray-800 font-mono">rgb({rgb[0]}, {rgb[1]}, {rgb[2]})</div>
                <div className="text-xs text-gray-500 mt-1">RGB</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
                <div className={`text-lg font-bold font-mono ${(contrastOnWhite || 0) >= 4.5 ? 'text-green-600' : 'text-red-600'}`}>
                  {contrastOnWhite?.toFixed(2)}:1
                </div>
                <div className="text-xs text-gray-500 mt-1">Contrast on White {(contrastOnWhite || 0) >= 4.5 ? '✓ AA' : '✗ Fail'}</div>
              </div>
              <div className="bg-gray-900 p-3 rounded-lg border border-gray-700 text-center">
                <div className={`text-lg font-bold font-mono ${(contrastOnBlack || 0) >= 4.5 ? 'text-green-400' : 'text-red-400'}`}>
                  {contrastOnBlack?.toFixed(2)}:1
                </div>
                <div className="text-xs text-gray-400 mt-1">Contrast on Black {(contrastOnBlack || 0) >= 4.5 ? '✓ AA' : '✗ Fail'}</div>
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-sm font-mono text-gray-700">
              L = 0.2126 × {rLinear.toFixed(4)} + 0.7152 × {gLinear.toFixed(4)} + 0.0722 × {bLinear.toFixed(4)} = {luminance.toFixed(6)}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
