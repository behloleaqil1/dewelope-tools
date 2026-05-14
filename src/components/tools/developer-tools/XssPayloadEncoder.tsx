'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * XssPayloadEncoder - Encode text to prevent XSS (educational tool).
 */
export default function XssPayloadEncoder({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<{ html: string; url: string; js: string } | null>(null);
  const [error, setError] = useState('');

  function encode() {
    setError('');
    setOutput(null);
    if (!input.trim()) {
      setError('Please enter text to encode');
      return;
    }

    // HTML entity encoding
    const htmlEncoded = input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');

    // URL encoding
    const urlEncoded = encodeURIComponent(input);

    // JavaScript string escaping
    const jsEncoded = input
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/"/g, '\\"')
      .replace(/</g, '\\x3C')
      .replace(/>/g, '\\x3E')
      .replace(/&/g, '\\x26');

    setOutput({ html: htmlEncoded, url: urlEncoded, js: jsEncoded });
  }

  const copyText = output
    ? `HTML Encoded:\n${output.html}\n\nURL Encoded:\n${output.url}\n\nJS Escaped:\n${output.js}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Text to Encode
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='<script>alert("XSS")</script>'
          aria-label={`Text input for ${toolName}`}
          className="input-field h-24 resize-y font-mono"
        />
      </InputArea>

      <button onClick={encode} aria-label="Encode text for XSS prevention" className="btn-primary">
        Encode Text
      </button>

      <OutputArea hasContent={output !== null}>
        {output && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="text-xs font-medium text-gray-500 mb-1">HTML Entity Encoding</div>
              <pre className="text-sm font-mono text-gray-800 break-all">{output.html}</pre>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="text-xs font-medium text-gray-500 mb-1">URL Encoding</div>
              <pre className="text-sm font-mono text-gray-800 break-all">{output.url}</pre>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="text-xs font-medium text-gray-500 mb-1">JavaScript String Escaping</div>
              <pre className="text-sm font-mono text-gray-800 break-all">{output.js}</pre>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
