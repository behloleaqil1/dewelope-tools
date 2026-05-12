'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssShapeGenerator - Generate CSS shapes including triangle, circle, star, heart, and arrow.
 * Provides live preview and copyable CSS code.
 */
export default function CssShapeGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [shape, setShape] = useState<'triangle' | 'circle' | 'star' | 'heart' | 'arrow'>('triangle');
  const [color, setColor] = useState('#3B82F6');
  const [size, setSize] = useState('100');
  const [output, setOutput] = useState('');

  const generate = () => {
    const s = parseInt(size) || 100;
    let css = '';

    switch (shape) {
      case 'triangle':
        css = `.triangle {\n  width: 0;\n  height: 0;\n  border-left: ${s / 2}px solid transparent;\n  border-right: ${s / 2}px solid transparent;\n  border-bottom: ${s}px solid ${color};\n}`;
        break;
      case 'circle':
        css = `.circle {\n  width: ${s}px;\n  height: ${s}px;\n  background: ${color};\n  border-radius: 50%;\n}`;
        break;
      case 'star':
        css = `.star {\n  position: relative;\n  display: inline-block;\n  width: 0;\n  height: 0;\n  border-right: ${s}px solid transparent;\n  border-bottom: ${Math.round(s * 0.7)}px solid ${color};\n  border-left: ${s}px solid transparent;\n  transform: rotate(35deg);\n}\n.star::before {\n  content: '';\n  position: absolute;\n  top: ${Math.round(s * -0.45)}px;\n  left: ${Math.round(s * -0.65)}px;\n  width: 0;\n  height: 0;\n  border-right: ${s}px solid transparent;\n  border-bottom: ${Math.round(s * 0.7)}px solid ${color};\n  border-left: ${s}px solid transparent;\n  transform: rotate(-70deg);\n}\n.star::after {\n  content: '';\n  position: absolute;\n  top: ${Math.round(s * 0.03)}px;\n  left: ${Math.round(s * -1.05)}px;\n  width: 0;\n  height: 0;\n  border-right: ${s}px solid transparent;\n  border-bottom: ${Math.round(s * 0.7)}px solid ${color};\n  border-left: ${s}px solid transparent;\n  transform: rotate(-35deg);\n}`;
        break;
      case 'heart':
        css = `.heart {\n  position: relative;\n  width: ${s}px;\n  height: ${Math.round(s * 0.9)}px;\n}\n.heart::before,\n.heart::after {\n  content: '';\n  position: absolute;\n  top: 0;\n  width: ${s / 2}px;\n  height: ${Math.round(s * 0.8)}px;\n  background: ${color};\n  border-radius: ${s / 2}px ${s / 2}px 0 0;\n}\n.heart::before {\n  left: ${s / 2}px;\n  transform: rotate(-45deg);\n  transform-origin: 0 100%;\n}\n.heart::after {\n  left: 0;\n  transform: rotate(45deg);\n  transform-origin: 100% 100%;\n}`;
        break;
      case 'arrow':
        css = `.arrow {\n  position: relative;\n  width: ${s}px;\n  height: ${Math.round(s * 0.2)}px;\n  background: ${color};\n}\n.arrow::after {\n  content: '';\n  position: absolute;\n  right: -${Math.round(s * 0.2)}px;\n  top: -${Math.round(s * 0.15)}px;\n  width: 0;\n  height: 0;\n  border-top: ${Math.round(s * 0.25)}px solid transparent;\n  border-bottom: ${Math.round(s * 0.25)}px solid transparent;\n  border-left: ${Math.round(s * 0.3)}px solid ${color};\n}`;
        break;
    }

    setOutput(css);
  };

  const getPreviewStyle = (): React.CSSProperties => {
    const s = parseInt(size) || 100;
    switch (shape) {
      case 'triangle':
        return { width: 0, height: 0, borderLeft: `${s / 2}px solid transparent`, borderRight: `${s / 2}px solid transparent`, borderBottom: `${s}px solid ${color}` };
      case 'circle':
        return { width: `${s}px`, height: `${s}px`, background: color, borderRadius: '50%' };
      case 'heart':
        return { width: `${s}px`, height: `${s}px`, background: color, transform: 'rotate(-45deg)', borderRadius: `${s / 2}px 0 0 0`, position: 'relative' as const };
      case 'arrow':
        return { width: `${s}px`, height: `${Math.round(s * 0.2)}px`, background: color };
      default:
        return { width: `${s}px`, height: `${s}px`, background: color };
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-shape`} className="block text-sm font-medium text-gray-700 mb-1">
          Shape
        </label>
        <select
          id={`${toolId}-shape`}
          value={shape}
          onChange={(e) => setShape(e.target.value as 'triangle' | 'circle' | 'star' | 'heart' | 'arrow')}
          aria-label={`Shape selection for ${toolName}`}
          className="input-field"
        >
          <option value="triangle">Triangle</option>
          <option value="circle">Circle</option>
          <option value="star">Star</option>
          <option value="heart">Heart</option>
          <option value="arrow">Arrow</option>
        </select>
      </InputArea>

      <div className="grid grid-cols-2 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-color`} className="block text-sm font-medium text-gray-700 mb-1">
            Color
          </label>
          <div className="flex gap-2">
            <input
              id={`${toolId}-color`}
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              aria-label={`Color for ${toolName}`}
              className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="input-field flex-1"
            />
          </div>
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-size`} className="block text-sm font-medium text-gray-700 mb-1">
            Size (px)
          </label>
          <input
            id={`${toolId}-size`}
            type="text"
            inputMode="numeric"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            placeholder="e.g., 100"
            aria-label={`Size for ${toolName}`}
            className="input-field"
          />
        </InputArea>
      </div>

      <button onClick={generate} aria-label="Generate CSS shape" className="btn-primary">
        Generate CSS
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Preview</label>
            <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg border border-gray-200 min-h-[150px]">
              <div style={getPreviewStyle()} />
            </div>
            <label className="block text-sm font-medium text-gray-700">CSS Code</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
