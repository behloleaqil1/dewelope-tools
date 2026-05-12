'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssBadgeGenerator - Generate CSS badge/tag component styles.
 * Creates customizable badge styles with colors, border radius, padding, and variants.
 */
export default function CssBadgeGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [text, setText] = useState('Badge');
  const [bgColor, setBgColor] = useState('#3B82F6');
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [borderRadius, setBorderRadius] = useState(12);
  const [paddingX, setPaddingX] = useState(12);
  const [paddingY, setPaddingY] = useState(4);
  const [fontSize, setFontSize] = useState(12);
  const [fontWeight, setFontWeight] = useState('600');
  const [variant, setVariant] = useState<'filled' | 'outlined' | 'soft'>('filled');
  const [uppercase, setUppercase] = useState(false);
  const [output, setOutput] = useState('');

  const generate = () => {
    const lines: string[] = [];
    lines.push('.badge {');
    lines.push('  display: inline-flex;');
    lines.push('  align-items: center;');
    lines.push(`  padding: ${paddingY}px ${paddingX}px;`);
    lines.push(`  font-size: ${fontSize}px;`);
    lines.push(`  font-weight: ${fontWeight};`);
    lines.push(`  border-radius: ${borderRadius}px;`);
    lines.push('  line-height: 1;');
    lines.push('  white-space: nowrap;');

    if (uppercase) {
      lines.push('  text-transform: uppercase;');
      lines.push('  letter-spacing: 0.05em;');
    }

    if (variant === 'filled') {
      lines.push(`  background-color: ${bgColor};`);
      lines.push(`  color: ${textColor};`);
      lines.push('  border: none;');
    } else if (variant === 'outlined') {
      lines.push('  background-color: transparent;');
      lines.push(`  color: ${bgColor};`);
      lines.push(`  border: 1.5px solid ${bgColor};`);
    } else {
      // soft variant
      lines.push(`  background-color: ${bgColor}20;`);
      lines.push(`  color: ${bgColor};`);
      lines.push('  border: none;');
    }

    lines.push('}');
    setOutput(lines.join('\n'));
  };

  const previewStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: `${paddingY}px ${paddingX}px`,
    fontSize: `${fontSize}px`,
    fontWeight: fontWeight,
    borderRadius: `${borderRadius}px`,
    lineHeight: 1,
    whiteSpace: 'nowrap',
    textTransform: uppercase ? 'uppercase' : 'none',
    letterSpacing: uppercase ? '0.05em' : 'normal',
    backgroundColor: variant === 'filled' ? bgColor : variant === 'soft' ? `${bgColor}20` : 'transparent',
    color: variant === 'filled' ? textColor : bgColor,
    border: variant === 'outlined' ? `1.5px solid ${bgColor}` : 'none',
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-text`} className="block text-sm font-medium text-gray-700 mb-1">
              Badge Text
            </label>
            <input
              id={`${toolId}-text`}
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Badge text"
              aria-label={`Badge text for ${toolName}`}
              className="input-field w-full"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Variant</label>
              <select
                value={variant}
                onChange={(e) => setVariant(e.target.value as 'filled' | 'outlined' | 'soft')}
                aria-label="Badge variant"
                className="input-field w-full"
              >
                <option value="filled">Filled</option>
                <option value="outlined">Outlined</option>
                <option value="soft">Soft</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Font Weight</label>
              <select
                value={fontWeight}
                onChange={(e) => setFontWeight(e.target.value)}
                aria-label="Font weight"
                className="input-field w-full"
              >
                <option value="400">Normal (400)</option>
                <option value="500">Medium (500)</option>
                <option value="600">Semibold (600)</option>
                <option value="700">Bold (700)</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
              <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} aria-label="Background color" className="w-full h-9 rounded cursor-pointer" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
              <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} aria-label="Text color" className="w-full h-9 rounded cursor-pointer" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Border Radius</label>
              <input type="number" min={0} max={50} value={borderRadius} onChange={(e) => setBorderRadius(parseInt(e.target.value) || 0)} aria-label="Border radius" className="input-field w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Padding X</label>
              <input type="number" min={0} max={40} value={paddingX} onChange={(e) => setPaddingX(parseInt(e.target.value) || 0)} aria-label="Horizontal padding" className="input-field w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Padding Y</label>
              <input type="number" min={0} max={20} value={paddingY} onChange={(e) => setPaddingY(parseInt(e.target.value) || 0)} aria-label="Vertical padding" className="input-field w-full" />
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Font Size (px)</label>
              <input type="number" min={8} max={24} value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value) || 12)} aria-label="Font size" className="input-field w-20" />
            </div>
            <label className="flex items-center gap-2 text-sm mt-5">
              <input type="checkbox" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} />
              Uppercase
            </label>
          </div>
          <button onClick={generate} className="btn-primary text-sm">
            Generate CSS
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Preview</label>
            <div className="p-4 bg-gray-50 rounded border border-gray-200 flex items-center gap-3">
              <span style={previewStyle}>{text || 'Badge'}</span>
            </div>
            <label className="block text-sm font-medium text-gray-700">Generated CSS</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
