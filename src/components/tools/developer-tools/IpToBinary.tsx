'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * IpToBinary - Convert IP addresses to binary representation and back.
 */
export default function IpToBinary({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'ip-to-binary' | 'binary-to-ip'>('ip-to-binary');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const convert = () => {
    setError('');
    setOutput('');

    if (!input.trim()) {
      setError('Please enter a value');
      return;
    }

    if (mode === 'ip-to-binary') {
      const parts = input.trim().split('.');
      if (parts.length !== 4) {
        setError('Invalid IPv4 address. Use format: 192.168.1.1');
        return;
      }
      const octets: number[] = [];
      for (const part of parts) {
        const num = parseInt(part, 10);
        if (isNaN(num) || num < 0 || num > 255) {
          setError('Each octet must be a number between 0 and 255');
          return;
        }
        octets.push(num);
      }
      const binary = octets.map((o) => o.toString(2).padStart(8, '0')).join('.');
      const fullBinary = octets.map((o) => o.toString(2).padStart(8, '0')).join('');
      setOutput(`Dotted Binary: ${binary}\nFull Binary: ${fullBinary}\nDecimal: ${octets.join('.')}`);
    } else {
      const cleaned = input.trim().replace(/[.\s]/g, '');
      if (!/^[01]+$/.test(cleaned) || cleaned.length !== 32) {
        setError('Invalid binary. Enter exactly 32 binary digits (with or without dots)');
        return;
      }
      const octets: number[] = [];
      for (let i = 0; i < 32; i += 8) {
        octets.push(parseInt(cleaned.slice(i, i + 8), 2));
      }
      const ip = octets.join('.');
      const dottedBinary = [cleaned.slice(0, 8), cleaned.slice(8, 16), cleaned.slice(16, 24), cleaned.slice(24, 32)].join('.');
      setOutput(`IP Address: ${ip}\nDotted Binary: ${dottedBinary}\nFull Binary: ${cleaned}`);
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-2">Conversion Mode</label>
        <div className="flex gap-4 mb-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={mode === 'ip-to-binary'}
              onChange={() => { setMode('ip-to-binary'); setOutput(''); setError(''); }}
              className="text-blue-600"
            />
            <span className="text-sm">IP → Binary</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={mode === 'binary-to-ip'}
              onChange={() => { setMode('binary-to-ip'); setOutput(''); setError(''); }}
              className="text-blue-600"
            />
            <span className="text-sm">Binary → IP</span>
          </label>
        </div>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          {mode === 'ip-to-binary' ? 'Enter IPv4 Address' : 'Enter 32-bit Binary'}
        </label>
        <input
          id={`${toolId}-input`}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'ip-to-binary' ? '192.168.1.1' : '11000000.10101000.00000001.00000001'}
          aria-label={`Input for ${toolName}`}
          className="input-field font-mono"
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </InputArea>

      <button onClick={convert} aria-label="Convert" className="btn-primary">
        Convert
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
