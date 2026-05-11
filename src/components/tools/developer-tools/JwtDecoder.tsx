'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * JwtDecoder - Decode JWT tokens into header and payload JSON.
 * Shows expiration status if the exp claim exists.
 */
export default function JwtDecoder({ toolId, toolName: _toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [header, setHeader] = useState('');
  const [payload, setPayload] = useState('');
  const [expStatus, setExpStatus] = useState('');
  const [error, setError] = useState<string | undefined>();

  function base64UrlDecode(str: string): string {
    // Replace URL-safe characters and add padding
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    const padding = base64.length % 4;
    if (padding === 2) base64 += '==';
    else if (padding === 3) base64 += '=';

    try {
      return decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
    } catch {
      throw new Error('Invalid base64url encoding');
    }
  }

  function handleDecode() {
    setError(undefined);
    setHeader('');
    setPayload('');
    setExpStatus('');

    const token = input.trim();
    if (!token) {
      setError('Please enter a JWT token');
      return;
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      setError('Invalid JWT format. A JWT must have exactly 3 parts separated by dots.');
      return;
    }

    try {
      const decodedHeader = base64UrlDecode(parts[0]);
      const headerJson = JSON.parse(decodedHeader);
      setHeader(JSON.stringify(headerJson, null, 2));
    } catch {
      setError('Failed to decode JWT header. The header is not valid base64url-encoded JSON.');
      return;
    }

    try {
      const decodedPayload = base64UrlDecode(parts[1]);
      const payloadJson = JSON.parse(decodedPayload);
      setPayload(JSON.stringify(payloadJson, null, 2));

      // Check expiration
      if (payloadJson.exp) {
        const expDate = new Date(payloadJson.exp * 1000);
        const now = new Date();
        if (expDate < now) {
          setExpStatus(`⚠️ Expired on ${expDate.toLocaleString()}`);
        } else {
          setExpStatus(`✓ Valid until ${expDate.toLocaleString()}`);
        }
      }
    } catch {
      setError('Failed to decode JWT payload. The payload is not valid base64url-encoded JSON.');
      return;
    }
  }

  return (
    <div className="space-y-5">
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          JWT Token
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your JWT token here (eyJhbGciOiJIUzI1NiIs...)"
          aria-label="JWT token input"
          className="input-field h-32 resize-y font-mono text-sm"
        />
      </InputArea>

      <button
        onClick={handleDecode}
        aria-label="Decode JWT token"
        className="btn-primary"
      >
        Decode Token
      </button>

      <OutputArea hasContent={!!header}>
        {header && (
          <div className="space-y-4">
            {expStatus && (
              <div
                className={`text-sm font-medium px-3 py-2 rounded-lg ${
                  expStatus.startsWith('⚠️')
                    ? 'bg-red-50 text-red-700 border border-red-100'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                }`}
                aria-label="Token expiration status"
              >
                {expStatus}
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-semibold text-gray-700">Header</h3>
                <CopyToClipboard text={header} />
              </div>
              <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono p-4 bg-gray-50 rounded-lg border border-gray-100">
                {header}
              </pre>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-semibold text-gray-700">Payload</h3>
                <CopyToClipboard text={payload} />
              </div>
              <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono p-4 bg-gray-50 rounded-lg border border-gray-100">
                {payload}
              </pre>
            </div>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
