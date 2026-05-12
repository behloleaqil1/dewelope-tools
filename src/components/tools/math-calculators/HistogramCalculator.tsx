'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * HistogramCalculator - Generate histogram bins and frequencies from data.
 * Calculates bin ranges, frequencies, relative frequencies, and cumulative frequencies.
 */
export default function HistogramCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [binCount, setBinCount] = useState('5');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const values = input
      .split(/[\s,;]+/)
      .map((v) => parseFloat(v.trim()))
      .filter((v) => !isNaN(v));

    if (values.length < 2) {
      setOutput('Please enter at least 2 numeric values.');
      return;
    }

    const numBins = parseInt(binCount);
    if (isNaN(numBins) || numBins < 1 || numBins > 100) {
      setOutput('Please enter a valid number of bins (1-100).');
      return;
    }

    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;
    const binWidth = range / numBins;

    const bins: { lower: number; upper: number; frequency: number }[] = [];
    for (let i = 0; i < numBins; i++) {
      bins.push({
        lower: min + i * binWidth,
        upper: min + (i + 1) * binWidth,
        frequency: 0,
      });
    }

    // Count frequencies
    for (const val of values) {
      let binIdx = Math.floor((val - min) / binWidth);
      if (binIdx >= numBins) binIdx = numBins - 1;
      bins[binIdx].frequency++;
    }

    const total = values.length;
    let cumulative = 0;

    const lines: string[] = [
      `Data Summary:`,
      `  Count: ${total}`,
      `  Min: ${min}`,
      `  Max: ${max}`,
      `  Range: ${range.toFixed(4)}`,
      `  Bin Width: ${binWidth.toFixed(4)}`,
      `  Bins: ${numBins}`,
      '',
      'Bin | Range | Frequency | Relative Freq | Cumulative',
      '----+-------+-----------+---------------+-----------',
    ];

    for (let i = 0; i < bins.length; i++) {
      const bin = bins[i];
      const relFreq = (bin.frequency / total * 100).toFixed(1);
      cumulative += bin.frequency;
      const cumPct = (cumulative / total * 100).toFixed(1);
      const lowerStr = bin.lower.toFixed(2);
      const upperStr = bin.upper.toFixed(2);
      lines.push(`  ${i + 1}  | [${lowerStr}, ${upperStr}${i === bins.length - 1 ? ']' : ')'} | ${bin.frequency} | ${relFreq}% | ${cumPct}%`);
    }

    // Visual histogram
    lines.push('');
    lines.push('Visual Histogram:');
    const maxFreq = Math.max(...bins.map((b) => b.frequency));
    const barScale = 30;
    for (let i = 0; i < bins.length; i++) {
      const bin = bins[i];
      const barLen = maxFreq > 0 ? Math.round((bin.frequency / maxFreq) * barScale) : 0;
      const bar = '█'.repeat(barLen);
      lines.push(`  [${bin.lower.toFixed(1)}-${bin.upper.toFixed(1)}${i === bins.length - 1 ? ']' : ')'} ${bar} ${bin.frequency}`);
    }

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Data Values (comma, space, or newline separated)
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. 12, 15, 18, 22, 25, 28, 30, 33, 35, 40"
          aria-label={`Data values for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />
      </InputArea>

      <InputArea>
        <label htmlFor={`${toolId}-bins`} className="block text-sm font-medium text-gray-700 mb-1">
          Number of Bins
        </label>
        <input
          id={`${toolId}-bins`}
          type="number"
          min="1"
          max="100"
          value={binCount}
          onChange={(e) => setBinCount(e.target.value)}
          aria-label={`Number of bins for ${toolName}`}
          className="input-field w-24"
        />
      </InputArea>

      <button onClick={calculate} aria-label="Generate histogram" className="btn-primary">
        Generate Histogram
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Histogram Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
