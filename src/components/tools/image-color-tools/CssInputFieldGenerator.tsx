'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssInputFieldGenerator - Generate CSS input/form field styles.
 * Customize border, padding, colors, focus states, and get ready-to-use CSS.
 */
export default function CssInputFieldGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [borderWidth, setBorderWidth] = useState('1');
  const [borderColor, setBorderColor] = useState('#d1d5db');
  const [borderRadius, setBorderRadius] = useState('6');
  const [padding, setPadding] = useState('10');
  const [fontSize, setFontSize] = useState('16');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#111827');
  const [placeholderColor, setPlaceholderColor] = useState('#9ca3af');
  const [focusBorderColor, setFocusBorderColor] = useState('#3b82f6');
  const [focusShadow, setFocusShadow] = useState(true);
  const [width, setWidth] = useState('100');
  const [transition, setTransition] = useState(true);

  const css = `.custom-input {
  width: ${width}%;
  padding: ${padding}px;
  font-size: ${fontSize}px;
  color: ${textColor};
  background-color: ${bgColor};
  border: ${borderWidth}px solid ${borderColor};
  border-radius: ${borderRadius}px;
  outline: none;${transition ? '\n  transition: border-color 0.2s ease, box-shadow 0.2s ease;' : ''}
}

.custom-input::placeholder {
  color: ${placeholderColor};
}

.custom-input:focus {
  border-color: ${focusBorderColor};${focusShadow ? `\n  box-shadow: 0 0 0 3px ${focusBorderColor}33;` : ''}
}`;

  const html = `<input type="text" class="custom-input" placeholder="Enter text..." />`;

  const previewStyle = {
    width: `${width}%`,
    padding: `${padding}px`,
    fontSize: `${fontSize}px`,
    color: textColor,
    backgroundColor: bgColor,
    border: `${borderWidth}px solid ${borderColor}`,
    borderRadius: `${borderRadius}px`,
    outline: 'none',
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor={`${toolId}-border-w`} className="block text-sm font-medium text-gray-700 mb-1">
              Border Width (px)
            </label>
            <input
              id={`${toolId}-border-w`}
              type="number"
              value={borderWidth}
              onChange={(e) => setBorderWidth(e.target.value)}
              min="0"
              max="10"
              aria-label={`Border width for ${toolName}`}
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-border-c`} className="block text-sm font-medium text-gray-700 mb-1">
              Border Color
            </label>
            <div className="flex gap-2">
              <input
                id={`${toolId}-border-c`}
                type="color"
                value={borderColor}
                onChange={(e) => setBorderColor(e.target.value)}
                className="h-10 w-12 rounded border cursor-pointer"
              />
              <input
                type="text"
                value={borderColor}
                onChange={(e) => setBorderColor(e.target.value)}
                className="input-field flex-1 font-mono"
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
              min="0"
              max="50"
              aria-label="Border radius"
              className="input-field"
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
              min="0"
              max="40"
              aria-label="Padding"
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-font`} className="block text-sm font-medium text-gray-700 mb-1">
              Font Size (px)
            </label>
            <input
              id={`${toolId}-font`}
              type="number"
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              min="10"
              max="32"
              aria-label="Font size"
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-width`} className="block text-sm font-medium text-gray-700 mb-1">
              Width (%)
            </label>
            <input
              id={`${toolId}-width`}
              type="number"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              min="10"
              max="100"
              aria-label="Input width percentage"
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
                className="h-10 w-12 rounded border cursor-pointer"
              />
              <input type="text" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="input-field flex-1 font-mono" />
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-text-c`} className="block text-sm font-medium text-gray-700 mb-1">
              Text Color
            </label>
            <div className="flex gap-2">
              <input
                id={`${toolId}-text-c`}
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="h-10 w-12 rounded border cursor-pointer"
              />
              <input type="text" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="input-field flex-1 font-mono" />
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-focus-c`} className="block text-sm font-medium text-gray-700 mb-1">
              Focus Border Color
            </label>
            <div className="flex gap-2">
              <input
                id={`${toolId}-focus-c`}
                type="color"
                value={focusBorderColor}
                onChange={(e) => setFocusBorderColor(e.target.value)}
                className="h-10 w-12 rounded border cursor-pointer"
              />
              <input type="text" value={focusBorderColor} onChange={(e) => setFocusBorderColor(e.target.value)} className="input-field flex-1 font-mono" />
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-placeholder-c`} className="block text-sm font-medium text-gray-700 mb-1">
              Placeholder Color
            </label>
            <div className="flex gap-2">
              <input
                id={`${toolId}-placeholder-c`}
                type="color"
                value={placeholderColor}
                onChange={(e) => setPlaceholderColor(e.target.value)}
                className="h-10 w-12 rounded border cursor-pointer"
              />
              <input type="text" value={placeholderColor} onChange={(e) => setPlaceholderColor(e.target.value)} className="input-field flex-1 font-mono" />
            </div>
          </div>
        </div>
        <div className="flex gap-6 mt-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={focusShadow} onChange={(e) => setFocusShadow(e.target.checked)} className="rounded border-gray-300" />
            Focus shadow
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={transition} onChange={(e) => setTransition(e.target.checked)} className="rounded border-gray-300" />
            Transition
          </label>
        </div>
      </InputArea>

      <OutputArea hasContent={true}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Live Preview</label>
            <div className="bg-gray-100 p-6 rounded border">
              <input
                type="text"
                placeholder="Enter text..."
                style={previewStyle}
                readOnly
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CSS</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded border overflow-x-auto">{css}</pre>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">HTML</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded border">{html}</pre>
          </div>
          <CopyToClipboard text={`${css}\n\n/* HTML */\n${html}`} />
        </div>
      </OutputArea>
    </div>
  );
}
