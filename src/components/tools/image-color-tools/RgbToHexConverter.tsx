'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * RgbToHexConverter - Convert RGB values (0-255) to hex color with a preview swatch.
 */
export default function RgbToHexConverter({ toolId, toolName: _toolName }: { toolId: string; toolName: string }) {
  const [r, setR] = useState(255);
  const [g, setG] = useState(87);
  const [b, setB] = useState(51);
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | undefined>();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
        setOutput('');
        setError('RGB values must be between 0 and 255');
        return;
      }
      if (!Number.isInteger(r) || !Number.isInteger(g) || !Number.isInteger(b)) {
        setOutput('');
        setError('RGB values must be integers');
        return;
      }
      setError(undefined);
      const toHex = (n: number) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, '0').toUpperCase();
      setOutput(`#${toHex(r)}${toHex(g)}${toHex(b)}`);
    }, 150);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [r, g, b]);

  return (
    <div className="space-y-4">
      <InputArea error={error}>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label htmlFor={`${toolId}-r`} className="block text-sm font-medium text-gray-700 mb-1">
              Red (0-255)
            </label>
            <input
              id={`${toolId}-r`}
              type="number"
              min={0}
              max={255}
              value={r}
              onChange={(e) => setR(Math.max(0, Math.min(255, parseInt(e.target.value) || 0)))}
              aria-label="Red color value"
              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-g`} className="block text-sm font-medium text-gray-700 mb-1">
              Green (0-255)
            </label>
            <input
              id={`${toolId}-g`}
              type="number"
              min={0}
              max={255}
              value={g}
              onChange={(e) => setG(Math.max(0, Math.min(255, parseInt(e.target.value) || 0)))}
              aria-label="Green color value"
              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-b`} className="block text-sm font-medium text-gray-700 mb-1">
              Blue (0-255)
            </label>
            <input
              id={`${toolId}-b`}
              type="number"
              min={0}
              max={255}
              value={b}
              onChange={(e) => setB(Math.max(0, Math.min(255, parseInt(e.target.value) || 0)))}
              aria-label="Blue color value"
              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]"
            />
          </div>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-lg border border-gray-200 shadow-sm"
                style={{ backgroundColor: output }}
                aria-label={`Color preview: ${output}`}
              />
              <div>
                <p className="text-sm text-gray-500">HEX Color</p>
                <code className="text-xl font-mono text-gray-800 select-all">{output}</code>
              </div>
            </div>
            <p className="text-sm text-gray-500">RGB: rgb({r}, {g}, {b})</p>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
