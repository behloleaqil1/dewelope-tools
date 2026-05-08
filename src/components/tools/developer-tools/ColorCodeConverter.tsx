'use client';

import { useState, useEffect, useRef } from 'react';
import { ToolEngineProps } from '@/types';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';
import { convertColor, ConvertColorResult } from '@/lib/developer-tools';

/**
 * ColorCodeConverter - Convert between HEX, RGB, and HSL color formats.
 * Displays a color preview swatch alongside all format outputs.
 * Requirements: 6.2, 6.5, 6.6
 */
export default function ColorCodeConverter({ toolId }: ToolEngineProps) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<ConvertColorResult | null>(null);
  const [error, setError] = useState<string | undefined>();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!input.trim()) {
      setResult(null);
      setError(undefined);
      return;
    }

    debounceRef.current = setTimeout(() => {
      const converted = convertColor(input);
      if (converted.valid) {
        setResult(converted);
        setError(undefined);
      } else {
        setResult(null);
        setError(converted.error);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [input]);

  const hexString = result?.hex || '';
  const rgbString = result ? `rgb(${result.rgb.r}, ${result.rgb.g}, ${result.rgb.b})` : '';
  const hslString = result ? `hsl(${result.hsl.h}, ${result.hsl.s}%, ${result.hsl.l}%)` : '';

  return (
    <div className="space-y-4">
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter a color (HEX, RGB, or HSL)
        </label>
        <input
          id={`${toolId}-input`}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="#ff6600 or rgb(255, 102, 0) or hsl(24, 100%, 50%)"
          aria-label="Color code input for conversion"
          className="w-full p-3 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]"
        />
      </InputArea>

      <OutputArea hasContent={!!result}>
        {result && (
          <div className="space-y-4">
            {/* Color Preview Swatch */}
            <div className="flex items-center gap-3">
              <div
                className="w-16 h-16 rounded-lg border border-gray-300 shadow-inner"
                style={{ backgroundColor: hexString }}
                aria-label={`Color preview: ${hexString}`}
              />
              <div className="text-sm text-gray-600">Color Preview</div>
            </div>

            {/* HEX Output */}
            <div className="space-y-1">
              <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">HEX</div>
              <div className="flex items-center gap-2">
                <code className="text-sm font-mono text-gray-800 bg-white px-3 py-2 rounded border border-gray-200 flex-1">
                  {hexString}
                </code>
                <CopyToClipboard text={hexString} />
              </div>
            </div>

            {/* RGB Output */}
            <div className="space-y-1">
              <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">RGB</div>
              <div className="flex items-center gap-2">
                <code className="text-sm font-mono text-gray-800 bg-white px-3 py-2 rounded border border-gray-200 flex-1">
                  {rgbString}
                </code>
                <CopyToClipboard text={rgbString} />
              </div>
            </div>

            {/* HSL Output */}
            <div className="space-y-1">
              <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">HSL</div>
              <div className="flex items-center gap-2">
                <code className="text-sm font-mono text-gray-800 bg-white px-3 py-2 rounded border border-gray-200 flex-1">
                  {hslString}
                </code>
                <CopyToClipboard text={hslString} />
              </div>
            </div>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
