'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function LineHeightCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [fontSize, setFontSize] = useState('16');
  const [ratio, setRatio] = useState('1.5');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const size = parseFloat(fontSize) || 16;
    const r = parseFloat(ratio) || 1.5;
    const lineHeight = size * r;
    const css = `font-size: ${size}px;\nline-height: ${r}; /* ${lineHeight}px */`;
    const spacing = lineHeight - size;
    setOutput(`Font Size: ${size}px\nLine Height Ratio: ${r}\nLine Height: ${lineHeight}px\nVertical Spacing: ${spacing}px (${(spacing / 2).toFixed(1)}px above + ${(spacing / 2).toFixed(1)}px below)\n\nCSS:\n${css}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-2 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-size`} className="block text-sm font-medium text-gray-700 mb-1">Font Size (px)</label>
          <input id={`${toolId}-size`} type="number" value={fontSize} onChange={(e) => setFontSize(e.target.value)} aria-label={`Font size for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-ratio`} className="block text-sm font-medium text-gray-700 mb-1">Line Height Ratio</label>
          <input id={`${toolId}-ratio`} type="number" step="0.1" value={ratio} onChange={(e) => setRatio(e.target.value)} aria-label={`Line height ratio for ${toolName}`} className="input-field" />
        </InputArea>
      </div>
      <div className="border rounded-lg p-4 bg-white">
        <p style={{ fontSize: `${fontSize}px`, lineHeight: ratio }}>The quick brown fox jumps over the lazy dog. This sample text demonstrates the line height setting across multiple lines of content.</p>
      </div>
      <button onClick={calculate} className="btn-primary">Calculate</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
