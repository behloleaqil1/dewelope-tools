'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToHexConverter - Converts text to hexadecimal representation
 */
export default function TextToHexConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [separator, setSeparator] = useState(' ');
  const [result, setResult] = useState('');

  function convert() {
    if (!input) return;
    const hex = Array.from(new TextEncoder().encode(input))
      .map(b => b.toString(16).padStart(2, '0'))
      .join(separator);
    setResult(hex);
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Text Input</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter text to convert to hex" aria-label={`Text input for ${toolName}`} className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y" />
        <label htmlFor={`${toolId}-sep`} className="block text-sm font-medium text-gray-700 mb-1 mt-3">Separator</label>
        <select id={`${toolId}-sep`} value={separator} onChange={(e) => setSeparator(e.target.value)} aria-label={`Separator for ${toolName}`} className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value=" ">Space</option>
          <option value="">None</option>
          <option value=":">Colon</option>
          <option value="-">Dash</option>
        </select>
      </InputArea>

      <button onClick={convert} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Convert</button>

      <OutputArea hasContent={!!result}>
        {result && (
          <div className="space-y-3">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono bg-white p-3 rounded border border-gray-200 break-all">{result}</pre>
            <CopyToClipboard text={result} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
