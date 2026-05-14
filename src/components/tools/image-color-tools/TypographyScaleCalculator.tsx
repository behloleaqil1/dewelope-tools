'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function TypographyScaleCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [baseSize, setBaseSize] = useState('16');
  const [ratio, setRatio] = useState('1.25');
  const [steps, setSteps] = useState('6');
  const [output, setOutput] = useState('');

  const ratios: Record<string, number> = {
    '1.067': 1.067, '1.125': 1.125, '1.2': 1.2, '1.25': 1.25,
    '1.333': 1.333, '1.414': 1.414, '1.5': 1.5, '1.618': 1.618,
  };

  const generate = () => {
    const base = parseFloat(baseSize) || 16;
    const r = parseFloat(ratio) || 1.25;
    const n = parseInt(steps) || 6;

    const scale: { step: number; px: number; rem: number; name: string }[] = [];
    const names = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl'];

    for (let i = -1; i < n; i++) {
      const px = base * Math.pow(r, i);
      scale.push({ step: i, px, rem: px / 16, name: names[i + 1] || `step-${i}` });
    }

    const cssVars = scale.map(s => `  --text-${s.name}: ${s.rem.toFixed(3)}rem; /* ${s.px.toFixed(1)}px */`).join('\n');
    const css = `:root {\n${cssVars}\n}`;

    setOutput(`Type Scale (base: ${base}px, ratio: ${r})\n${'─'.repeat(40)}\n${scale.map(s => `${s.name.padEnd(6)} │ ${s.px.toFixed(1).padStart(7)}px │ ${s.rem.toFixed(3)}rem`).join('\n')}\n\n${css}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-3 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-base`} className="block text-sm font-medium text-gray-700 mb-1">Base Size (px)</label>
          <input id={`${toolId}-base`} type="number" value={baseSize} onChange={(e) => setBaseSize(e.target.value)} aria-label={`Base size for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-ratio`} className="block text-sm font-medium text-gray-700 mb-1">Scale Ratio</label>
          <select id={`${toolId}-ratio`} value={ratio} onChange={(e) => setRatio(e.target.value)} aria-label={`Scale ratio for ${toolName}`} className="input-field">
            {Object.entries(ratios).map(([k, v]) => <option key={k} value={k}>{v} - {k === '1.618' ? 'Golden' : k === '1.414' ? 'Aug. Fourth' : k === '1.333' ? 'Perfect Fourth' : k === '1.25' ? 'Major Third' : k}</option>)}
          </select>
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-steps`} className="block text-sm font-medium text-gray-700 mb-1">Steps</label>
          <input id={`${toolId}-steps`} type="number" min="3" max="10" value={steps} onChange={(e) => setSteps(e.target.value)} aria-label={`Steps for ${toolName}`} className="input-field" />
        </InputArea>
      </div>
      <button onClick={generate} className="btn-primary">Generate Scale</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
