'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssEmbossTextGenerator - Generate CSS embossed and debossed text effects.
 * Creates realistic raised/sunken text using text-shadow techniques.
 */
export default function CssEmbossTextGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [text, setText] = useState('Embossed Text');
  const [style, setStyle] = useState('emboss-light');
  const [fontSize, setFontSize] = useState('48');
  const [bgColor, setBgColor] = useState('#b0b0b0');
  const [textColor, setTextColor] = useState('#b0b0b0');
  const [output, setOutput] = useState('');
  const [cssCode, setCssCode] = useState('');

  const styles: Record<string, { name: string; shadow: string; color: string }> = {
    'emboss-light': { name: 'Light Emboss', shadow: '-1px -1px 1px rgba(255,255,255,0.8), 1px 1px 1px rgba(0,0,0,0.3)', color: 'inherit' },
    'emboss-strong': { name: 'Strong Emboss', shadow: '-2px -2px 2px rgba(255,255,255,0.9), 2px 2px 3px rgba(0,0,0,0.4)', color: 'inherit' },
    'deboss-light': { name: 'Light Deboss', shadow: '1px 1px 1px rgba(255,255,255,0.6), -1px -1px 1px rgba(0,0,0,0.3)', color: 'inherit' },
    'deboss-strong': { name: 'Strong Deboss', shadow: '2px 2px 2px rgba(255,255,255,0.7), -2px -2px 3px rgba(0,0,0,0.5)', color: 'inherit' },
    'letterpress': { name: 'Letterpress', shadow: '0 1px 0 rgba(255,255,255,0.7), 0 -1px 0 rgba(0,0,0,0.2)', color: 'inherit' },
    'pillow': { name: 'Pillow Emboss', shadow: '-1px -1px 1px rgba(255,255,255,0.8), 1px 1px 1px rgba(0,0,0,0.3), inset 1px 1px 1px rgba(0,0,0,0.1)', color: 'inherit' },
  };

  const generate = () => {
    const selectedStyle = styles[style];
    if (!selectedStyle) return;

    const css = `.emboss-text {
  font-size: ${fontSize}px;
  font-weight: bold;
  color: ${textColor};
  background-color: ${bgColor};
  text-shadow: ${selectedStyle.shadow};
  font-family: Arial, sans-serif;
  padding: 20px;
}`;

    const html = `<div class="emboss-text">${text}</div>`;

    setCssCode(css);
    setOutput(`/* ${selectedStyle.name} Effect */\n\n${css}\n\n<!-- HTML -->\n${html}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label htmlFor={`${toolId}-text`} className="block text-sm font-medium text-gray-700 mb-1">Text</label>
            <input id={`${toolId}-text`} type="text" value={text} onChange={(e) => setText(e.target.value)} className="input-field" aria-label={`Text input for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-style`} className="block text-sm font-medium text-gray-700 mb-1">Effect Style</label>
            <select id={`${toolId}-style`} value={style} onChange={(e) => setStyle(e.target.value)} className="input-field" aria-label="Effect style">
              <option value="emboss-light">Light Emboss</option>
              <option value="emboss-strong">Strong Emboss</option>
              <option value="deboss-light">Light Deboss</option>
              <option value="deboss-strong">Strong Deboss</option>
              <option value="letterpress">Letterpress</option>
              <option value="pillow">Pillow Emboss</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-size`} className="block text-sm font-medium text-gray-700 mb-1">Font Size (px)</label>
            <input id={`${toolId}-size`} type="number" value={fontSize} onChange={(e) => setFontSize(e.target.value)} className="input-field" aria-label="Font size" />
          </div>
          <div>
            <label htmlFor={`${toolId}-bg`} className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
            <input id={`${toolId}-bg`} type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="input-field h-10" aria-label="Background color" />
          </div>
          <div>
            <label htmlFor={`${toolId}-color`} className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
            <input id={`${toolId}-color`} type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="input-field h-10" aria-label="Text color" />
          </div>
        </div>
        <button onClick={generate} className="btn-primary mt-4">Generate Emboss CSS</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-4">
            {cssCode && (
              <div className="p-6 rounded-lg" style={{ backgroundColor: bgColor }}>
                <span style={{ fontSize: `${fontSize}px`, fontWeight: 'bold', color: textColor, textShadow: styles[style]?.shadow }}>{text}</span>
              </div>
            )}
            <label className="block text-sm font-medium text-gray-700">CSS & HTML Code</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
