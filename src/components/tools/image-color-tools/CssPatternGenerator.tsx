'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssPatternGenerator - Generate CSS-only background patterns.
 * Creates stripes, dots, checks, and other patterns using pure CSS.
 */
export default function CssPatternGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [pattern, setPattern] = useState<'stripes' | 'dots' | 'checks' | 'diagonal' | 'zigzag' | 'grid'>('stripes');
  const [color1, setColor1] = useState('#3b82f6');
  const [color2, setColor2] = useState('#ffffff');
  const [size, setSize] = useState(20);
  const [output, setOutput] = useState('');

  const generateCSS = () => {
    let css = '';

    switch (pattern) {
      case 'stripes':
        css = `background: repeating-linear-gradient(
  0deg,
  ${color1},
  ${color1} ${size}px,
  ${color2} ${size}px,
  ${color2} ${size * 2}px
);`;
        break;
      case 'dots':
        css = `background-color: ${color2};
background-image: radial-gradient(${color1} ${Math.floor(size / 4)}px, transparent ${Math.floor(size / 4)}px);
background-size: ${size}px ${size}px;`;
        break;
      case 'checks':
        css = `background-color: ${color2};
background-image:
  linear-gradient(45deg, ${color1} 25%, transparent 25%),
  linear-gradient(-45deg, ${color1} 25%, transparent 25%),
  linear-gradient(45deg, transparent 75%, ${color1} 75%),
  linear-gradient(-45deg, transparent 75%, ${color1} 75%);
background-size: ${size}px ${size}px;
background-position: 0 0, 0 ${size / 2}px, ${size / 2}px -${size / 2}px, -${size / 2}px 0px;`;
        break;
      case 'diagonal':
        css = `background: repeating-linear-gradient(
  45deg,
  ${color1},
  ${color1} ${Math.floor(size / 2)}px,
  ${color2} ${Math.floor(size / 2)}px,
  ${color2} ${size}px
);`;
        break;
      case 'zigzag':
        css = `background-color: ${color2};
background-image:
  linear-gradient(135deg, ${color1} 25%, transparent 25%),
  linear-gradient(225deg, ${color1} 25%, transparent 25%),
  linear-gradient(315deg, ${color1} 25%, transparent 25%),
  linear-gradient(45deg, ${color1} 25%, transparent 25%);
background-size: ${size}px ${size}px;
background-position: 0 0, ${size / 2}px 0, ${size / 2}px -${size / 2}px, 0px ${size / 2}px;`;
        break;
      case 'grid':
        css = `background-color: ${color2};
background-image:
  linear-gradient(${color1} 1px, transparent 1px),
  linear-gradient(90deg, ${color1} 1px, transparent 1px);
background-size: ${size}px ${size}px;`;
        break;
    }

    setOutput(css);
  };

  const getPreviewStyle = (): React.CSSProperties => {
    if (!output) return { backgroundColor: color2 };
    const styles: Record<string, string> = {};
    output.split('\n').forEach(line => {
      const match = line.match(/^([\w-]+):\s*(.+);?\s*$/);
      if (match) {
        const prop = match[1].replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        styles[prop] = match[2].replace(/;$/, '');
      }
    });
    return styles as React.CSSProperties;
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-1">Pattern Type</label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {(['stripes', 'dots', 'checks', 'diagonal', 'zigzag', 'grid'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPattern(p)}
              className={`px-3 py-2 rounded text-xs font-medium ${pattern === p ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              aria-label={`Select ${p} pattern`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </InputArea>

      <div className="grid grid-cols-2 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-color1`} className="block text-sm font-medium text-gray-700 mb-1">
            Color 1
          </label>
          <div className="flex gap-2 items-center">
            <input
              id={`${toolId}-color1`}
              type="color"
              value={color1}
              onChange={(e) => setColor1(e.target.value)}
              className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
              aria-label="Primary pattern color"
            />
            <input
              type="text"
              value={color1}
              onChange={(e) => setColor1(e.target.value)}
              className="input-field font-mono text-sm flex-1"
              aria-label="Primary color hex value"
            />
          </div>
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-color2`} className="block text-sm font-medium text-gray-700 mb-1">
            Color 2
          </label>
          <div className="flex gap-2 items-center">
            <input
              id={`${toolId}-color2`}
              type="color"
              value={color2}
              onChange={(e) => setColor2(e.target.value)}
              className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
              aria-label="Secondary pattern color"
            />
            <input
              type="text"
              value={color2}
              onChange={(e) => setColor2(e.target.value)}
              className="input-field font-mono text-sm flex-1"
              aria-label="Secondary color hex value"
            />
          </div>
        </InputArea>
      </div>

      <InputArea>
        <label htmlFor={`${toolId}-size`} className="block text-sm font-medium text-gray-700 mb-1">
          Pattern Size: {size}px
        </label>
        <input
          id={`${toolId}-size`}
          type="range"
          min={5}
          max={80}
          value={size}
          onChange={(e) => setSize(parseInt(e.target.value))}
          aria-label={`Pattern size for ${toolName}`}
          className="w-full"
        />
      </InputArea>

      <button onClick={generateCSS} aria-label="Generate CSS pattern" className="btn-primary">
        Generate Pattern
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Preview</label>
            <div
              className="w-full h-40 rounded-lg border border-gray-200"
              style={getPreviewStyle()}
            />
            <label className="block text-sm font-medium text-gray-700">CSS Code</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
