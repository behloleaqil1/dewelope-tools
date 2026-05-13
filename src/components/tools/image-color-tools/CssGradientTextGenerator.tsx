'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssGradientTextGenerator - Generate CSS gradient text effects.
 * Creates gradient-filled text using background-clip and text-fill-color.
 */
export default function CssGradientTextGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [text, setText] = useState('Gradient Text');
  const [color1, setColor1] = useState('#667eea');
  const [color2, setColor2] = useState('#764ba2');
  const [color3, setColor3] = useState('');
  const [direction, setDirection] = useState('to right');
  const [fontSize, setFontSize] = useState('48');
  const [fontWeight, setFontWeight] = useState('bold');
  const [gradientType, setGradientType] = useState('linear');
  const [output, setOutput] = useState('');

  const generate = () => {
    if (!text.trim()) {
      setOutput('');
      return;
    }

    const colors = [color1, color2, color3].filter(c => c.trim());
    const colorStops = colors.join(', ');

    let gradientValue = '';
    if (gradientType === 'linear') {
      gradientValue = `linear-gradient(${direction}, ${colorStops})`;
    } else if (gradientType === 'radial') {
      gradientValue = `radial-gradient(circle, ${colorStops})`;
    } else {
      gradientValue = `conic-gradient(from 0deg, ${colorStops})`;
    }

    let css = `/* CSS Gradient Text Effect */\n`;
    css += `.gradient-text {\n`;
    css += `  font-size: ${fontSize}px;\n`;
    css += `  font-weight: ${fontWeight};\n`;
    css += `  background: ${gradientValue};\n`;
    css += `  -webkit-background-clip: text;\n`;
    css += `  -webkit-text-fill-color: transparent;\n`;
    css += `  background-clip: text;\n`;
    css += `  display: inline-block;\n`;
    css += `}\n\n`;
    css += `/* With animation (optional) */\n`;
    css += `.gradient-text-animated {\n`;
    css += `  font-size: ${fontSize}px;\n`;
    css += `  font-weight: ${fontWeight};\n`;
    css += `  background: ${gradientValue};\n`;
    css += `  background-size: 200% auto;\n`;
    css += `  -webkit-background-clip: text;\n`;
    css += `  -webkit-text-fill-color: transparent;\n`;
    css += `  background-clip: text;\n`;
    css += `  display: inline-block;\n`;
    css += `  animation: gradient-shift 3s ease infinite;\n`;
    css += `}\n\n`;
    css += `@keyframes gradient-shift {\n`;
    css += `  0% { background-position: 0% center; }\n`;
    css += `  50% { background-position: 100% center; }\n`;
    css += `  100% { background-position: 0% center; }\n`;
    css += `}\n\n`;
    css += `<!-- HTML -->\n`;
    css += `<span class="gradient-text">${text}</span>\n`;

    setOutput(css);
  };

  const previewStyle: React.CSSProperties = {
    fontSize: `${Math.min(parseInt(fontSize) || 48, 72)}px`,
    fontWeight: fontWeight as React.CSSProperties['fontWeight'],
    background: gradientType === 'linear'
      ? `linear-gradient(${direction}, ${[color1, color2, color3].filter(c => c).join(', ')})`
      : gradientType === 'radial'
      ? `radial-gradient(circle, ${[color1, color2, color3].filter(c => c).join(', ')})`
      : `conic-gradient(from 0deg, ${[color1, color2, color3].filter(c => c).join(', ')})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    display: 'inline-block',
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-text`} className="block text-sm font-medium text-gray-700 mb-1">Text</label>
            <input id={`${toolId}-text`} type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Your gradient text..." className="input-field" aria-label={`Text input for ${toolName}`} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor={`${toolId}-color1`} className="block text-sm font-medium text-gray-700 mb-1">Color 1</label>
              <input id={`${toolId}-color1`} type="color" value={color1} onChange={(e) => setColor1(e.target.value)} className="input-field h-10" />
            </div>
            <div>
              <label htmlFor={`${toolId}-color2`} className="block text-sm font-medium text-gray-700 mb-1">Color 2</label>
              <input id={`${toolId}-color2`} type="color" value={color2} onChange={(e) => setColor2(e.target.value)} className="input-field h-10" />
            </div>
            <div>
              <label htmlFor={`${toolId}-color3`} className="block text-sm font-medium text-gray-700 mb-1">Color 3 (optional)</label>
              <input id={`${toolId}-color3`} type="color" value={color3 || '#ffffff'} onChange={(e) => setColor3(e.target.value)} className="input-field h-10" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">Gradient Type</label>
              <select id={`${toolId}-type`} value={gradientType} onChange={(e) => setGradientType(e.target.value)} className="input-field">
                <option value="linear">Linear</option>
                <option value="radial">Radial</option>
                <option value="conic">Conic</option>
              </select>
            </div>
            <div>
              <label htmlFor={`${toolId}-direction`} className="block text-sm font-medium text-gray-700 mb-1">Direction</label>
              <select id={`${toolId}-direction`} value={direction} onChange={(e) => setDirection(e.target.value)} className="input-field">
                <option value="to right">To Right</option>
                <option value="to left">To Left</option>
                <option value="to bottom">To Bottom</option>
                <option value="to top">To Top</option>
                <option value="45deg">45°</option>
                <option value="135deg">135°</option>
                <option value="225deg">225°</option>
                <option value="315deg">315°</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-fontsize`} className="block text-sm font-medium text-gray-700 mb-1">Font Size (px)</label>
              <input id={`${toolId}-fontsize`} type="number" min="12" max="120" value={fontSize} onChange={(e) => setFontSize(e.target.value)} className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-weight`} className="block text-sm font-medium text-gray-700 mb-1">Font Weight</label>
              <select id={`${toolId}-weight`} value={fontWeight} onChange={(e) => setFontWeight(e.target.value)} className="input-field">
                <option value="normal">Normal</option>
                <option value="bold">Bold</option>
                <option value="900">Black (900)</option>
                <option value="300">Light (300)</option>
              </select>
            </div>
          </div>
          <button onClick={generate} className="btn-primary">Generate CSS</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Preview</label>
            <div className="p-4 bg-white border rounded-lg overflow-hidden">
              <span style={previewStyle}>{text}</span>
            </div>
            <label className="block text-sm font-medium text-gray-700">Generated CSS & HTML</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-3 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
