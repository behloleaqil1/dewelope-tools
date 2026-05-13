'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssGlassmorphismTextGenerator - Generate CSS glassmorphism text effects.
 * Creates frosted glass text styling with backdrop blur, transparency, and border effects.
 */
export default function CssGlassmorphismTextGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [text, setText] = useState('Glassmorphism');
  const [fontSize, setFontSize] = useState('64');
  const [blur, setBlur] = useState('10');
  const [opacity, setOpacity] = useState('0.2');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#ffffff');
  const [borderOpacity, setBorderOpacity] = useState('0.3');
  const [borderRadius, setBorderRadius] = useState('16');
  const [padding, setPadding] = useState('24');
  const [output, setOutput] = useState('');

  const generate = () => {
    const css = `.glass-text {
  font-size: ${fontSize}px;
  color: ${textColor};
  background: rgba(${hexToRgb(bgColor)}, ${opacity});
  backdrop-filter: blur(${blur}px);
  -webkit-backdrop-filter: blur(${blur}px);
  border: 1px solid rgba(255, 255, 255, ${borderOpacity});
  border-radius: ${borderRadius}px;
  padding: ${padding}px;
  display: inline-block;
  font-weight: bold;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}`;
    setOutput(css);
  };

  const hexToRgb = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return '255, 255, 255';
    return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
  };

  const previewStyle: React.CSSProperties = {
    fontSize: `${Math.min(parseInt(fontSize) || 32, 80)}px`,
    color: textColor,
    background: `rgba(${hexToRgb(bgColor)}, ${opacity})`,
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
    border: `1px solid rgba(255, 255, 255, ${borderOpacity})`,
    borderRadius: `${borderRadius}px`,
    padding: `${padding}px`,
    display: 'inline-block',
    fontWeight: 'bold',
    textShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-text`} className="block text-sm font-medium text-gray-700 mb-1">Preview Text</label>
            <input id={`${toolId}-text`} type="text" value={text} onChange={(e) => setText(e.target.value)} className="input-field" aria-label={`Preview text for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-fontsize`} className="block text-sm font-medium text-gray-700 mb-1">Font Size (px)</label>
            <input id={`${toolId}-fontsize`} type="number" value={fontSize} onChange={(e) => setFontSize(e.target.value)} className="input-field" aria-label="Font size" />
          </div>
          <div>
            <label htmlFor={`${toolId}-blur`} className="block text-sm font-medium text-gray-700 mb-1">Blur Amount (px)</label>
            <input id={`${toolId}-blur`} type="number" value={blur} onChange={(e) => setBlur(e.target.value)} className="input-field" aria-label="Blur amount" />
          </div>
          <div>
            <label htmlFor={`${toolId}-opacity`} className="block text-sm font-medium text-gray-700 mb-1">Background Opacity (0-1)</label>
            <input id={`${toolId}-opacity`} type="number" step="0.05" min="0" max="1" value={opacity} onChange={(e) => setOpacity(e.target.value)} className="input-field" aria-label="Background opacity" />
          </div>
          <div>
            <label htmlFor={`${toolId}-bgcolor`} className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
            <input id={`${toolId}-bgcolor`} type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="input-field h-10" aria-label="Background color" />
          </div>
          <div>
            <label htmlFor={`${toolId}-textcolor`} className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
            <input id={`${toolId}-textcolor`} type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="input-field h-10" aria-label="Text color" />
          </div>
          <div>
            <label htmlFor={`${toolId}-border-opacity`} className="block text-sm font-medium text-gray-700 mb-1">Border Opacity (0-1)</label>
            <input id={`${toolId}-border-opacity`} type="number" step="0.05" min="0" max="1" value={borderOpacity} onChange={(e) => setBorderOpacity(e.target.value)} className="input-field" aria-label="Border opacity" />
          </div>
          <div>
            <label htmlFor={`${toolId}-radius`} className="block text-sm font-medium text-gray-700 mb-1">Border Radius (px)</label>
            <input id={`${toolId}-radius`} type="number" value={borderRadius} onChange={(e) => setBorderRadius(e.target.value)} className="input-field" aria-label="Border radius" />
          </div>
          <div>
            <label htmlFor={`${toolId}-padding`} className="block text-sm font-medium text-gray-700 mb-1">Padding (px)</label>
            <input id={`${toolId}-padding`} type="number" value={padding} onChange={(e) => setPadding(e.target.value)} className="input-field" aria-label="Padding" />
          </div>
        </div>
        <button onClick={generate} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">Generate CSS</button>
      </InputArea>

      <div className="p-8 rounded-lg bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400">
        <div style={previewStyle}>{text || 'Preview'}</div>
      </div>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated CSS</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
