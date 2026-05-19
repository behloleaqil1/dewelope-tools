'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TsvToCsvConverter - Convert TSV to CSV with proper field quoting.
 */
export default function TsvToCsvConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState('');

  const convert = () => {
    setError('');
    setResult('');
    if (!input.trim()) { setError('Please enter TSV data.'); return; }

    const lines = input.split('\n');
    const csvLines = lines.map((line) => {
      const fields = line.split('\t');
      return fields.map((field) => {
        if (field.includes(',') || field.includes('"') || field.includes('\n')) {
          return `"${field.replace(/"/g, '""')}"`;
        }
        return field;
      }).join(',');
    });

    setResult(csvLines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">TSV Input</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder={"Name\tAge\tCity\nAlice\t30\tNew York\nBob\t25\tLos Angeles"} rows={6} aria-label={`TSV input for ${toolName}`} className="input-field font-mono" />
      </InputArea>

      <button onClick={convert} className="btn-primary" aria-label="Convert TSV to CSV">Convert</button>

      <OutputArea hasContent={result.length > 0}>
        {result && (
          <div className="space-y-3">
            <pre className="text-sm bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto whitespace-pre-wrap font-mono">{result}</pre>
            <CopyToClipboard text={result} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
