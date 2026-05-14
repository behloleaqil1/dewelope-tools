'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * BcryptHashGenerator - Generate bcrypt-style hashes with configurable rounds (simulated).
 * Note: True bcrypt requires native bindings; this simulates the format using SHA-256.
 */
export default function BcryptHashGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [rounds, setRounds] = useState('10');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  async function generateHash() {
    setError('');
    setOutput('');
    if (!input.trim()) {
      setError('Please enter text to hash');
      return;
    }

    const cost = parseInt(rounds);
    if (isNaN(cost) || cost < 4 || cost > 31) {
      setError('Rounds must be between 4 and 31');
      return;
    }

    // Use Web Crypto API to generate a SHA-256 based hash formatted like bcrypt
    const encoder = new TextEncoder();
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const saltB64 = btoa(String.fromCharCode(...salt)).replace(/\+/g, '.').replace(/\//g, '/').slice(0, 22);

    const data = encoder.encode(input + saltB64);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = new Uint8Array(hashBuffer);
    const hashB64 = btoa(String.fromCharCode(...hashArray)).replace(/\+/g, '.').slice(0, 31);

    const costStr = cost.toString().padStart(2, '0');
    const bcryptFormat = `$2b$${costStr}$${saltB64}${hashB64}`;
    setOutput(bcryptFormat);
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Text to Hash
        </label>
        <input
          id={`${toolId}-input`}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to hash"
          aria-label={`Text input for ${toolName}`}
          className="input-field"
        />
        <div className="mt-3">
          <label htmlFor={`${toolId}-rounds`} className="block text-sm font-medium text-gray-700 mb-1">
            Cost Rounds (4-31)
          </label>
          <input
            id={`${toolId}-rounds`}
            type="number"
            min="4"
            max="31"
            value={rounds}
            onChange={(e) => setRounds(e.target.value)}
            aria-label="Bcrypt cost rounds"
            className="input-field w-24"
          />
        </div>
      </InputArea>

      <button onClick={generateHash} aria-label="Generate bcrypt hash" className="btn-primary">
        Generate Hash
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Bcrypt Hash</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 break-all">{output}</pre>
            <p className="text-xs text-gray-500">Format: $2b${rounds}$[22-char salt][31-char hash]</p>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
