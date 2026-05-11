'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function VarianceCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const nums = input.split(/[,\s]+/).map(Number).filter(n => !isNaN(n));
    if (nums.length < 2) { setOutput('Please enter at least 2 numbers.'); return; }
    const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
    const squaredDiffs = nums.map(n => (n - mean) ** 2);
    const popVariance = squaredDiffs.reduce((a, b) => a + b, 0) / nums.length;
    const sampleVariance = squaredDiffs.reduce((a, b) => a + b, 0) / (nums.length - 1);
    setOutput(`Mean: ${mean.toFixed(4)}\n\nPopulation Variance (σ²): ${popVariance.toFixed(6)}\nPopulation Std Dev (σ): ${Math.sqrt(popVariance).toFixed(6)}\n\nSample Variance (s²): ${sampleVariance.toFixed(6)}\nSample Std Dev (s): ${Math.sqrt(sampleVariance).toFixed(6)}\n\nN: ${nums.length}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Numbers (comma or space separated)</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="2, 4, 4, 4, 5, 5, 7, 9" aria-label={`Input for ${toolName}`} className="input-field h-24 resize-y font-mono" />
      </InputArea>
      <button onClick={calculate} className="btn-primary">Calculate</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
