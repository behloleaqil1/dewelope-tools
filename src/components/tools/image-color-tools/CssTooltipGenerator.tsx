'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssTooltipGenerator - Generate CSS-only tooltip code with customizable position, color, and style.
 */
export default function CssTooltipGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [tooltipText, setTooltipText] = useState('This is a tooltip');
  const [position, setPosition] = useState<'top' | 'bottom' | 'left' | 'right'>('top');
  const [bgColor, setBgColor] = useState('#333333');
  const [textColor, setTextColor] = useState('#ffffff');
  const [fontSize, setFontSize] = useState(14);
  const [output, setOutput] = useState('');

  function handleGenerate() {
    const arrowSize = '5px';
    let arrowCSS = '';
    let positionCSS = '';

    switch (position) {
      case 'top':
        positionCSS = `bottom: 125%; left: 50%; transform: translateX(-50%);`;
        arrowCSS = `top: 100%; left: 50%; transform: translateX(-50%); border-color: ${bgColor} transparent transparent transparent;`;
        break;
      case 'bottom':
        positionCSS = `top: 125%; left: 50%; transform: translateX(-50%);`;
        arrowCSS = `bottom: 100%; left: 50%; transform: translateX(-50%); border-color: transparent transparent ${bgColor} transparent;`;
        break;
      case 'left':
        positionCSS = `right: 125%; top: 50%; transform: translateY(-50%);`;
        arrowCSS = `left: 100%; top: 50%; transform: translateY(-50%); border-color: transparent transparent transparent ${bgColor};`;
        break;
      case 'right':
        positionCSS = `left: 125%; top: 50%; transform: translateY(-50%);`;
        arrowCSS = `right: 100%; top: 50%; transform: translateY(-50%); border-color: transparent ${bgColor} transparent transparent;`;
        break;
    }

    const html = `<div class="tooltip-container">
  Hover me
  <span class="tooltip-text">${tooltipText}</span>
</div>`;

    const css = `.tooltip-container {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.tooltip-text {
  visibility: hidden;
  opacity: 0;
  position: absolute;
  ${positionCSS}
  background-color: ${bgColor};
  color: ${textColor};
  font-size: ${fontSize}px;
  padding: 8px 12px;
  border-radius: 4px;
  white-space: nowrap;
  transition: opacity 0.3s;
  z-index: 1;
}

.tooltip-text::after {
  content: "";
  position: absolute;
  ${arrowCSS}
  border-width: ${arrowSize};
  border-style: solid;
}

.tooltip-container:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
}`;

    setOutput(`<!-- HTML -->\n${html}\n\n/* CSS */\n${css}`);
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-text`} className="block text-sm font-medium text-gray-700 mb-1">Tooltip Text</label>
            <input id={`${toolId}-text`} type="text" value={tooltipText} onChange={(e) => setTooltipText(e.target.value)} className="input-field" aria-label={`Tooltip text for ${toolName}`} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-pos`} className="block text-sm font-medium text-gray-700 mb-1">Position</label>
              <select id={`${toolId}-pos`} value={position} onChange={(e) => setPosition(e.target.value as 'top' | 'bottom' | 'left' | 'right')} className="input-field" aria-label="Tooltip position">
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </div>
            <div>
              <label htmlFor={`${toolId}-size`} className="block text-sm font-medium text-gray-700 mb-1">Font Size (px)</label>
              <input id={`${toolId}-size`} type="number" min={10} max={24} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="input-field" aria-label="Font size" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-bg`} className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
              <input id={`${toolId}-bg`} type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-10 w-full" aria-label="Background color" />
            </div>
            <div>
              <label htmlFor={`${toolId}-tc`} className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
              <input id={`${toolId}-tc`} type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="h-10 w-full" aria-label="Text color" />
            </div>
          </div>
        </div>
        <button onClick={handleGenerate} className="btn-primary mt-3">
          Generate Tooltip CSS
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Code</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
