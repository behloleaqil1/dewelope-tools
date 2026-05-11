'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ScreenPpiCalculator - Calculates pixels per inch from screen size and resolution.
 * Formula: PPI = √(width² + height²) / diagonal
 */
export default function ScreenPpiCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [diagonal, setDiagonal] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ ppi: number; dotPitch: number; totalPixels: number } | null>(null);

  const calculate = () => {
    const newErrors: Record<string, string> = {};
    const w = parseFloat(width);
    const h = parseFloat(height);
    const d = parseFloat(diagonal);

    if (!width.trim() || isNaN(w) || w <= 0) {
      newErrors.width = 'Please enter a valid width in pixels';
    }
    if (!height.trim() || isNaN(h) || h <= 0) {
      newErrors.height = 'Please enter a valid height in pixels';
    }
    if (!diagonal.trim() || isNaN(d) || d <= 0) {
      newErrors.diagonal = 'Please enter a valid screen diagonal in inches';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});
    const diagonalPixels = Math.sqrt(w * w + h * h);
    const ppi = diagonalPixels / d;
    const dotPitch = 25.4 / ppi; // mm per pixel
    const totalPixels = w * h;

    setResult({ ppi, dotPitch, totalPixels });
  };

  const copyText = result
    ? `PPI: ${result.ppi.toFixed(2)}\nDot Pitch: ${result.dotPitch.toFixed(4)} mm\nTotal Pixels: ${result.totalPixels.toLocaleString()}\nResolution: ${width} × ${height}\nScreen Size: ${diagonal}"`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <InputArea error={errors.width}>
            <label htmlFor={`${toolId}-width`} className="block text-sm font-medium text-gray-700 mb-1">
              Width (pixels)
            </label>
            <input
              id={`${toolId}-width`}
              type="text"
              inputMode="numeric"
              value={width}
              onChange={(e) => { setWidth(e.target.value); if (errors.width) setErrors((prev) => ({ ...prev, width: '' })); }}
              placeholder="e.g. 2560"
              aria-label={`Screen width for ${toolName}`}
              className="input-field"
            />
          </InputArea>

          <InputArea error={errors.height}>
            <label htmlFor={`${toolId}-height`} className="block text-sm font-medium text-gray-700 mb-1">
              Height (pixels)
            </label>
            <input
              id={`${toolId}-height`}
              type="text"
              inputMode="numeric"
              value={height}
              onChange={(e) => { setHeight(e.target.value); if (errors.height) setErrors((prev) => ({ ...prev, height: '' })); }}
              placeholder="e.g. 1440"
              aria-label={`Screen height for ${toolName}`}
              className="input-field"
            />
          </InputArea>
        </div>

        <InputArea error={errors.diagonal}>
          <label htmlFor={`${toolId}-diagonal`} className="block text-sm font-medium text-gray-700 mb-1">
            Screen Diagonal (inches)
          </label>
          <input
            id={`${toolId}-diagonal`}
            type="text"
            inputMode="decimal"
            value={diagonal}
            onChange={(e) => { setDiagonal(e.target.value); if (errors.diagonal) setErrors((prev) => ({ ...prev, diagonal: '' })); }}
            placeholder="e.g. 27"
            aria-label={`Screen diagonal for ${toolName}`}
            className="input-field"
          />
        </InputArea>
      </div>

      <button onClick={calculate} aria-label="Calculate PPI" className="btn-primary">
        Calculate PPI
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.ppi.toFixed(2)}</div>
                <div className="text-xs text-gray-500 mt-1">PPI</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-indigo-600">{result.dotPitch.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">Dot Pitch (mm)</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-gray-800">{(result.totalPixels / 1000000).toFixed(2)}MP</div>
                <div className="text-xs text-gray-500 mt-1">Total Pixels</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
              PPI = √({width}² + {height}²) / {diagonal} = {result.ppi.toFixed(2)}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
