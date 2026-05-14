'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * HexToTextConverter - Converts hexadecimal to text
 */
export default function HexToTextConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState<string | undefined>();

  function convert() {
    setError(undefined);
    setResult('');

    if (!input.trim()) {
      setError('Please enter hex values');
      return;
    }

    try {
      const cleaned = input.replace(/[^0-9A-Fa-f]/g, '');
      if (cleaned.length % 2 !== 0) {
        setError('Hex string must have an even number of characters');
        return;
      }

      const bytes = new Uint8Array(cleaned.length / 2);
      for (let i = 0; i < cleaned.length; i += 2) {
        bytes[i / 2] = parseInt(cleaned.substring(i, i + 2), 16);
      }

      const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
      setResult(text);
    } catch {
      setError('Invalid hex input or cannot decode as UTF-8');
    }
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Hex Input</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter hex values (e.g., 48 65 6c 6c 6f)" aria-label={`Hex input for ${toolName}`} className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y font-mono" />
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
