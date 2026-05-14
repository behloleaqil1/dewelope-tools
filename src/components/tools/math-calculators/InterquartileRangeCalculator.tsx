'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function InterquartileRangeCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const quartile = (sorted: number[], q: number): number => {
    const pos = (sorted.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (sorted[base + 1] !== undefined) {
      return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
    }
    return sorted[base];
  };

  const calculate = () => {
    const nums = input.split(/[,\s]+/).map(Number).filter(n => !isNaN(n));
    if (nums.length < 4) { setOutput('Enter at least 4 numbers.'); return; }

    const sorted = [...nums].sort((a, b) => a - b);
    const q1 = quartile(sorted, 0.25);
    const q2 = quartile(sorted, 0.5);
    const q3 = quartile(sorted, 0.75);
    const iqr = q3 - q1;
    const lowerFence = q1 - 1.5 * iqr;
    const upperFence = q3 + 1.5 * iqr;
    const outliers = sorted.filter(n => n < lowerFence || n > upperFence);

    setOutput(`Q1 (25th percentile): ${q1.toFixed(4)}\nQ2 (Median): ${q2.toFixed(4)}\nQ3 (75th percentile): ${q3.toFixed(4)}\nIQR (Q3 - Q1): ${iqr.toFixed(4)}\n\nLower Fence: ${lowerFence.toFixed(4)}\nUpper Fence: ${upperFence.toFixed(4)}\nOutliers: ${outliers.length > 0 ? outliers.join(', ') : 'None'}\nn: ${nums.length}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Data Set (comma or space separated)</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="7, 15, 36, 39, 40, 41, 42, 43, 47, 49" aria-label={`Data input for ${toolName}`} className="input-field h-24 resize-y font-mono" />
      </InputArea>
      <button onClick={calculate} className="btn-primary">Calculate IQR</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
