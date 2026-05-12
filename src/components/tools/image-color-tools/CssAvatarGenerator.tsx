'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssAvatarGenerator - Generate CSS avatar/initials component.
 * Creates a CSS-only avatar with initials, customizable colors, size, and shape.
 */
export default function CssAvatarGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [name, setName] = useState('John Doe');
  const [bgColor, setBgColor] = useState('#3B82F6');
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [size, setSize] = useState(64);
  const [shape, setShape] = useState<'circle' | 'rounded' | 'square'>('circle');
  const [fontSize, setFontSize] = useState(24);
  const [fontWeight, setFontWeight] = useState('600');
  const [output, setOutput] = useState('');

  const getInitials = (fullName: string): string => {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const generate = () => {
    const initials = getInitials(name);
    const borderRadius = shape === 'circle' ? '50%' : shape === 'rounded' ? '8px' : '0';

    const css = `.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${size}px;
  height: ${size}px;
  border-radius: ${borderRadius};
  background-color: ${bgColor};
  color: ${textColor};
  font-size: ${fontSize}px;
  font-weight: ${fontWeight};
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  user-select: none;
  text-transform: uppercase;
}`;

    const html = `<div class="avatar">${initials}</div>`;

    const fullOutput = `/* CSS Avatar: ${name} → ${initials} */\n\n/* HTML */\n${html}\n\n/* CSS */\n${css}`;
    setOutput(fullOutput);
  };

  const initials = getInitials(name);
  const borderRadius = shape === 'circle' ? '50%' : shape === 'rounded' ? '8px' : '0';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              id={`${toolId}-name`}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter full name"
              aria-label={`Name input for ${toolName}`}
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-bg`} className="block text-sm font-medium text-gray-700 mb-1">
              Background Color
            </label>
            <div className="flex gap-2">
              <input
                id={`${toolId}-bg`}
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                aria-label="Background color"
                className="w-10 h-10 rounded cursor-pointer"
              />
              <input
                type="text"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="input-field flex-1 font-mono text-sm"
              />
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-text`} className="block text-sm font-medium text-gray-700 mb-1">
              Text Color
            </label>
            <div className="flex gap-2">
              <input
                id={`${toolId}-text`}
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                aria-label="Text color"
                className="w-10 h-10 rounded cursor-pointer"
              />
              <input
                type="text"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="input-field flex-1 font-mono text-sm"
              />
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-size`} className="block text-sm font-medium text-gray-700 mb-1">
              Size (px)
            </label>
            <input
              id={`${toolId}-size`}
              type="number"
              min={24}
              max={256}
              value={size}
              onChange={(e) => setSize(parseInt(e.target.value) || 64)}
              aria-label="Avatar size"
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-shape`} className="block text-sm font-medium text-gray-700 mb-1">
              Shape
            </label>
            <select
              id={`${toolId}-shape`}
              value={shape}
              onChange={(e) => setShape(e.target.value as typeof shape)}
              aria-label="Avatar shape"
              className="input-field"
            >
              <option value="circle">Circle</option>
              <option value="rounded">Rounded Square</option>
              <option value="square">Square</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-fontsize`} className="block text-sm font-medium text-gray-700 mb-1">
              Font Size (px)
            </label>
            <input
              id={`${toolId}-fontsize`}
              type="number"
              min={10}
              max={128}
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value) || 24)}
              aria-label="Font size"
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-fontweight`} className="block text-sm font-medium text-gray-700 mb-1">
              Font Weight
            </label>
            <select
              id={`${toolId}-fontweight`}
              value={fontWeight}
              onChange={(e) => setFontWeight(e.target.value)}
              aria-label="Font weight"
              className="input-field"
            >
              <option value="400">Normal (400)</option>
              <option value="500">Medium (500)</option>
              <option value="600">Semi-Bold (600)</option>
              <option value="700">Bold (700)</option>
            </select>
          </div>
        </div>

        {/* Live Preview */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: `${size}px`,
              height: `${size}px`,
              borderRadius,
              backgroundColor: bgColor,
              color: textColor,
              fontSize: `${fontSize}px`,
              fontWeight,
              userSelect: 'none',
              textTransform: 'uppercase',
            }}
          >
            {initials}
          </div>
        </div>

        <button
          onClick={generate}
          className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
        >
          Generate CSS Code
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Code</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
