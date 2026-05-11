'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * JwtGenerator - Generate JWT tokens with custom payload, header, and secret.
 * Uses HMAC-SHA256 signing via Web Crypto API (browser-based).
 */
export default function JwtGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [payload, setPayload] = useState('{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": 1516239022\n}');
  const [secret, setSecret] = useState('my-secret-key');
  const [algorithm, setAlgorithm] = useState('HS256');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const base64UrlEncode = (str: string): string => {
    return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  };

  const generate = async () => {
    setError('');
    setOutput('');

    try {
      JSON.parse(payload);
    } catch {
      setError('Invalid JSON payload. Please check your syntax.');
      return;
    }

    if (!secret.trim()) {
      setError('Please enter a secret key.');
      return;
    }

    try {
      const header = JSON.stringify({ alg: algorithm, typ: 'JWT' });
      const encodedHeader = base64UrlEncode(header);
      const encodedPayload = base64UrlEncode(payload);
      const signingInput = `${encodedHeader}.${encodedPayload}`;

      const encoder = new TextEncoder();
      const keyData = encoder.encode(secret);
      const key = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );

      const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(signingInput));
      const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      setOutput(`${signingInput}.${encodedSignature}`);
    } catch {
      setError('Failed to generate JWT. Please check your inputs.');
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-payload`} className="block text-sm font-medium text-gray-700 mb-1">
          Payload (JSON)
        </label>
        <textarea
          id={`${toolId}-payload`}
          value={payload}
          onChange={(e) => setPayload(e.target.value)}
          placeholder='{"sub": "1234567890", "name": "John Doe"}'
          aria-label={`JWT payload for ${toolName}`}
          className="input-field h-32 resize-y font-mono text-sm"
        />
      </InputArea>

      <InputArea>
        <label htmlFor={`${toolId}-secret`} className="block text-sm font-medium text-gray-700 mb-1">
          Secret Key
        </label>
        <input
          id={`${toolId}-secret`}
          type="text"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          placeholder="Enter your secret key"
          aria-label={`Secret key for ${toolName}`}
          className="input-field font-mono"
        />
      </InputArea>

      <InputArea>
        <label htmlFor={`${toolId}-algorithm`} className="block text-sm font-medium text-gray-700 mb-1">
          Algorithm
        </label>
        <select
          id={`${toolId}-algorithm`}
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
          aria-label={`Algorithm for ${toolName}`}
          className="input-field"
        >
          <option value="HS256">HS256 (HMAC-SHA256)</option>
        </select>
      </InputArea>

      <button onClick={generate} aria-label="Generate JWT" className="btn-primary">
        Generate JWT
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Generated JWT</label>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            </div>
            <div className="text-xs text-gray-500">
              Header: {`{"alg":"${algorithm}","typ":"JWT"}`}
            </div>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
