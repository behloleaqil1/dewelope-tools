'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssBlobGenerator - Generate CSS blob/organic shapes with border-radius.
 */
export default function CssBlobGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [color, setColor] = useState('#6366f1');
  const [size, setSize] = useState('200');
  const [complexity, setComplexity] = useState<'simple' | 'medium' | 'complex'>('medium');
  const [blob, setBlob] = useState<{ borderRadius: string; css: string } | null>(null);

  const generateBlob = () => {
    const sizeNum = Math.max(50, Math.min(600, parseInt(size) || 200));
    let borderRadius: string;

    const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

    if (complexity === 'simple') {
      const values = Array.from({ length: 4 }, () => `${rand(30, 70)}%`);
      borderRadius = values.join(' ');
    } else if (complexity === 'medium') {
      const values = Array.from({ length: 8 }, () => `${rand(20, 80)}%`);
      borderRadius = `${values[0]} ${values[1]} ${values[2]} ${values[3]} / ${values[4]} ${values[5]} ${values[6]} ${values[7]}`;
    } else {
      const values = Array.from({ length: 8 }, () => `${rand(10, 90)}%`);
      borderRadius = `${values[0]} ${values[1]} ${values[2]} ${values[3]} / ${values[4]} ${values[5]} ${values[6]} ${values[7]}`;
    }

    const css = `.blob {\n  width: ${sizeNum}px;\n  height: ${sizeNum}px;\n  background-color: ${color};\n  border-radius: ${borderRadius};\n}`;

    setBlob({ borderRadius, css });
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <label htmlFor={`${toolId}-color`} className="block text-sm font-medium text-gray-700 mb-1">Color</label>
            <div className="flex gap-2 items-center">
              <input
                id={`${toolId}-color`}
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
                aria-label={`Blob color for ${toolName}`}
              />
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="input-field flex-1"
                aria-label="Color hex value"
              />
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-size`} className="block text-sm font-medium text-gray-700 mb-1">Size (px)</label>
            <input
              id={`${toolId}-size`}
              type="number"
              min="50"
              max="600"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="input-field"
              aria-label={`Blob size for ${toolName}`}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Complexity</label>
          <div className="flex gap-4">
            <label className="inline-flex items-center text-sm">
              <input type="radio" checked={complexity === 'simple'} onChange={() => setComplexity('simple')} className="mr-1" />
              Simple
            </label>
            <label className="inline-flex items-center text-sm">
              <input type="radio" checked={complexity === 'medium'} onChange={() => setComplexity('medium')} className="mr-1" />
              Medium
            </label>
            <label className="inline-flex items-center text-sm">
              <input type="radio" checked={complexity === 'complex'} onChange={() => setComplexity('complex')} className="mr-1" />
              Complex
            </label>
          </div>
        </div>
      </InputArea>

      <button onClick={generateBlob} aria-label="Generate blob" className="btn-primary">
        Generate Blob
      </button>

      <OutputArea hasContent={blob !== null}>
        {blob && (
          <div className="space-y-4">
            <div className="flex justify-center p-8 bg-gray-50 rounded-lg border border-gray-200">
              <div
                style={{
                  width: `${Math.min(200, parseInt(size) || 200)}px`,
                  height: `${Math.min(200, parseInt(size) || 200)}px`,
                  backgroundColor: color,
                  borderRadius: blob.borderRadius,
                  transition: 'all 0.3s ease',
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CSS Code</label>
              <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{blob.css}</pre>
            </div>
            <CopyToClipboard text={blob.css} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
