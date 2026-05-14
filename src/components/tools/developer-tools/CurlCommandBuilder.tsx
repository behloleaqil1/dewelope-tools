'use client';

import { useState } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CurlCommandBuilder - Build curl commands from URL, method, headers, and body inputs.
 */
export default function CurlCommandBuilder({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('GET');
  const [headers, setHeaders] = useState('');
  const [body, setBody] = useState('');

  const buildCommand = (): string => {
    if (!url.trim()) return '';
    const parts: string[] = ['curl'];
    if (method !== 'GET') parts.push(`-X ${method}`);
    const headerLines = headers.split('\n').filter(h => h.trim());
    for (const h of headerLines) {
      parts.push(`-H '${h.trim()}'`);
    }
    if (body.trim() && ['POST', 'PUT', 'PATCH'].includes(method)) {
      parts.push(`-d '${body.trim()}'`);
    }
    parts.push(`'${url.trim()}'`);
    return parts.join(' \\\n  ');
  };

  const result = buildCommand();

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div>
        <label htmlFor={`${toolId}-url`} className="block text-sm font-medium text-gray-700 mb-1">URL</label>
        <input id={`${toolId}-url`} type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://api.example.com/endpoint" aria-label={`URL for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label htmlFor={`${toolId}-method`} className="block text-sm font-medium text-gray-700 mb-1">Method</label>
        <select id={`${toolId}-method`} value={method} onChange={(e) => setMethod(e.target.value)} aria-label={`HTTP method for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          {['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'].map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor={`${toolId}-headers`} className="block text-sm font-medium text-gray-700 mb-1">Headers (one per line, e.g. Content-Type: application/json)</label>
        <textarea id={`${toolId}-headers`} value={headers} onChange={(e) => setHeaders(e.target.value)} rows={3} placeholder="Content-Type: application/json" aria-label={`Headers for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono" />
      </div>
      <div>
        <label htmlFor={`${toolId}-body`} className="block text-sm font-medium text-gray-700 mb-1">Request Body</label>
        <textarea id={`${toolId}-body`} value={body} onChange={(e) => setBody(e.target.value)} rows={4} placeholder='{"key": "value"}' aria-label={`Request body for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono" />
      </div>
      <OutputArea hasContent={!!result}>
        {result && (
          <div className="space-y-2">
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded-lg">{result}</pre>
            <CopyToClipboard text={result} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
