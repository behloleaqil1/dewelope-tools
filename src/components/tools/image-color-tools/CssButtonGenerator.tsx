'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssButtonGenerator - Generate CSS button styles with hover effects.
 * Customize colors, border radius, padding, font size, and hover transitions.
 */
export default function CssButtonGenerator({ toolId, toolName: _toolName }: { toolId: string; toolName: string }) {
  const [bgColor, setBgColor] = useState('#3B82F6');
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [hoverBgColor, setHoverBgColor] = useState('#2563EB');
  const [borderRadius, setBorderRadius] = useState('8');
  const [paddingX, setPaddingX] = useState('24');
  const [paddingY, setPaddingY] = useState('12');
  const [fontSize, setFontSize] = useState('16');
  const [fontWeight, setFontWeight] = useState('600');
  const [borderWidth, setBorderWidth] = useState('0');
  const [borderColor, setBorderColor] = useState('#000000');
  const [shadow, setShadow] = useState(true);
  const [transition, setTransition] = useState('0.2');
  const [output, setOutput] = useState('');

  const generate = () => {
    const css = `.btn {
  background-color: ${bgColor};
  color: ${textColor};
  border: ${borderWidth}px solid ${borderColor};
  border-radius: ${borderRadius}px;
  padding: ${paddingY}px ${paddingX}px;
  font-size: ${fontSize}px;
  font-weight: ${fontWeight};
  cursor: pointer;
  transition: all ${transition}s ease;${shadow ? `\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);` : ''}
  text-decoration: none;
  display: inline-block;
}

.btn:hover {
  background-color: ${hoverBgColor};${shadow ? `\n  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);` : ''}
  transform: translateY(-1px);
}

.btn:active {
  transform: translateY(0);${shadow ? `\n  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);` : ''}
}`;

    setOutput(css);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${toolId}-bg`} className="block text-xs font-medium text-gray-700 mb-1">
              Background Color
            </label>
            <div className="flex gap-2">
              <input
                id={`${toolId}-bg`}
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                aria-label="Background color"
                className="w-10 h-9 rounded cursor-pointer"
              />
              <input
                type="text"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="input-field font-mono flex-1"
              />
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-text`} className="block text-xs font-medium text-gray-700 mb-1">
              Text Color
            </label>
            <div className="flex gap-2">
              <input
                id={`${toolId}-text`}
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                aria-label="Text color"
                className="w-10 h-9 rounded cursor-pointer"
              />
              <input
                type="text"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="input-field font-mono flex-1"
              />
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-hover`} className="block text-xs font-medium text-gray-700 mb-1">
              Hover Background
            </label>
            <div className="flex gap-2">
              <input
                id={`${toolId}-hover`}
                type="color"
                value={hoverBgColor}
                onChange={(e) => setHoverBgColor(e.target.value)}
                aria-label="Hover background color"
                className="w-10 h-9 rounded cursor-pointer"
              />
              <input
                type="text"
                value={hoverBgColor}
                onChange={(e) => setHoverBgColor(e.target.value)}
                className="input-field font-mono flex-1"
              />
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-radius`} className="block text-xs font-medium text-gray-700 mb-1">
              Border Radius (px)
            </label>
            <input
              id={`${toolId}-radius`}
              type="number"
              value={borderRadius}
              onChange={(e) => setBorderRadius(e.target.value)}
              aria-label="Border radius"
              className="input-field"
              min="0"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-px`} className="block text-xs font-medium text-gray-700 mb-1">
              Padding X (px)
            </label>
            <input
              id={`${toolId}-px`}
              type="number"
              value={paddingX}
              onChange={(e) => setPaddingX(e.target.value)}
              aria-label="Horizontal padding"
              className="input-field"
              min="0"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-py`} className="block text-xs font-medium text-gray-700 mb-1">
              Padding Y (px)
            </label>
            <input
              id={`${toolId}-py`}
              type="number"
              value={paddingY}
              onChange={(e) => setPaddingY(e.target.value)}
              aria-label="Vertical padding"
              className="input-field"
              min="0"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-fs`} className="block text-xs font-medium text-gray-700 mb-1">
              Font Size (px)
            </label>
            <input
              id={`${toolId}-fs`}
              type="number"
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              aria-label="Font size"
              className="input-field"
              min="8"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-fw`} className="block text-xs font-medium text-gray-700 mb-1">
              Font Weight
            </label>
            <select
              id={`${toolId}-fw`}
              value={fontWeight}
              onChange={(e) => setFontWeight(e.target.value)}
              aria-label="Font weight"
              className="input-field"
            >
              <option value="400">Normal (400)</option>
              <option value="500">Medium (500)</option>
              <option value="600">Semi-bold (600)</option>
              <option value="700">Bold (700)</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-bw`} className="block text-xs font-medium text-gray-700 mb-1">
              Border Width (px)
            </label>
            <input
              id={`${toolId}-bw`}
              type="number"
              value={borderWidth}
              onChange={(e) => setBorderWidth(e.target.value)}
              aria-label="Border width"
              className="input-field"
              min="0"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-bc`} className="block text-xs font-medium text-gray-700 mb-1">
              Border Color
            </label>
            <div className="flex gap-2">
              <input
                id={`${toolId}-bc`}
                type="color"
                value={borderColor}
                onChange={(e) => setBorderColor(e.target.value)}
                aria-label="Border color"
                className="w-10 h-9 rounded cursor-pointer"
              />
              <input
                type="text"
                value={borderColor}
                onChange={(e) => setBorderColor(e.target.value)}
                className="input-field font-mono flex-1"
              />
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-trans`} className="block text-xs font-medium text-gray-700 mb-1">
              Transition (s)
            </label>
            <input
              id={`${toolId}-trans`}
              type="number"
              value={transition}
              onChange={(e) => setTransition(e.target.value)}
              aria-label="Transition duration"
              className="input-field"
              min="0"
              max="2"
              step="0.1"
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={shadow}
                onChange={(e) => setShadow(e.target.checked)}
              />
              Box Shadow
            </label>
          </div>
        </div>
        <button onClick={generate} className="btn-primary mt-3">
          Generate CSS
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Preview</label>
            <div className="p-4 bg-gray-50 rounded flex justify-center">
              <button
                style={{
                  backgroundColor: bgColor,
                  color: textColor,
                  border: `${borderWidth}px solid ${borderColor}`,
                  borderRadius: `${borderRadius}px`,
                  padding: `${paddingY}px ${paddingX}px`,
                  fontSize: `${fontSize}px`,
                  fontWeight: fontWeight,
                  cursor: 'pointer',
                }}
              >
                Button
              </button>
            </div>
            <label className="block text-sm font-medium text-gray-700">CSS Code</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
