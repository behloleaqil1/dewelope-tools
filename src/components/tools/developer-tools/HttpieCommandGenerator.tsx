'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * HttpieCommandGenerator - Generate HTTPie CLI commands from API request configuration.
 */
export default function HttpieCommandGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('');
  const [headers, setHeaders] = useState('');
  const [body, setBody] = useState('');
  const [auth, setAuth] = useState('');
  const [output, setOutput] = useState('');

  const generate = () => {
    if (!url.trim()) {
      setOutput('');
      return;
    }

    const parts: string[] = ['http'];

    if (method !== 'GET') {
      parts.push(method);
    }

    parts.push(url.trim());

    if (auth.trim()) {
      parts.push(`-a ${auth.trim()}`);
    }

    if (headers.trim()) {
      headers.trim().split('\n').forEach((h) => {
        const trimmed = h.trim();
        if (trimmed) {
          parts.push(`${trimmed}`);
        }
      });
    }

    if (body.trim() && ['POST', 'PUT', 'PATCH'].includes(method)) {
      body.trim().split('\n').forEach((line) => {
        const trimmed = line.trim();
        if (trimmed) {
          parts.push(`${trimmed}`);
        }
      });
    }

    setOutput(parts.join(' \\\n  '));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-method`} className="block text-sm font-medium text-gray-700 mb-1">
              HTTP Method
            </label>
            <select
              id={`${toolId}-method`}
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              aria-label={`HTTP method for ${toolName}`}
              className="input-field"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="PATCH">PATCH</option>
              <option value="DELETE">DELETE</option>
              <option value="HEAD">HEAD</option>
              <option value="OPTIONS">OPTIONS</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-url`} className="block text-sm font-medium text-gray-700 mb-1">
              URL
            </label>
            <input
              id={`${toolId}-url`}
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://api.example.com/users"
              aria-label={`Request URL for ${toolName}`}
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-headers`} className="block text-sm font-medium text-gray-700 mb-1">
              Headers (one per line, e.g. Content-Type:application/json)
            </label>
            <textarea
              id={`${toolId}-headers`}
              value={headers}
              onChange={(e) => setHeaders(e.target.value)}
              placeholder="Content-Type:application/json&#10;Authorization:Bearer token123"
              aria-label={`Request headers for ${toolName}`}
              className="input-field h-24 resize-y font-mono"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-body`} className="block text-sm font-medium text-gray-700 mb-1">
              Body fields (one per line, e.g. name=John age:=30)
            </label>
            <textarea
              id={`${toolId}-body`}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="name=John&#10;age:=30&#10;active:=true"
              aria-label={`Request body for ${toolName}`}
              className="input-field h-24 resize-y font-mono"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-auth`} className="block text-sm font-medium text-gray-700 mb-1">
              Authentication (user:password)
            </label>
            <input
              id={`${toolId}-auth`}
              type="text"
              value={auth}
              onChange={(e) => setAuth(e.target.value)}
              placeholder="user:password"
              aria-label={`Authentication for ${toolName}`}
              className="input-field"
            />
          </div>
          <button
            onClick={generate}
            className="btn-primary"
          >
            Generate HTTPie Command
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated HTTPie Command</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-3 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
