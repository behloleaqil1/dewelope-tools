'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssChipTagGenerator - Generate CSS chip/tag component styles.
 * Creates customizable chip/tag/badge styles with various variants.
 */
export default function CssChipTagGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [variant, setVariant] = useState<'filled' | 'outlined' | 'soft'>('filled');
  const [color, setColor] = useState('#3B82F6');
  const [borderRadius, setBorderRadius] = useState('9999');
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [closable, setClosable] = useState(false);
  const [output, setOutput] = useState('');

  const generate = () => {
    const sizeMap = {
      sm: { padding: '2px 8px', fontSize: '11px', height: '20px' },
      md: { padding: '4px 12px', fontSize: '13px', height: '28px' },
      lg: { padding: '6px 16px', fontSize: '15px', height: '36px' },
    };

    const s = sizeMap[size];

    const hexToRgb = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return { r, g, b };
    };

    const rgb = hexToRgb(color);

    let chipStyles = '';
    if (variant === 'filled') {
      chipStyles = `  background-color: ${color};
  color: #ffffff;
  border: none;`;
    } else if (variant === 'outlined') {
      chipStyles = `  background-color: transparent;
  color: ${color};
  border: 1.5px solid ${color};`;
    } else {
      chipStyles = `  background-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.12);
  color: ${color};
  border: none;`;
    }

    const css = `.chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: ${s.padding};
  font-size: ${s.fontSize};
  font-weight: 500;
  line-height: 1;
  height: ${s.height};
  border-radius: ${borderRadius}px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  white-space: nowrap;
  transition: all 0.15s ease;
${chipStyles}
}

.chip:hover {
  opacity: 0.85;
  transform: translateY(-1px);
}${closable ? `

.chip-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${parseInt(s.height) - 8}px;
  height: ${parseInt(s.height) - 8}px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.1);
  cursor: pointer;
  margin-left: 2px;
  font-size: ${parseInt(s.fontSize) - 2}px;
  line-height: 1;
}

.chip-close:hover {
  background: rgba(0, 0, 0, 0.2);
}` : ''}
`;

    const html = `<!-- HTML -->
<span class="chip">${closable ? 'Tag Label <span class="chip-close">×</span>' : 'Tag Label'}</span>`;

    setOutput(`${css}\n${html}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-variant`} className="block text-sm font-medium text-gray-700 mb-1">
              Variant
            </label>
            <select
              id={`${toolId}-variant`}
              value={variant}
              onChange={(e) => setVariant(e.target.value as 'filled' | 'outlined' | 'soft')}
              className="input-field"
              aria-label={`Variant selection for ${toolName}`}
            >
              <option value="filled">Filled</option>
              <option value="outlined">Outlined</option>
              <option value="soft">Soft</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-color`} className="block text-sm font-medium text-gray-700 mb-1">
              Color
            </label>
            <div className="flex gap-2">
              <input
                id={`${toolId}-color`}
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-10 h-10 rounded cursor-pointer"
                aria-label="Chip color"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="input-field flex-1 font-mono"
                aria-label="Chip color hex"
              />
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-radius`} className="block text-sm font-medium text-gray-700 mb-1">
              Border Radius (px)
            </label>
            <input
              id={`${toolId}-radius`}
              type="number"
              value={borderRadius}
              onChange={(e) => setBorderRadius(e.target.value)}
              className="input-field"
              aria-label="Border radius"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-size`} className="block text-sm font-medium text-gray-700 mb-1">
              Size
            </label>
            <select
              id={`${toolId}-size`}
              value={size}
              onChange={(e) => setSize(e.target.value as 'sm' | 'md' | 'lg')}
              className="input-field"
              aria-label="Chip size"
            >
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={closable} onChange={(e) => setClosable(e.target.checked)} />
            Include close button
          </label>
        </div>
        <button onClick={generate} className="btn-primary mt-4">
          Generate CSS
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated CSS & HTML</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
