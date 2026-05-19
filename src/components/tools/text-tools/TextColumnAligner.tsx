'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextColumnAligner - Align text into evenly-spaced columns by delimiter.
 */
export default function TextColumnAligner({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [delimiter, setDelimiter] = useState('=');
  const [error, setError] = useState('');
  const [result, setResult] = useState('');

  const align = () => {
    setError('');
    setResult('');
    if (!input.trim()) { setError('Please enter text to align.'); return; }

    const lines = input.split('\n');
    const splitLines = lines.map((line) => {
      const idx = line.indexOf(delimiter);
      if (idx === -1) return { left: line, right: null };
      return { left: line.slice(0, idx).trimEnd(), right: line.slice(idx + delimiter.length).trimStart() };
    });

    const maxLeft = Math.max(...splitLines.map((l) => l.left.length));
    const aligned = splitLines.map((l) => {
      if (l.right === null) return l.left;
      return `${l.left.padEnd(maxLeft)} ${delimiter} ${l.right}`;
    }).join('\n');

    setResult(aligned);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Input Text</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder={"name = 'John'\nage = 30\nlongVariable = true"} rows={6} aria-label={`Input text for ${toolName}`} className="input-field font-mono" />
        <div className="mt-3">
          <label htmlFor={`${toolId}-delim`} className="block text-sm font-medium text-gray-700 mb-1">Delimiter</label>
          <input id={`${toolId}-delim`} type="text" value={delimiter} onChange={(e) => setDelimiter(e.target.value)} placeholder="=" aria-label={`Delimiter for ${toolName}`} className="input-field w-24" />
        </div>
      </InputArea>

      <button onClick={align} className="btn-primary" aria-label="Align columns">Align</button>

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
