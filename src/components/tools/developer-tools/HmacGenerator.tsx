'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * HmacGenerator - Generate HMAC with key and message using Web Crypto API.
 */
export default function HmacGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [message, setMessage] = useState('');
  const [key, setKey] = useState('');
  const [algorithm, setAlgorithm] = useState('SHA-256');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  async function generateHmac() {
    setError('');
    setOutput('');
    if (!message.trim()) {
      setError('Please enter a message');
      return;
    }
    if (!key.trim()) {
      setError('Please enter a secret key');
      return;
    }

    const encoder = new TextEncoder();
    const keyData = encoder.encode(key);
    const msgData = encoder.encode(message);

    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: algorithm },
      false,
      ['sign']
    );

    const signature = await crypto.subtle.sign('HMAC', cryptoKey, msgData);
    const hashArray = Array.from(new Uint8Array(signature));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    setOutput(hashHex);
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-message`} className="block text-sm font-medium text-gray-700 mb-1">
          Message
        </label>
        <textarea
          id={`${toolId}-message`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter message"
          aria-label={`Message input for ${toolName}`}
          className="input-field h-24 resize-y font-mono"
        />
        <label htmlFor={`${toolId}-key`} className="block text-sm font-medium text-gray-700 mb-1 mt-3">
          Secret Key
        </label>
        <input
          id={`${toolId}-key`}
          type="text"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Enter secret key"
          aria-label="HMAC secret key"
          className="input-field font-mono"
        />
        <label htmlFor={`${toolId}-algo`} className="block text-sm font-medium text-gray-700 mb-1 mt-3">
          Algorithm
        </label>
        <select
          id={`${toolId}-algo`}
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
          aria-label="HMAC algorithm"
          className="input-field w-40"
        >
          <option value="SHA-256">SHA-256</option>
          <option value="SHA-384">SHA-384</option>
          <option value="SHA-512">SHA-512</option>
        </select>
      </InputArea>

      <button onClick={generateHmac} aria-label="Generate HMAC" className="btn-primary">
        Generate HMAC
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">HMAC ({algorithm})</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
