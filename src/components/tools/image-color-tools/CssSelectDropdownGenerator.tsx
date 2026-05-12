'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssSelectDropdownGenerator - Generate custom CSS styles for select/dropdown elements.
 */
export default function CssSelectDropdownGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [bgColor, setBgColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#333333');
  const [borderColor, setBorderColor] = useState('#cccccc');
  const [borderRadius, setBorderRadius] = useState('4');
  const [fontSize, setFontSize] = useState('16');
  const [padding, setPadding] = useState('10');
  const [arrowColor, setArrowColor] = useState('#666666');
  const [hoverBg, setHoverBg] = useState('#f0f0f0');
  const [focusBorder, setFocusBorder] = useState('#3b82f6');
  const [output, setOutput] = useState('');

  const generate = () => {
    const arrowSvg = encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${arrowColor}"><path d="M7 10l5 5 5-5z"/></svg>`);

    const css = `.custom-select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-color: ${bgColor};
  color: ${textColor};
  border: 1px solid ${borderColor};
  border-radius: ${borderRadius}px;
  font-size: ${fontSize}px;
  padding: ${padding}px ${parseInt(padding) + 30}px ${padding}px ${padding}px;
  width: 100%;
  cursor: pointer;
  outline: none;
  background-image: url("data:image/svg+xml,${arrowSvg}");
  background-repeat: no-repeat;
  background-position: right ${padding}px center;
  background-size: 20px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.custom-select:hover {
  background-color: ${hoverBg};
}

.custom-select:focus {
  border-color: ${focusBorder};
  box-shadow: 0 0 0 3px ${focusBorder}33;
}

.custom-select:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}`;

    setOutput(css);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor={`${toolId}-bg`} className="block text-sm font-medium text-gray-700 mb-1">Background</label>
              <input id={`${toolId}-bg`} type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full h-9 rounded cursor-pointer" aria-label={`Background color for ${toolName}`} />
            </div>
            <div>
              <label htmlFor={`${toolId}-text`} className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
              <input id={`${toolId}-text`} type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-full h-9 rounded cursor-pointer" aria-label="Text color" />
            </div>
            <div>
              <label htmlFor={`${toolId}-border`} className="block text-sm font-medium text-gray-700 mb-1">Border Color</label>
              <input id={`${toolId}-border`} type="color" value={borderColor} onChange={(e) => setBorderColor(e.target.value)} className="w-full h-9 rounded cursor-pointer" aria-label="Border color" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor={`${toolId}-arrow`} className="block text-sm font-medium text-gray-700 mb-1">Arrow Color</label>
              <input id={`${toolId}-arrow`} type="color" value={arrowColor} onChange={(e) => setArrowColor(e.target.value)} className="w-full h-9 rounded cursor-pointer" aria-label="Arrow color" />
            </div>
            <div>
              <label htmlFor={`${toolId}-hover`} className="block text-sm font-medium text-gray-700 mb-1">Hover BG</label>
              <input id={`${toolId}-hover`} type="color" value={hoverBg} onChange={(e) => setHoverBg(e.target.value)} className="w-full h-9 rounded cursor-pointer" aria-label="Hover background" />
            </div>
            <div>
              <label htmlFor={`${toolId}-focus`} className="block text-sm font-medium text-gray-700 mb-1">Focus Border</label>
              <input id={`${toolId}-focus`} type="color" value={focusBorder} onChange={(e) => setFocusBorder(e.target.value)} className="w-full h-9 rounded cursor-pointer" aria-label="Focus border color" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor={`${toolId}-radius`} className="block text-sm font-medium text-gray-700 mb-1">Border Radius (px)</label>
              <input id={`${toolId}-radius`} type="number" value={borderRadius} onChange={(e) => setBorderRadius(e.target.value)} className="input-field" aria-label="Border radius" />
            </div>
            <div>
              <label htmlFor={`${toolId}-font`} className="block text-sm font-medium text-gray-700 mb-1">Font Size (px)</label>
              <input id={`${toolId}-font`} type="number" value={fontSize} onChange={(e) => setFontSize(e.target.value)} className="input-field" aria-label="Font size" />
            </div>
            <div>
              <label htmlFor={`${toolId}-pad`} className="block text-sm font-medium text-gray-700 mb-1">Padding (px)</label>
              <input id={`${toolId}-pad`} type="number" value={padding} onChange={(e) => setPadding(e.target.value)} className="input-field" aria-label="Padding" />
            </div>
          </div>
          <button onClick={generate} className="btn-primary w-full">Generate CSS</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Preview</label>
            <div className="p-4 bg-gray-50 rounded-lg">
              <select
                className="custom-select"
                style={{
                  appearance: 'none',
                  backgroundColor: bgColor,
                  color: textColor,
                  border: `1px solid ${borderColor}`,
                  borderRadius: `${borderRadius}px`,
                  fontSize: `${fontSize}px`,
                  padding: `${padding}px ${parseInt(padding) + 30}px ${padding}px ${padding}px`,
                  width: '100%',
                  cursor: 'pointer',
                }}
                aria-label="Preview select"
              >
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </select>
            </div>
            <label className="block text-sm font-medium text-gray-700">Generated CSS</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
