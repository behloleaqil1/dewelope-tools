'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * AbcAnalysisCalculator - Perform ABC inventory classification analysis.
 * Classifies items into A (high value), B (medium), C (low) categories based on cumulative value.
 */
export default function AbcAnalysisCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [thresholdA, setThresholdA] = useState(80);
  const [thresholdB, setThresholdB] = useState(95);
  const [error, setError] = useState('');

  function handleAnalyze() {
    setError('');
    setOutput('');
    if (!input.trim()) {
      setError('Please enter items (one per line: name,value).');
      return;
    }

    const lines = input.trim().split('\n');
    const items: { name: string; value: number }[] = [];

    for (const line of lines) {
      const parts = line.split(',');
      if (parts.length < 2) {
        setError(`Invalid line: "${line}". Use format: name,value`);
        return;
      }
      const name = parts[0].trim();
      const value = parseFloat(parts[1].trim());
      if (isNaN(value) || value < 0) {
        setError(`Invalid value for "${name}".`);
        return;
      }
      items.push({ name, value });
    }

    if (items.length === 0) {
      setError('No valid items found.');
      return;
    }

    // Sort by value descending
    items.sort((a, b) => b.value - a.value);
    const totalValue = items.reduce((sum, item) => sum + item.value, 0);

    let cumulative = 0;
    const results: string[] = [];
    results.push('Item | Value | Cumulative % | Class');
    results.push('-----|-------|-------------|------');

    let countA = 0, countB = 0, countC = 0;
    let valueA = 0, valueB = 0, valueC = 0;

    for (const item of items) {
      cumulative += item.value;
      const cumulativePct = (cumulative / totalValue) * 100;
      let cls: string;
      if (cumulativePct <= thresholdA) {
        cls = 'A';
        countA++;
        valueA += item.value;
      } else if (cumulativePct <= thresholdB) {
        cls = 'B';
        countB++;
        valueB += item.value;
      } else {
        cls = 'C';
        countC++;
        valueC += item.value;
      }
      results.push(`${item.name} | ${item.value.toFixed(2)} | ${cumulativePct.toFixed(1)}% | ${cls}`);
    }

    results.push('');
    results.push('--- Summary ---');
    results.push(`Class A: ${countA} items (${((valueA / totalValue) * 100).toFixed(1)}% of value)`);
    results.push(`Class B: ${countB} items (${((valueB / totalValue) * 100).toFixed(1)}% of value)`);
    results.push(`Class C: ${countC} items (${((valueC / totalValue) * 100).toFixed(1)}% of value)`);
    results.push(`Total: ${items.length} items, value: ${totalValue.toFixed(2)}`);

    setOutput(results.join('\n'));
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label htmlFor={`${toolId}-ta`} className="block text-sm font-medium text-gray-700 mb-1">A Threshold (%)</label>
            <input id={`${toolId}-ta`} type="number" min={1} max={99} value={thresholdA} onChange={(e) => setThresholdA(Number(e.target.value))} className="input-field" aria-label="Class A threshold percentage" />
          </div>
          <div>
            <label htmlFor={`${toolId}-tb`} className="block text-sm font-medium text-gray-700 mb-1">B Threshold (%)</label>
            <input id={`${toolId}-tb`} type="number" min={1} max={99} value={thresholdB} onChange={(e) => setThresholdB(Number(e.target.value))} className="input-field" aria-label="Class B threshold percentage" />
          </div>
        </div>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Items (one per line: name,value)
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={"Widget A,5000\nWidget B,3000\nWidget C,1500\nWidget D,500"}
          aria-label={`Items input for ${toolName}`}
          className="input-field h-48 resize-y font-mono"
        />
        <button onClick={handleAnalyze} className="btn-primary mt-2">
          Run ABC Analysis
        </button>
      </InputArea>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">ABC Classification</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
