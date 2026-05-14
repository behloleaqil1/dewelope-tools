'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function LetterSpacingCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [fontSize, setFontSize] = useState('16');
  const [tracking, setTracking] = useState('50');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const size = parseFloat(fontSize) || 16;
    const track = parseFloat(tracking) || 0;
    const emValue = track / 1000;
    const pxValue = size * emValue;
    const css = `font-size: ${size}px;\nletter-spacing: ${emValue.toFixed(4)}em; /* ${pxValue.toFixed(2)}px at ${size}px, tracking ${track} */`;
    setOutput(`Font Size: ${size}px\nTracking: ${track}\nLetter Spacing: ${emValue.toFixed(4)}em\nLetter Spacing: ${pxValue.toFixed(2)}px\n\nCSS:\n${css}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-2 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-size`} className="block text-sm font-medium text-gray-700 mb-1">Font Size (px)</label>
          <input id={`${toolId}-size`} type="number" value={fontSize} onChange={(e) => setFontSize(e.target.value)} aria-label={`Font size for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-tracking`} className="block text-sm font-medium text-gray-700 mb-1">Tracking (1/1000 em)</label>
          <input id={`${toolId}-tracking`} type="number" value={tracking} onChange={(e) => setTracking(e.target.value)} aria-label={`Tracking value for ${toolName}`} className="input-field" />
        </InputArea>
      </div>
      <div className="border rounded-lg p-4 bg-white">
        <p style={{ fontSize: `${fontSize}px`, letterSpacing: `${parseFloat(tracking) / 1000}em` }}>SAMPLE TEXT PREVIEW</p>
      </div>
      <button onClick={calculate} className="btn-primary">Calculate</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
