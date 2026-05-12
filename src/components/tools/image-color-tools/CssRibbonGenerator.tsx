'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssRibbonGenerator - Generate CSS ribbon/banner shapes.
 * Creates CSS code for ribbon elements with customizable text, color, and position.
 */
export default function CssRibbonGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [text, setText] = useState('SALE');
  const [bgColor, setBgColor] = useState('#e74c3c');
  const [textColor, setTextColor] = useState('#ffffff');
  const [position, setPosition] = useState<'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'>('top-right');
  const [fontSize, setFontSize] = useState('14');
  const [output, setOutput] = useState('');

  function generate() {
    const positionStyles: Record<string, string> = {
      'top-left': `  top: 20px;\n  left: -35px;\n  transform: rotate(-45deg);`,
      'top-right': `  top: 20px;\n  right: -35px;\n  transform: rotate(45deg);`,
      'bottom-left': `  bottom: 20px;\n  left: -35px;\n  transform: rotate(45deg);`,
      'bottom-right': `  bottom: 20px;\n  right: -35px;\n  transform: rotate(-45deg);`,
    };

    const css = `.ribbon-container {
  position: relative;
  overflow: hidden;
}

.ribbon {
  position: absolute;
${positionStyles[position]}
  width: 150px;
  padding: 5px 0;
  background-color: ${bgColor};
  color: ${textColor};
  text-align: center;
  font-size: ${fontSize}px;
  font-weight: bold;
  letter-spacing: 1px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 10;
}`;

    const html = `<div class="ribbon-container">
  <div class="ribbon">${text}</div>
  <!-- Your content here -->
</div>`;

    setOutput(`/* HTML */\n${html}\n\n/* CSS */\n${css}`);
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-text`} className="block text-sm font-medium text-gray-700 mb-1">
          Ribbon Text
        </label>
        <input
          id={`${toolId}-text`}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g. SALE"
          aria-label={`Ribbon text for ${toolName}`}
          className="input-field mb-3"
        />
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label htmlFor={`${toolId}-bg`} className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
            <input id={`${toolId}-bg`} type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full h-10 cursor-pointer" aria-label="Background color" />
          </div>
          <div>
            <label htmlFor={`${toolId}-tc`} className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
            <input id={`${toolId}-tc`} type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-full h-10 cursor-pointer" aria-label="Text color" />
          </div>
        </div>
        <label htmlFor={`${toolId}-pos`} className="block text-sm font-medium text-gray-700 mb-1">Position</label>
        <select id={`${toolId}-pos`} value={position} onChange={(e) => setPosition(e.target.value as typeof position)} className="input-field mb-3" aria-label="Ribbon position">
          <option value="top-left">Top Left</option>
          <option value="top-right">Top Right</option>
          <option value="bottom-left">Bottom Left</option>
          <option value="bottom-right">Bottom Right</option>
        </select>
        <label htmlFor={`${toolId}-fs`} className="block text-sm font-medium text-gray-700 mb-1">Font Size (px)</label>
        <input id={`${toolId}-fs`} type="number" value={fontSize} onChange={(e) => setFontSize(e.target.value)} className="input-field mb-3" min="8" max="48" aria-label="Font size" />
        <button onClick={generate} className="btn-primary mt-2">Generate Ribbon CSS</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Code</label>
            <div className="relative overflow-hidden border rounded p-8 mb-3" style={{ minHeight: '100px' }}>
              <div
                className="absolute font-bold text-center shadow-md z-10"
                style={{
                  width: '150px',
                  padding: '5px 0',
                  backgroundColor: bgColor,
                  color: textColor,
                  fontSize: `${fontSize}px`,
                  letterSpacing: '1px',
                  ...(position === 'top-right' ? { top: '20px', right: '-35px', transform: 'rotate(45deg)' } :
                    position === 'top-left' ? { top: '20px', left: '-35px', transform: 'rotate(-45deg)' } :
                    position === 'bottom-right' ? { bottom: '20px', right: '-35px', transform: 'rotate(-45deg)' } :
                    { bottom: '20px', left: '-35px', transform: 'rotate(45deg)' })
                }}
              >
                {text}
              </div>
              <p className="text-gray-400 text-center">Preview</p>
            </div>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
