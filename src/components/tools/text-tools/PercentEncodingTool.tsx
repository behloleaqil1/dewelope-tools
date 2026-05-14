'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PercentEncodingTool - URL percent encoding/decoding
 */
export default function PercentEncodingTool({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [encodeType, setEncodeType] = useState<'component' | 'full'>('component');
  const [result, setResult] = useState('');
  const [error, setError] = useState<string | undefined>();

  function process() {
    setError(undefined);
    setResult('');

    if (!input) { setError('Please enter text'); return; }

    try {
      if (mode === 'encode') {
        const encoded = encodeType === 'component' ? encodeURIComponent(input) : encodeURI(input);
        setResult(encoded);
      } else {
        const decoded = encodeType === 'component' ? decodeURIComponent(input) : decodeURI(input);
        setResult(decoded);
      }
    } catch {
      setError('Invalid input for percent encoding/decoding');
    }
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="flex gap-3">
          <div className="flex-1">
            <label htmlFor={`${toolId}-mode`} className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
            <select id={`${toolId}-mode`} value={mode} onChange={(e) => setMode(e.target.value as 'encode' | 'decode')} aria-label={`Mode for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="encode">Encode</option>
              <option value="decode">Decode</option>
            </select>
          </div>
          <div className="flex-1">
            <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select id={`${toolId}-type`} value={encodeType} onChange={(e) => setEncodeType(e.target.value as 'component' | 'full')} aria-label={`Encoding type for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="component">URI Component</option>
              <option value="full">Full URI</option>
            </select>
          </div>
        </div>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1 mt-3">Input</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder={mode === 'encode' ? 'Enter text to percent-encode' : 'Enter percent-encoded text'} aria-label={`Input for ${toolName}`} className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y" />
      </InputArea>

      <button onClick={process} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">{mode === 'encode' ? 'Encode' : 'Decode'}</button>

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
