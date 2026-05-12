'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function ImageDimensionCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [targetWidth, setTargetWidth] = useState('');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const w = parseFloat(width), h = parseFloat(height), tw = parseFloat(targetWidth);
    if (isNaN(w) || isNaN(h) || w === 0 || h === 0) { setOutput('Enter valid width and height.'); return; }
    const ratio = w / h;
    const results: string[] = [`Original: ${w} × ${h}`, `Aspect Ratio: ${ratio.toFixed(4)} (≈ ${Math.round(ratio * 100) / 100}:1)`];
    if (!isNaN(tw) && tw > 0) {
      const newHeight = Math.round(tw / ratio);
      results.push(`\nScaled to width ${tw}: ${tw} × ${newHeight}`);
    }
    const common = [1920, 1280, 1024, 800, 640, 320];
    results.push('\nCommon widths:');
    common.forEach(cw => results.push(`  ${cw} × ${Math.round(cw / ratio)}`));
    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="flex gap-2">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Width</label><input value={width} onChange={(e) => setWidth(e.target.value)} placeholder="1920" aria-label={`Width for ${toolName}`} className="input-field" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Height</label><input value={height} onChange={(e) => setHeight(e.target.value)} placeholder="1080" aria-label={`Height for ${toolName}`} className="input-field" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Target W</label><input value={targetWidth} onChange={(e) => setTargetWidth(e.target.value)} placeholder="800" aria-label={`Target width for ${toolName}`} className="input-field" /></div>
        </div>
      </InputArea>
      <button onClick={calculate} className="btn-primary">Calculate</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
