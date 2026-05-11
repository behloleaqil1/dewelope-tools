'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorContrastChecker - Checks WCAG contrast ratio between foreground and background colors.
 * Shows pass/fail for AA and AAA levels for both normal and large text.
 */
export default function ColorContrastChecker({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [foreground, setForeground] = useState('#000000');
  const [background, setBackground] = useState('#ffffff');
  const [result, setResult] = useState<{
    ratio: number;
    aaNormal: boolean;
    aaLarge: boolean;
    aaaNormal: boolean;
    aaaLarge: boolean;
  } | null>(null);

  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const cleaned = hex.replace('#', '');
    if (!/^[0-9a-fA-F]{6}$/.test(cleaned)) return null;
    return {
      r: parseInt(cleaned.substring(0, 2), 16),
      g: parseInt(cleaned.substring(2, 4), 16),
      b: parseInt(cleaned.substring(4, 6), 16),
    };
  };

  const getLuminance = (r: number, g: number, b: number): number => {
    const [rs, gs, bs] = [r, g, b].map((c) => {
      const s = c / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const calculateContrast = () => {
    const fgRgb = hexToRgb(foreground);
    const bgRgb = hexToRgb(background);

    if (!fgRgb || !bgRgb) return;

    const fgLum = getLuminance(fgRgb.r, fgRgb.g, fgRgb.b);
    const bgLum = getLuminance(bgRgb.r, bgRgb.g, bgRgb.b);

    const lighter = Math.max(fgLum, bgLum);
    const darker = Math.min(fgLum, bgLum);
    const ratio = (lighter + 0.05) / (darker + 0.05);

    setResult({
      ratio,
      aaNormal: ratio >= 4.5,
      aaLarge: ratio >= 3,
      aaaNormal: ratio >= 7,
      aaaLarge: ratio >= 4.5,
    });
  };

  // Auto-calculate on color change
  const handleFgChange = (value: string) => {
    setForeground(value);
    setTimeout(() => calculateContrast(), 0);
  };

  const handleBgChange = (value: string) => {
    setBackground(value);
    setTimeout(() => calculateContrast(), 0);
  };

  const copyText = result
    ? [
        `Contrast Ratio: ${result.ratio.toFixed(2)}:1`,
        `AA Normal Text: ${result.aaNormal ? 'Pass' : 'Fail'}`,
        `AA Large Text: ${result.aaLarge ? 'Pass' : 'Fail'}`,
        `AAA Normal Text: ${result.aaaNormal ? 'Pass' : 'Fail'}`,
        `AAA Large Text: ${result.aaaLarge ? 'Pass' : 'Fail'}`,
        `Foreground: ${foreground}`,
        `Background: ${background}`,
      ].join('\n')
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-fg`} className="block text-sm font-medium text-gray-700 mb-1">
            Foreground Color (Hex)
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={foreground}
              onChange={(e) => handleFgChange(e.target.value)}
              aria-label={`Foreground color picker for ${toolName}`}
              className="w-10 h-10 rounded border border-gray-200 cursor-pointer"
            />
            <input
              id={`${toolId}-fg`}
              type="text"
              value={foreground}
              onChange={(e) => handleFgChange(e.target.value)}
              placeholder="#000000"
              aria-label={`Foreground hex color for ${toolName}`}
              className="input-field font-mono"
            />
          </div>
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-bg`} className="block text-sm font-medium text-gray-700 mb-1">
            Background Color (Hex)
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={background}
              onChange={(e) => handleBgChange(e.target.value)}
              aria-label={`Background color picker for ${toolName}`}
              className="w-10 h-10 rounded border border-gray-200 cursor-pointer"
            />
            <input
              id={`${toolId}-bg`}
              type="text"
              value={background}
              onChange={(e) => handleBgChange(e.target.value)}
              placeholder="#ffffff"
              aria-label={`Background hex color for ${toolName}`}
              className="input-field font-mono"
            />
          </div>
        </InputArea>
      </div>

      <button onClick={calculateContrast} aria-label="Check contrast ratio" className="btn-primary">
        Check Contrast
      </button>

      {/* Preview */}
      <div
        className="p-6 rounded-lg border border-gray-200 text-center"
        style={{ backgroundColor: background, color: foreground }}
      >
        <p className="text-2xl font-bold">Sample Text (Large)</p>
        <p className="text-sm mt-2">This is how normal text looks with these colors.</p>
      </div>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="text-center">
              <div className={`text-3xl font-bold ${result.aaNormal ? 'text-green-600' : 'text-red-600'}`}>
                {result.ratio.toFixed(2)}:1
              </div>
              <div className="text-xs text-gray-500 mt-1">Contrast Ratio</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'AA Normal Text (≥4.5)', pass: result.aaNormal },
                { label: 'AA Large Text (≥3.0)', pass: result.aaLarge },
                { label: 'AAA Normal Text (≥7.0)', pass: result.aaaNormal },
                { label: 'AAA Large Text (≥4.5)', pass: result.aaaLarge },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`p-3 rounded-lg border text-center ${
                    item.pass ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className={`text-sm font-bold ${item.pass ? 'text-green-700' : 'text-red-700'}`}>
                    {item.pass ? '✓ Pass' : '✗ Fail'}
                  </div>
                  <div className="text-xs text-gray-600 mt-0.5">{item.label}</div>
                </div>
              ))}
            </div>

            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
