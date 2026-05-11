'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorChannelSeparator - Separates a color into its R, G, B channels.
 * Shows individual channel previews and values.
 */
export default function ColorChannelSeparator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [hexColor, setHexColor] = useState('#3B82F6');
  const [result, setResult] = useState<{ r: number; g: number; b: number } | null>({ r: 59, g: 130, b: 246 });
  const [error, setError] = useState('');

  const parseColor = (hex: string) => {
    const clean = hex.replace('#', '');
    if (!/^[0-9a-fA-F]{6}$/.test(clean)) {
      setError('Please enter a valid 6-digit hex color');
      setResult(null);
      return;
    }

    setError('');
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    setResult({ r, g, b });
  };

  const handleChange = (value: string) => {
    setHexColor(value);
    if (value.replace('#', '').length === 6) {
      parseColor(value);
    }
  };

  const copyText = result
    ? `Original: ${hexColor}\nRed Channel: rgb(${result.r}, 0, 0) | #${result.r.toString(16).padStart(2, '0')}0000\nGreen Channel: rgb(0, ${result.g}, 0) | #00${result.g.toString(16).padStart(2, '0')}00\nBlue Channel: rgb(0, 0, ${result.b}) | #0000${result.b.toString(16).padStart(2, '0')}\nRGB: rgb(${result.r}, ${result.g}, ${result.b})`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-color`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter Hex Color
        </label>
        <div className="flex gap-3 items-center">
          <input
            id={`${toolId}-color`}
            type="text"
            value={hexColor}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="#3B82F6"
            aria-label={`Hex color input for ${toolName}`}
            className="input-field font-mono flex-1"
          />
          <input
            type="color"
            value={hexColor.startsWith('#') && hexColor.length === 7 ? hexColor : '#3B82F6'}
            onChange={(e) => handleChange(e.target.value)}
            className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
            aria-label="Color picker"
          />
        </div>
      </InputArea>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Original Color</label>
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-lg border border-gray-200" style={{ backgroundColor: hexColor }} />
                <div className="text-sm font-mono text-gray-700">
                  <p>{hexColor.toUpperCase()}</p>
                  <p>rgb({result.r}, {result.g}, {result.b})</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded border border-gray-200" style={{ backgroundColor: `rgb(${result.r}, 0, 0)` }} />
                  <div>
                    <div className="text-sm font-bold text-red-600">Red</div>
                    <div className="text-xs text-gray-500">{result.r} / 255</div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: `${(result.r / 255) * 100}%` }} />
                </div>
                <div className="text-xs font-mono text-gray-500 mt-1">#{result.r.toString(16).padStart(2, '0')}0000</div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded border border-gray-200" style={{ backgroundColor: `rgb(0, ${result.g}, 0)` }} />
                  <div>
                    <div className="text-sm font-bold text-green-600">Green</div>
                    <div className="text-xs text-gray-500">{result.g} / 255</div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(result.g / 255) * 100}%` }} />
                </div>
                <div className="text-xs font-mono text-gray-500 mt-1">#00{result.g.toString(16).padStart(2, '0')}00</div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded border border-gray-200" style={{ backgroundColor: `rgb(0, 0, ${result.b})` }} />
                  <div>
                    <div className="text-sm font-bold text-blue-600">Blue</div>
                    <div className="text-xs text-gray-500">{result.b} / 255</div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(result.b / 255) * 100}%` }} />
                </div>
                <div className="text-xs font-mono text-gray-500 mt-1">#0000{result.b.toString(16).padStart(2, '0')}</div>
              </div>
            </div>

            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
