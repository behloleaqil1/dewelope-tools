'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssCardGenerator - Generate CSS card component styles.
 * Creates customizable card CSS with border-radius, shadow, padding, and hover effects.
 */
export default function CssCardGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [borderRadius, setBorderRadius] = useState('12');
  const [padding, setPadding] = useState('24');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [shadowSize, setShadowSize] = useState('medium');
  const [hoverEffect, setHoverEffect] = useState('lift');
  const [borderColor, setBorderColor] = useState('#e5e7eb');
  const [output, setOutput] = useState('');

  const generate = () => {
    const shadows: Record<string, string> = {
      none: 'none',
      small: '0 1px 3px rgba(0, 0, 0, 0.1)',
      medium: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
      large: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    };

    const hoverEffects: Record<string, string> = {
      none: '',
      lift: `\n.card:hover {\n  transform: translateY(-4px);\n  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);\n}`,
      grow: `\n.card:hover {\n  transform: scale(1.02);\n}`,
      glow: `\n.card:hover {\n  box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);\n}`,
      border: `\n.card:hover {\n  border-color: #3b82f6;\n}`,
    };

    let css = `.card {\n`;
    css += `  background-color: ${bgColor};\n`;
    css += `  border-radius: ${borderRadius}px;\n`;
    css += `  padding: ${padding}px;\n`;
    css += `  border: 1px solid ${borderColor};\n`;
    css += `  box-shadow: ${shadows[shadowSize]};\n`;
    if (hoverEffect !== 'none') {
      css += `  transition: all 0.2s ease-in-out;\n`;
    }
    css += `}`;
    css += hoverEffects[hoverEffect];

    setOutput(css);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${toolId}-radius`} className="block text-sm font-medium text-gray-700 mb-1">
              Border Radius (px)
            </label>
            <input
              id={`${toolId}-radius`}
              type="number"
              value={borderRadius}
              onChange={(e) => setBorderRadius(e.target.value)}
              aria-label={`Border radius for ${toolName}`}
              className="input-field"
              min="0"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-padding`} className="block text-sm font-medium text-gray-700 mb-1">
              Padding (px)
            </label>
            <input
              id={`${toolId}-padding`}
              type="number"
              value={padding}
              onChange={(e) => setPadding(e.target.value)}
              aria-label={`Padding for ${toolName}`}
              className="input-field"
              min="0"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-bg`} className="block text-sm font-medium text-gray-700 mb-1">
              Background Color
            </label>
            <input
              id={`${toolId}-bg`}
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              aria-label={`Background color for ${toolName}`}
              className="input-field h-10"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-border`} className="block text-sm font-medium text-gray-700 mb-1">
              Border Color
            </label>
            <input
              id={`${toolId}-border`}
              type="color"
              value={borderColor}
              onChange={(e) => setBorderColor(e.target.value)}
              aria-label={`Border color for ${toolName}`}
              className="input-field h-10"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-shadow`} className="block text-sm font-medium text-gray-700 mb-1">
              Shadow Size
            </label>
            <select
              id={`${toolId}-shadow`}
              value={shadowSize}
              onChange={(e) => setShadowSize(e.target.value)}
              aria-label={`Shadow size for ${toolName}`}
              className="input-field"
            >
              <option value="none">None</option>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
              <option value="xl">Extra Large</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-hover`} className="block text-sm font-medium text-gray-700 mb-1">
              Hover Effect
            </label>
            <select
              id={`${toolId}-hover`}
              value={hoverEffect}
              onChange={(e) => setHoverEffect(e.target.value)}
              aria-label={`Hover effect for ${toolName}`}
              className="input-field"
            >
              <option value="none">None</option>
              <option value="lift">Lift</option>
              <option value="grow">Grow</option>
              <option value="glow">Glow</option>
              <option value="border">Border Highlight</option>
            </select>
          </div>
        </div>
        <button
          onClick={generate}
          className="btn-primary mt-3"
        >
          Generate Card CSS
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated CSS</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <div className="mt-3">
              <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
              <div
                className="p-4 border"
                style={{
                  backgroundColor: bgColor,
                  borderRadius: `${borderRadius}px`,
                  padding: `${padding}px`,
                  borderColor: borderColor,
                }}
              >
                <h3 className="font-semibold text-gray-800">Card Title</h3>
                <p className="text-gray-600 text-sm mt-1">This is a preview of your card component style.</p>
              </div>
            </div>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
