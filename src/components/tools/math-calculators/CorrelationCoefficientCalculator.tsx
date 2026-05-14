'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function CorrelationCoefficientCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [xValues, setXValues] = useState('');
  const [yValues, setYValues] = useState('');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const x = xValues.split(/[,\s]+/).map(Number).filter(n => !isNaN(n));
    const y = yValues.split(/[,\s]+/).map(Number).filter(n => !isNaN(n));
    if (x.length < 2 || y.length < 2) { setOutput('Enter at least 2 values for each dataset.'); return; }
    if (x.length !== y.length) { setOutput('Both datasets must have the same number of values.'); return; }

    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
    const sumX2 = x.reduce((acc, xi) => acc + xi * xi, 0);
    const sumY2 = y.reduce((acc, yi) => acc + yi * yi, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

    if (denominator === 0) { setOutput('Cannot compute: no variation in one or both datasets.'); return; }

    const r = numerator / denominator;
    const r2 = r * r;
    let strength = '';
    const absR = Math.abs(r);
    if (absR >= 0.9) strength = 'Very strong';
    else if (absR >= 0.7) strength = 'Strong';
    else if (absR >= 0.5) strength = 'Moderate';
    else if (absR >= 0.3) strength = 'Weak';
    else strength = 'Very weak / No';

    setOutput(`Pearson r: ${r.toFixed(6)}\nR² (Coefficient of Determination): ${r2.toFixed(6)}\nCorrelation: ${strength} ${r >= 0 ? 'positive' : 'negative'}\nn: ${n}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-x`} className="block text-sm font-medium text-gray-700 mb-1">X Values (comma or space separated)</label>
        <textarea id={`${toolId}-x`} value={xValues} onChange={(e) => setXValues(e.target.value)} placeholder="1, 2, 3, 4, 5" aria-label={`X values input for ${toolName}`} className="input-field h-20 resize-y font-mono" />
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-y`} className="block text-sm font-medium text-gray-700 mb-1">Y Values (comma or space separated)</label>
        <textarea id={`${toolId}-y`} value={yValues} onChange={(e) => setYValues(e.target.value)} placeholder="2, 4, 5, 4, 5" aria-label={`Y values input for ${toolName}`} className="input-field h-20 resize-y font-mono" />
      </InputArea>
      <button onClick={calculate} className="btn-primary">Calculate Correlation</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
