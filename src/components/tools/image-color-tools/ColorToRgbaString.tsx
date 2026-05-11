'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorToRgbaString - Converts hex color to rgba() string with adjustable alpha.
 */
export default function ColorToRgbaString({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [hexInput, setHexInput] = useState('#3b82f6');
  const [alpha, setAlpha] = useState('1');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const hex = hexInput.trim().replace('#', '');
      let r: number, g: number, b: number;

      if (hex.length === 3) {
        r = parseInt(hex[0] + hex[0], 16);
        g = parseInt(hex[1] + hex[1], 16);
        b = parseInt(hex[2] + hex[2], 16);
      } else if (hex.length === 6) {
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
      } else {
        setError('Enter a valid 3 or 6 character hex color');
        setOutput('');
        return;
      }

      if (isNaN(r) || isNaN(g) || isNaN(b)) {
        setError('Invalid hex characters');
        setOutput('');
        return;
      }

      const a = Math.min(1, Math.max(0, parseFloat(alpha) || 0));
      const rgbaStr = `rgba(${r}, ${g}, ${b}, ${a})`;
      setOutput(rgbaStr);
      setError('');
    }, 200);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [hexInput, alpha]);

  const parsedHex = hexInput.trim().replace('#', '');
  const previewColor = output || 'transparent';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-hex`} className="block text-sm font-medium text-gray-700 mb-1">
              Hex Color
            </label>
            <div className="flex gap-2">
              <input
                id={`${toolId}-hex`}
                type="text"
                value={hexInput}
                onChange={(e) => setHexInput(e.target.value)}
                placeholder="#3b82f6"
                aria-label={`Hex color input for ${toolName}`}
                className="input-field flex-1 font-mono"
              />
              <input
                type="color"
                value={parsedHex.length === 6 ? `#${parsedHex}` : '#3b82f6'}
                onChange={(e) => setHexInput(e.target.value)}
                className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
                aria-label="Color picker"
              />
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-alpha`} className="block text-sm font-medium text-gray-700 mb-1">
              Alpha (0 - 1)
            </label>
            <input
              id={`${toolId}-alpha`}
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={alpha}
              onChange={(e) => setAlpha(e.target.value)}
              className="w-full"
              aria-label="Alpha value slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0 (transparent)</span>
              <span className="font-mono font-medium">{parseFloat(alpha).toFixed(2)}</span>
              <span>1 (opaque)</span>
            </div>
          </div>
        </div>
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">RGBA String</label>
            <code className="block text-lg font-mono text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-200">{output}</code>
            <div className="flex gap-3 items-center">
              <div
                className="w-16 h-16 rounded-lg border border-gray-300"
                style={{ backgroundColor: previewColor }}
                aria-label="Color preview"
              />
              <div
                className="w-16 h-16 rounded-lg border border-gray-300"
                style={{ background: `linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)`, backgroundSize: '8px 8px', backgroundPosition: '0 0, 4px 4px', position: 'relative' }}
              >
                <div className="absolute inset-0 rounded-lg" style={{ backgroundColor: previewColor }} />
              </div>
            </div>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
