'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorAccessibilityChecker - Checks color combinations for WCAG AA/AAA compliance
 * with live text preview at different sizes.
 */
export default function ColorAccessibilityChecker({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [textColor, setTextColor] = useState('#333333');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [linkColor, setLinkColor] = useState('#0066cc');
  const [result, setResult] = useState<{
    textRatio: number;
    linkRatio: number;
    textAA: boolean;
    textAAA: boolean;
    textAALarge: boolean;
    textAAALarge: boolean;
    linkAA: boolean;
    linkAAA: boolean;
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

  const getContrastRatio = (hex1: string, hex2: string): number => {
    const rgb1 = hexToRgb(hex1);
    const rgb2 = hexToRgb(hex2);
    if (!rgb1 || !rgb2) return 0;
    const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    return (lighter + 0.05) / (darker + 0.05);
  };

  const check = () => {
    const textRatio = getContrastRatio(textColor, bgColor);
    const linkRatio = getContrastRatio(linkColor, bgColor);

    setResult({
      textRatio,
      linkRatio,
      textAA: textRatio >= 4.5,
      textAAA: textRatio >= 7,
      textAALarge: textRatio >= 3,
      textAAALarge: textRatio >= 4.5,
      linkAA: linkRatio >= 4.5,
      linkAAA: linkRatio >= 7,
    });
  };

  const copyText = result
    ? `Color Accessibility Report\nText (${textColor}) on Background (${bgColor}): ${result.textRatio.toFixed(2)}:1\n  AA Normal: ${result.textAA ? 'Pass' : 'Fail'} | AA Large: ${result.textAALarge ? 'Pass' : 'Fail'}\n  AAA Normal: ${result.textAAA ? 'Pass' : 'Fail'} | AAA Large: ${result.textAAALarge ? 'Pass' : 'Fail'}\nLink (${linkColor}) on Background (${bgColor}): ${result.linkRatio.toFixed(2)}:1\n  AA: ${result.linkAA ? 'Pass' : 'Fail'} | AAA: ${result.linkAAA ? 'Pass' : 'Fail'}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-text`} className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
          <div className="flex gap-2 items-center">
            <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} aria-label={`Text color picker for ${toolName}`} className="w-10 h-10 rounded border border-gray-200 cursor-pointer" />
            <input id={`${toolId}-text`} type="text" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="input-field font-mono" aria-label={`Text hex color for ${toolName}`} />
          </div>
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-bg`} className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
          <div className="flex gap-2 items-center">
            <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} aria-label={`Background color picker for ${toolName}`} className="w-10 h-10 rounded border border-gray-200 cursor-pointer" />
            <input id={`${toolId}-bg`} type="text" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="input-field font-mono" aria-label={`Background hex color for ${toolName}`} />
          </div>
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-link`} className="block text-sm font-medium text-gray-700 mb-1">Link Color</label>
          <div className="flex gap-2 items-center">
            <input type="color" value={linkColor} onChange={(e) => setLinkColor(e.target.value)} aria-label={`Link color picker for ${toolName}`} className="w-10 h-10 rounded border border-gray-200 cursor-pointer" />
            <input id={`${toolId}-link`} type="text" value={linkColor} onChange={(e) => setLinkColor(e.target.value)} className="input-field font-mono" aria-label={`Link hex color for ${toolName}`} />
          </div>
        </InputArea>
      </div>

      <button onClick={check} aria-label="Check color accessibility" className="btn-primary">
        Check Accessibility
      </button>

      {/* Live Preview */}
      <div className="p-6 rounded-lg border border-gray-200" style={{ backgroundColor: bgColor }}>
        <p style={{ color: textColor, fontSize: '24px', fontWeight: 'bold' }}>Large Heading Text</p>
        <p style={{ color: textColor, fontSize: '16px' }}>This is normal body text at 16px size.</p>
        <p style={{ color: linkColor, fontSize: '16px', textDecoration: 'underline' }}>This is a sample link</p>
        <p style={{ color: textColor, fontSize: '12px' }}>Small text at 12px for reference.</p>
      </div>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700">Text on Background ({result.textRatio.toFixed(2)}:1)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: 'AA Normal (≥4.5)', pass: result.textAA },
                { label: 'AA Large (≥3.0)', pass: result.textAALarge },
                { label: 'AAA Normal (≥7.0)', pass: result.textAAA },
                { label: 'AAA Large (≥4.5)', pass: result.textAAALarge },
              ].map((item) => (
                <div key={item.label} className={`p-2 rounded border text-center ${item.pass ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <div className={`text-xs font-bold ${item.pass ? 'text-green-700' : 'text-red-700'}`}>{item.pass ? '✓ Pass' : '✗ Fail'}</div>
                  <div className="text-xs text-gray-600 mt-0.5">{item.label}</div>
                </div>
              ))}
            </div>
            <h3 className="text-sm font-medium text-gray-700 mt-3">Link on Background ({result.linkRatio.toFixed(2)}:1)</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className={`p-2 rounded border text-center ${result.linkAA ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className={`text-xs font-bold ${result.linkAA ? 'text-green-700' : 'text-red-700'}`}>{result.linkAA ? '✓ Pass' : '✗ Fail'}</div>
                <div className="text-xs text-gray-600 mt-0.5">AA (≥4.5)</div>
              </div>
              <div className={`p-2 rounded border text-center ${result.linkAAA ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className={`text-xs font-bold ${result.linkAAA ? 'text-green-700' : 'text-red-700'}`}>{result.linkAAA ? '✓ Pass' : '✗ Fail'}</div>
                <div className="text-xs text-gray-600 mt-0.5">AAA (≥7.0)</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
