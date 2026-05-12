'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ScatterPlotDataGenerator - Generate random scatter plot data with correlation.
 * Creates X,Y data points with a specified correlation coefficient and noise level.
 */
export default function ScatterPlotDataGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [numPoints, setNumPoints] = useState('50');
  const [correlation, setCorrelation] = useState('0.7');
  const [xMin, setXMin] = useState('0');
  const [xMax, setXMax] = useState('100');
  const [format, setFormat] = useState<'csv' | 'json' | 'tsv'>('csv');
  const [output, setOutput] = useState('');

  const gaussianRandom = (): number => {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  };

  const generate = () => {
    const n = parseInt(numPoints);
    const r = parseFloat(correlation);
    const minX = parseFloat(xMin);
    const maxX = parseFloat(xMax);

    if (isNaN(n) || n < 2 || n > 10000) {
      setOutput('Please enter a valid number of points (2-10000).');
      return;
    }
    if (isNaN(r) || r < -1 || r > 1) {
      setOutput('Correlation must be between -1 and 1.');
      return;
    }
    if (isNaN(minX) || isNaN(maxX) || minX >= maxX) {
      setOutput('X min must be less than X max.');
      return;
    }

    const points: { x: number; y: number }[] = [];
    const xRange = maxX - minX;

    for (let i = 0; i < n; i++) {
      const x = minX + Math.random() * xRange;
      const noise = gaussianRandom() * xRange * 0.2;
      const y = r * (x - minX) + Math.sqrt(1 - r * r) * noise + minX;
      points.push({ x: parseFloat(x.toFixed(2)), y: parseFloat(y.toFixed(2)) });
    }

    // Calculate actual correlation
    const meanX = points.reduce((s, p) => s + p.x, 0) / n;
    const meanY = points.reduce((s, p) => s + p.y, 0) / n;
    let sumXY = 0, sumX2 = 0, sumY2 = 0;
    for (const p of points) {
      sumXY += (p.x - meanX) * (p.y - meanY);
      sumX2 += (p.x - meanX) ** 2;
      sumY2 += (p.y - meanY) ** 2;
    }
    const actualR = sumX2 > 0 && sumY2 > 0 ? sumXY / Math.sqrt(sumX2 * sumY2) : 0;

    let result = `// ${n} data points, target r=${r}, actual r=${actualR.toFixed(4)}\n\n`;

    if (format === 'csv') {
      result += 'x,y\n';
      result += points.map((p) => `${p.x},${p.y}`).join('\n');
    } else if (format === 'tsv') {
      result += 'x\ty\n';
      result += points.map((p) => `${p.x}\t${p.y}`).join('\n');
    } else {
      result += JSON.stringify(points, null, 2);
    }

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-points`} className="block text-sm font-medium text-gray-700 mb-1">
            Number of Points
          </label>
          <input
            id={`${toolId}-points`}
            type="number"
            min="2"
            max="10000"
            value={numPoints}
            onChange={(e) => setNumPoints(e.target.value)}
            aria-label={`Number of points for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-correlation`} className="block text-sm font-medium text-gray-700 mb-1">
            Target Correlation (-1 to 1)
          </label>
          <input
            id={`${toolId}-correlation`}
            type="number"
            min="-1"
            max="1"
            step="0.1"
            value={correlation}
            onChange={(e) => setCorrelation(e.target.value)}
            aria-label={`Correlation for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-xmin`} className="block text-sm font-medium text-gray-700 mb-1">
            X Min
          </label>
          <input
            id={`${toolId}-xmin`}
            type="number"
            value={xMin}
            onChange={(e) => setXMin(e.target.value)}
            aria-label={`X minimum for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-xmax`} className="block text-sm font-medium text-gray-700 mb-1">
            X Max
          </label>
          <input
            id={`${toolId}-xmax`}
            type="number"
            value={xMax}
            onChange={(e) => setXMax(e.target.value)}
            aria-label={`X maximum for ${toolName}`}
            className="input-field"
          />
        </InputArea>
      </div>

      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-1">Output Format</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" checked={format === 'csv'} onChange={() => setFormat('csv')} className="text-blue-600" />
            <span className="text-sm">CSV</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" checked={format === 'tsv'} onChange={() => setFormat('tsv')} className="text-blue-600" />
            <span className="text-sm">TSV</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" checked={format === 'json'} onChange={() => setFormat('json')} className="text-blue-600" />
            <span className="text-sm">JSON</span>
          </label>
        </div>
      </InputArea>

      <button onClick={generate} aria-label="Generate scatter plot data" className="btn-primary">
        Generate Data
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Scatter Plot Data</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-96 overflow-y-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
