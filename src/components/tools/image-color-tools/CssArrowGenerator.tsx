'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssArrowGenerator - Generate CSS arrow/pointer shapes using borders or clip-path.
 * Supports multiple directions, sizes, and colors with live preview.
 */
export default function CssArrowGenerator({ toolId, toolName: _toolName }: { toolId: string; toolName: string }) {
  const [direction, setDirection] = useState<'up' | 'down' | 'left' | 'right'>('right');
  const [size, setSize] = useState('40');
  const [color, setColor] = useState('#3B82F6');
  const [method, setMethod] = useState<'border' | 'clip-path'>('border');
  const [output, setOutput] = useState('');

  function generateCSS() {
    const s = parseInt(size) || 40;

    if (method === 'border') {
      let css = `.arrow-${direction} {\n  width: 0;\n  height: 0;\n`;
      switch (direction) {
        case 'up':
          css += `  border-left: ${s}px solid transparent;\n  border-right: ${s}px solid transparent;\n  border-bottom: ${s}px solid ${color};\n`;
          break;
        case 'down':
          css += `  border-left: ${s}px solid transparent;\n  border-right: ${s}px solid transparent;\n  border-top: ${s}px solid ${color};\n`;
          break;
        case 'left':
          css += `  border-top: ${s}px solid transparent;\n  border-bottom: ${s}px solid transparent;\n  border-right: ${s}px solid ${color};\n`;
          break;
        case 'right':
          css += `  border-top: ${s}px solid transparent;\n  border-bottom: ${s}px solid transparent;\n  border-left: ${s}px solid ${color};\n`;
          break;
      }
      css += `}`;
      setOutput(css);
    } else {
      let polygon = '';
      switch (direction) {
        case 'up': polygon = '50% 0%, 0% 100%, 100% 100%'; break;
        case 'down': polygon = '0% 0%, 100% 0%, 50% 100%'; break;
        case 'left': polygon = '100% 0%, 100% 100%, 0% 50%'; break;
        case 'right': polygon = '0% 0%, 0% 100%, 100% 50%'; break;
      }
      const css = `.arrow-${direction} {\n  width: ${s * 2}px;\n  height: ${s * 2}px;\n  background-color: ${color};\n  clip-path: polygon(${polygon});\n}`;
      setOutput(css);
    }
  }

  function getPreviewStyle(): React.CSSProperties {
    const s = parseInt(size) || 40;
    if (method === 'border') {
      const base: React.CSSProperties = { width: 0, height: 0 };
      switch (direction) {
        case 'up': return { ...base, borderLeft: `${s}px solid transparent`, borderRight: `${s}px solid transparent`, borderBottom: `${s}px solid ${color}` };
        case 'down': return { ...base, borderLeft: `${s}px solid transparent`, borderRight: `${s}px solid transparent`, borderTop: `${s}px solid ${color}` };
        case 'left': return { ...base, borderTop: `${s}px solid transparent`, borderBottom: `${s}px solid transparent`, borderRight: `${s}px solid ${color}` };
        case 'right': return { ...base, borderTop: `${s}px solid transparent`, borderBottom: `${s}px solid transparent`, borderLeft: `${s}px solid ${color}` };
      }
    } else {
      let polygon = '';
      switch (direction) {
        case 'up': polygon = '50% 0%, 0% 100%, 100% 100%'; break;
        case 'down': polygon = '0% 0%, 100% 0%, 50% 100%'; break;
        case 'left': polygon = '100% 0%, 100% 100%, 0% 50%'; break;
        case 'right': polygon = '0% 0%, 0% 100%, 100% 50%'; break;
      }
      return { width: `${s * 2}px`, height: `${s * 2}px`, backgroundColor: color, clipPath: `polygon(${polygon})` };
    }
    return {};
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${toolId}-direction`} className="block text-sm font-medium text-gray-700 mb-1">Direction</label>
            <select id={`${toolId}-direction`} value={direction} onChange={(e) => setDirection(e.target.value as 'up' | 'down' | 'left' | 'right')} aria-label="Arrow direction" className="input-field">
              <option value="up">Up</option>
              <option value="down">Down</option>
              <option value="left">Left</option>
              <option value="right">Right</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-method`} className="block text-sm font-medium text-gray-700 mb-1">Method</label>
            <select id={`${toolId}-method`} value={method} onChange={(e) => setMethod(e.target.value as 'border' | 'clip-path')} aria-label="CSS method" className="input-field">
              <option value="border">Border Trick</option>
              <option value="clip-path">Clip-path</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-size`} className="block text-sm font-medium text-gray-700 mb-1">Size (px)</label>
            <input id={`${toolId}-size`} type="number" value={size} onChange={(e) => setSize(e.target.value)} aria-label="Arrow size in pixels" className="input-field" min="10" max="200" step="5" />
          </div>
          <div>
            <label htmlFor={`${toolId}-color`} className="block text-sm font-medium text-gray-700 mb-1">Color</label>
            <div className="flex gap-2">
              <input id={`${toolId}-color`} type="color" value={color} onChange={(e) => setColor(e.target.value)} aria-label="Arrow color" className="h-10 w-12 rounded cursor-pointer" />
              <input type="text" value={color} onChange={(e) => setColor(e.target.value)} className="input-field flex-1 font-mono" aria-label="Arrow color hex value" />
            </div>
          </div>
        </div>
        <button onClick={generateCSS} className="btn-primary mt-3">Generate CSS</button>

        <div className="mt-4 flex items-center justify-center p-6 bg-gray-50 rounded-lg border border-gray-200 min-h-[120px]">
          <div style={getPreviewStyle()} />
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated CSS</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
