'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function ZScoreCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [mean, setMean] = useState('');
  const [stdDev, setStdDev] = useState('');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const x = parseFloat(value);
    const mu = parseFloat(mean);
    const sigma = parseFloat(stdDev);
    if (isNaN(x) || isNaN(mu) || isNaN(sigma)) { setOutput('Please enter valid numbers.'); return; }
    if (sigma === 0) { setOutput('Standard deviation cannot be zero.'); return; }
    const zScore = (x - mu) / sigma;
    const percentile = (0.5 * (1 + erf(zScore / Math.sqrt(2)))) * 100;
    setOutput(`Z-Score: ${zScore.toFixed(6)}\nPercentile: ${percentile.toFixed(4)}%\nFormula: z = (x - μ) / σ = (${x} - ${mu}) / ${sigma}`);
  };

  function erf(x: number): number {
    const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
    const sign = x < 0 ? -1 : 1;
    x = Math.abs(x);
    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    return sign * y;
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">Value (x)</label>
        <input id={`${toolId}-value`} type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder="85" aria-label={`Value input for ${toolName}`} className="input-field" />
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-mean`} className="block text-sm font-medium text-gray-700 mb-1">Mean (μ)</label>
        <input id={`${toolId}-mean`} type="number" value={mean} onChange={(e) => setMean(e.target.value)} placeholder="75" aria-label={`Mean input for ${toolName}`} className="input-field" />
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-stddev`} className="block text-sm font-medium text-gray-700 mb-1">Standard Deviation (σ)</label>
        <input id={`${toolId}-stddev`} type="number" value={stdDev} onChange={(e) => setStdDev(e.target.value)} placeholder="10" aria-label={`Standard deviation input for ${toolName}`} className="input-field" />
      </InputArea>
      <button onClick={calculate} className="btn-primary">Calculate Z-Score</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
