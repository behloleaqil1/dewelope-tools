'use client';

import { useState, useCallback } from 'react';
import { ToolEngineProps } from '@/types';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';
import { generatePalette, PaletteColor, parseColor } from '@/lib/image-color-tools';

/**
 * PaletteGenerator - Generates a 5-color palette from a base color.
 * Displays each color as a swatch with HEX and RGB values.
 * Requirements: 7.5, 7.7
 */
export default function PaletteGenerator({ toolId, toolName }: ToolEngineProps) {
  const [baseColor, setBaseColor] = useState('#3B82F6');
  const [palette, setPalette] = useState<PaletteColor[]>(generatePalette('#3B82F6'));
  const [error, setError] = useState<string | undefined>();

  const handleColorChange = useCallback((value: string) => {
    setBaseColor(value);
    const parsed = parseColor(value);
    if (parsed) {
      setError(undefined);
      setPalette(generatePalette(value));
    } else if (value.trim().length > 0) {
      setError('Invalid color format. Expected HEX (#RRGGBB), RGB, or HSL');
      setPalette([]);
    } else {
      setError(undefined);
      setPalette([]);
    }
  }, []);

  const handleNativePickerChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBaseColor(value);
    const parsed = parseColor(value);
    if (parsed) {
      setError(undefined);
      setPalette(generatePalette(value));
    }
  }, []);

  const formatRgb = (color: PaletteColor): string =>
    `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`;

  const allHexValues = palette.map((c) => c.hex).join(', ');

  return (
    <div className="space-y-6" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-base`} className="block text-sm font-medium text-gray-700 mb-1">
          Base Color
        </label>
        <div className="flex items-center gap-3">
          <input
            id={`${toolId}-picker`}
            type="color"
            value={parseColor(baseColor)?.hex || '#000000'}
            onChange={handleNativePickerChange}
            aria-label={`Base color picker for ${toolName}`}
            className="w-14 h-14 rounded-md border border-gray-300 cursor-pointer min-w-[44px] min-h-[44px]"
          />
          <input
            id={`${toolId}-base`}
            type="text"
            value={baseColor}
            onChange={(e) => handleColorChange(e.target.value)}
            placeholder="#RRGGBB, rgb(r,g,b), or hsl(h,s%,l%)"
            aria-label="Base color value input"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
          />
        </div>
      </InputArea>

      <OutputArea hasContent={palette.length > 0}>
        {palette.length > 0 && (
          <div className="space-y-4">
            <div className="grid grid-cols-5 gap-2">
              {palette.map((color, index) => (
                <div
                  key={index}
                  className="w-full aspect-square rounded-lg border border-gray-200"
                  style={{ backgroundColor: color.hex }}
                  aria-label={`Palette color ${index + 1}: ${color.hex}`}
                />
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              {palette.map((color, index) => (
                <div key={index} className="bg-white p-2 rounded-md border border-gray-200 text-center">
                  <div className="text-xs font-mono text-gray-800 font-medium">{color.hex}</div>
                  <div className="text-xs font-mono text-gray-500 mt-0.5">{formatRgb(color)}</div>
                </div>
              ))}
            </div>

            <CopyToClipboard text={allHexValues} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
