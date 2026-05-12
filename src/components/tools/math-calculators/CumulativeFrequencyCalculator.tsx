'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CumulativeFrequencyCalculator - Calculate cumulative frequency from data.
 * Computes both cumulative frequency and cumulative relative frequency.
 */
export default function CumulativeFrequencyCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const values = input.split(/[\s,]+/).map(Number).filter(n => !isNaN(n));
    if (values.length === 0) { setOutput('Please enter valid numerical data.'); return; }

    // Count frequency of each value
    const freqMap = new Map<number, number>();
    values.forEach(v => freqMap.set(v, (freqMap.get(v) || 0) + 1));

    // Sort by value
    const sorted = Array.from(freqMap.entries()).sort((a, b) => a[0] - b[0]);

    const total = values.length;
    let cumFreq = 0;
    const rows: string[] = [];

    const header = 'Value | Frequency | Cumulative Freq | Cumulative %';
    const separator = '-'.repeat(header.length);
    rows.push(header);
    rows.push(separator);

    sorted.forEach(([value, freq]) => {
      cumFreq += freq;
      const cumPercent = (cumFreq / total) * 100;
      rows.push(
        `${String(value).padStart(5)} | ${String(freq).padStart(9)} | ${String(cumFreq).padStart(15)} | ${cumPercent.toFixed(1).padStart(10)}%`
      );
    });

    rows.push('');
    rows.push(`Total data points: ${total}`);
    rows.push(`Unique values: ${sorted.length}`);
    rows.push(`Min: ${sorted[0][0]}, Max: ${sorted[sorted.length - 1][0]}`);

    setOutput(rows.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter data values (comma or space separated)
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. 5, 8, 3, 5, 9, 3, 8, 5, 7, 3, 5, 8"
          aria-label={`Data input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />
      </InputArea>

      <button onClick={calculate} aria-label="Calculate cumulative frequency" className="btn-primary">
        Calculate
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Cumulative Frequency Table</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
