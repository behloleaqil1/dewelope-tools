'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * StemLeafPlotGenerator - Generate stem-and-leaf plot from numerical data.
 * Organizes data by tens (stem) and ones (leaf) digits.
 */
export default function StemLeafPlotGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ plot: string; count: number; min: number; max: number } | null>(null);

  const generate = () => {
    setError('');
    setResult(null);

    const numbers = input
      .split(/[\s,;]+/)
      .map(s => s.trim())
      .filter(s => s !== '')
      .map(Number);

    if (numbers.length < 2) {
      setError('Please enter at least 2 numbers (separated by commas, spaces, or newlines)');
      return;
    }

    if (numbers.some(isNaN)) {
      setError('All values must be valid numbers');
      return;
    }

    // Round to integers for stem-and-leaf
    const integers = numbers.map(n => Math.round(n));
    const sorted = [...integers].sort((a, b) => a - b);
    const min = sorted[0];
    const max = sorted[sorted.length - 1];

    // Build stem-leaf map
    const stemMap = new Map<number, number[]>();

    for (const num of sorted) {
      const absNum = Math.abs(num);
      const stem = Math.floor(absNum / 10) * (num < 0 ? -1 : 1);
      const leaf = absNum % 10;

      if (!stemMap.has(stem)) {
        stemMap.set(stem, []);
      }
      stemMap.get(stem)!.push(leaf);
    }

    // Sort stems and build display
    const stems = [...stemMap.keys()].sort((a, b) => a - b);
    const lines: string[] = [];
    const maxStemWidth = Math.max(...stems.map(s => String(s).length));

    for (const stem of stems) {
      const leaves = stemMap.get(stem)!.sort((a, b) => a - b);
      const stemStr = String(stem).padStart(maxStemWidth, ' ');
      lines.push(`${stemStr} | ${leaves.join(' ')}`);
    }

    const plot = lines.join('\n');
    setResult({ plot, count: integers.length, min, max });
  };

  const copyText = result
    ? `Stem-and-Leaf Plot (n=${result.count})\nKey: stem | leaf (e.g., 3 | 5 = 35)\n\n${result.plot}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter data values (comma, space, or newline separated)
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. 12, 15, 21, 23, 24, 28, 31, 35, 37, 42, 45"
          aria-label={`Data input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />
      </InputArea>

      <button onClick={generate} aria-label="Generate stem-and-leaf plot" className="btn-primary">
        Generate Plot
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">Stem-and-Leaf Plot</label>
              <CopyToClipboard text={copyText} />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 mb-2">Key: stem | leaf (e.g., 3 | 5 = 35)</p>
              <pre className="whitespace-pre text-sm font-mono text-gray-800">{result.plot}</pre>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-gray-50 p-2 rounded-lg border border-gray-200">
                <div className="text-lg font-bold text-blue-600">{result.count}</div>
                <div className="text-xs text-gray-500">Count</div>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg border border-gray-200">
                <div className="text-lg font-bold text-green-600">{result.min}</div>
                <div className="text-xs text-gray-500">Min</div>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg border border-gray-200">
                <div className="text-lg font-bold text-purple-600">{result.max}</div>
                <div className="text-xs text-gray-500">Max</div>
              </div>
            </div>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
