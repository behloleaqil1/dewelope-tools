'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function MeanMedianModeRange({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const calculate = () => {
    const nums = input.split(/[,\s\n]+/).map(Number).filter(n => !isNaN(n));
    if (nums.length === 0) return;
    const sorted = [...nums].sort((a, b) => a - b);
    const mean = nums.reduce((s, n) => s + n, 0) / nums.length;
    const median = nums.length % 2 === 0 ? (sorted[nums.length / 2 - 1] + sorted[nums.length / 2]) / 2 : sorted[Math.floor(nums.length / 2)];
    const freq: Record<number, number> = {};
    nums.forEach(n => { freq[n] = (freq[n] || 0) + 1; });
    const maxFreq = Math.max(...Object.values(freq));
    const modes = Object.entries(freq).filter(([, v]) => v === maxFreq && v > 1).map(([k]) => k);
    const range = sorted[sorted.length - 1] - sorted[0];
    const lines = [
      `Dataset: ${sorted.join(', ')}`,
      `Count: ${nums.length}`,
      `Mean: ${mean.toFixed(4)}`,
      `Median: ${median}`,
      `Mode: ${modes.length > 0 ? modes.join(', ') : 'No mode (all values unique)'}`,
      `Range: ${range}`,
    ];
    setResult(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Enter numbers (comma, space, or newline separated)</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="5, 10, 15, 10, 20, 25, 10" aria-label={`Numbers for ${toolName}`} className="input-field h-32 resize-y font-mono" />
      </InputArea>
      <button onClick={calculate} className="btn-primary" aria-label="Calculate statistics">Calculate</button>
      <OutputArea hasContent={!!result}>
        {result && (
          <div className="space-y-2">
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{result}</pre>
            <CopyToClipboard text={result} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
