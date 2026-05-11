'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * WavelengthToColor - Converts visible light wavelength (380-780nm) to approximate RGB color.
 * Uses spectral color approximation algorithm.
 */
export default function WavelengthToColor({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [wavelength, setWavelength] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ r: number; g: number; b: number; hex: string } | null>(null);

  const wavelengthToRgb = (nm: number): { r: number; g: number; b: number } => {
    let r = 0, g = 0, b = 0;

    if (nm >= 380 && nm < 440) {
      r = -(nm - 440) / (440 - 380);
      g = 0;
      b = 1;
    } else if (nm >= 440 && nm < 490) {
      r = 0;
      g = (nm - 440) / (490 - 440);
      b = 1;
    } else if (nm >= 490 && nm < 510) {
      r = 0;
      g = 1;
      b = -(nm - 510) / (510 - 490);
    } else if (nm >= 510 && nm < 580) {
      r = (nm - 510) / (580 - 510);
      g = 1;
      b = 0;
    } else if (nm >= 580 && nm < 645) {
      r = 1;
      g = -(nm - 645) / (645 - 580);
      b = 0;
    } else if (nm >= 645 && nm <= 780) {
      r = 1;
      g = 0;
      b = 0;
    }

    // Intensity factor for edges of visible spectrum
    let factor = 0;
    if (nm >= 380 && nm < 420) factor = 0.3 + 0.7 * (nm - 380) / (420 - 380);
    else if (nm >= 420 && nm <= 700) factor = 1;
    else if (nm > 700 && nm <= 780) factor = 0.3 + 0.7 * (780 - nm) / (780 - 700);

    const gamma = 0.8;
    r = Math.round(255 * Math.pow(r * factor, gamma));
    g = Math.round(255 * Math.pow(g * factor, gamma));
    b = Math.round(255 * Math.pow(b * factor, gamma));

    return { r, g, b };
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    return '#' + [r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('');
  };

  const convert = () => {
    setError('');
    const nm = parseFloat(wavelength);
    if (!wavelength.trim() || isNaN(nm)) {
      setError('Please enter a valid wavelength');
      setResult(null);
      return;
    }
    if (nm < 380 || nm > 780) {
      setError('Wavelength must be between 380nm and 780nm (visible spectrum)');
      setResult(null);
      return;
    }

    const { r, g, b } = wavelengthToRgb(nm);
    setResult({ r, g, b, hex: rgbToHex(r, g, b) });
  };

  const copyText = result
    ? `Wavelength: ${wavelength}nm\nHex: ${result.hex}\nRGB: rgb(${result.r}, ${result.g}, ${result.b})`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Wavelength (nm)
        </label>
        <input
          id={`${toolId}-input`}
          type="text"
          inputMode="decimal"
          value={wavelength}
          onChange={(e) => { setWavelength(e.target.value); if (error) setError(''); }}
          placeholder="e.g. 550 (380-780)"
          aria-label={`Wavelength input for ${toolName}`}
          className="input-field"
        />
        <p className="text-xs text-gray-500 mt-1">Visible spectrum: 380nm (violet) to 780nm (red)</p>
      </InputArea>

      <button onClick={convert} aria-label="Convert wavelength to color" className="btn-primary">
        Convert
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div
              className="w-full h-24 rounded-lg border border-gray-200"
              style={{ backgroundColor: result.hex }}
              aria-label={`Color preview: ${result.hex}`}
            />
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-gray-800 font-mono">{result.hex}</div>
                <div className="text-xs text-gray-500 mt-1">Hex</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-gray-800 font-mono">rgb({result.r}, {result.g}, {result.b})</div>
                <div className="text-xs text-gray-500 mt-1">RGB</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
