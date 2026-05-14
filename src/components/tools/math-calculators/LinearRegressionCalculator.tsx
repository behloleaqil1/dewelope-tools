'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function LinearRegressionCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [xValues, setXValues] = useState('');
  const [yValues, setYValues] = useState('');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const x = xValues.split(/[,\s]+/).map(Number).filter(n => !isNaN(n));
    const y = yValues.split(/[,\s]+/).map(Number).filter(n => !isNaN(n));
    if (x.length < 2 || y.length < 2) { setOutput('Enter at least 2 data points.'); return; }
    if (x.length !== y.length) { setOutput('X and Y must have the same number of values.'); return; }

    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
    const sumX2 = x.reduce((acc, xi) => acc + xi * xi, 0);

    const denom = n * sumX2 - sumX * sumX;
    if (denom === 0) { setOutput('Cannot compute: all X values are identical.'); return; }

    const slope = (n * sumXY - sumX * sumY) / denom;
    const intercept = (sumY - slope * sumX) / n;

    const meanY = sumY / n;
    const ssTotal = y.reduce((acc, yi) => acc + (yi - meanY) ** 2, 0);
    const ssResidual = y.reduce((acc, yi, i) => acc + (yi - (slope * x[i] + intercept)) ** 2, 0);
    const r2 = ssTotal === 0 ? 0 : 1 - ssResidual / ssTotal;

    const sign = intercept >= 0 ? '+' : '-';
    setOutput(`Slope (m): ${slope.toFixed(6)}\nIntercept (b): ${intercept.toFixed(6)}\nEquation: y = ${slope.toFixed(4)}x ${sign} ${Math.abs(intercept).toFixed(4)}\nR²: ${r2.toFixed(6)}\nn: ${n}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-x`} className="block text-sm font-medium text-gray-700 mb-1">X Values (comma or space separated)</label>
        <textarea id={`${toolId}-x`} value={xValues} onChange={(e) => setXValues(e.target.value)} placeholder="1, 2, 3, 4, 5" aria-label={`X values for ${toolName}`} className="input-field h-20 resize-y font-mono" />
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-y`} className="block text-sm font-medium text-gray-700 mb-1">Y Values (comma or space separated)</label>
        <textarea id={`${toolId}-y`} value={yValues} onChange={(e) => setYValues(e.target.value)} placeholder="2.1, 3.9, 6.2, 7.8, 10.1" aria-label={`Y values for ${toolName}`} className="input-field h-20 resize-y font-mono" />
      </InputArea>
      <button onClick={calculate} className="btn-primary">Calculate Regression</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
