'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function CovarianceCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [xValues, setXValues] = useState('');
  const [yValues, setYValues] = useState('');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const x = xValues.split(/[,\s]+/).map(Number).filter(n => !isNaN(n));
    const y = yValues.split(/[,\s]+/).map(Number).filter(n => !isNaN(n));
    if (x.length < 2 || y.length < 2) { setOutput('Enter at least 2 values for each dataset.'); return; }
    if (x.length !== y.length) { setOutput('Both datasets must have the same number of values.'); return; }

    const n = x.length;
    const meanX = x.reduce((a, b) => a + b, 0) / n;
    const meanY = y.reduce((a, b) => a + b, 0) / n;

    const popCov = x.reduce((acc, xi, i) => acc + (xi - meanX) * (y[i] - meanY), 0) / n;
    const sampleCov = x.reduce((acc, xi, i) => acc + (xi - meanX) * (y[i] - meanY), 0) / (n - 1);

    const direction = popCov > 0 ? 'Positive (variables move together)' : popCov < 0 ? 'Negative (variables move inversely)' : 'Zero (no linear relationship)';

    setOutput(`Population Covariance: ${popCov.toFixed(6)}\nSample Covariance: ${sampleCov.toFixed(6)}\nDirection: ${direction}\n\nMean X: ${meanX.toFixed(4)}\nMean Y: ${meanY.toFixed(4)}\nn: ${n}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-x`} className="block text-sm font-medium text-gray-700 mb-1">X Values (comma or space separated)</label>
        <textarea id={`${toolId}-x`} value={xValues} onChange={(e) => setXValues(e.target.value)} placeholder="1, 2, 3, 4, 5" aria-label={`X values for ${toolName}`} className="input-field h-20 resize-y font-mono" />
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-y`} className="block text-sm font-medium text-gray-700 mb-1">Y Values (comma or space separated)</label>
        <textarea id={`${toolId}-y`} value={yValues} onChange={(e) => setYValues(e.target.value)} placeholder="5, 6, 7, 8, 9" aria-label={`Y values for ${toolName}`} className="input-field h-20 resize-y font-mono" />
      </InputArea>
      <button onClick={calculate} className="btn-primary">Calculate Covariance</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
