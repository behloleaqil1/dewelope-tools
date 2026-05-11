'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteExtractor - Extracts and displays dominant colors from a user-provided hex palette string.
 * Users enter comma-separated hex colors and the tool displays them as a visual palette.
 */
export default function ColorPaletteExtractor({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [colors, setColors] = useState<{ hex: string; rgb: string }[]>([]);
  const [error, setError] = useState('');

  const hexToRgb = (hex: string): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const extract = () => {
    setError('');
    setColors([]);

    const raw = input.trim();
    if (!raw) { setError('Please enter hex color values'); return; }

    const parts = raw.split(/[,\s\n]+/).map((s) => s.trim()).filter(Boolean);
    const parsed: { hex: string; rgb: string }[] = [];

    for (const part of parts) {
      let hex = part.startsWith('#') ? part : `#${part}`;
      hex = hex.toLowerCase();
      if (/^#[0-9a-f]{6}$/.test(hex)) {
        parsed.push({ hex, rgb: hexToRgb(hex) });
      } else if (/^#[0-9a-f]{3}$/.test(hex)) {
        const expanded = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
        parsed.push({ hex: expanded, rgb: hexToRgb(expanded) });
      } else {
        setError(`Invalid hex color: "${part}"`);
        return;
      }
    }

    if (parsed.length === 0) { setError('No valid colors found'); return; }
    setColors(parsed);
  };

  const copyText = colors.map((c) => `${c.hex} → ${c.rgb}`).join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter Hex Colors (comma or space separated)
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => { setInput(e.target.value); if (error) setError(''); }}
          placeholder="#FF5733, #33FF57, #3357FF, #F0F0F0, #333333"
          aria-label={`Hex color input for ${toolName}`}
          className="input-field h-24 resize-y font-mono"
        />
      </InputArea>

      <button onClick={extract} aria-label="Extract color palette" className="btn-primary">
        Extract Palette
      </button>

      <OutputArea hasContent={colors.length > 0}>
        {colors.length > 0 && (
          <div className="space-y-3">
            <div className="flex rounded-lg overflow-hidden h-16 border border-gray-200">
              {colors.map((c, i) => (
                <div key={i} className="flex-1" style={{ backgroundColor: c.hex }} title={c.hex} />
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {colors.map((c, i) => (
                <div key={i} className="flex items-center gap-2 bg-gray-50 p-2 rounded border border-gray-200">
                  <div className="w-8 h-8 rounded border border-gray-300 flex-shrink-0" style={{ backgroundColor: c.hex }} />
                  <div className="text-xs">
                    <div className="font-mono font-bold">{c.hex}</div>
                    <div className="text-gray-500">{c.rgb}</div>
                  </div>
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
