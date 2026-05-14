'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * Base64urlEncoderDecoder - Encode/decode using Base64URL (URL-safe Base64)
 */
export default function Base64urlEncoderDecoder({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [result, setResult] = useState('');
  const [error, setError] = useState<string | undefined>();

  function process() {
    setError(undefined);
    setResult('');

    if (!input) { setError('Please enter text'); return; }

    try {
      if (mode === 'encode') {
        const base64 = btoa(unescape(encodeURIComponent(input)));
        const base64url = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        setResult(base64url);
      } else {
        let base64 = input.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4) base64 += '=';
        const decoded = decodeURIComponent(escape(atob(base64)));
        setResult(decoded);
      }
    } catch {
      setError(mode === 'encode' ? 'Failed to encode' : 'Invalid Base64URL input');
    }
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-mode`} className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
        <select id={`${toolId}-mode`} value={mode} onChange={(e) => setMode(e.target.value as 'encode' | 'decode')} aria-label={`Mode for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="encode">Encode (Text → Base64URL)</option>
          <option value="decode">Decode (Base64URL → Text)</option>
        </select>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1 mt-3">Input</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder={mode === 'encode' ? 'Enter text to encode' : 'Enter Base64URL to decode'} aria-label={`Input for ${toolName}`} className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y font-mono" />
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
