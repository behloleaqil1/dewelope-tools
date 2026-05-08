'use client';

import { useState, useCallback } from 'react';
import { ToolEngineProps } from '@/types';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';
import { parseColor, ParsedColor } from '@/lib/image-color-tools';

/**
 * ColorPicker - Interactive color picker with simultaneous HEX/RGB/HSL display.
 * Supports both native color input and manual text entry.
 * Requirements: 7.2, 7.7
 */
export default function ColorPicker({ toolId, toolName }: ToolEngineProps) {
  const [colorInput, setColorInput] = useState('#3B82F6');
  const [parsedColor, setParsedColor] = useState<ParsedColor | null>(
    parseColor('#3B82F6')
  );
  const [error, setError] = useState<string | undefined>();

  const handleColorChange = useCallback((value: string) => {
    setColorInput(value);
    const parsed = parseColor(value);
    if (parsed) {
      setParsedColor(parsed);
      setError(undefined);
    } else if (value.trim().length > 0) {
      setError('Invalid color format. Expected HEX (#RRGGBB), RGB, or HSL');
    } else {
      setError(undefined);
      setParsedColor(null);
    }
  }, []);

  const handleNativePickerChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setColorInput(value);
    const parsed = parseColor(value);
    if (parsed) {
      setParsedColor(parsed);
      setError(undefined);
    }
  }, []);

  const formatRgb = (color: ParsedColor): string =>
    `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`;

  const formatHsl = (color: ParsedColor): string =>
    `hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`;

  return (
    <div className="space-y-6" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-picker`} className="block text-sm font-medium text-gray-700 mb-1">
          Pick a color or enter a value
        </label>
        <div className="flex items-center gap-3">
          <input
            id={`${toolId}-picker`}
            type="color"
            value={parsedColor?.hex || '#000000'}
            onChange={handleNativePickerChange}
            aria-label={`Color picker for ${toolName}`}
            className="w-14 h-14 rounded-md border border-gray-300 cursor-pointer min-w-[44px] min-h-[44px]"
          />
          <input
            id={`${toolId}-text`}
            type="text"
            value={colorInput}
            onChange={(e) => handleColorChange(e.target.value)}
            placeholder="#RRGGBB, rgb(r,g,b), or hsl(h,s%,l%)"
            aria-label="Color value input (HEX, RGB, or HSL)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
          />
        </div>
      </InputArea>

      <OutputArea hasContent={parsedColor !== null}>
        {parsedColor && (
          <div className="space-y-4">
            <div
              className="w-full h-24 rounded-lg border border-gray-200"
              style={{ backgroundColor: parsedColor.hex }}
              aria-label={`Color preview: ${parsedColor.hex}`}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white p-3 rounded-md border border-gray-200">
                <div className="text-xs text-gray-500 uppercase font-medium mb-1">HEX</div>
                <div className="text-sm font-mono text-gray-800">{parsedColor.hex}</div>
                <CopyToClipboard text={parsedColor.hex} className="mt-2" />
              </div>

              <div className="bg-white p-3 rounded-md border border-gray-200">
                <div className="text-xs text-gray-500 uppercase font-medium mb-1">RGB</div>
                <div className="text-sm font-mono text-gray-800">{formatRgb(parsedColor)}</div>
                <CopyToClipboard text={formatRgb(parsedColor)} className="mt-2" />
              </div>

              <div className="bg-white p-3 rounded-md border border-gray-200">
                <div className="text-xs text-gray-500 uppercase font-medium mb-1">HSL</div>
                <div className="text-sm font-mono text-gray-800">{formatHsl(parsedColor)}</div>
                <CopyToClipboard text={formatHsl(parsedColor)} className="mt-2" />
              </div>
            </div>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
