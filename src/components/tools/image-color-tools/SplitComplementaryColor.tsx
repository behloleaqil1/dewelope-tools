'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SplitComplementaryColor - Generate split-complementary color scheme.
 * Takes a base color and produces two colors adjacent to its complement (±30° from 180°).
 */
export default function SplitComplementaryColor({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [color, setColor] = useState('#3b82f6');
  const [output, setOutput] = useState<{ base: string; split1: string; split2: string } | null>(null);

  const hexToHsl = (hex: string): [number, number, number] => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const l = (max + min) / 2;
    let h = 0, s = 0;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
      else if (max === g) h = ((b - r) / d + 2) / 6;
      else h = ((r - g) / d + 4) / 6;
    }
    return [h * 360, s * 100, l * 100];
  };

  const hslToHex = (h: number, s: number, l: number): string => {
    h = ((h % 360) + 360) % 360;
    s /= 100; l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const generate = () => {
    const [h, s, l] = hexToHsl(color);
    const split1 = hslToHex((h + 150) % 360, s, l);
    const split2 = hslToHex((h + 210) % 360, s, l);
    setOutput({ base: color, split1, split2 });
  };

  const copyText = output ? `Base: ${output.base}\nSplit 1: ${output.split1}\nSplit 2: ${output.split2}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-color`} className="block text-sm font-medium text-gray-700 mb-1">
          Base Color
        </label>
        <div className="flex gap-3 items-center">
          <input
            id={`${toolId}-color`}
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
            aria-label={`Color picker for ${toolName}`}
          />
          <input
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="#3b82f6"
            className="input-field flex-1 font-mono"
            aria-label="Hex color value"
          />
        </div>
      </InputArea>

      <button onClick={generate} className="btn-primary">Generate Split-Complementary</button>

      <OutputArea hasContent={output !== null}>
        {output && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <div className="w-full h-20 rounded-lg border border-gray-200" style={{ backgroundColor: output.base }} />
                <div className="text-xs text-gray-600 mt-1 font-mono">{output.base}</div>
                <div className="text-xs text-gray-500">Base</div>
              </div>
              <div className="text-center">
                <div className="w-full h-20 rounded-lg border border-gray-200" style={{ backgroundColor: output.split1 }} />
                <div className="text-xs text-gray-600 mt-1 font-mono">{output.split1}</div>
                <div className="text-xs text-gray-500">Split 1</div>
              </div>
              <div className="text-center">
                <div className="w-full h-20 rounded-lg border border-gray-200" style={{ backgroundColor: output.split2 }} />
                <div className="text-xs text-gray-600 mt-1 font-mono">{output.split2}</div>
                <div className="text-xs text-gray-500">Split 2</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
