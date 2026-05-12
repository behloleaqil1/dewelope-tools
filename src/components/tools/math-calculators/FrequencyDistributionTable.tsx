'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * FrequencyDistributionTable - Create a frequency distribution table from data.
 * Groups data into classes and calculates frequency, relative frequency, and percentages.
 */
export default function FrequencyDistributionTable({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [numClasses, setNumClasses] = useState('5');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const values = input.split(/[\s,]+/).map(Number).filter(n => !isNaN(n));
    if (values.length === 0) { setOutput('Please enter valid numerical data.'); return; }

    const classes = parseInt(numClasses) || 5;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;
    const classWidth = Math.ceil(range / classes);

    const rows: { lower: number; upper: number; freq: number; relFreq: number; percent: number }[] = [];

    for (let i = 0; i < classes; i++) {
      const lower = min + i * classWidth;
      const upper = lower + classWidth - 1;
      const freq = values.filter(v => v >= lower && v <= upper).length;
      rows.push({
        lower,
        upper,
        freq,
        relFreq: freq / values.length,
        percent: (freq / values.length) * 100,
      });
    }

    const header = 'Class Interval | Frequency | Relative Freq | Percentage';
    const separator = '-'.repeat(header.length);
    const tableRows = rows.map(r =>
      `${String(r.lower).padStart(5)} - ${String(r.upper).padEnd(5)} | ${String(r.freq).padStart(9)} | ${r.relFreq.toFixed(4).padStart(13)} | ${r.percent.toFixed(1).padStart(8)}%`
    );

    const summary = [
      '',
      `Total data points: ${values.length}`,
      `Range: ${range}`,
      `Class width: ${classWidth}`,
      `Number of classes: ${classes}`,
    ];

    setOutput([header, separator, ...tableRows, ...summary].join('\n'));
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
          placeholder="e.g. 12, 15, 18, 22, 25, 28, 30, 35, 40, 45"
          aria-label={`Data input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />
      </InputArea>

      <InputArea>
        <label htmlFor={`${toolId}-classes`} className="block text-sm font-medium text-gray-700 mb-1">
          Number of Classes
        </label>
        <input
          id={`${toolId}-classes`}
          type="number"
          min="2"
          max="20"
          value={numClasses}
          onChange={(e) => setNumClasses(e.target.value)}
          aria-label={`Number of classes for ${toolName}`}
          className="input-field w-32"
        />
      </InputArea>

      <button onClick={calculate} aria-label="Create frequency distribution table" className="btn-primary">
        Create Table
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Frequency Distribution Table</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
