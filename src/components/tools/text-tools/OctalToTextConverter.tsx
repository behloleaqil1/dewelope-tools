'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * OctalToTextConverter - Converts octal values to text
 */
export default function OctalToTextConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState<string | undefined>();

  function convert() {
    setError(undefined);
    setResult('');

    if (!input.trim()) {
      setError('Please enter octal values');
      return;
    }

    try {
      const octals = input.trim().split(/[\s,]+/);
      const bytes = new Uint8Array(octals.length);
      for (let i = 0; i < octals.length; i++) {
        const val = parseInt(octals[i], 8);
        if (isNaN(val) || val > 377) {
          setError(`Invalid octal value: ${octals[i]}`);
          return;
        }
        bytes[i] = val;
      }
      const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
      setResult(text);
    } catch {
      setError('Invalid octal input or cannot decode as UTF-8');
    }
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Octal Input</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter octal values separated by spaces (e.g., 110 145 154 154 157)" aria-label={`Octal input for ${toolName}`} className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y font-mono" />
      </InputArea>

      <button onClick={convert} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Convert</button>

      <OutputArea hasContent={!!result}>
        {result && (
          <div className="space-y-3">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 bg-white p-3 rounded border border-gray-200">{result}</pre>
            <CopyToClipboard text={result} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
