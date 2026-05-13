'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssOutlineTextGenerator - Generate CSS text outline/stroke effects.
 * Uses text-stroke and text-shadow techniques for outlined text.
 */
export default function CssOutlineTextGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [text, setText] = useState('Outline Text');
  const [fontSize, setFontSize] = useState('48');
  const [strokeWidth, setStrokeWidth] = useState('2');
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [fillColor, setFillColor] = useState('#ffffff');
  const [bgColor, setBgColor] = useState('#f0f0f0');
  const [method, setMethod] = useState<'webkit' | 'shadow' | 'both'>('both');
  const [output, setOutput] = useState('');

  const generate = () => {
    const sw = parseInt(strokeWidth) || 2;
    const lines: string[] = [];

    lines.push('/* CSS Text Outline/Stroke Effect */');
    lines.push('.outlined-text {');
    lines.push(`  font-size: ${fontSize}px;`);
    lines.push('  font-weight: bold;');
    lines.push(`  color: ${fillColor};`);

    if (method === 'webkit' || method === 'both') {
      lines.push(`  -webkit-text-stroke: ${sw}px ${strokeColor};`);
    }

    if (method === 'shadow' || method === 'both') {
      // Generate multi-directional text-shadow for outline effect
      const shadows: string[] = [];
      const steps = 16;
      for (let i = 0; i < steps; i++) {
        const angle = (2 * Math.PI * i) / steps;
        const x = (Math.cos(angle) * sw).toFixed(2);
        const y = (Math.sin(angle) * sw).toFixed(2);
        shadows.push(`${x}px ${y}px 0 ${strokeColor}`);
      }
      lines.push(`  text-shadow: ${shadows.join(',\n    ')};`);
    }

    lines.push('}');
    lines.push('');
    lines.push('/* HTML */');
    lines.push(`<span class="outlined-text">${text}</span>`);

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-text`} className="block text-sm font-medium text-gray-700 mb-1">Preview Text</label>
            <input id={`${toolId}-text`} type="text" value={text} onChange={(e) => setText(e.target.value)} className="input-field" aria-label={`Preview text for ${toolName}`} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor={`${toolId}-size`} className="block text-sm font-medium text-gray-700 mb-1">Font Size (px)</label>
              <input id={`${toolId}-size`} type="number" value={fontSize} onChange={(e) => setFontSize(e.target.value)} className="input-field" aria-label="Font size" />
            </div>
            <div>
              <label htmlFor={`${toolId}-width`} className="block text-sm font-medium text-gray-700 mb-1">Stroke Width (px)</label>
              <input id={`${toolId}-width`} type="number" min="1" max="10" value={strokeWidth} onChange={(e) => setStrokeWidth(e.target.value)} className="input-field" aria-label="Stroke width" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label htmlFor={`${toolId}-stroke`} className="block text-sm font-medium text-gray-700 mb-1">Stroke Color</label>
              <input id={`${toolId}-stroke`} type="color" value={strokeColor} onChange={(e) => setStrokeColor(e.target.value)} className="input-field h-10" aria-label="Stroke color" />
            </div>
            <div>
              <label htmlFor={`${toolId}-fill`} className="block text-sm font-medium text-gray-700 mb-1">Fill Color</label>
              <input id={`${toolId}-fill`} type="color" value={fillColor} onChange={(e) => setFillColor(e.target.value)} className="input-field h-10" aria-label="Fill color" />
            </div>
            <div>
              <label htmlFor={`${toolId}-bg`} className="block text-sm font-medium text-gray-700 mb-1">Background</label>
              <input id={`${toolId}-bg`} type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="input-field h-10" aria-label="Background color" />
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-method`} className="block text-sm font-medium text-gray-700 mb-1">Method</label>
            <select id={`${toolId}-method`} value={method} onChange={(e) => setMethod(e.target.value as 'webkit' | 'shadow' | 'both')} className="input-field" aria-label="Outline method">
              <option value="webkit">-webkit-text-stroke only</option>
              <option value="shadow">text-shadow only (cross-browser)</option>
              <option value="both">Both (best coverage)</option>
            </select>
          </div>
          <button onClick={generate} className="btn-primary w-full">Generate Outline CSS</button>
          <div className="p-4 rounded border" style={{ backgroundColor: bgColor }}>
            <span style={{
              fontSize: `${fontSize}px`,
              fontWeight: 'bold',
              color: fillColor,
              WebkitTextStroke: (method === 'webkit' || method === 'both') ? `${strokeWidth}px ${strokeColor}` : undefined,
            }}>{text}</span>
          </div>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated CSS</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-3 rounded max-h-96 overflow-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
